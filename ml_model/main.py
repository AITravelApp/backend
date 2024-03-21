from flask import Flask, jsonify
import ml_model

app = Flask(__name__)

# Health check endpoint
@app.route('/health')
def health_check():
    if ml_model.is_healthy():
        return jsonify({'status': 'OK'}), 200
    else:
        return jsonify({'status': 'error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)