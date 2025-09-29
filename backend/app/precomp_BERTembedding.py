import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from pathlib import Path
import joblib
from scipy import sparse
import torch

# --- CONFIG ---
CSV_FILE = Path(__file__).parent / "internship_database.csv"
INDICES_DIR = Path(__file__).parent / "indices"
INDICES_DIR.mkdir(exist_ok=True)

def main():
    print("Loading dataset...")
    try:
        df = pd.read_csv(CSV_FILE).dropna(subset=['skills', 'domain', 'title', 'location', 'degree'])
    except FileNotFoundError:
        print(f"ERROR: {CSV_FILE} not found.")
        return

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")

    model = SentenceTransformer('all-MiniLM-L6-v2', device=device)

    # --- Compute BERT embeddings (as numpy arrays) ---
    print("Encoding skills...")
    skills_list = df['skills'].astype(str).tolist()
    skills_emb = model.encode(skills_list, convert_to_tensor=False, show_progress_bar=True)
    skills_emb = np.asarray(skills_emb, dtype=np.float32)
    np.save(INDICES_DIR / "skills_embeddings.npy", skills_emb)
    print(f"Saved skills embeddings to {INDICES_DIR / 'skills_embeddings.npy'}")

    print("Encoding domain...")
    domain_list = df['domain'].astype(str).tolist()
    domain_emb = model.encode(domain_list, convert_to_tensor=False, show_progress_bar=True)
    domain_emb = np.asarray(domain_emb, dtype=np.float32)
    np.save(INDICES_DIR / "domain_embeddings.npy", domain_emb)
    print(f"Saved domain embeddings to {INDICES_DIR / 'domain_embeddings.npy'}")

    # --- Fit and save TF-IDF vectorizers and matrices ---
    print("Fitting TF-IDF vectorizers...")
    title_vectorizer = TfidfVectorizer(stop_words='english', min_df=2, max_df=0.95)
    location_vectorizer = TfidfVectorizer(stop_words='english', min_df=2, max_df=0.95)
    degree_vectorizer = TfidfVectorizer(stop_words='english', min_df=1)

    title_tfidf = title_vectorizer.fit_transform(df['title'].astype(str))
    location_tfidf = location_vectorizer.fit_transform(df['location'].astype(str))
    degree_tfidf = degree_vectorizer.fit_transform(df['degree'].astype(str))

    joblib.dump(title_vectorizer, INDICES_DIR / "title_vectorizer.joblib")
    joblib.dump(location_vectorizer, INDICES_DIR / "location_vectorizer.joblib")
    joblib.dump(degree_vectorizer, INDICES_DIR / "degree_vectorizer.joblib")
    print("Saved TF-IDF vectorizers (joblib).")

    sparse.save_npz(INDICES_DIR / "title_tfidf.npz", title_tfidf)
    sparse.save_npz(INDICES_DIR / "location_tfidf.npz", location_tfidf)
    sparse.save_npz(INDICES_DIR / "degree_tfidf.npz", degree_tfidf)
    print("Saved TF-IDF matrices (npz).")

    # Optionally save a small metadata file to confirm consistent index ordering
    df.reset_index(drop=True).to_csv(INDICES_DIR / "dataset_index.csv", index=False)
    print(f"Saved index / dataset snapshot to {INDICES_DIR / 'dataset_index.csv'}")

    print("Precompute finished.")

if __name__ == "__main__":
    main()