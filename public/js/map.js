// Initialize map only if map container exists
if (document.getElementById("map")) {
  const apiKey = "e2b1136f28334a77a68b3d6be5716565";
  const listingData = window.listingData;

  console.log("Map.js loaded. Listing Data:", listingData);
  console.log("Leaflet available:", typeof L !== "undefined");

  // Parse coordinates and validate
  const lat =
    listingData && listingData.latitude
      ? parseFloat(listingData.latitude)
      : null;
  const lng =
    listingData && listingData.longitude
      ? parseFloat(listingData.longitude)
      : null;

  console.log("Parsed coordinates - Lat:", lat, "Lng:", lng);

  const hasValidCoordinates =
    listingData &&
    lat !== null &&
    lng !== null &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    typeof L !== "undefined";

  console.log("Has valid coordinates:", hasValidCoordinates);

  if (hasValidCoordinates) {
    // Show loading state
    const mapContainer = document.getElementById("map");
    mapContainer.style.opacity = "0.5";
    mapContainer.innerHTML =
      '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #667eea;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem;"></i></div>';

    // Initialize map with listing coordinates
    const map = L.map("map", {
      scrollWheelZoom: true,
      dragging: true,
      zoomControl: true,
    }).setView([lat, lng], 13);

    // Add Geoapify map tiles with better styling
    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=${apiKey}`,
      {
        attribution:
          '© <a href="https://www.geoapify.com/">Geoapify</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
        minZoom: 2,
      },
    ).addTo(map);

    // Create custom marker icon for listing
    const listingIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          border: 3px solid white;
          animation: pulse 2s infinite;
        ">
          <i class="fa-solid fa-home"></i>
        </div>
      `,
      className: "",
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });

    // Add marker for listing with custom icon
    const marker = L.marker([lat, lng], {
      icon: listingIcon,
    }).addTo(map);

    // Enhanced popup with better styling
    const popupContent = `
      <div style="
        font-family: 'Poppins', sans-serif;
        padding: 12px;
        min-width: 200px;
      ">
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px;
          border-radius: 8px 8px 0 0;
          margin: -12px -12px 10px -12px;
          font-weight: 700;
        ">
          <i class="fa-solid fa-map-pin" style="margin-right: 8px;"></i>${listingData.title}
        </div>
        <div style="color: #4a5568; margin-bottom: 8px; display: flex; align-items: center;">
          <i class="fa-solid fa-location-dot" style="color: #667eea; margin-right: 8px;"></i>
          <span>${listingData.location}</span>
        </div>
        <div style="
          background: #f7fafc;
          padding: 8px;
          border-radius: 6px;
          text-align: center;
          font-weight: 600;
          color: #667eea;
          margin-top: 10px;
        ">
          Tap the map to explore
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 250,
      className: "custom-popup",
      closeButton: true,
    });

    // Open popup by default
    marker.openPopup();

    // Position zoom controls in bottom right
    map.zoomControl.setPosition("bottomright");

    // Add custom CSS for better zoom control styling
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 4px 25px rgba(102, 126, 234, 0.6);
          transform: scale(1.05);
        }
      }

      .leaflet-control-zoom-in,
      .leaflet-control-zoom-out {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        width: 40px !important;
        height: 40px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-weight: bold !important;
        font-size: 18px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3) !important;
        margin-bottom: 5px !important;
      }

      .leaflet-control-zoom-in:hover,
      .leaflet-control-zoom-out:hover {
        background: linear-gradient(135deg, #5568d3 0%, #6a3f91 100%) !important;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
        transform: translateY(-2px) !important;
      }

      .custom-popup .leaflet-popup-content-wrapper {
        background: white !important;
        border-radius: 10px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        border: none !important;
        padding: 0 !important;
      }

      .custom-popup .leaflet-popup-tip {
        background: white !important;
        border: none !important;
      }

      .custom-popup .leaflet-popup-close-button {
        color: #667eea !important;
        font-size: 24px !important;
        font-weight: bold !important;
      }

      .custom-popup .leaflet-popup-close-button:hover {
        color: #764ba2 !important;
      }

      .leaflet-container {
        background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
      }

      .leaflet-attribution-flag {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Try to show user location if available
    map.locate({ setView: false, maxZoom: 15 });

    map.on("locationfound", (e) => {
      // Create user marker with different icon
      const userIcon = L.divIcon({
        html: `
          <div style="
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(245, 87, 108, 0.3);
            border: 3px solid white;
          ">
            <i class="fa-solid fa-location-crosshairs"></i>
          </div>
        `,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const userMarker = L.marker(e.latlng, { icon: userIcon }).addTo(map);
      userMarker.bindPopup(
        `<div style="text-align: center; padding: 8px;">
          <strong style="color: #667eea;">Your Location</strong><br/>
          <small style="color: #718096;">Accuracy: ${Math.round(e.accuracy)}m</small>
        </div>`,
        { maxWidth: 200 },
      );

      // Draw accuracy circle with gradient effect
      const circle = L.circle(e.latlng, e.accuracy / 2, {
        color: "#f5576c",
        fillColor: "#f093fb",
        fillOpacity: 0.1,
        weight: 2,
        dashArray: "5, 5",
      }).addTo(map);
    });

    map.on("locationerror", () => {
      console.info(
        "User location not available - showing listing location only",
      );
    });

    // Add keyboard navigation
    map.keyboard.enable();

    // Add map click event to show coordinates (optional feature)
    map.on("click", function (e) {
      console.log("Clicked at:", e.latlng);
    });
  } else {
    console.error("Cannot initialize map - missing latitude or longitude");
  }
} else {
  console.error("Map container not found!");
}
