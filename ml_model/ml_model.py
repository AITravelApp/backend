import os
import json
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import matplotlib.pyplot as plt

def is_healthy():
    return True

def load_data(file_path='data.json'):
    with open(file_path, 'r') as file:
        activities = json.load(file)
    return pd.DataFrame(activities)

def prepare_data(df):
    df['combined_features'] = df['location'] + " " + df['category'] + " " + df['price'] + " " + df['duration']
    return df

def train_model(df):
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])
    return tfidf_vectorizer, tfidf_matrix

def visualize_recommendations(user_preferences, recommendations):
    try:
        activity_names = recommendations['activity_name']
        similarity_scores = recommendations['similarity_to_user']
        descriptions = recommendations['description']

        # Create the directory if it doesn't exist
        os.makedirs('./graph/', exist_ok=True)
        # Create a bar plot
        plt.figure(figsize=(10, 6))
        plt.bar(descriptions, similarity_scores, color='skyblue')
        plt.xlabel('Activity Name')
        plt.ylabel('Similarity Score')
        plt.title('Top 3 Recommended Activities Based on User Preferences')
        plt.xticks(rotation=40, ha='right')
        plt.tight_layout()

        plt.savefig('./graph/recommendations_graph.png')

        # Close the plot to free up resources
        plt.close()
    except Exception as e:
        print("Error in visualize_recommendations:", e)


def get_recommendations(user_preferences, df, tfidf_vectorizer, tfidf_matrix):
    user_features = " ".join([str(value) for value in user_preferences.values()])
    user_vector = tfidf_vectorizer.transform([user_features])

    cosine_similarities = cosine_similarity(user_vector, tfidf_matrix)

    top_indices = cosine_similarities.argsort(axis=1)[0][-8:][::-1]
    top_cosine_similarities = cosine_similarities[0][top_indices]
    

    recommendations = df.iloc[top_indices]
    recommendations.loc[:, 'similarity_to_user'] = top_cosine_similarities
    visualize_recommendations(user_preferences, recommendations)
    return recommendations[['activity_id', 'activity_name', 'location', 'description', 'category', 'rating', 'price', 'duration', 'similarity_to_user']]