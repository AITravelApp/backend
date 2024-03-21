import { Resolver, Query } from 'type-graphql';
import axios from 'axios';

@Resolver()
export class MLResolver {
    @Query(() => String)
    async PythonServerHealthCheck(): Promise<string> {
        try {
            const response = await axios.get('http://ml_model:5000/health');
            if (response.data.status === 'OK') {
                return 'OK';
            } else {
                return 'Python server returned an unexpected response';
            }
        } catch (error) {
            console.error('Error communicating with Python server:', error);
            return 'Error communicating with Python server';
        }
    }
}