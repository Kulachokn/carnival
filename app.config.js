// Get the config from app.json or app.config.js
const config = require('./app.json');

// Add custom config for maps
const updatedConfig = {
  ...config,
  plugins: [
    ...(config.plugins || []),
  ],
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || ""
      }
    }
  },
};

export default updatedConfig;
