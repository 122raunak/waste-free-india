// RecyclingPoints.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "80vh" };
const defaultCenter = { lat: 28.7041, lng: 77.1025 }; // Delhi default

export default function RecyclingPoints() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
    libraries,
  });

  const [center, setCenter] = useState(defaultCenter);
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCenter(userLoc);

          if (mapRef.current) {
            fetchAllPlaces(mapRef.current, userLoc);
          }
        },
        () => console.log("User denied Geolocation")
      );
    } else {
      // If user denies, fetch around default center
      if (mapRef.current) fetchAllPlaces(mapRef.current, defaultCenter);
    }
  }, []);

  // ✅ Fetch nearby places
  const fetchAllPlaces = (map, location) => {
    fetchPlaces(map, location, "scrap shop");
    fetchPlaces(map, location, "dustbin");
    fetchPlaces(map, location, "recycling center");
    fetchPlaces(map, location, "ngo");
  };

  const fetchPlaces = (map, location, keyword) => {
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location,
      radius: 5000,
      keyword,
    };
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces((prev) => [...prev, ...results]);
      }
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      onLoad={(map) => {
        mapRef.current = map;
        fetchAllPlaces(map, center);
      }}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
        draggable: true,
        scrollwheel: true,
      }}
    >
      {/* 5 km highlight circle */}
      <Circle
        center={center}
        radius={5000}
        options={{
          fillColor: "#90ee90",
          fillOpacity: 0.2,
          strokeColor: "#008000",
          strokeOpacity: 0.5,
        }}
      />

      {/* Current user location */}
      <Marker
        position={center}
        label={{
          text: "You",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
        }}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#0000FF",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "white",
        }}
      />

      {/* Waste management markers */}
      {places.map((place, i) => (
        <Marker
          key={i}
          position={{
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }}
          onClick={() => setSelected(place)}
          label={{
            text: getLabelEmoji(place.name),
            fontSize: "18px",
          }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 20,
            fillColor: getColor(place.name),
            fillOpacity: 0.8,
            strokeWeight: 1,
            strokeColor: "white",
          }}
        />
      ))}

      {selected && (
        <InfoWindow
          position={{
            lat: selected.geometry.location.lat(),
            lng: selected.geometry.location.lng(),
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <h4>{selected.name}</h4>
            <p>{selected.vicinity}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

// Assign emoji for each type
function getLabelEmoji(name) {
  const n = name.toLowerCase();

  if (n.includes("scrap")) return "🏭";
  if (n.includes("dustbin")) return "🗑️";
  if (n.includes("recycling")) return "♻️";
  if (n.includes("ngo")) return "🙌";
  return "📍";
}

// Assign color for each type
function getColor(name) {
  const n = name.toLowerCase();
  if (n.includes("scrap")) return "#FFA500"; // orange
  if (n.includes("dustbin")) return "#FF0000"; // red
  if (n.includes("recycling")) return "#00FF00"; // green
  if (n.includes("ngo")) return "#0000FF"; // blue
  return "#808080"; // gray
}
