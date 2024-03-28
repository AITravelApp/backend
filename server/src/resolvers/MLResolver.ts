import { Resolver, Query } from 'type-graphql';
import amqp from 'amqplib';

@Resolver()
export class MLResolver {
    @Query(() => String)
    async pythonServerHealthCheck(): Promise<string> {
        try {
            // Connect to RabbitMQ
            const connection = await amqp.connect('amqp://rabbitmq');
            const channel = await connection.createChannel();

            // Declare a queue
            const queueName = 'ml_model_health_check';
            await channel.assertQueue(queueName, { durable: false });

            const message = "Hello from nodejs server";
            channel.sendToQueue(queueName, Buffer.from(message));

            // Close the connection
            await channel.close();
            await connection.close();

            return 'Message published to RabbitMQ';
        } catch (error) {
            console.error('Error publishing message to RabbitMQ:', error);
            return 'Error publishing message to RabbitMQ';
        }
    }
}
function uuidv4() {
    throw new Error('Function not implemented.');
}

