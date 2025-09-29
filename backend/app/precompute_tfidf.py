import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy import sparse

# Load your data
csv_path = "internship_database.csv"
df = pd.read_csv(csv_path)

# Fit vectorizers
print("Fitting title vectorizer...")
title_vectorizer = TfidfVectorizer(stop_words='english', min_df=2, max_df=0.95)
title_tfidf = title_vectorizer.fit_transform(df['title'].astype(str))

print("Fitting location vectorizer...")
location_vectorizer = TfidfVectorizer(stop_words='english', min_df=2, max_df=0.95)
location_tfidf = location_vectorizer.fit_transform(df['location'].astype(str))

print("Fitting degree vectorizer...")
degree_vectorizer = TfidfVectorizer(stop_words='english', min_df=1)
degree_tfidf = degree_vectorizer.fit_transform(df['degree'].astype(str))

# Save vectorizers
with open("title_vectorizer.pkl", "wb") as f:
    pickle.dump(title_vectorizer, f)
with open("location_vectorizer.pkl", "wb") as f:
    pickle.dump(location_vectorizer, f)
with open("degree_vectorizer.pkl", "wb") as f:
    pickle.dump(degree_vectorizer, f)

# Save TF-IDF matrices
sparse.save_npz("title_tfidf.npz", title_tfidf)
sparse.save_npz("location_tfidf.npz", location_tfidf)
sparse.save_npz("degree_tfidf.npz", degree_tfidf)

print("TF-IDF vectorizers and matrices saved.")
