import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MapContainer from "./MapContainer";
import RouteForm from "./RouteForm";
import RouteInfo from "./RouteInfo";
import L from "leaflet";
import { toast } from "react-hot-toast";
import "leaflet-routing-machine";

const Map = () => {
  const [searchParams] = useSearchParams();
  const [map, setMap] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routingControl, setRoutingControl] = useState(null);

  const getRouteColor = (safetyScore) => {
    if (safetyScore >= 80) return "#22c55e";
    if (safetyScore >= 60) return "#84cc16";
    if (safetyScore >= 40) return "#eab308";
    if (safetyScore >= 20) return "#f97316";
    return "#ef4444";
  };

  const calculateSafetyScore = async (route) => {
    try {
      const bounds = L.latLngBounds(route.coordinates);

      const simplifiedCoords = route.coordinates
        .filter((_, i) => i % 5 === 0) // Take every 5th point
        .map((c) => ({ lat: c.lat.toFixed(6), lng: c.lng.toFixed(6) }));

      const coordinates = {
        minLat: bounds.getSouth().toFixed(6),
        maxLat: bounds.getNorth().toFixed(6),
        minLng: bounds.getWest().toFixed(6),
        maxLng: bounds.getEast().toFixed(6),
        waypoints: simplifiedCoords,
      };

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(
        `${backendUrl}/api/calculate-safety-score`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coordinates }),
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      return data.score || 50;
    } catch (error) {
      console.error("AI safety score failed:", error);
      return 50;
    }
  };

  // Update your calculateRoutes function:
  const calculateRoutes = async (startCoords, endCoords) => {
    if (!startCoords || !endCoords) {
      throw new Error("Invalid start or end coordinates");
    }

    if (routingControl) {
      map.removeControl(routingControl);
    }

    try {
      const waypointSets = generateWaypoints(startCoords, endCoords);
      const routePromises = waypointSets.map((waypoints) =>
        calculateSingleRoute(waypoints)
      );
      const calculatedRoutes = await Promise.all(routePromises);

      const processedRoutes = await Promise.all(
        calculatedRoutes.map(async (route, index) => {
          if (!route?.coordinates) {
            console.warn("Invalid route coordinates at index:", index);
            return null;
          }

          const safetyScore = await calculateSafetyScore(route);
          return {
            id: index,
            coordinates: route.coordinates,
            distance: route.summary?.totalDistance || 0,
            time: route.summary?.totalTime || 0,
            safetyScore,
            color: getRouteColor(safetyScore),
            instructions: route.instructions || [],
          };
        })
      );

      // Filter out null routes
      const validRoutes = processedRoutes.filter((route) => route !== null);

      if (validRoutes.length === 0) {
        throw new Error("No valid routes generated");
      }

      // Rest of your routing control code...
      return validRoutes;
    } catch (error) {
      console.error("Error calculating routes:", error);
      throw error;
    }
  };

  const handleMapReady = (mapInstance) => {
    setMap(mapInstance);
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  // Generate additional waypoints around the direct route
  const generateWaypoints = (start, end) => {
    const waypoints = [];
    const directLat = (end.lat - start.lat) / 2;
    const directLng = (end.lng - start.lng) / 2;

    // Generate 4 offset points for different routes
    const offsets = [
      { lat: 0.01, lng: 0.01 },
      { lat: -0.01, lng: -0.01 },
      { lat: 0.01, lng: -0.01 },
      { lat: -0.01, lng: 0.01 },
    ];

    offsets.forEach((offset) => {
      const midPoint = L.latLng(
        start.lat + directLat + offset.lat,
        start.lng + directLng + offset.lng
      );
      waypoints.push([start, midPoint, end]);
    });

    // Add the direct route
    waypoints.push([start, end]);

    return waypoints;
  };

  const calculateSingleRoute = (waypoints) => {
    return new Promise((resolve) => {
      const control = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        showAlternatives: true,
        createMarker: function () {
          return null;
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
      });

      control.on("routesfound", (e) => {
        resolve(e.routes[0]); // Get the first (best) route for these waypoints
      });

      control.addTo(map);
      setTimeout(() => {
        map.removeControl(control);
      }, 1000);
    });
  };

  useEffect(() => {
    const source = searchParams.get("source");
    const destination = searchParams.get("destination");
    const date = searchParams.get("date");

    if (source && destination && map) {
      handleRouteSubmit(source, destination);
    }
  }, [searchParams, map]);

  const handleRouteSubmit = async (source, destination) => {
    if (!map) return;

    setIsLoading(true);
    try {
      const startCoords = await geocodeAddress(source);
      const endCoords = await geocodeAddress(destination);

      if (!startCoords || !endCoords) {
        toast.error(
          "Could not find one or both locations. Please try different addresses."
        );
        return;
      }

      const calculatedRoutes = await calculateRoutes(startCoords, endCoords);
      setRoutes(calculatedRoutes);
      setSelectedRouteId(calculatedRoutes[0]?.id || null);

      const bounds = L.latLngBounds([startCoords, endCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } catch (error) {
      console.error("Error calculating routes:", error);
      toast.error("Error calculating routes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelect = (routeId) => {
    setSelectedRouteId(routeId);
    const selectedRoute = routes.find((route) => route.id === routeId);
    if (selectedRoute && selectedRoute.coordinates.length > 0) {
      const bounds = L.latLngBounds(selectedRoute.coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        routes={routes}
        selectedRouteId={selectedRouteId}
        onMapReady={handleMapReady}
      />
      <div className="route-panel absolute top-4 left-4 bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-semibold mb-6">Find Your Route</h2>
        <RouteForm
          onSubmit={handleRouteSubmit}
          isLoading={isLoading}
          initialSource={searchParams.get("source") || ""}
          initialDestination={searchParams.get("destination") || ""}
        />
        {routes?.length > 0 && (
          <RouteInfo
            routes={routes}
            selectedRouteId={selectedRouteId}
            onRouteSelect={handleRouteSelect}
            source={searchParams.get("source") || ""}
            destination={searchParams.get("destination") || ""}
          />
        )}
      </div>
    </div>
  );
};

export default Map;
