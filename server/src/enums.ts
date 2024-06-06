import { registerEnumType } from "type-graphql";

export enum TypeOfTraveler {
    RELAX_AND_ENJOY = "relax_and_enjoy",
    DISCOVERING_EVERYDAY = "discovering_everyday",
    BOTH = "both"
}

registerEnumType(TypeOfTraveler, {
    name: "TypeOfTraveler",
    description: "Type of traveler"
});


export enum TypeOfWantedTrip {
    OUTDOOR_TRIP = "outdoor_trip",
    FESTIVALS_AND_CLUBS = "festivals_and_clubs",
    CULTURAL_TRIP = "cultural_trip",
    BEACH_TRIP = "beach_trip",
    URBAN_TRIP_CITIES = "urban_trip_cities"
}

registerEnumType(TypeOfWantedTrip, {
    name: "TypeOfWantedTrip",
    description: "Type of wanted trip"
});

export enum WantedActivities {
    CULTURAL_ACTIVITIES = "cultural_activities",
    OUTDOOR_ACTIVITIES = "outdoor_activities",
    FOOD_AND_CULINARY_EXPERIENCES = "food_and_culinary_experiences",
    BEACH_ACTIVITIES = "beach_activities",
    SHOPPING_ACTIVITIES = "shopping_activities",
    EXPLORING_THE_NEARBY_AREA = "exploring_the_nearby_area",
    RELAXATION = "relaxation",
    CONCERTS_AND_FESTIVALS = "concerts_and_festivals"
}

registerEnumType(WantedActivities, {
    name: "WantedActivities",
    description: "Wanted activities"
});


export enum MatchedExperiences {
    ITALIAN_NIGHT_LIFE = "experiencing_Italian_night_life",
    ITALIAN_CUISINE = "savoring_Italian_cuisine",
    VISITING_MUSEUMS = "visiting_different_museums",
    SIGHTSEEING_BUILDINGS = "sightseeing_historic_buildings_and_cities",
    EXPLORING_COASTAL_AREAS = "exploring_coastal_areas",
    EXPLORING_NEARBY_NATURE = "exploring_the_nearby_nature",
    SHOPPING_POPULAR_DESTINATIONS = "shopping_at_popular_destinations",
    EXPERIENCING_WINES = "experiencing_Italian_wines,_cocktails"
}

registerEnumType(MatchedExperiences, {
    name: "MatchedExperiences",
    description: "Matched experiences"
});

export enum TravelingWith {
    SOLO = "solo",
    WITH_FRIENDS = "with_friends",
    WITH_FAMILY = "with_family",
    WITH_PARTNER = "with_partner"
}

registerEnumType(TravelingWith, {
    name: "TravelingWith",
    description: "Traveling with"
});