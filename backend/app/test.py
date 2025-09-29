import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import time
import torch
from pathlib import Path
class InternshipSearchEngine:
    def __init__(self, dataframe):
        self.df = dataframe.copy().reset_index(drop=True) # Ensure clean integer index
            
        # Determine the device to use (GPU if available, otherwise CPU)
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"Using device: {self.device}")

        # Load the model onto the chosen device
        self.bert_model = SentenceTransformer('all-MiniLM-L6-v2', device=self.device)
        
        # --- Initialize vectorizers ---
        self.title_vectorizer = TfidfVectorizer(stop_words='english', min_df=2, max_df=0.95)
        self.location_vectorizer = TfidfVectorizer(stop_words='english', min_df=2, max_df=0.95)
        self.degree_vectorizer = TfidfVectorizer(stop_words='english', min_df=1)
        
        # --- Pre-compute and index everything once ---
        self._prepare_indices()

    def _prepare_indices(self):
        """
        Pre-computes all embeddings and TF-IDF matrices.
        """
        print("Preparing search engine: generating embeddings and TF-IDF matrices...")
        start_time = time.time()

        # --- Semantic Part: Pre-compute ALL embeddings in a single batch ---
        print("Encoding skills...")
        self.skills_embeddings = self.bert_model.encode(
            self.df['skills'].tolist(), 
            convert_to_tensor=True, 
            show_progress_bar=True,
            device=self.device
        )
        
        print("Encoding domains...")
        self.domain_embeddings = self.bert_model.encode(
            self.df['domain'].tolist(), 
            convert_to_tensor=True, 
            show_progress_bar=True,
            device=self.device
        )
        
        # --- Lexical Part: TF-IDF matrices ---
        print("Fitting TF-IDF vectorizers...")
        self.title_tfidf = self.title_vectorizer.fit_transform(self.df['title'].astype(str))
        self.location_tfidf = self.location_vectorizer.fit_transform(self.df['location'].astype(str))
        self.degree_tfidf = self.degree_vectorizer.fit_transform(self.df['degree'].astype(str))
        
        end_time = time.time()
        print(f"Preparation complete. Took {end_time - start_time:.2f} seconds.")

    def search(self, query, user_details, top_k=5):
        """
        Performs a search using pre-computed indices.
        """
        scores_df = pd.DataFrame(index=self.df.index)

        # --- Semantic Search: skills ---
        skills_query = query.get('skills')
        if skills_query:
            if isinstance(skills_query, list):
                skills_query = " ".join(skills_query)
            skills_query = str(skills_query)
            skills_query_embedding = self.bert_model.encode(skills_query, convert_to_tensor=True, device=self.device)
            skills_scores = util.cos_sim(skills_query_embedding, self.skills_embeddings).squeeze()
            scores_df['skills_score'] = skills_scores.cpu().numpy()
        else:
            scores_df['skills_score'] = 0.0

        # --- Semantic Search: domain ---
        domain_query = query.get('domain')
        if domain_query:
            if isinstance(domain_query, list):
                domain_query = " ".join(domain_query)
            domain_query = str(domain_query)
            domain_query_embedding = self.bert_model.encode(domain_query, convert_to_tensor=True, device=self.device)
            domain_scores = util.cos_sim(domain_query_embedding, self.domain_embeddings).squeeze()
            scores_df['domain_score'] = domain_scores.cpu().numpy()
        else:
            scores_df['domain_score'] = 0.0

        # --- Lexical Search: title ---
        title_query = query.get('title')
        if title_query:
            if isinstance(title_query, list):
                title_query = " ".join(title_query)
            title_query = str(title_query)
            query_title_vec = self.title_vectorizer.transform([title_query])
            scores_df['title_score'] = cosine_similarity(query_title_vec, self.title_tfidf).flatten()
        else:
            scores_df['title_score'] = 0.0

        # --- Lexical Search: location ---
        location_query = query.get('location')
        if location_query:
            if isinstance(location_query, list):
                location_query = " ".join(location_query)
            location_query = str(location_query)
            query_location_vec = self.location_vectorizer.transform([location_query])
            scores_df['location_score'] = cosine_similarity(query_location_vec, self.location_tfidf).flatten()
        else:
            scores_df['location_score'] = 0.0

        # --- Lexical Search: degree ---
        degree_query = query.get('degree')
        if degree_query:
            if isinstance(degree_query, list):
                degree_query = " ".join(degree_query)
            degree_query = str(degree_query)
            query_degree_vec = self.degree_vectorizer.transform([degree_query])
            scores_df['degree_score'] = cosine_similarity(query_degree_vec, self.degree_tfidf).flatten()
        else:
            scores_df['degree_score'] = 0.0

        raw_weights = {
            'skills': 0.7,
            'domain': 0.2,
            'title': 0.3,
            'location': 0.1,
            'degree': 0.05
        }

        total = sum(raw_weights.values())
        weights = {k: v / total for k, v in raw_weights.items()}  # normalize to sum=1

        scores_df['final_score'] = (
            weights['skills'] * scores_df['skills_score'] +
            weights['domain'] * scores_df['domain_score'] +
            weights['title'] * scores_df['title_score'] +
            weights['location'] * scores_df['location_score'] +
            weights['degree'] * scores_df['degree_score']
        )

        # --- Combine scores with original data and return results ---
        results_df = self.df.join(scores_df)
        results = results_df.sort_values(by='final_score', ascending=False).head(top_k)

        recommendations = results[['title', 'location', 'skills', 'domain', 'final_score', 
                                'company_name', 'stipend', 'duration', 'workmode']].to_dict(orient='records')

        response = {
            "user": user_details,
            "recommendations": recommendations
        }
        return response



# if __name__ == "__main__":
#     # --- Path to CSV file ---
#     CSV_FILE = Path(__file__).parent / "internship_database.csv"

#     print("Loading internship dataset...")
#     try:
#         df = pd.read_csv(CSV_FILE).dropna(
#             subset=['skills', 'domain', 'title', 'location', 'degree']
#         )
#     except FileNotFoundError:
#         print(f"WARNING: {CSV_FILE} not found. Search engine will not be available.")
#         df = pd.DataFrame()

#     # --- Initialize search engine ---
#     if not df.empty:
#         try:
#             engine = InternshipSearchEngine(df)

#             # --- Example query ---
#             query = {
#                 "skills": ["Python", "Machine Learning"],
#                 "domain": "Data Science",
#                 "title": "Data Intern",
#                 "location": "New York",
#                 "degree": "Bachelors"
#             }
#             user_details = {
#                 "name": "Alice",
#                 "degree": "Bachelors",
#                 "location": "New York"
#             }

#             response = engine.search(query, user_details, top_k=5)

#             print("\n=== Recommendations ===")
#             for i, rec in enumerate(response["recommendations"], 1):
#                 print(f"\n{i}. {rec['title']} at {rec['company_name']}")
#                 print(f"   Location: {rec['location']} | Work mode: {rec['workmode']}")
#                 print(f"   Domain: {rec['domain']} | Skills: {rec['skills']}")
#                 print(f"   Duration: {rec['duration']} | Stipend: {rec['stipend']}")
#                 print(f"   Score: {rec['final_score']:.4f}")

#         except Exception as e:
#             print(f"Failed to initialize search engine: {e}")
#     else:
#         print("No data available. Exiting.")