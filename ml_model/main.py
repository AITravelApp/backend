from flask import Flask, jsonify, request
import ml_model

app = Flask(__name__)

def is_healthy():
    return True

@app.route('/health', methods=['GET'])
def health_check():
    if is_healthy():
        return jsonify({'status': 'OK'}), 200
    else:
        return jsonify({'status': 'error'}), 500

@app.route('/get_recommendations', methods=['POST'])
def get_user_recommendations():
    if request.method == 'POST':
        user_preferences = request.json['userPreferences']
        events = request.json['events']
        restaurants = request.json['restaurants']
        bars = request.json['bars']

        # # Combine all the data into one DataFrame for processing
        # df_events = pd.DataFrame(events)
        # df_restaurants = pd.DataFrame(restaurants)
        # df_bars = pd.DataFrame(bars)

        # # Concatenate all dataframes
        # df = pd.concat([df_events, df_restaurants, df_bars], ignore_index=True)

        # # Process the combined dataframe
        # df = ml_model.prepare_data(df)
        # tfidf_vectorizer, tfidf_matrix = ml_model.train_model(df)
        # recommendations = ml_model.get_recommendations(user_preferences, df, tfidf_vectorizer, tfidf_matrix)
        
        return jsonify(request.json), 200
    else:
        return jsonify({'error': 'Method not allowed'}), 405
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
