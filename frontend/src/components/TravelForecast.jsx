import { useState, useRef } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Car,
  Settings,
  ChevronDown,
  ChevronUp,
  Shield,
  Navigation,
  Mountain,
  Book,
  AlertTriangle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Squares from './Squares';


const TravelForecast = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [formData, setFormData] = useState({
    sourcePoint: "",
    destination: "",
    travelDate: "",
    modeOfTravel: "car",
    preference: "balanced",
  });
  const expandedCardRef = useRef(null);

  const outerVignetteStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)',
    opacity: '50%',
  };

  const centerVignetteStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
  };

  const travelModes = [
    { value: "car", label: "Car", icon: <Car className="h-4 w-4" /> },
    {
      value: "bus",
      label: "Bus",
      icon: (
        <span className="flex items-center justify-center h-4 w-4">🚌</span>
      ),
    },
    {
      value: "train",
      label: "Train",
      icon: (
        <span className="flex items-center justify-center h-4 w-4">🚆</span>
      ),
    },
    {
      value: "plane",
      label: "Plane",
      icon: (
        <span className="flex items-center justify-center h-4 w-4">✈️</span>
      ),
    },
  ];

  const preferences = [
    {
      value: "fast",
      label: "Fastest Route",
      icon: <Clock className="h-4 w-4" />,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      borderColor: "border-pink-300 dark:border-pink-800",
    },
    {
      value: "safe",
      label: "Safest Route",
      icon: <Shield className="h-4 w-4" />,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
      borderColor: "border-teal-300 dark:border-teal-800",
    },
    {
      value: "scenic",
      label: "Scenic Route",
      icon: <Mountain className="h-4 w-4" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-300 dark:border-purple-800",
    },
    {
      value: "balanced",
      label: "Balanced",
      icon: <Settings className="h-4 w-4" />,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      borderColor: "border-amber-300 dark:border-amber-800",
    },
  ];

  // Card section icons and gradients - enhanced vibrant colors
  const sectionStyles = {
    "Risk Assessment": {
      icon: <Shield className="h-5 w-5" />,
      gradient: "from-rose-400/30 to-red-400/30",
      activeGradient: "from-rose-500 to-red-500",
      textColor: "text-rose-600 dark:text-rose-400",
      hoverBg: "group-hover:bg-rose-500/30 dark:group-hover:bg-rose-500/40",
      borderColor: "border-rose-300 dark:border-rose-700",
      bgColor:
        "bg-gradient-to-br from-rose-100 to-red-50 dark:from-rose-900/40 dark:to-red-900/30",
    },
    "Route Analysis": {
      icon: <Navigation className="h-5 w-5" />,
      gradient: "from-indigo-400/30 to-blue-400/30",
      activeGradient: "from-indigo-500 to-blue-500",
      textColor: "text-indigo-600 dark:text-indigo-400",
      hoverBg: "group-hover:bg-indigo-500/30 dark:group-hover:bg-indigo-500/40",
      borderColor: "border-indigo-300 dark:border-indigo-700",
      bgColor:
        "bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/30",
    },
    "Points of Interest": {
      icon: <Mountain className="h-5 w-5" />,
      gradient: "from-emerald-400/30 to-green-400/30",
      activeGradient: "from-emerald-500 to-green-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      hoverBg:
        "group-hover:bg-emerald-500/30 dark:group-hover:bg-emerald-500/40",
      borderColor: "border-emerald-300 dark:border-emerald-700",
      bgColor:
        "bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/40 dark:to-green-900/30",
    },
    "Travel Recommendations": {
      icon: <Book className="h-5 w-5" />,
      gradient: "from-fuchsia-400/30 to-purple-400/30",
      activeGradient: "from-fuchsia-500 to-purple-500",
      textColor: "text-fuchsia-600 dark:text-fuchsia-400",
      hoverBg:
        "group-hover:bg-fuchsia-500/30 dark:group-hover:bg-fuchsia-500/40",
      borderColor: "border-fuchsia-300 dark:border-fuchsia-700",
      bgColor:
        "bg-gradient-to-br from-fuchsia-100 to-purple-50 dark:from-fuchsia-900/40 dark:to-purple-900/30",
    },
    "Special Considerations": {
      icon: <AlertTriangle className="h-5 w-5" />,
      gradient: "from-amber-400/30 to-yellow-400/30",
      activeGradient: "from-amber-500 to-yellow-500",
      textColor: "text-amber-600 dark:text-amber-400",
      hoverBg: "group-hover:bg-amber-500/30 dark:group-hover:bg-amber-500/40",
      borderColor: "border-amber-300 dark:border-amber-700",
      bgColor:
        "bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/30",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(
        `${backendUrl}/api/forecast/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate forecast");
      }

      setForecast(data.data.forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderSection = (title, content) => {
    if (!content) return null;
    const style = sectionStyles[title] || {
      icon: <Settings />,
      gradient: "from-gray-400/30 to-slate-400/30",
      activeGradient: "from-gray-500 to-slate-500",
      textColor: "text-gray-600 dark:text-gray-400",
      hoverBg: "group-hover:bg-gray-500/30 dark:group-hover:bg-gray-500/40",
      borderColor: "border-gray-300 dark:border-gray-700",
      bgColor:
        "bg-gradient-to-br from-gray-100 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/30",
    };

    return (
      <motion.div
        layoutId={`card-${title}`}
        key={`card-${title}`}
        className={`group p-5 flex flex-col justify-between items-start rounded-xl cursor-pointer transition-all relative overflow-hidden hover:shadow-xl border ${style.borderColor} ${style.bgColor}`}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${style.gradient} transition-all duration-500 opacity-60 ${style.hoverBg}`}
        />

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className={`absolute -inset-[100px] bg-gradient-to-r ${style.activeGradient} opacity-30 blur-3xl`}
          />
        </div>

        <div className="w-full relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2.5 rounded-full bg-white dark:bg-neutral-900 shadow-md ${style.textColor} border border-current/20`}
            >
              {style.icon}
            </div>
            <h3 className={`text-xl font-bold ${style.textColor}`}>{title}</h3>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 line-clamp-3 text-sm leading-relaxed">
            {content}
          </p>
        </div>
        <button
          onClick={() => setActiveCard({ title, content, style })}
          className={`mt-5 flex items-center justify-center px-4 py-2 text-sm rounded-full font-medium bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm ${style.textColor} shadow-md hover:shadow-lg transition-all relative z-10 border border-current/50`}
        >
          View Details <ChevronDown className="ml-2 h-4 w-4" />
        </button>
      </motion.div>
    );
  };

  // Restrict date to today and future dates
  const today = new Date().toISOString().split("T")[0];

  // Input field styling by type
  const inputStyles = {
    source: {
      ringColor: "focus:ring-blue-500",
      iconColor: "text-blue-500",
      borderFocus: "focus:border-blue-300",
      bgFocus: "bg-blue-500/5",
    },
    destination: {
      ringColor: "focus:ring-rose-500",
      iconColor: "text-rose-500",
      borderFocus: "focus:border-rose-300",
      bgFocus: "bg-rose-500/5",
    },
    date: {
      ringColor: "focus:ring-violet-500",
      iconColor: "text-violet-500",
      borderFocus: "focus:border-violet-300",
      bgFocus: "bg-violet-500/5",
    },
    travel: {
      ringColor: "focus:ring-emerald-500",
      iconColor: "text-emerald-500",
      borderFocus: "focus:border-emerald-300",
      bgFocus: "bg-emerald-500/5",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8 relative overflow-hidden">
      {/* Squares component positioned as absolute background with aspect ratio preservation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full">
        {<div style={outerVignetteStyle}></div>}
        
          <Squares 
            speed={0.3} 
            squareSize={70}
            direction='up' // up, down, left, right, diagonal
            borderColor='#3747E9'
            hoverFillColor='#222'
            preserveAspectRatio="xMidYMid slice" // Ensures squares maintain their aspect ratio
          />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-0 relative z-10 sm:px-6">
        
        {/* Input Form - increased transparency and blur */}
        <div className="bg-white/60 dark:bg-neutral-800/60 rounded-2xl shadow-xl p-6 mb-10 backdrop-blur-2xl border border-white/40 dark:border-neutral-700/40 overflow-hidden relative">
        <div className="text-center mb-10">
          <div className="inline-block mb-4 p-2 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-full">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v8"></path>
                <path d="m4.93 10.93 1.41 1.41"></path>
                <path d="M2 18h2"></path>
                <path d="M20 18h2"></path>
                <path d="m19.07 10.93-1.41 1.41"></path>
                <path d="M22 22H2"></path>
                <path d="m8 22 4-10 4 10"></path>
                <path d="M15 2.2a4 4 0 0 1 0 7.6"></path>
                <path d="M9 2.2a4 4 0 0 0 0 7.6"></path>
              </svg>
            </div>
          </div>
          <h1 className="sm:text-5xl text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            Travel Forecast
          </h1>
          <p className="text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto bg-white/50 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full">
            Plan your journey with intelligent insights about routes, weather
            conditions, and points of interest
          </p>
        </div>
          {/* Background decorative elements */}
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
  
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            Plan Your Journey
          </h2>
  
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Point */}
              <div className="relative group">
                <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <MapPin
                    className={`w-4 h-4 mr-2 ${inputStyles.source.iconColor}`}
                  />
                  Starting Point
                </label>
                <input
                  type="text"
                  name="sourcePoint"
                  value={formData.sourcePoint}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg bg-white/70 dark:bg-neutral-700/70 ${inputStyles.source.ringColor} ${inputStyles.source.borderFocus} outline-none dark:border-neutral-600 dark:text-neutral-200 transition-all backdrop-blur-sm`}
                  placeholder="Enter starting location"
                  required
                />
                <div
                  className={`absolute inset-0 -z-10 ${inputStyles.source.bgFocus} rounded-lg scale-95 opacity-0 group-focus-within:opacity-100 group-focus-within:scale-105 transition-all duration-300`}
                ></div>
              </div>
  
              {/* Destination */}
              <div className="relative group">
                <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <MapPin
                    className={`w-4 h-4 mr-2 ${inputStyles.destination.iconColor}`}
                  />
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg bg-white/70 dark:bg-neutral-700/70 ${inputStyles.destination.ringColor} ${inputStyles.destination.borderFocus} outline-none dark:border-neutral-600 dark:text-neutral-200 transition-all backdrop-blur-sm`}
                  placeholder="Enter destination"
                  required
                />
                <div
                  className={`absolute inset-0 -z-10 ${inputStyles.destination.bgFocus} rounded-lg scale-95 opacity-0 group-focus-within:opacity-100 group-focus-within:scale-105 transition-all duration-300`}
                ></div>
              </div>
  
              {/* Travel Date */}
              <div className="relative group">
                <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Calendar
                    className={`w-4 h-4 mr-2 ${inputStyles.date.iconColor}`}
                  />
                  Travel Date
                </label>
                <input
                  type="date"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleInputChange}
                  min={today} // Restrict to today and future dates
                  className={`w-full p-3 border rounded-lg bg-white/70 dark:bg-neutral-700/70 ${inputStyles.date.ringColor} ${inputStyles.date.borderFocus} outline-none dark:border-neutral-600 dark:text-neutral-200 transition-all backdrop-blur-sm`}
                  required
                />
                <div
                  className={`absolute inset-0 -z-10 ${inputStyles.date.bgFocus} rounded-lg scale-95 opacity-0 group-focus-within:opacity-100 group-focus-within:scale-105 transition-all duration-300`}
                ></div>
              </div>
  
              {/* Mode of Travel */}
              <div className="relative group">
                <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  <Car
                    className={`w-4 h-4 mr-2 ${inputStyles.travel.iconColor}`}
                  />
                  Mode of Travel
                </label>
                <div className="relative">
                  <select
                    name="modeOfTravel"
                    value={formData.modeOfTravel}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg bg-white/70 dark:bg-neutral-700/70 ${inputStyles.travel.ringColor} ${inputStyles.travel.borderFocus} outline-none dark:border-neutral-600 dark:text-neutral-200 appearance-none transition-all backdrop-blur-sm`}
                    required
                  >
                    {travelModes.map((mode) => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${inputStyles.travel.iconColor}`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                <div
                  className={`absolute inset-0 -z-10 ${inputStyles.travel.bgFocus} rounded-lg scale-95 opacity-0 group-focus-within:opacity-100 group-focus-within:scale-105 transition-all duration-300`}
                ></div>
              </div>
            </div>
  
            {/* Preference */}
            <div className="relative group">
              <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Settings className="w-4 h-4 mr-2 text-indigo-500" />
                Route Preference
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {preferences.map((pref) => (
                  <div
                    key={pref.value}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        preference: pref.value,
                      }))
                    }
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all backdrop-blur-sm
                      ${
                        formData.preference === pref.value
                          ? `${pref.bgColor} ${pref.borderColor} shadow-md`
                          : "bg-white/70 dark:bg-neutral-800/70 border-gray-200/70 dark:border-neutral-700/70 hover:border-indigo-300 dark:hover:border-indigo-700"
                      }`}
                  >
                    <div
                      className={`mr-2 ${
                        formData.preference === pref.value
                          ? pref.color
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {pref.icon}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        formData.preference === pref.value
                          ? pref.color
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {pref.label}
                    </span>
                  </div>
                ))}
              </div>
              <input
                type="hidden"
                name="preference"
                value={formData.preference}
              />
            </div>
  
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl text-white font-medium relative overflow-hidden
                ${
                  loading
                    ? "bg-indigo-400/90"
                    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
                }
                transition duration-200 group shadow-lg hover:shadow-xl backdrop-blur-sm`}
            >
              <div className="absolute inset-0 w-full h-full bg-[url('/api/placeholder/400/320')] opacity-10"></div>
              {loading ? (
                <span className="flex items-center justify-center">
                  <Clock className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Generating Forecast...
                </span>
              ) : (
                <>
                  <span className="relative z-10">
                    Generate Travel Forecast
                  </span>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                </>
              )}
            </button>
          </form>
        </div>
  
        {/* Error Message */}
        {error && (
          <div className="bg-red-50/70 dark:bg-red-900/30 border border-red-200/70 dark:border-red-800/70 text-red-700 dark:text-red-400 p-5 rounded-xl mb-8 animate-fadeIn shadow-md backdrop-blur-md">
            <p className="font-medium flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error: {error}
            </p>
          </div>
        )}
  
        {/* Forecast Display */}
        {forecast && (
          <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-2xl rounded-2xl shadow-xl p-6 border border-white/40 dark:border-neutral-700/40 animate-fadeIn overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -left-12 -top-12 w-32 h-32 bg-gradient-to-tr from-pink-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
  
            <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Your Travel Forecast
            </h2>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {renderSection(
                "Risk Assessment",
                forecast.formatted
                  .split("RISK ASSESSMENT")[1]
                  ?.split("ROUTE ANALYSIS")[0]
              )}
              {renderSection(
                "Route Analysis",
                forecast.formatted
                  .split("ROUTE ANALYSIS")[1]
                  ?.split("POINTS OF INTEREST")[0]
              )}
              {renderSection(
                "Points of Interest",
                forecast.formatted
                  .split("POINTS OF INTEREST")[1]
                  ?.split("TRAVEL RECOMMENDATIONS")[0]
              )}
              {renderSection(
                "Travel Recommendations",
                forecast.formatted
                  .split("TRAVEL RECOMMENDATIONS")[1]
                  ?.split("SPECIAL CONSIDERATIONS")[0]
              )}
              {renderSection(
                "Special Considerations",
                forecast.formatted.split("SPECIAL CONSIDERATIONS")[1]
              )}
            </div>
          </div>
        )}
  
        {/* Expandable Card Modal */}
        <AnimatePresence>
          {activeCard && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-30"
                onClick={() => setActiveCard(null)}
              />
              <div className="fixed inset-0 grid place-items-center z-40 p-4 overflow-y-auto">
                <motion.div
                  layoutId={`card-${activeCard.title}`}
                  ref={expandedCardRef}
                  className={`w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden
                    rounded-2xl shadow-2xl border ${activeCard.style.borderColor}
                    transition-all duration-500 ease-out ${activeCard.style.bgColor} backdrop-blur-xl`}
                >
                  <div className="relative p-6 md:p-8 overflow-y-auto">
                    {/* Card Header with Icon */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-r ${activeCard.style.activeGradient} opacity-20`}
                    />
                    <div className="flex items-center gap-4 mb-6 relative">
                      <div
                        className={`p-4 rounded-full ${activeCard.style.textColor} bg-white/80 dark:bg-neutral-900/80 shadow-lg border border-current/20`}
                      >
                        {activeCard.style.icon}
                      </div>
                      <h3
                        className={`text-2xl font-bold ${activeCard.style.textColor}`}
                      >
                        {activeCard.title}
                      </h3>
                    </div>
  
                    {/* Content with styled formatting */}
                    <div className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap prose dark:prose-invert max-w-none">
                      {activeCard.content.split("► ").map((segment, idx) => {
                        if (idx === 0)
                          return (
                            <p key={idx} className="text-lg leading-relaxed">
                              {segment}
                            </p>
                          );
                        return (
                          <div key={idx} className="flex mt-6 gap-3">
                            <span
                              className={`text-xl ${activeCard.style.textColor}`}
                            >
                              ►
                            </span>
                            <p className="text-base leading-relaxed">
                              {segment}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
  
                  <div className="mt-auto bg-gradient-to-t from-white/90 dark:from-neutral-900/90 pt-6 sticky bottom-0">
                    <button
                      onClick={() => setActiveCard(null)}
                      className={`flex items-center justify-center px-6 py-3 rounded-full font-medium mx-6 mb-6
                        ${activeCard.style.textColor} border border-current hover:bg-white/80 dark:hover:bg-neutral-800/80 backdrop-blur-sm
                        transition-all shadow-md hover:shadow-lg`}
                    >
                      Close Details <ChevronUp className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
  
      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
  
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
  
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }
  
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TravelForecast;
