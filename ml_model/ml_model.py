import os
import json
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

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
        # Sort recommendations by similarity score
        recommendations = recommendations.sort_values(by='similarity_to_user', ascending=True)

        # Extract data for plotting
        activity_names = recommendations['activity_name']
        similarity_scores = recommendations['similarity_to_user']
        activity_info = [
            f"Location: {row['location']}\n"
            f"Description: {row['description']}\n"
            f"Category: {row['category']}\n"
            f"Duration: {row['duration']}\n"
            f"Availability: {row['availability']}" 
            for _, row in recommendations.iterrows()
        ]

        # Assign colors to activities
        colors = plt.cm.viridis(np.linspace(0, 1, len(activity_names)))

        data_dir = '/app/data'
        os.makedirs(data_dir, exist_ok=True)

        # Create a figure with one subplot
        fig, ax = plt.subplots(figsize=(16, 8))

        # Plot bar plot with space between the bars
        bar_height = 0.8
        bars = ax.barh(activity_names, similarity_scores, color=colors, height=bar_height)
        ax.set_xlabel('Similarity Score')
        ax.set_title('Top Recommended Activities Based on User Preferences')

        # Add activity information as text under each bar
        for bar, info in zip(bars, activity_info):
            ax.text(bar.get_width(), bar.get_y() + bar_height / 2, info, va='center')

        # Set tight layout to prevent overlap
        fig.tight_layout()

        # Save the plot
        file_path = os.path.join(data_dir, 'recommendations_graph.png')
        plt.savefig(file_path)
        print("Plot saved to:", file_path)

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
