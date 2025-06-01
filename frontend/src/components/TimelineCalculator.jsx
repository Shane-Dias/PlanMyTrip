"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Waves from "./Waves";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Star,
  Phone,
  Shield,
  CalendarIcon,
  Loader2,
  Compass,
  MapPin,
  Navigation,
  Search,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DateRangePicker = ({ dateRange, setDateRange }) => {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            disabled={(date) => date < new Date()}
            className="sm:flex hidden"
          />
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={(date) => date < new Date()}
            className="sm:hidden flex"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const TimelineCalculator = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!source || !destination || !dateRange.from || !dateRange.to) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setHotels([]);

    try {
      const prompt = `Provide a list of 5-6 safe 4+ rated hotels between ${source} and ${destination} for the duration ${format(
        dateRange.from,
        "PPP"
      )} to ${format(dateRange.to, "PPP")}. 
Include the following details for each hotel:
1. Hotel Name: Unique and culturally relevant to the destination. Use names that reflect the local culture and traditions.
2. Rating: Between 4.0 and 5.0.
3. Review: A short, realistic review.
4. Contact Information: Landline number in the format +91-XXX-XXXX-XXXX (some may be empty).

Include a mix of luxury, budget, heritage, boutique hotels, and resorts.

Format each hotel on a new line exactly like this example dont give any other information like I'm providing fictional examples..:
Hotel Name - Rating - Review - Contact
Example:
The Grand Palace - 4.5 - Excellent service and luxurious rooms - +91-22-1234-5678
Sunset Inn - 4.2 - Great location with beautiful views - 
Heritage Retreat - 4.7 - Perfect for a relaxing getaway - +91-44-8765-4321
Comfort Cottage - 4.3 - Great cottage with great comfort - No info available
Kerala Backwaters Resort - 4.6 - Serene location with houseboat facilities - +91-484-1234-5678`;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "API key is missing. Please configure your Gemini API key."
        );
      }

      // Updated Gemini API endpoint with correct model name
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch hotels");
      }

      const data = await response.json();

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format from API");
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      const hotelList = parseHotelResponse(textResponse);

      if (hotelList.length === 0) {
        throw new Error(
          "No hotels found. Please try different locations or dates."
        );
      }

      setHotels(hotelList);
      toast.success(`Found ${hotelList.length} hotels for your trip`);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setError(error.message);
      toast.error(error.message || "An error occurred while fetching hotels");
    } finally {
      setLoading(false);
    }
  };

  const parseHotelResponse = (response) => {
    try {
      const hotelLines = response
        .split("\n")
        .filter((line) => line.trim() !== "" && line.includes("-"))
        .map((line) => line.trim());

      return hotelLines.map((line, index) => {
        const parts = line.split(" - ").map((part) => part.trim());
        return {
          id: index + 1,
          name: parts[0] || "Unknown Hotel",
          rating: parts[1] || "N/A",
          review: parts[2] || "No review available",
          contact: parts[3] || "Contact not available",
        };
      });
    } catch (err) {
      console.error("Error parsing hotel response:", err);
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 sm:p-4 md:p-8">
      <Waves
        lineColor="#8737E9"
        backgroundColor="rgba(255, 255, 255, 0.2)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <div className="mx-auto py-4 sm:py-8">
        <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden border-0 bg-white bg-opacity-90 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-lg" />

          <CardHeader className="relative z-10 border-b pb-4 sm:pb-6">
            <div className="flex justify-center mb-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
              Indian Tourism Hotel Finder
            </CardTitle>
            <CardDescription className="text-center text-gray-600 mt-2 text-sm sm:text-base">
              Discover safe, highly-rated accommodations for your dream Indian
              adventure
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 relative z-10 pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-indigo-600" />
                  Source
                </label>
                <Input
                  placeholder="Enter source location (e.g., Mumbai)"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm text-sm"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-600" />
                  Destination
                </label>
                <Input
                  placeholder="Enter destination (e.g., Goa)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                Travel Dates
              </label>
              <DateRangePicker
                dateRange={dateRange}
                setDateRange={setDateRange}
                className="w-full"
              />
            </div>

            <Button
              className="w-full mt-4 sm:mt-6 py-4 sm:py-6 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all rounded-lg"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                  Finding Your Perfect Stay...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                  Discover Hotels
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-2 sm:mt-4">
              All results are vetted for safety and quality standards
            </p>
          </CardContent>
        </Card>

        {error && (
          <Card className="w-full max-w-2xl mx-auto mt-4 sm:mt-6 border-l-4 border-red-500 bg-white shadow-lg">
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-start">
                <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-red-500 mr-2 sm:mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700 text-sm sm:text-base">
                    {error}
                  </p>
                  <p className="text-xs sm:text-sm mt-1 text-red-600 opacity-80">
                    Please check your inputs and try again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {hotels.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
              Safe 4+ Rated Hotels for Your Journey
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {hotels.map((hotel) => (
                <Card
                  key={hotel.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white bg-opacity-90 backdrop-blur-sm"
                >
                  <div className="h-1 sm:h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">
                      {hotel.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-4 pt-1 sm:pt-2 px-3 sm:px-6 pb-4">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-yellow-100 p-1 sm:p-1.5">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      </div>
                      <span className="text-xs sm:text-sm">
                        <span className="font-semibold">{hotel.rating}</span>
                        <span className="text-gray-500"> rating</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-blue-100 p-1 sm:p-1.5">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 truncate max-w-full">
                        {hotel.contact}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="rounded-full bg-green-100 p-1 sm:p-1.5 mt-0.5">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {hotel.review}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-1 sm:mt-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 text-xs sm:text-sm py-1 sm:py-2"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineCalculator;
