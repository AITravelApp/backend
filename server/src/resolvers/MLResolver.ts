import { Resolver, Query, Arg } from 'type-graphql';
import axios from 'axios';
import { MatchedExperiences, TravelingWith, TypeOfTraveler, TypeOfWantedTrip, WantedActivities } from '../enums';

const API_URL = 'https://serpapi.com/search.json';
const API_KEY = '3c8d4f0179b3bcefb459d8a19ef8db0d7644f44b84306ecb1131df1bde213959';

async function getEvents(eventType: string, location: { city: string, ll: string }): Promise<any[]> {
    const formattedEventType = eventType.split('_').join('+');
    const query = `${formattedEventType}+in+Italy`;
    console.log(query)
    const response = await axios.get(`${API_URL}`, {
        params: {
            api_key: API_KEY,
            engine: 'google_events',
            q: query,
            hl: 'en',
            gl: 'us',
        }
    });
    return response.data.events_results;
}



async function getRestaurants(location: { city: string, ll: string }): Promise<any[]> {
    const response = await axios.get(`${API_URL}`, {
        params: {
            api_key: API_KEY,
            engine: 'google_maps',
            q: `local restaurants`,
            hl: 'en',
            ll: location.ll,
            type: "search",
            gl: 'us',
        }
    }
    )
    return response.data.local_results;
}

async function getBars(location: { city: string, ll: string }): Promise<any[]> {
    const response = await axios.get(`${API_URL}`, {
        params: {
            api_key: API_KEY,
            engine: 'google_maps',
            q: `bars`,
            type: "search",
            ll: location.ll,
            hl: 'en',
            gl: 'us',
        }
    }
    )
    return response.data.local_results;
}


@Resolver()
export class MLResolver {
    @Query(() => String)
    async pythonServerHealthCheck(): Promise<string> {
        try {
            const response = await axios.get('http://ml_model:5000/health');

            if (response.data.status === 'OK') {
                return 'Python server is healthy';
            } else {
                return 'Python server is not working';
            }
        } catch (error) {
            console.error('Error checking Python server health:', error);
            return 'Error checking Python server health';
        }
    }

    @Query(() => String)
    async getRecommendations(
        @Arg('type_of_traveler', () => [String]) type_of_traveler: string[],
        @Arg('type_of_wanted_trip', () => [String]) type_of_wanted_trip: string[],
        @Arg('wanted_activities', () => [String]) wanted_activities: string[],
        @Arg('matched_experiences', () => [String]) matched_experiences: string[],
        @Arg('traveling_with', () => [String]) traveling_with: string[],
    ): Promise<string> {
        try {
            const userPreferences = {
                type_of_traveler: type_of_traveler[0],
                type_of_wanted_trip : type_of_wanted_trip[0],
                wanted_activities : wanted_activities[0],
                matched_experiences: matched_experiences[0],
                traveling_with: traveling_with[0],
                location: { city: 'Rome', ll: "@41.8967, 12.4822,21z", },
            };

            // const userPreferences = {
            //     type_of_traveler: 'relax_and_enjoy',
            //     type_of_wanted_trip: ['outdoor_trip', 'festivals_and_clubs'],
            //     wanted_activities: ['cultural_activities', 'outdoor_activities', 'food_and_culinary_experiences', 'beach_activities', 'shopping_activities', 'exploring_the_nearby_area', 'relaxation', 'concerts_and_festivals'],
            //     matched_experiences: ['experiencing_Italian_night_life', 'savoring_Italian_cuisine', 'sightseeing_historic_buildings_and_cities', 'experiencing_Italian_wines,_cocktails'],
            //     traveling_with: 'with_friends',
            //     //
            //     location: { city: 'Rome', ll: "@41.902782,-12.496366,21z", },
            // };

            const [events, restaurants, bars] = await Promise.all([
                getEvents(userPreferences.wanted_activities, userPreferences.location),
                getRestaurants(userPreferences.location),
                getBars(userPreferences.location)
            ]);

            
            const combinedData = {
                userPreferences,
                events,
                restaurants,
                bars
            };
            const response = await axios.post('http://ml_model:5000/get_recommendations', combinedData);
            return JSON.stringify(combinedData);
            

            
        } catch (error) {
            console.error('Error retrieving recommendations:', error);
            return 'Error retrieving recommendations';
        }
    }

}
