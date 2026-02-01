# Geoapify Integration - Implementation Summary

## Overview

Integrated Geoapify geocoding and Leaflet.js mapping for displaying listing locations on a map.

## Changes Made

### 1. Database Model (`models/listing.js`)

- Added `latitude` field (Number, optional)
- Added `longitude` field (Number, optional)
- These store the geocoded coordinates for each listing

### 2. Geocoding Utility (`utils/geocode.js`)

- Created new utility module for Geoapify API integration
- `geocodeAddress(address, country)` function:
  - Accepts location and country
  - Returns `{latitude, longitude}` or `null`
  - Handles API errors gracefully
  - Uses Geoapify Geocoding API v1

### 3. Controllers (`controllers/listings.js`)

- **createListing()**: Geocodes address after listing creation
- **updateListing()**: Geocodes address if location/country changed (only if coordinates missing)
- Prevents redundant geocoding calls

### 4. Map Display (`public/js/map.js`)

- Initializes Leaflet map only if map container exists
- Uses Geoapify Carto map tiles
- Displays marker at listing coordinates
- Shows user location if browser permission granted
- Features:
  - Zoom controls (bottom-right)
  - Popup on marker with listing title and location
  - User location circle with accuracy
  - Graceful fallback if coordinates unavailable

### 5. Views (`views/listings/show.ejs`)

- Added map container with 450px height
- Passes listing data to JavaScript:
  ```javascript
  window.listingData = {
    title,
    location,
    latitude,
    longitude,
  };
  ```

### 6. Environment (`/.env`)

- Added `GEOAPIFY_API_KEY` environment variable
- Key is read by `utils/geocode.js`

## Usage

### For New Listings

1. Create listing with location and country
2. Listing is automatically geocoded before saving
3. Coordinates stored in database
4. Map displays marker at location

### For Existing Listings

Run geocoding script to populate coordinates for existing listings:

```bash
node geocode-listings.js
```

- Finds all listings without coordinates
- Geocodes them using Geoapify API
- Updates database with latitude/longitude

## API Calls

- **Geoapify Geocoding**: Called once per listing on create/update
- **Geoapify Tiles**: Called each time map is displayed (cached by browser)
- **Browser Geolocation**: Optional, only if user permits

## Features Implemented

✓ Geocoding with Geoapify Geocoding API
✓ Coordinates stored in database (no re-geocoding)
✓ Leaflet.js map with Geoapify tiles
✓ Listing marker with popup
✓ User location marker (if available)
✓ Zoom controls
✓ Efficient (no redundant API calls)
✓ Graceful error handling

## Notes

- Listing must have `location` and `country` to be geocoded
- Map only displays if listing has coordinates
- User location is optional and requires browser permission
- Existing listings need one-time geocoding via script
