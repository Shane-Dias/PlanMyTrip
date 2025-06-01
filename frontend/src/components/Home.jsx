import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import WorldMapDemo from "@/components/WorldMapDemo";
import { Shield, Navigation, Users, Cloud, Map } from "lucide-react";
import { Link } from "react-router-dom"; // Use `next/link` if using Next.js
import ChatAssistant from "./ChatAssistant";
import { useNavigate } from "react-router-dom";



const Home = () => {
  const dots = [
    {
      start: { lat: 37.7749, lng: -122.4194 },
      end: { lat: 34.0522, lng: -118.2437 },
    },
    {
      start: { lat: 40.7128, lng: -74.006 },
      end: { lat: 51.5074, lng: -0.1278 },
    },
  ];

  const {navigate}=useNavigate()

  const features = [
    {
      title: "Real-Time Risk Analysis",
      description:
        "Analyze crime rates, live weather alerts, and local incidents to ensure your safety.",
      icon: Shield,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
    {
      title: "AI-Driven Route Safety",
      description:
        "Get safety scores for routes based on historical and real-time data.",
      icon: Navigation,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
    },
    {
      title: "Crowdsourced Safety Reports",
      description:
        "Verified reports using blockchain for credibility and transparency.",
      icon: Users,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
    },
    {
      title: "Travel Risk Forecasting",
      description: "AI-powered predictions for potential hazards and risks.",
      icon: Cloud,
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600",
    },
    {
      title: "Alternate Routes & Safe Zones",
      description:
        "Suggestions for safer routes and zones based on risk factors.",
      icon: Map,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
  ];

  return (
    <div className="relative min-h-screen font-smooch bg-gradient-to-br from-green-300 via-teal-200 to-blue-200"> 
      <ChatAssistant /> 
      {/* Full-screen map background */} 
      <div className="fixed inset-0 z-0 pt-12 bg-opacity-70"> 
        <WorldMapDemo dots={dots} lineColor="#3b82f6" /> 
      </div>
    
      {/* Content overlay */} 
      <div className="relative z-10"> 
        {/* Hero Section with gradient background */} 
        <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8"> 
          <div className="text-center max-w-4xl mx-auto bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/50"> 
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Travel Safely Anywhere
            </h1>
            <p className="text-xl text-indigo-900 mb-8">
              Your AI-powered companion for secure journeys around the world
            </p>
            <Link to={'trip'}>
            <Button  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-orbitron"> 
              Get Started Now 
            </Button> 
            </Link>
            
          </div> 
        </div>
    
        {/* Features Section with glass effect */} 
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16 sm:py-24"> 
          <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
            <h2 className="text-3xl sm:text-4xl font-boldonse text-center mb-12 sm:mb-16 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent"> 
              Key Features 
            </h2> 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"> 
              {features.map((feature, index) => ( 
                <Card 
                  key={index} 
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm border-2 border-white/50 overflow-hidden" 
                > 
                  <div className={`h-2 w-full ${feature.color}`}></div>
                  <CardHeader className="p-6"> 
                    <div className="mb-4"> 
                      <feature.icon className={`w-8 h-8 text-white p-1 rounded-lg ${feature.color}`} /> 
                    </div> 
                    <CardTitle className="text-xl font-lilita text-gray-900"> 
                      {feature.title} 
                    </CardTitle> 
                  </CardHeader> 
                  <CardContent className="p-6 pt-0"> 
                    <CardDescription className="text-base font-delius text-gray-600"> 
                      {feature.description} 
                    </CardDescription> 
                    <Button variant="ghost" className={`mt-4 text-white ${feature.color} ${feature.hoverColor}`}>
                      Learn More
                    </Button>
                  </CardContent> 
                </Card> 
              ))} 
            </div> 
          </div> 
        </div>
    
        {/* CTA Section with vibrant gradient */} 
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-32 sm:py-28"> 
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"> 
            <div className="bg-white/20 backdrop-blur-md py-16 px-8 rounded-2xl max-w-3xl mx-auto border border-white/30">
              <h2 className="text-3xl sm:text-4xl font-lilita text-white mb-6"> 
                Ready to Travel Safely? 
              </h2> 
              <p className="text-white/90 mb-8 text-lg">
                Join thousands of travelers who explore the world with confidence
              </p>
              <Button 
              onClick={() => navigate('dashboard')}
              className="bg-white hover:bg-gray-100 text-purple-700 font-bold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-orbitron"> 
                Get Started Now 
              </Button> 
            </div>
          </div> 
        </div>
    
        {/* Footer with colorful accent */} 
        <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white"> 
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-pink-400">TravelSafe</h3>
                <p className="text-gray-300">Your trusted companion for safe travels around the globe.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-teal-400">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-amber-400">Connect</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center font-smooch text-gray-400 border-t border-gray-700 pt-8"> 
              &copy; {new Date().getFullYear()} TravelSafe. All rights reserved. 
            </div> 
          </div> 
        </footer> 
      </div> 
    </div>
  );
};

export default Home;
