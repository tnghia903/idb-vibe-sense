const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

const MOCK_RESTAURANTS = [
  {
    id: 'mock1',
    name: 'The Love Boat',
    type: 'restaurant',
    tags: { cuisine: 'italian', atmosphere: 'romantic' },
    lat: 48.8566,
    lon: 2.3522,
    address: '123 Love Lane',
  },
  {
    id: 'mock2',
    name: 'Cupid\'s Cafe',
    type: 'cafe',
    tags: { atmosphere: 'cozy' },
    lat: 48.8584,
    lon: 2.2945,
    address: '456 Heart St',
  },
  {
    id: 'mock3',
    name: 'Sunset Bar',
    type: 'bar',
    tags: { view: 'sunset' },
    lat: 48.8606,
    lon: 2.3376,
    address: '789 Golden Hour Blvd',
  },
];

export const OverpassService = {
  fetchRestaurants: async (lat, lon, radius = 1000) => {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"restaurant|cafe|bar"](around:${radius},${lat},${lon});
        way["amenity"~"restaurant|cafe|bar"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    try {
      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        body: query,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from Overpass API');
      }

      const data = await response.json();
      return data.elements.filter(el => el.tags && el.tags.name).map(el => ({
        id: el.id,
        name: el.tags.name,
        type: el.tags.amenity,
        tags: el.tags,
        lat: el.lat || (el.center && el.center.lat), // Handle ways if center is available, otherwise might need more processing
        lon: el.lon || (el.center && el.center.lon),
        // Simple distance calc could be added here
      }));
    } catch (error) {
      console.error('Overpass API Error:', error);
      throw error;
    }
  },

  fetchRandomRestaurants: () => {
    return Promise.resolve(MOCK_RESTAURANTS);
  }
};
