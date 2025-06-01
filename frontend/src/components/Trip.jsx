import { useEffect, useState } from "react";
import TripCard from "@/components/TripCard";
import AddTripDrawer from "@/components/AddTripDrawer";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import ChatAssistant from "./ChatAssistant";
import LiveWeather from "./LiveWeather";

const Trip = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        console.log(user.id);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(
          `${backendUrl}/api/fetchtrip/${user.id}`
        );
        console.log(response.data);
        setTrips(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError(error.message);
        if (error.response?.status === 404) {
          setTrips([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  const handleAddTrip = (newTrip) => {
    setTrips([...trips, { id: trips.length + 1, ...newTrip }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <ChatAssistant />

      {/* Hero Section with Overlay Gradient */}
      <div
        className="relative w-full h-[600px] bg-cover bg-center flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1634418074362-1bea22613b18?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/80 to-indigo-600/50"></div>

        {/* Content with animation classes */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Plan Your <span className="text-amber-300">Safe Journey</span>
          </h1>
          <p className="text-xl text-white/90 max-w-xl mx-auto leading-relaxed">
            Get the safest routes for your trips with our advanced safety
            algorithms
          </p>
          <button className="mt-8 bg-amber-500 hover:bg-amber-400 text-violet-900 font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl">
            Explore Routes
          </button>
        </div>
      </div>

      <div className="container mx-auto py-16 px-6">
        {/* Your Trips Section with Card Design */}
        <div className="mb-16 ">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-violet-700 to-indigo-500 bg-clip-text text-transparent mb-3">
              Your Trips
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mx-auto rounded-full"></div>
            <p className="text-lg text-indigo-700/70 mt-4">
              Manage and track your travel plans effortlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 ">
            {trips.length > 0 ? (
              trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  date={new Date(trip.date).toLocaleDateString()}
                  source={trip.source}
                  destination={trip.destination}
                  className="bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-lg"
                />
              ))
            ) : (
              <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-xl p-10 text-center border border-indigo-100 shadow-sm ">
                <div className="text-indigo-400 text-5xl mb-4">✈️</div>
                <p className="text-indigo-700 text-lg">
                  No trips added yet. Start planning your safe journey!
                </p>
              </div>
            )}
            <TripCard isAddButton onClick={() => setIsDrawerOpen(true)} />
          </div>
        </div>

        {/* Weather Section with Enhanced Design */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12 md:mb-16 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-indigo-600 to-violet-800">
            <div className="p-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400"></div>
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                Live Weather Updates
              </h2>
              <p className="text-indigo-100 mb-4 sm:mb-6 text-sm sm:text-base">
                Real-time weather information for your journey
              </p>
              <LiveWeather />
            </div>
          </div>
        </div>

        {/* Safety Insights Section */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600"></div>
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-3 text-amber-500">🛡️</div>
              <h2 className="text-3xl font-bold text-indigo-800">
                Travel Safety Insights
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Avoid traveling late at night in unfamiliar areas.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Use well-lit and crowded roads whenever possible.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Always share your location with someone you trust.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Check weather conditions before planning your trip.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Keep digital copies of important documents in secure cloud
                      storage.
                    </p>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Research local emergency numbers and save them in your
                      contacts.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Wear appropriate footwear for the terrain you'll be
                      exploring.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Carry a basic first aid kit with essential medications.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Be aware of local customs and dress codes to respect
                      cultural norms.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-amber-500 mr-2">•</div>
                    <p className="text-indigo-700">
                      Use a money belt or anti-theft bag to protect valuables.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <button className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center">
              <span>View All Safety Tips</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-indigo-700/70">
          <p>© 2025 SafeJourney | Your trusted travel companion</p>
        </div>
      </div>

      {/* Add Trip Drawer */}
      <AddTripDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddTrip={handleAddTrip}
      />
    </div>
  );
};

export default Trip;
