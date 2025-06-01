import React, { useState, useEffect } from "react";

const API_KEY = "2b9f1405e7f17c4ca878e6433a9db51a";

const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not found or API error");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const getSafetySuggestions = (weatherData) => {
  if (!weatherData) return [];

  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const speed = weatherData.wind.speed;
  const condition = weatherData.weather[0].main.toLowerCase();
  const description = weatherData.weather[0].description.toLowerCase();
  const visibility = weatherData.visibility;
  const pressure = weatherData.main.pressure;
  const sunrise = weatherData.sys.sunrise;
  const sunset = weatherData.sys.sunset;
  const currentTime = Math.floor(Date.now() / 1000);
  const isDaytime = currentTime > sunrise && currentTime < sunset;

  let suggestions = [];
  // Temperature-based suggestions
  if (temp > 40) {
    suggestions.push(
      "🚨 EXTREME HEAT DANGER! Limit all outdoor activity. Drink 4-5 liters of water daily. Wear loose, light-colored cotton clothing and wide-brimmed hats. Stay in air-conditioned spaces. Know signs of heat stroke: confusion, hot/dry skin, rapid pulse. Seek immediate medical help if symptoms appear."
    );
  } else if (temp > 35) {
    suggestions.push(
      "🔥 Extreme heat warning! Stay hydrated with at least 3-4 liters of water daily. Wear loose, light-colored clothing and a wide-brimmed hat. Avoid outdoor activities between 11am-3pm when UV radiation is strongest. Apply SPF 50+ sunscreen every 2 hours."
    );
  } else if (temp > 30) {
    suggestions.push(
      "☀️ Hot weather alert! Pack light, breathable clothing and a refillable water bottle. Seek shade when possible and consider planning indoor activities during midday heat."
    );
  } else if (temp >= 25 && temp <= 30) {
    suggestions.push(
      "🌡️ Warm weather conditions! Lightweight clothing recommended. Bring sunglasses, hat, and sunscreen. Ideal for outdoor dining and evening activities. Stay hydrated throughout the day."
    );
  } else if (temp >= 20 && temp <= 28) {
    suggestions.push(
      "✨ Pleasant weather conditions! Perfect for sightseeing and outdoor activities. Still, carry a light jacket for evenings and stay hydrated throughout the day."
    );
  } else if (temp >= 10 && temp < 20) {
    suggestions.push(
      "🍂 Mild temperatures. Bring light layers that can be added or removed throughout the day. A light jacket or sweater will be useful, especially in mornings and evenings."
    );
  } else if (temp < 0) {
    suggestions.push(
      "❄️ Freezing temperatures! Pack thermal underwear, insulated boots, and a quality winter coat. Gloves, scarf and hat are essential to prevent frostbite. Keep electronic devices in inner pockets to preserve battery life."
    );
  } else if (temp < -10) {
    suggestions.push(
      "🥶 SEVERE COLD! Extreme winter gear required: thermal layers, insulated parka, waterproof boots with thermal insoles, insulated gloves, balaclava/face mask. Limit outdoor exposure to 15-30 minutes. Carry emergency warming supplies if traveling."
    );
  } else if (temp < 10) {
    suggestions.push(
      "🧣 Cold weather alert! Dress in multiple layers rather than one heavy coat. Carry hand warmers and lip balm to combat dry skin. Travel with an emergency blanket in your vehicle or bag."
    );
  }

  // Humidity-based suggestions - Expanded
  if (humidity > 90) {
    suggestions.push(
      "💦 Extremely high humidity (" +
        humidity +
        "%)! Expect significant discomfort and possible health concerns. Pack multiple changes of lightweight, quick-dry clothing. Use antiperspirant liberally and consider portable battery-powered fans. Schedule frequent indoor breaks in air-conditioned environments."
    );
  } else if (humidity > 80) {
    suggestions.push(
      "💧 High humidity (" +
        humidity +
        "%)! Expect added discomfort and potential difficulty in temperature regulation. Pack moisture-wicking clothing, anti-frizz hair products, and extra water. Consider scheduling rest periods in air-conditioned places."
    );
  } else if (humidity > 60 && humidity <= 80) {
    suggestions.push(
      "🌤️ Moderately humid (" +
        humidity +
        "%). Choose light, breathable fabrics like cotton and linen. Anti-chafing products may be helpful for extended walking. Reapply sunscreen more frequently as sweat can reduce effectiveness."
    );
  } else if (humidity < 30) {
    suggestions.push(
      "🏜️ Very dry conditions! Bring moisturizer, lip balm, and eye drops. Increase water intake to prevent dehydration. Consider a portable humidifier for your accommodation if staying multiple days."
    );
  } else if (humidity < 20) {
    suggestions.push(
      "🌵 Extremely dry air (" +
        humidity +
        "%)! Pack specialized intense moisturizers, nasal spray, and eye drops. Drink at least 3 liters of water daily. Silk pillowcases can help prevent static electricity in hair. Watch for nosebleeds and cracked skin."
    );
  }

  // Wind-based suggestions - Expanded
  if (speed > 20) {
    suggestions.push(
      "⚠️ EXTREME WIND DANGER (" +
        speed +
        "m/s)! Stay indoors if possible. Secure all belongings and avoid areas with trees, power lines, or unsecured structures. Public transportation may be suspended. Follow local emergency advisories."
    );
  } else if (speed > 15) {
    suggestions.push(
      "🌪️ Dangerous wind levels (" +
        speed +
        "m/s)! Secure loose items and avoid open areas. Check for travel delays, especially if flying. Consider postponing outdoor activities involving heights or open spaces."
    );
  } else if (speed > 8) {
    suggestions.push(
      "💨 Strong winds detected (" +
        speed +
        "m/s)! Secure hats and loose clothing. Be cautious when opening vehicle doors. Wind may affect walking stability and outdoor dining experiences."
    );
  } else if (speed > 5) {
    suggestions.push(
      "🍃 Breezy conditions (" +
        speed +
        "m/s). Light items like maps and scarves should be secured. Consider windproof layers even in warm weather. Not ideal for flying drones or similar activities."
    );
  }

  // Pressure-based suggestions
  if (pressure < 1000) {
    suggestions.push(
      "📉 Low barometric pressure (" +
        pressure +
        " hPa). If you experience headaches or joint pain, pack appropriate medication. Weather changes likely approaching. Not ideal for activities requiring precise balance."
    );
  } else if (pressure > 1030) {
    suggestions.push(
      "📈 High barometric pressure (" +
        pressure +
        " hPa). Typically indicates stable, clear weather. Good time for outdoor photography and activities requiring good visibility."
    );
  }

  // Visibility-based suggestions
  if (visibility < 1000) {
    suggestions.push(
      "👁️ Extremely poor visibility (" +
        visibility +
        "m)! Avoid driving if possible. Use location sharing with companions when outdoors. Bright or reflective clothing recommended. Consider postponing activities requiring clear visibility."
    );
  } else if (visibility < 5000) {
    suggestions.push(
      "🔍 Reduced visibility (" +
        visibility +
        "m). Allow extra travel time. Use location pins when meeting others. Take photos of landmarks or street signs to help with navigation."
    );
  }

  // Weather condition-based suggestions - Expanded
  if (condition.includes("rain") || description.includes("rain")) {
    if (description.includes("light")) {
      suggestions.push(
        "🌦️ Light rain expected! Pack a compact umbrella and water-resistant shoes. Consider quick-dry clothing materials and a waterproof phone case."
      );
    } else if (description.includes("heavy")) {
      suggestions.push(
        "🌧️ Heavy rainfall warning! Waterproof (not just water-resistant) gear is essential. Check local flood alerts before traveling to low-lying areas. Have backup indoor activities planned."
      );
    } else if (description.includes("drizzle")) {
      suggestions.push(
        "🌧️ Light drizzle in forecast. A water-resistant jacket should suffice. Pack microfiber cloth for camera lenses and eyeglasses. Still suitable for most outdoor activities with proper preparation."
      );
    } else {
      suggestions.push(
        "🌧️ Rain in the forecast! Bring a raincoat or umbrella and waterproof footwear. Pack a dry bag for electronics and plan some indoor activities as alternatives."
      );
    }
  }

  if (condition.includes("snow") || description.includes("snow")) {
    if (description.includes("light")) {
      suggestions.push(
        "❄️ Light snow expected. Waterproof boots with good traction recommended. Pack hat and gloves. Road conditions may be slippery - allow extra travel time."
      );
    } else if (description.includes("heavy")) {
      suggestions.push(
        "❄️❄️ Heavy snowfall warning! Insulated waterproof boots with deep treads essential. Pack thermal layers, snow gaiters, and waterproof gloves. Check for transit delays or cancellations. Consider travel insurance."
      );
    } else {
      suggestions.push(
        "❄️ Snowy conditions expected! Pack waterproof boots with good traction. Bring thermal socks, waterproof gloves, and clothing layers. Check road conditions before driving and allow extra travel time."
      );
    }
  }

  if (
    condition.includes("fog") ||
    description.includes("fog") ||
    description.includes("mist")
  ) {
    suggestions.push(
      "🌫️ Reduced visibility due to fog! If driving, use low-beam headlights and maintain extra distance from other vehicles. Check for delays if flying or using public transportation. Consider postponing trips to scenic viewpoints."
    );
  }

  if (
    condition.includes("storm") ||
    description.includes("storm") ||
    description.includes("thunder")
  ) {
    suggestions.push(
      "⛈️ Storm warning! Stay informed with a local weather app. Avoid open areas, hilltops, and bodies of water. Have emergency contact information and shelter locations ready. Consider travel insurance for potential cancellations."
    );
  }

  if (condition.includes("hail") || description.includes("hail")) {
    suggestions.push(
      "🧊 Hail warning! Seek immediate shelter during hailstorms. If driving, pull over under protective covering if possible. Protect head and face if caught outdoors. Check vehicles for damage afterward."
    );
  }

  if (
    condition.includes("dust") ||
    description.includes("dust") ||
    description.includes("sand")
  ) {
    suggestions.push(
      "🏜️ Dust/sand conditions! Bring dust masks or bandanas to cover mouth and nose. Pack eye protection/goggles. Keep electronics in sealed containers. Consider saline nasal spray and eye drops for comfort."
    );
  }

  if (condition.includes("clear")) {
    if (!isDaytime) {
      suggestions.push(
        "🌙 Clear night skies! Excellent for stargazing - pack a star chart or astronomy app. Bring a flashlight with red light option to preserve night vision. Night temperatures may drop significantly, so pack an extra layer."
      );
    } else {
      suggestions.push(
        "☀️ Clear skies! Perfect for photography and outdoor activities. Still bring sun protection even if temperatures are moderate. Great conditions for local exploration!"
      );
    }
  }

  if (
    condition.includes("cloud") ||
    description.includes("cloud") ||
    description.includes("overcast")
  ) {
    if (description.includes("scattered") || description.includes("few")) {
      suggestions.push(
        "⛅ Partly cloudy conditions. Good for most outdoor activities with some natural sun protection. Still bring sun protection as UV rays penetrate light cloud cover. Good lighting for photography."
      );
    } else {
      suggestions.push(
        "☁️ Overcast conditions. Good for outdoor activities without direct sun exposure. Layers are recommended as temperatures can fluctuate. Keep a compact umbrella handy as conditions may change."
      );
    }
  }

  // UV index considerations (approximated based on conditions)
  if (isDaytime && condition.includes("clear") && temp > 25) {
    suggestions.push(
      "🔆 High UV index likely! Wear broad-spectrum SPF 50+ sunscreen, UV-blocking sunglasses, and protective clothing. Reapply sunscreen every 2 hours, especially after swimming or sweating. Seek shade during peak hours (10am-4pm)."
    );
  }

  // Seasonal allergies considerations
  if (
    (condition.includes("clear") || condition.includes("cloud")) &&
    humidity > 60 &&
    temp > 15
  ) {
    suggestions.push(
      "🌼 Possible seasonal allergens present. If sensitive, pack antihistamines, nasal spray, and eye drops. Consider tracking local pollen counts. Rinse face and hands after extended outdoor exposure."
    );
  }

  // Local travel considerations - Expanded
  suggestions.push(
    "🧳 Travel Tip: Before heading out, save offline maps of " +
      weatherData.name +
      " and download translation apps if needed. Check local transportation availability based on current weather conditions."
  );

  suggestions.push(
    "📱 Tech Tip: Weather conditions may affect device performance. In extreme heat, prevent overheating by keeping devices out of direct sunlight. In cold weather, keep devices in inner pockets to maintain battery life. In humid conditions, use waterproof cases."
  );

  suggestions.push(
    "🏛️ Activity Planning: Current weather is ideal for " +
      getRecommendedActivities(temp, condition, humidity, isDaytime) +
      ". Check operating hours as they may change based on weather conditions."
  );

  return suggestions;
};

function getRecommendedActivities(temp, condition, humidity, isDaytime) {
  if (
    condition.includes("rain") ||
    condition.includes("storm") ||
    condition.includes("snow")
  ) {
    return "indoor activities like museums, galleries, shopping centers, and local cuisine restaurants";
  } else if (temp > 30) {
    return "water-based activities, indoor attractions with air conditioning, and early morning or evening outdoor explorations";
  } else if (temp < 5) {
    return "indoor cultural sites, cozy cafés, and short outdoor excursions with proper cold-weather gear";
  } else if (
    isDaytime &&
    (condition.includes("clear") ||
      (condition.includes("cloud") && !condition.includes("overcast")))
  ) {
    return "outdoor sightseeing, parks, walking tours, and outdoor dining";
  } else if (!isDaytime && condition.includes("clear")) {
    return "night tours, rooftop bars, outdoor evening events, and stargazing if away from city lights";
  } else {
    return "a mix of indoor and outdoor activities, with flexible scheduling to adapt to changing conditions";
  }
}

const LiveWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Mumbai");

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      const data = await fetchWeatherData(city);
      if (data) {
        setWeatherData(data);
        setError(null);
      } else {
        setError(
          "Failed to fetch weather data. Please check the city name and try again."
        );
      }
      setLoading(false);
    };

    getWeather();
  }, [city]);

  const handleCityChange = (e) => setCity(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Force refresh of weather data when form is submitted
    const getWeather = async () => {
      setLoading(true);
      const data = await fetchWeatherData(city);
      if (data) {
        setWeatherData(data);
        setError(null);
      } else {
        setError(
          "Failed to fetch weather data. Please check the city name and try again."
        );
      }
      setLoading(false);
    };
    getWeather();
  };

  // Get safety suggestions only if we have weather data
  const travelSuggestions = weatherData
    ? getSafetySuggestions(weatherData)
    : [];

  return (
    <div className="mt-12 max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-indigo-50 to-violet-50">
      {/* Decorative accent line */}
      <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-amber-400"></div>

      <div className="p-4 sm:p-6 md:p-8">
        {/* Header Section with Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-amber-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
              </svg>
              Live Weather Updates
            </h2>
            <p className="text-base sm:text-lg text-indigo-700/70 mt-1">
              Check weather conditions before you travel
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full md:w-auto mt-4 md:mt-0"
          >
            <div className="relative flex w-full">
              <input
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="Enter city name"
                className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-indigo-100 rounded-l-lg w-full md:w-64 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white/80"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-r-lg hover:from-indigo-700 hover:to-violet-700 transition-all font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8 sm:py-16 bg-white/80 rounded-xl shadow-sm">
            <div className="mb-4 w-10 h-10 sm:w-12 sm:h-12 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-base sm:text-lg text-indigo-800">
              Loading weather data...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-6 sm:py-8 bg-red-50 rounded-xl border border-red-100 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="font-semibold text-red-700">{error}</p>
            <p className="text-sm mt-1 text-red-600">
              Try checking the spelling or searching for a different city
            </p>
          </div>
        ) : (
          weatherData && (
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Main Weather Card */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-indigo-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-indigo-900">
                    {weatherData.name}, {weatherData.sys.country}
                  </h3>
                  <p className="text-sm sm:text-base text-indigo-600/80">
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center mt-2 sm:mt-3">
                    <span className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs sm:text-sm font-medium capitalize">
                      {weatherData.weather[0].description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mt-4 md:mt-0">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-16 h-16 sm:w-24 sm:h-24 mr-2 sm:mr-4"
                  />
                  <div className="text-right">
                    <p className="text-3xl sm:text-5xl font-bold text-indigo-900">
                      {Math.round(weatherData.main.temp)}°C
                    </p>
                    <p className="text-sm sm:text-md text-indigo-700/80 mt-1">
                      Feels like: {Math.round(weatherData.main.feels_like)}°C
                    </p>
                    <p className="text-xs sm:text-sm text-indigo-700/70">
                      H: {Math.round(weatherData.main.temp_max)}°C | L:{" "}
                      {Math.round(weatherData.main.temp_min)}°C
                    </p>
                  </div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-indigo-100 flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2 sm:mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14.5v.5a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.5M14 10V5a2 2 0 10-4 0v5M10 15H8a2 2 0 100 4h10a2 2 0 100-4h-3"
                      />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-indigo-600/70 font-medium">
                    Humidity
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-indigo-900 mt-1">
                    {weatherData.main.humidity}%
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-indigo-100 flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2 sm:mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-indigo-600/70 font-medium">
                    Wind
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-indigo-900 mt-1">
                    {weatherData.wind.speed} m/s
                  </p>
                  <p className="text-xs sm:text-sm text-indigo-600/60 mt-1">
                    {Math.round(weatherData.wind.speed * 3.6)} km/h
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-indigo-100 flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2 sm:mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-indigo-600/70 font-medium">
                    Pressure
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-indigo-900 mt-1">
                    {weatherData.main.pressure}
                  </p>
                  <p className="text-xs sm:text-sm text-indigo-600/60 mt-1">
                    hPa
                  </p>
                </div>
              </div>

              {/* Travel Suggestions */}
              {travelSuggestions.length > 0 && (
                <div className="mt-1 sm:mt-2 p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-900">
                      Travel Safety Tips & Recommendations
                    </h3>
                  </div>

                  <ul className="space-y-2 sm:space-y-3">
                    {travelSuggestions.map((tip, index) => (
                      <li
                        key={index}
                        className="text-amber-800 flex items-start bg-white p-2 sm:p-3 rounded-lg shadow-sm text-sm sm:text-base"
                      >
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 mr-2 sm:mr-3 font-medium text-xs sm:text-sm">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data Source Footer */}
              <div className="mt-1 sm:mt-2 p-3 sm:p-4 bg-white/80 border border-indigo-100 rounded-lg text-center text-xs sm:text-sm text-indigo-600/60">
                <p>
                  Data provided by OpenWeatherMap | Last updated:{" "}
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LiveWeather;
