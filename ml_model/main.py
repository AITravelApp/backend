from flask import Flask, jsonify
import pika
import ml_model
import json

app = Flask(__name__)

# Connect to RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('amqp://rabbitmq'))
channel = connection.channel()

# Declare the queue
channel.queue_declare(queue='ml_model_health_check', durable=True)

# Health check endpoint
@app.route('/health')
def health_check():
    if ml_model.is_healthy():
        return jsonify({'status': 'OK'}), 200
    else:
        return jsonify({'status': 'error'}), 500

def callback(ch, method, properties, body):
    message = body.decode()
    print("Received message:", message)

    if ml_model.is_healthy():
        response = {'status': 'OK'}
    else:
        response = {'status': 'error'}

    # Send response back to RabbitMQ
    ch.basic_publish(exchange='',
                     routing_key=properties.reply_to,
                     properties=pika.BasicProperties(correlation_id=properties.correlation_id),
                     body=json.dumps(response))

    ch.basic_ack(delivery_tag=method.delivery_tag)


# Consume messages from the queue
channel.basic_consume(queue='ml_model_health_check', on_message_callback=callback, auto_ack=False)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

