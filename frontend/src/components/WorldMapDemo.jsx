"use client";
import WorldMap from "@/components/ui/world-map";
import { motion } from "framer-motion";

export default function WorldMapDemo() {
  return (
    <div className="relative h-full w-full min-h-screen">
      {/* Text content positioned above the map */}
      <div className="relative z-10 pt-20 mb-36">
        <div className="max-w-7xl mx-auto text-center px-4">
          <p className="font-bold text-xl md:text-4xl mb-4">
            <span className="text-black font-lilita font-extrabold">
              {"SafeJourney".split("").map((word, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}>
                  {word}
                </motion.span>
              ))}
            </span>
          </p>
          <div className="max-w-2xl mx-auto">
           
          </div>
        </div>
      </div>

      {/* World map */}
      <div className="absolute top-0 left-0 w-full h-full">
        <WorldMap
          className="w-full h-full"
          dots={[
            // North America connections
            {
              start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
              end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
            },
            {
              start: { lat: 40.7128, lng: -74.006 }, // New York
              end: { lat: 25.7617, lng: -80.1918 }, // Miami
            },
            
            // South America connections
            {
              start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              end: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
            },
            {
              start: { lat: -33.4489, lng: -70.6693 }, // Santiago
              end: { lat: -0.1807, lng: -78.4678 }, // Quito
            },

            // Transatlantic connections
            {
              start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            },
           

            // European connections
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 48.8566, lng: 2.3522 }, // Paris
            },
           
            // Europe to Asia/Africa
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 28.6139, lng: 77.209 }, // New Delhi
            },
            {
              start: { lat: 48.8566, lng: 2.3522 }, // Paris
              end: { lat: 30.0444, lng: 31.2357 }, // Cairo
            },
            {
              start: { lat: 41.0082, lng: 28.9784 }, // Istanbul
              end: { lat: 25.2048, lng: 55.2708 }, // Dubai
            },

            // Asian connections
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
            },
            {
              start: { lat: 31.2304, lng: 121.4737 }, // Shanghai
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
            {
              start: { lat: 1.3521, lng: 103.8198 }, // Singapore
              end: { lat: -33.8688, lng: 151.2093 }, // Sydney
            },
          
            // African connections
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
           

            // Trans-Pacific connections
            {
              start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
           

            // Additional interesting connections
            {
              start: { lat: 55.7558, lng: 37.6173 }, // Moscow
              end: { lat: 19.4326, lng: -99.1332 }, // Mexico City
            },
            {
              start: { lat: 19.0760, lng: 72.8777 }, // Mumbai
              end: { lat: -33.8688, lng: 151.2093 }, // Sydney
            },
          
          ]} />
      </div>
    </div>
  );
}