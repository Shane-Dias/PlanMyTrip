import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TripCard = ({ date, source, destination, isAddButton, onClick }) => {
  const navigate = useNavigate();

  // Handle card click
  const handleCardClick = () => {
    if (isAddButton) {
      onClick(); // Trigger the onClick prop for the add button
    } else {
      // Navigate to the /map route with query parameters
      const formattedDate = format(date, "yyyy-MM-dd");
      navigate(
        `/map?source=${encodeURIComponent(
          source
        )}&destination=${encodeURIComponent(destination)}&date=${formattedDate}`
      );
    }
  };

  if (isAddButton) {
    return (
      <Card
        onClick={handleCardClick}
        className="w-full sm:min-w-[300px] md:min-w-[350px] h-[180px] sm:h-[220px] flex items-center justify-center cursor-pointer group transition-all duration-300 hover:shadow-lg border border-gray-200"
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
          <span className="text-3xl sm:text-4xl text-gray-400 group-hover:text-gray-600">
            +
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      onClick={handleCardClick}
      className="w-full sm:min-w-[300px] md:min-w-[350px] h-auto min-h-[180px] sm:h-[220px] p-4 sm:p-6 md:p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer"
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="text-base sm:text-lg text-gray-500">
          {date && format(date, "MMMM d, yyyy")}
        </div>
        <div className="space-y-2 sm:space-y-4">
          <div className="flex items-center gap-2 text-lg sm:text-xl">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="font-semibold truncate">{source}</span>
          </div>
          <div className="flex items-center gap-2 text-lg sm:text-xl">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="font-semibold truncate">{destination}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;
