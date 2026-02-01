// utils/geocode.js

// Load API key ONLY from environment variables
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

/**
 * Geocode an address using Geoapify Geocoding API
 * @param {string} address - Location address
 * @param {string} country - Country name (optional)
 * @returns {Promise<{ latitude: number, longitude: number } | null>}
 */
async function geocodeAddress(address, country = "") {
  if (!address) return null;

  if (!GEOAPIFY_API_KEY) {
    console.error("❌ GEOAPIFY_API_KEY is missing");
    return null;
  }

  try {
    const query = country ? `${address}, ${country}` : address;

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      query,
    )}&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("❌ Geoapify HTTP error:", response.status);
      return null;
    }

    const data = await response.json();

    if (
      data.features &&
      data.features.length > 0 &&
      data.features[0].geometry &&
      data.features[0].geometry.coordinates
    ) {
      const [longitude, latitude] = data.features[0].geometry.coordinates;

      // Ensure numbers (not strings)
      return {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
    }

    console.warn("⚠️ No geocoding results for:", query);
    return null;
  } catch (error) {
    console.error("❌ Geocoding error:", error.message);
    return null;
  }
}

module.exports = { geocodeAddress };
