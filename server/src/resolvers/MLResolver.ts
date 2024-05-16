import { Resolver, Query } from 'type-graphql';
import axios from 'axios';

@Resolver()
export class MLResolver {
    @Query(() => String)
    async pythonServerHealthCheck(): Promise<string> {
        try {
            const response = await axios.get('http://ml_model:5000/health');

            if (response.data.status === 'OK') {
                return 'Python server is healthy';
            } else {
                return 'Python server is not healthy';
            }
        } catch (error) {
            console.error('Error checking Python server health:', error);
            return 'Error checking Python server health';
        }
    }

    @Query(() => String)
    async getRecommendations(): Promise<string> {
        try {
            const userPreferences = {
                location: 'Venice',
                category: 'Boat Tours',
                price: '$',
                duration: '2 hours'
            };

            const response = await axios.post('http://ml_model:5000/get_recommendations', userPreferences);

            if (response.status === 200) {
                console.log("RESPONSE", response.data);
                return JSON.stringify(response.data);
            } else {
                return 'Error retrieving recommendations';
            }
        } catch (error) {
            console.error('Error retrieving recommendations:', error);
            return 'Error retrieving recommendations';
        }
    }

}
