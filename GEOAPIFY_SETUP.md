## Geoapify Integration - Setup Instructions

### Step 1: Verify Environment Variables

Check `.env` file has `GEOAPIFY_API_KEY`:

```
GEOAPIFY_API_KEY=e2b1136f28334a77a68b3d6be5716565
```

### Step 2: Populate Coordinates for Existing Listings

If you have existing listings in database without coordinates, run:

```bash
node geocode-listings.js
```

This will:

- Find all listings without latitude/longitude
- Geocode each using Geoapify API
- Store coordinates in database
- You only need to run this ONCE

### Step 3: Test

1. Create a new listing with location and country
2. Go to listing detail page
3. Map should display with marker at location
4. Try allowing browser geolocation for user location marker

### How It Works

**On Listing Creation/Update:**

- Location and country are geocoded via Geoapify
- Coordinates (lat/long) are stored in database
- No redundant API calls (checked if coordinates exist)

**On Listing View:**

- Leaflet map initializes with listing coordinates
- Displays marker with popup
- Optionally shows user location if permitted

### API Limits

- Geoapify free tier: 5,000 requests/day
- Our implementation minimizes calls (once per listing create/update)
- Map tiles are cached by browser

### Troubleshooting

**Map not showing?**

- Check listing has coordinates (latitude/longitude in database)
- Check browser console for errors
- Verify GEOAPIFY_API_KEY is set

**Geocoding failing?**

- Location format: "City, Country"
- Verify location/country fields exist
- Check internet connection

**User location not showing?**

- Browser must have geolocation permission enabled
- Only shows if user allows location access
- Falls back silently if permission denied
