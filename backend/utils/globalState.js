let globalState = {
  // We'll store simulation states by city. e.g. { 'Mumbai': { rain: 0, temp: 30, aqi: 100 } }
};

const getCityState = (city) => {
  if (!globalState[city]) {
    // defaults
    globalState[city] = { rain: 10, temp: 30, aqi: 150 };
  }
  return globalState[city];
};

const updateCityState = (city, updates) => {
  globalState[city] = { ...getCityState(city), ...updates };
  return globalState[city];
};

module.exports = {
  getCityState,
  updateCityState,
  getAllStates: () => globalState
};
