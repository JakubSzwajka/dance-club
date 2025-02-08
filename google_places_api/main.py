import googlemaps
import yaml
from datetime import datetime

# Initialize the client
gmaps = googlemaps.Client(key='')

def main():
    # Perform a nearby search for dancing schools near New York City
    places_result = gmaps.places_nearby(
        location=(51.1103, 17.0321),
        radius=5000,
        keyword='dancing school'
    )

    # Prepare data structure for YAML
    dance_schools = {
        'metadata': {
            'timestamp': datetime.now().isoformat(),
            'location': {
                'latitude': 51.1103,
                'longitude': 17.0321
            },
            'radius': 5000,
            'keyword': 'dancing school'
        },
        'places': []
    }

    # Process each place and add to our data structure
    for place in places_result.get('results', []):
        # Get detailed information for each place
        place_id = place.get('place_id')
        if place_id:
            details = gmaps.place(place_id=place_id)
            place_details = details.get('result', {})

            # Extract relevant information
            place_data = {
                'name': place.get('name'),
                'place_id': place_id,
                'address': place.get('vicinity'),
                'location': place.get('geometry', {}).get('location'),
                'rating': place.get('rating'),
                'user_ratings_total': place.get('user_ratings_total'),
                'types': place.get('types'),
                'details': {
                    'formatted_address': place_details.get('formatted_address'),
                    'formatted_phone_number': place_details.get('formatted_phone_number'),
                    'website': place_details.get('website'),
                    'opening_hours': place_details.get('opening_hours', {}).get('weekday_text', []),
                    'reviews': place_details.get('reviews', [])
                }
            }
            dance_schools['places'].append(place_data)

    # Save to YAML file
    filename = f"dance_schools_{datetime.now().strftime('%Y%m%d_%H%M%S')}.yaml"
    with open(filename, 'w', encoding='utf-8') as file:
        yaml.dump(dance_schools, file, allow_unicode=True, sort_keys=False)

    print(f"Data has been saved to {filename}")

if __name__ == "__main__":
    main()