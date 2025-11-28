export const LocationService = {
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
        );
      }
    });
  },

  getPermissionStatus: async () => {
    if (!navigator.permissions) {
      return 'unknown';
    }
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state; // 'granted', 'denied', 'prompt'
    } catch (error) {
      return 'unknown';
    }
  }
};
