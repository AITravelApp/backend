import { Resolver, Query } from 'type-graphql';
import axios from 'axios';

@Resolver()
export class UserResolver {
    @Query(() => String)
    async UserResolverHealthCheck(): Promise<string> {
        try {
            const response = await axios.get('http://ml_model:5000/health');
            if (response.data.status === 'OK') {
                return 'Python server is healthy';
            } else {
                return 'Python server returned an unexpected response';
            }
        } catch (error) {
            console.error('Error communicating with Python server:', error);
            return 'Error communicating with Python server';
        }
    }
}