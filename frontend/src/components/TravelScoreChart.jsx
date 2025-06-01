import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  TrendingUp,
  Loader2,
  AlertTriangle,
  Car,
  CloudRain,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { motion } from "framer-motion";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Custom gradient colors
const gradients = {
  primary: {
    id: "barGradient",
    colors: ["#4F46E5", "#7C3AED"],
  },
  secondary: {
    id: "cardGradient",
    colors: ["rgba(124, 58, 237, 0.1)", "rgba(79, 70, 229, 0.05)"],
  },
  pie1: {
    id: "pieGradient1",
    colors: ["#4F46E5", "#7C3AED", "#A78BFA", "#C4B5FD"],
  },
  pie2: {
    id: "pieGradient2",
    colors: ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"],
  },
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Create custom gradients for our chart elements
const Gradients = () => (
  <svg
    style={{ width: 0, height: 0, position: "absolute" }}
    aria-hidden="true"
    focusable="false"
  >
    <linearGradient id={gradients.primary.id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={gradients.primary.colors[0]} />
      <stop offset="100%" stopColor={gradients.primary.colors[1]} />
    </linearGradient>
    <linearGradient id={gradients.secondary.id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={gradients.secondary.colors[0]} />
      <stop offset="100%" stopColor={gradients.secondary.colors[1]} />
    </linearGradient>
  </svg>
);

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <p className="font-medium">{label}</p>
        <p className="text-primary font-bold">{`${
          payload[0].name || "Score"
        }: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Enhanced Bar Component with animation
const AnimatedBar = (props) => {
  return (
    <motion.g
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.5, delay: props.index * 0.1 }}
      transformOrigin="50% 100%"
    >
      <Bar
        {...props}
        fill={`url(#${gradients.primary.id})`}
        radius={[8, 8, 0, 0]}
        barSize={30}
      />
    </motion.g>
  );
};

const pieChartColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const generatePrompt = (start, end) => {
  return `As a travel expert, analyze traveling from ${start} to ${end}. Provide EXACTLY ONE set of data in this format:

Monthly suitability scores (12 comma-separated values 0-100): 42,78,65,90,83,67,96,72,88,49,70,61
###
Tourist demographics (2 comma-separated numbers): 15234,8123  
###
Visitor categories (3 comma-separated numbers): 5123,10234,8123

IMPORTANT: Return only ONE set of data with exactly this format. Do not provide multiple alternatives or examples.`;
};

export function TravelScoreChart() {
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  // Define the pie chart COLORS with our gradients
  const TOURIST_COLORS = ["#4F46E5", "#7C3AED", "#A78BFA", "#C4B5FD"];
  const VISITOR_COLORS = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

  const source = searchParams.get("source");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);
  const [touristTypes, setTouristTypes] = useState([]);
  const [visitorTypes, setVisitorTypes] = useState([]);
  const [safetyData, setSafetyData] = useState(null);
  const [error, setError] = useState(null);

  const processGeminiResponse = (response) => {
    try {
      if (!response) throw new Error("Empty response from API");

      // Add debugging to see what we actually received
      console.log("Raw Gemini response:", response);

      const parts = response.split("###").map((str) => str.trim());
      console.log("Split parts:", parts, "Length:", parts.length);

      if (parts.length !== 3) {
        throw new Error(
          `Invalid response format - expected 3 parts, got ${parts.length}. Response: ${response}`
        );
      }

      const [monthlyScores, tourists, visitors] = parts;

      // Process monthly scores
      const scoreValues = monthlyScores.split(",").map((num) => {
        const parsed = parseInt(num.trim());
        return isNaN(parsed) ? 50 : Math.min(Math.max(parsed, 0), 100); // Default to 50 if invalid
      });

      if (scoreValues.length !== 12)
        throw new Error("Expected 12 monthly scores");

      const monthScores = scoreValues.map((num, index) => ({
        month: months[index],
        score: num,
      }));

      // Process tourist data
      const touristValues = tourists.split(",").map((num) => {
        const parsed = parseInt(num.trim());
        return isNaN(parsed) ? 1000 : Math.max(parsed, 0); // Default to 1000 if invalid
      });

      if (touristValues.length !== 2)
        throw new Error("Expected 2 tourist values");

      const touristData = [
        {
          name: "Indian Tourists",
          value: touristValues[0],
          fill: pieChartColors[0],
        },
        {
          name: "Foreign Tourists",
          value: touristValues[1],
          fill: pieChartColors[1],
        },
      ];

      // Process visitor data
      const visitorValues = visitors.split(",").map((num) => {
        const parsed = parseInt(num.trim());
        return isNaN(parsed) ? 1000 : Math.max(parsed, 0); // Default to 1000 if invalid
      });

      if (visitorValues.length !== 3)
        throw new Error("Expected 3 visitor values");

      const visitorData = [
        { name: "Children", value: visitorValues[0], fill: pieChartColors[2] },
        {
          name: "Male Adults",
          value: visitorValues[1],
          fill: pieChartColors[3],
        },
        {
          name: "Female Adults",
          value: visitorValues[2],
          fill: pieChartColors[4],
        },
      ];

      return { monthScores, touristData, visitorData };
    } catch (err) {
      console.error("Error processing API response:", err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!source || !destination || !date || !user) {
        toast.error("Source, destination, and date are required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch travel data from Gemini 1.5 Pro
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("Gemini API key not configured");
        }
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const [travelResponse, safetyResponse] = await Promise.all([
          fetch(
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
                        text: generatePrompt(source, destination),
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  topP: 0.9,
                },
              }),
            }
          ),
          fetch(
            `${backendUrl}/api/analyzeArea/${user.id}/${source}/${destination}/${date}`
          )
            .then((res) => {
              if (!res.ok) throw new Error(`Safety API: ${res.status}`);
              return res.json();
            })
            .catch((err) => {
              console.warn("Failed to fetch safety data:", err);
              return { savedRouteOccurrence: null };
            }),
        ]);

        // Handle Gemini response
        if (!travelResponse.ok) {
          const errorData = await travelResponse.json();
          throw new Error(errorData.error?.message || "Gemini API error");
        }

        const travelData = await travelResponse.json();
        console.log("Full Gemini API response:", travelData);

        // Check if the response has the expected structure
        if (
          !travelData.candidates ||
          !travelData.candidates[0] ||
          !travelData.candidates[0].content
        ) {
          throw new Error("Invalid Gemini API response structure");
        }

        const textResponse = travelData.candidates[0].content.parts[0].text;
        console.log("Extracted text response:", textResponse);

        const { monthScores, touristData, visitorData } =
          processGeminiResponse(textResponse);

        setScores(monthScores);
        setTouristTypes(touristData);
        setVisitorTypes(visitorData);
        setSafetyData(safetyResponse.savedRouteOccurrence);

        toast.success("Travel analysis complete");
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        toast.error(`Analysis failed: ${error.message}`);

        // Use fallback data if API fails
        try {
          const fallbackResponse =
            "50,60,70,80,90,85,75,65,55,60,65,70###25000,15000###10000,20000,10000";
          const { monthScores, touristData, visitorData } =
            processGeminiResponse(fallbackResponse);
          setScores(monthScores);
          setTouristTypes(touristData);
          setVisitorTypes(visitorData);
        } catch (fallbackError) {
          console.error("Even fallback data failed:", fallbackError);
          // Set empty arrays to prevent further errors
          setScores([]);
          setTouristTypes([]);
          setVisitorTypes([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [source, destination, date, user]);

  const getBestMonth = () => {
    if (!scores || scores.length === 0) return null;
    return scores.reduce((max, current) =>
      current.score > max.score ? current : max
    );
  };

  const totalTourists = useMemo(() => {
    return (
      touristTypes?.reduce((acc, curr) => acc + (curr?.value || 0), 0) || 0
    );
  }, [touristTypes]);

  const totalVisitors = useMemo(() => {
    return (
      visitorTypes?.reduce((acc, curr) => acc + (curr?.value || 0), 0) || 0
    );
  }, [visitorTypes]);

  const bestMonth = getBestMonth();

  // Add chart data index for animations
  const scoresToRender =
    scores?.map((item, index) => ({ ...item, index })) || [];

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Analyzing travel data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error} - Showing sample data</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <Gradients />

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="w-full max-w-6xl mx-auto overflow-hidden border-none shadow-lg relative">
          {/* Gradient overlay for card */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/10 rounded-xl" />

          <CardHeader className="relative z-10 border-b">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Travel Analysis: {source} to {destination}
              </CardTitle>
              <CardDescription className="text-lg">
                Analyzing the best time to visit and tourist demographics
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-8 relative z-10 pt-6">
            {scores?.length > 0 ? (
              <motion.div
                className="flex flex-col gap-8"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                <div className="rounded-xl p-4 bg-white/50 dark:bg-gray-900/50 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">
                    Monthly Travel Score Analysis
                  </h3>
                  <div className="h-[350px] w-full">
                    <BarChart
                      width={800}
                      height={350}
                      data={scoresToRender}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      className="w-full"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(value) => value.slice(0, 3)}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        dx={-10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="score"
                        fill={`url(#${gradients.primary.id})`}
                        radius={[8, 8, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="rounded-xl p-4 bg-white/50 dark:bg-gray-900/50 shadow-sm h-[350px] flex flex-col"
                    variants={itemFadeIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      Tourist Demographics
                    </h3>
                    <div className="flex-1 flex items-center justify-center">
                      <PieChart width={300} height={300}>
                        <Pie
                          data={touristTypes}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                        >
                          {touristTypes?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                TOURIST_COLORS[index % TOURIST_COLORS.length]
                              }
                            />
                          ))}
                          <Label
                            content={({ viewBox }) => (
                              <g>
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy - 5}
                                    className="fill-foreground text-2xl font-bold"
                                  >
                                    {totalTourists.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy + 20}
                                    className="fill-muted-foreground text-sm"
                                  >
                                    Total Tourists
                                  </tspan>
                                </text>
                              </g>
                            )}
                          />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </div>
                  </motion.div>

                  <motion.div
                    className="rounded-xl p-4 bg-white/50 dark:bg-gray-900/50 shadow-sm h-[350px] flex flex-col"
                    variants={itemFadeIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      Visitor Categories
                    </h3>
                    <div className="flex-1 flex items-center justify-center">
                      <PieChart width={300} height={300}>
                        <Pie
                          data={visitorTypes}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                        >
                          {visitorTypes?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                VISITOR_COLORS[index % VISITOR_COLORS.length]
                              }
                            />
                          ))}
                          <Label
                            content={({ viewBox }) => (
                              <g>
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy - 5}
                                    className="fill-foreground text-2xl font-bold"
                                  >
                                    {totalVisitors.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy + 20}
                                    className="fill-muted-foreground text-sm"
                                  >
                                    Visitor Types
                                  </tspan>
                                </text>
                              </g>
                            )}
                          />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-l-4 border-l-yellow-500">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <AlertTitle className="text-lg">No data available</AlertTitle>
                  <AlertDescription className="text-muted-foreground">
                    We couldn't generate any travel analysis data for this
                    route.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>

          {bestMonth && (
            <CardFooter className="flex-col items-start gap-2 relative z-10 border-t bg-indigo-50/50 dark:bg-indigo-900/10 py-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 items-center"
              >
                <div className="flex gap-2 font-medium text-base">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    Best time to travel:
                  </span>
                  {bestMonth.month}
                </div>
                <div className="flex items-center bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded-full">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">
                    Score: {bestMonth.score}
                  </span>
                  <TrendingUp className="h-4 w-4 ml-1 text-indigo-700 dark:text-indigo-300" />
                </div>
              </motion.div>
              <div className="leading-tight text-muted-foreground">
                Based on weather, costs, crowds, and local events
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      {safetyData?.occurrences && (
        <motion.div
          className="w-full max-w-6xl mx-auto space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-indigo-600" />
            Safety Analysis
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {safetyData.occurrences.crimes?.length > 0 && (
              <motion.div
                variants={itemFadeIn}
                transition={{ delay: 0.7 }}
                className="lg:col-span-1"
              >
                <Card className="h-full border-none shadow-md relative overflow-hidden">
                  {/* Gradient corner accent */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full" />

                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Recent Crime Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {safetyData.occurrences.crimes.map((crime, idx) => (
                        <motion.div
                          key={crime._id || idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx, duration: 0.3 }}
                        >
                          <Alert
                            variant={
                              crime.severity >= 4 ? "destructive" : "default"
                            }
                            className={`border-l-4 ${
                              crime.severity >= 4
                                ? "border-l-red-600"
                                : "border-l-orange-400"
                            }`}
                          >
                            <AlertTitle className="flex items-center gap-2 font-semibold">
                              {crime.crimeType} - {crime.time}
                              <span
                                className={`text-sm px-2 py-0.5 rounded-full ${
                                  crime.severity >= 4
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                }`}
                              >
                                Severity: {crime.severity}/5
                              </span>
                            </AlertTitle>
                            <AlertDescription className="ml-1">
                              {crime.description}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {safetyData.occurrences.incidents?.length > 0 && (
              <motion.div
                variants={itemFadeIn}
                transition={{ delay: 0.8 }}
                className="lg:col-span-1"
              >
                <Card className="h-full border-none shadow-md relative overflow-hidden">
                  {/* Gradient corner accent */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full" />

                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-amber-500" />
                      Traffic & Road Incidents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {safetyData.occurrences.incidents.map((incident, idx) => (
                        <motion.div
                          key={incident._id || idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx, duration: 0.3 }}
                        >
                          <Alert
                            variant={
                              incident.severity >= 4 ? "destructive" : "default"
                            }
                            className={`border-l-4 ${
                              incident.severity >= 4
                                ? "border-l-red-600"
                                : "border-l-amber-400"
                            }`}
                          >
                            <AlertTitle className="flex items-center gap-2 font-semibold">
                              {incident.incidentType}
                            </AlertTitle>
                            <AlertDescription className="ml-1">
                              {incident.description}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {safetyData.occurrences.weather?.length > 0 && (
              <motion.div
                variants={itemFadeIn}
                transition={{ delay: 0.9 }}
                className="lg:col-span-1"
              >
                <Card className="h-full border-none shadow-md relative overflow-hidden">
                  {/* Gradient corner accent */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full" />

                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <CloudRain className="h-5 w-5 text-blue-500" />
                      Weather Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {safetyData.occurrences.weather.map((alert, idx) => (
                        <motion.div
                          key={alert._id || idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx, duration: 0.3 }}
                        >
                          <Alert className="border-l-4 border-l-blue-500">
                            <AlertTitle className="font-semibold flex items-center gap-2">
                              {alert.alertType}
                              <span className="text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                Severity: {alert.severity}
                              </span>
                            </AlertTitle>
                            <AlertDescription className="ml-1">
                              {alert.description}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default TravelScoreChart;
