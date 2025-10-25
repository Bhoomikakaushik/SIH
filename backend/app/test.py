import pandas as pd
import numpy as np
from sklearn.preprocessing import normalize as sk_normalize
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import time
import torch
from pathlib import Path
import joblib
from scipy import sparse
import os

class InternshipSearchEngine:
    def __init__(self, dataframe, indices_dir=None, use_precomputed=True):
        self.df = dataframe.copy().reset_index(drop=True)  # Ensure clean integer index

        # CONTROL: force CPU in restricted envs (set FORCE_CPU=1 in environ to force CPU)
        use_cuda = torch.cuda.is_available() and os.getenv("FORCE_CPU", "0") != "1"
        self.device = 'cuda' if use_cuda else 'cpu'
        print(f"Using device: {self.device}")

        # Lazy load model only when needed (avoid loading large model at init)
        self.bert_model = None

        # Where precomputed indices are stored
        self.indices_dir = Path(indices_dir) if indices_dir else Path(__file__).parent / "indices"

        # placeholders (use numpy memmap / arrays, avoid moving to GPU)
        self.skills_embeddings = None        # numpy memmap/ndarray
        self.domain_embeddings = None        # numpy memmap/ndarray
        self.title_vectorizer = TfidfVectorizer(stop_words='english', min_df=2, max_df=0.95)
        self.location_vectorizer = TfidfVectorizer(stop_words='english', min_df=2, max_df=0.95)
        self.degree_vectorizer = TfidfVectorizer(stop_words='english', min_df=1)
        self.title_tfidf = None
        self.location_tfidf = None
        self.degree_tfidf = None

        loaded = False
        if use_precomputed and self.indices_dir.exists():
            try:
                loaded = self._load_indices()
                if loaded:
                    print("Loaded precomputed indices from", self.indices_dir)
            except Exception as e:
                print("Failed to load precomputed indices:", e)
                loaded = False

        if not loaded:
            # compute and save indices for future runs (if folder provided)
            self._prepare_indices(save_indices=True if self.indices_dir else False)

    def _normalize_rows_chunked(self, mat, chunk_size=2000):
        """
        Normalize rows of mat to unit vectors in float32, processing in chunks to limit peak memory.
        Returns a new (n,d) float32 ndarray.
        """
        n, d = mat.shape
        out = np.empty((n, d), dtype=np.float32)
        for i in range(0, n, chunk_size):
            j = min(i + chunk_size, n)
            block = np.asarray(mat[i:j], dtype=np.float32)
            norms = np.linalg.norm(block, axis=1, keepdims=True) + 1e-8
            out[i:j] = block / norms
        return out

    def _load_indices(self):
        """
        Load precomputed embeddings/vectorizers/matrices from indices_dir.
        Use numpy mmap for embeddings to reduce memory pressure.
        Returns True on success, False otherwise.
        """
        idx = self.indices_dir
        skill_file = idx / "skills_embeddings.npy"
        domain_file = idx / "domain_embeddings.npy"
        title_vec_file = idx / "title_vectorizer.joblib"
        location_vec_file = idx / "location_vectorizer.joblib"
        degree_vec_file = idx / "degree_vectorizer.joblib"
        title_tfidf_file = idx / "title_tfidf.npz"
        location_tfidf_file = idx / "location_tfidf.npz"
        degree_tfidf_file = idx / "degree_tfidf.npz"

        required = [skill_file, domain_file, title_vec_file, location_vec_file, degree_vec_file,
                    title_tfidf_file, location_tfidf_file, degree_tfidf_file]
        if not all(p.exists() for p in required):
            return False

        # load numpy embeddings using mmap (keeps memory usage low)
        self.skills_embeddings = np.load(skill_file, mmap_mode='r')
        self.domain_embeddings = np.load(domain_file, mmap_mode='r')

        # Precompute and store normalized versions (chunked to avoid memory spikes)
        try:
            self.skills_embeddings_norm = self._normalize_rows_chunked(self.skills_embeddings)
            self.domain_embeddings_norm = self._normalize_rows_chunked(self.domain_embeddings)
        except Exception:
            # fallback: convert and normalize straightforwardly (may use more memory)
            self.skills_embeddings_norm = np.asarray(self.skills_embeddings, dtype=np.float32)
            self.skills_embeddings_norm /= (np.linalg.norm(self.skills_embeddings_norm, axis=1, keepdims=True) + 1e-8)
            self.domain_embeddings_norm = np.asarray(self.domain_embeddings, dtype=np.float32)
            self.domain_embeddings_norm /= (np.linalg.norm(self.domain_embeddings_norm, axis=1, keepdims=True) + 1e-8)

        # load vectorizers
        self.title_vectorizer = joblib.load(title_vec_file)
        self.location_vectorizer = joblib.load(location_vec_file)
        self.degree_vectorizer = joblib.load(degree_vec_file)

        # load TF-IDF sparse matrices and normalize rows to unit norm (in-place copy=False)
        self.title_tfidf = sparse.load_npz(title_tfidf_file)
        self.location_tfidf = sparse.load_npz(location_tfidf_file)
        self.degree_tfidf = sparse.load_npz(degree_tfidf_file)
        sk_normalize(self.title_tfidf, norm='l2', axis=1, copy=False)
        sk_normalize(self.location_tfidf, norm='l2', axis=1, copy=False)
        sk_normalize(self.degree_tfidf, norm='l2', axis=1, copy=False)

        return True

    def _prepare_indices(self, save_indices=False):
        """
        Pre-computes all embeddings and TF-IDF matrices. If save_indices is True and
        an indices_dir is configured, save results for reuse.
        """
        print("Preparing search engine: generating embeddings and TF-IDF matrices...")
        start_time = time.time()

        # --- Semantic Part: Pre-compute ALL embeddings in a single batch ---
        print("Encoding skills (this will load the model)...")
        # lazy load model (force CPU to avoid GPU memory pressure in deployments)
        if self.bert_model is None:
            from sentence_transformers import SentenceTransformer
            self.bert_model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')

        self.skills_embeddings = self.bert_model.encode(
            self.df['skills'].tolist(),
            convert_to_tensor=False,
            show_progress_bar=True,
            device='cpu'
        )
        self.skills_embeddings = np.asarray(self.skills_embeddings, dtype=np.float32)

        self.domain_embeddings = self.bert_model.encode(
            self.df['domain'].tolist(),
            convert_to_tensor=False,
            show_progress_bar=True,
            device='cpu'
        )
        self.domain_embeddings = np.asarray(self.domain_embeddings, dtype=np.float32)

        # normalize immediately (chunked)
        self.skills_embeddings_norm = self._normalize_rows_chunked(self.skills_embeddings)
        self.domain_embeddings_norm = self._normalize_rows_chunked(self.domain_embeddings)

        # --- Lexical Part: TF-IDF matrices ---
        self.title_tfidf = self.title_vectorizer.fit_transform(self.df['title'].astype(str))
        self.location_tfidf = self.location_vectorizer.fit_transform(self.df['location'].astype(str))
        self.degree_tfidf = self.degree_vectorizer.fit_transform(self.df['degree'].astype(str))

        # normalize TF-IDF rows
        sk_normalize(self.title_tfidf, norm='l2', axis=1, copy=False)
        sk_normalize(self.location_tfidf, norm='l2', axis=1, copy=False)
        sk_normalize(self.degree_tfidf, norm='l2', axis=1, copy=False)

        # --- Optionally save to disk for future runs ---
        if save_indices and self.indices_dir:
            self.indices_dir.mkdir(parents=True, exist_ok=True)
            # save as float32 (smaller)
            np.save(self.indices_dir / "skills_embeddings.npy", self.skills_embeddings.astype(np.float32))
            np.save(self.indices_dir / "domain_embeddings.npy", self.domain_embeddings.astype(np.float32))
            joblib.dump(self.title_vectorizer, self.indices_dir / "title_vectorizer.joblib")
            joblib.dump(self.location_vectorizer, self.indices_dir / "location_vectorizer.joblib")
            joblib.dump(self.degree_vectorizer, self.indices_dir / "degree_vectorizer.joblib")
            sparse.save_npz(self.indices_dir / "title_tfidf.npz", self.title_tfidf)
            sparse.save_npz(self.indices_dir / "location_tfidf.npz", self.location_tfidf)
            sparse.save_npz(self.indices_dir / "degree_tfidf.npz", self.degree_tfidf)
            # save a small CSV snapshot so index ordering can be validated later if needed
            self.df.reset_index(drop=True).to_csv(self.indices_dir / "dataset_index.csv", index=False)
            print("Saved computed indices to", self.indices_dir)

        end_time = time.time()
        print(f"Preparation complete. Took {end_time - start_time:.2f} seconds.")

    def search(self, query, user_details, top_k=5, candidate_pool=200):
        """
        Performs a search using pre-computed indices.
        candidate_pool: number of top candidates to fetch from semantic/title signals before final ranking.
        """
        n = len(self.df)
        # ensure model loaded lazily and on CPU
        if self.bert_model is None:
            from sentence_transformers import SentenceTransformer
            self.bert_model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')

        # fast dot-based cosine helpers (assume embeddings already unit-normalized)
        def _dot_cosine_normed(query_vec, matrix_normed):
            q = np.asarray(query_vec, dtype=np.float32)
            q = q / (np.linalg.norm(q) + 1e-8)
            return matrix_normed.dot(q)  # (n,)

        # compute per-signal scores (numpy arrays)
        skills_scores = np.zeros(n, dtype=np.float32)
        domain_scores = np.zeros(n, dtype=np.float32)
        title_scores = np.zeros(n, dtype=np.float32)
        location_scores = np.zeros(n, dtype=np.float32)
        degree_scores = np.zeros(n, dtype=np.float32)

        # semantic: skills
        skills_query = query.get('skills')
        if skills_query:
            if isinstance(skills_query, list):
                skills_query = " ".join(skills_query)
            skills_query_embedding = self.bert_model.encode(skills_query, convert_to_tensor=False, device='cpu')
            skills_scores = _dot_cosine_normed(skills_query_embedding, self.skills_embeddings_norm)

        # semantic: domain
        domain_query = query.get('domain')
        if domain_query:
            if isinstance(domain_query, list):
                domain_query = " ".join(domain_query)
            domain_query_embedding = self.bert_model.encode(str(domain_query), convert_to_tensor=False, device='cpu')
            domain_scores = _dot_cosine_normed(domain_query_embedding, self.domain_embeddings_norm)

        # lexical: title/location/degree (TF-IDF matrices already normalized row-wise)
        title_query = query.get('title')
        if title_query:
            if isinstance(title_query, list):
                title_query = " ".join(title_query)
            qtv = self.title_vectorizer.transform([str(title_query)])
            qtv = sk_normalize(qtv, norm='l2', axis=1, copy=True)
            title_scores = cosine_similarity(qtv, self.title_tfidf).ravel()

        location_query = query.get('location')
        if location_query:
            if isinstance(location_query, list):
                location_query = " ".join(location_query)
            qlv = self.location_vectorizer.transform([str(location_query)])
            qlv = sk_normalize(qlv, norm='l2', axis=1, copy=True)
            location_scores = cosine_similarity(qlv, self.location_tfidf).ravel()

        degree_query = query.get('degree')
        if degree_query:
            if isinstance(degree_query, list):
                degree_query = " ".join(degree_query)
            qdv = self.degree_vectorizer.transform([str(degree_query)])
            qdv = sk_normalize(qdv, norm='l2', axis=1, copy=True)
            degree_scores = cosine_similarity(qdv, self.degree_tfidf).ravel()

        # weights (normalized)
        raw_weights = np.array([0.7, 0.2, 0.3, 0.1, 0.05], dtype=np.float32)
        weights = raw_weights / raw_weights.sum()

        # final score computed as numpy vector
        final_score = (weights[0] * skills_scores +
                       weights[1] * domain_scores +
                       weights[2] * title_scores +
                       weights[3] * location_scores +
                       weights[4] * degree_scores)

        # candidate pruning: keep only top `candidate_pool` by final_score, then sort
        k = min(top_k, candidate_pool, n)
        if n <= k:
            top_idx = np.argsort(-final_score)[:top_k]
        else:
            part = np.argpartition(final_score, -k)[-k:]
            top_idx = part[np.argsort(-final_score[part])][:top_k]

        # build results using indices only (avoid constructing full DataFrame)
        results_df = self.df.iloc[top_idx].copy()
        results_df = results_df.assign(final_score=final_score[top_idx])

        recommendations = results_df[['title', 'location', 'skills', 'domain', 'final_score',
                                      'company_name', 'stipend', 'duration', 'workmode']].to_dict(orient='records')

        return {"user": user_details, "recommendations": recommendations}



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