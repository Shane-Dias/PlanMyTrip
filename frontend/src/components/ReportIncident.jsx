import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Iridescence from './Iridescence';
import axios from "axios";

const ReportIncident = () => {
  const { user } = useUser();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState("");
  const [nearbyIncidents, setNearbyIncidents] = useState([]);
  const [editingIncidentId, setEditingIncidentId] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [visibleComments, setVisibleComments] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch user's current location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchNearbyIncidents(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setError("Unable to retrieve your location.");
      }
    );
  };

  // Fetch nearby incidents
  const fetchNearbyIncidents = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/incidents/nearby?latitude=${latitude}&longitude=${longitude}&radius=1`
      );
      setNearbyIncidents(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching nearby incidents:", error);
      setError("Failed to fetch nearby incidents.");
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to report an incident.");
      return;
    }

    if (!location.latitude || !location.longitude) {
      setError("Please allow location access to report an incident.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("description", description);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post(`${backendUrl}/api/incidents/report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Incident reported successfully!");
      setDescription("");
      setImages([]);
      setError("");
      fetchNearbyIncidents(location.latitude, location.longitude);
    } catch (error) {
      console.error("Error reporting incident:", error);
      setError("Failed to report incident.");
    }
  };

  // Handle upvote/downvote
  const handleVote = async (incidentId, voteType) => {
    try {
      await axios.post(`${backendUrl}/api/incidents/${incidentId}/vote`, {
        userId: user.id,
        voteType,
      });
      fetchNearbyIncidents(location.latitude, location.longitude);
    } catch (error) {
      console.error("Error voting:", error);
      setError("Failed to vote on the incident.");
    }
  };

  // Handle adding a comment
  const handleComment = async (incidentId, comment) => {
    try {
      await axios.post(`${backendUrl}/${incidentId}/comment`, {
        userId: user.id,
        comment,
      });
      fetchNearbyIncidents(location.latitude, location.longitude);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment.");
    }
  };

  // Handle editing a comment
  const handleEditComment = (commentId, currentComment) => {
    setEditingCommentId(commentId); // Set the comment being edited
    setEditedCommentText(currentComment); // Set the current comment text for editing
  };

  // Save the edited comment
  const saveEditedComment = async (incidentId, commentId) => {
    try {
      await axios.put(`${backendUrl}/api/incidents/${incidentId}/comments/${commentId}`, {
        userId: user.id, // Ensure this is the correct user ID
        newComment: editedCommentText, // Ensure this is the updated comment text
      });
      setEditingCommentId(null); // Stop editing
      fetchNearbyIncidents(location.latitude, location.longitude); // Refresh nearby incidents
    } catch (error) {
      console.error("Error updating comment:", error);
      setError("Failed to update comment.");
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (incidentId, commentId) => {
    try {
      await axios.delete(`${backendUrl}/${incidentId}/comments/${commentId}`, {
        params: { userId: user.id }, // Send userId as a query parameter
      });
      fetchNearbyIncidents(location.latitude, location.longitude); // Refresh nearby incidents
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment.");
    }
  };

  // Handle editing an incident
  const handleEdit = (incidentId, currentDescription) => {
    setEditingIncidentId(incidentId); // Set the incident being edited
    setEditedDescription(currentDescription); // Set the current description for editing
  };

  // Save the edited incident
  const saveEdit = async (incidentId) => {
    try {
      await axios.put(`${backendUrl}/api/incidents/${incidentId}`, {
        userId: user.id,
        description: editedDescription,
      });
      setEditingIncidentId(null); // Stop editing
      fetchNearbyIncidents(location.latitude, location.longitude); // Refresh nearby incidents
    } catch (error) {
      console.error("Error updating incident:", error);
      setError("Failed to update incident.");
    }
  };

  // Handle deleting an incident
  const deleteIncident = async (incidentId) => {
    try {
      await axios.delete(`${backendUrl}/api/incidents/${incidentId}`, {
        data: { userId: user.id },
      });
      fetchNearbyIncidents(location.latitude, location.longitude); // Refresh nearby incidents
    } catch (error) {
      console.error("Error deleting incident:", error);
      setError("Failed to delete incident.");
    }
  };

  // Toggle comments visibility
  const toggleComments = (incidentId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [incidentId]: !prev[incidentId],
    }));
  };

  // Fetch location and nearby incidents on component mount
  useEffect(() => {
    getLocation();
  }, []);

  // Sort incidents by net votes
  const sortedIncidents = nearbyIncidents.sort((a, b) => {
    const netVotesA = (a.upvoteCount || 0) - (a.downvoteCount || 0);
    const netVotesB = (b.upvoteCount || 0) - (b.downvoteCount || 0);
    return netVotesB - netVotesA;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-900 relative overflow-hidden">
      {/* Abstract Background Elements  */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full blur-3xl -ml-20 -mb-20"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-3xl"></div>
        <Iridescence
          color={[1, 0.2, 1]}
          mouseReact={false}
          amplitude={0.5}
          speed={1.0}
          className="w-full h-full"
        />
      </div>
  
      <div className="relative z-10 max-w-5xl mx-auto py-8 md:py-16 px-4 sm:px-6">
        {/* Header with 3D Effect */}
        <div className="flex justify-center mb-8 md:mb-14">
          <div className="relative">
            <h1 className="text-3xl md:text-5xl font-extrabold text-center drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200">
                Community Incidents Reporter
              </span>
            </h1>
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          </div>
        </div>
  
        {error && (
          <div className="mb-6 md:mb-8 p-4 md:p-5 bg-red-900 bg-opacity-20 backdrop-blur-md border border-red-500 border-opacity-30 rounded-xl shadow-lg transform hover:scale-[1.01] transition-all duration-300">
            <p className="text-red-200 flex items-center text-sm md:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </p>
          </div>
        )}
  
        {/* Report Form Card with Enhanced Glass Morphism */}
        <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-4 md:p-8 mb-8 md:mb-12 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8 flex items-center">
            <div className="p-2 mr-3 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            Report an Incident
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-7">
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 md:p-4 bg-white bg-opacity-5 border border-purple-300 border-opacity-20 rounded-xl focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition-all text-white placeholder-purple-200 placeholder-opacity-40"
                rows="3"
                placeholder="Describe the incident in detail..."
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">Upload Images</label>
              <div className="w-full p-4 md:p-6 border-2 border-dashed border-purple-400 border-opacity-30 rounded-xl hover:border-opacity-50 transition-all cursor-pointer bg-white bg-opacity-5">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full text-xs md:text-sm text-purple-100 file:mr-3 md:file:mr-4 file:py-2 file:px-3 md:file:py-2.5 md:file:px-5 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-fuchsia-500 file:text-white hover:file:shadow-lg cursor-pointer"
                />
                <p className="mt-2 md:mt-3 text-xs text-purple-200 text-center">Drag and drop or click to select images</p>
                <div className="flex justify-center mt-3 md:mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-purple-300 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">Location</label>
              <button
                type="button"
                onClick={getLocation}
                className="inline-flex items-center px-4 py-2 md:px-5 md:py-3 border border-purple-400 border-opacity-30 rounded-xl text-xs md:text-sm font-medium text-white bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 hover:from-purple-500/30 hover:to-fuchsia-500/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition-all shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Get Current Location
              </button>
              {location.latitude && location.longitude && (
                <div className="mt-3 text-xs md:text-sm text-purple-200 bg-purple-900 bg-opacity-30 p-2 md:p-3 rounded-xl border border-purple-500 border-opacity-20">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">Latitude: {location.latitude}, Longitude: {location.longitude}</span>
                  </p>
                </div>
              )}
            </div>
  
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-purple-900 transition-all duration-300 transform hover:scale-[1.02] shadow-lg font-medium text-base md:text-lg mt-2 md:mt-4"
            >
              Submit Report
            </button>
          </form>
        </div>
  
        {/* Nearby Incidents Section with improved styling */}
        <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-4 md:p-8 shadow-2xl">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8 flex items-center">
            <div className="p-2 mr-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            Nearby Incidents
          </h3>
          <div className="space-y-4 md:space-y-6">
            {sortedIncidents.map((incident) => (
              <div key={incident._id} className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Incident Content */}
                <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
                  {/* Voting Section - Stack horizontally on mobile, vertically on desktop */}
                  <div className="flex flex-row md:flex-col items-center md:space-y-2 bg-white bg-opacity-5 py-2 px-3 md:py-3 md:px-2 rounded-lg mb-3 md:mb-0 justify-center space-x-4 md:space-x-0">
                    <button
                      onClick={() => handleVote(incident._id, "upvote")}
                      className="p-1 md:p-1.5 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-200" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="text-xs md:text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-fuchsia-500 px-2 py-1 md:px-3 md:py-1 rounded-full">
                      {(incident.upvoteCount || 0) - (incident.downvoteCount || 0)}
                    </span>
                    <button
                      onClick={() => handleVote(incident._id, "downvote")}
                      className="p-1 md:p-1.5 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-200" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
  
                  {/* Main Content with improved styling */}
                  <div className="flex-1">
                    {editingIncidentId === incident._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="w-full p-3 md:p-4 bg-white bg-opacity-10 border border-purple-300 border-opacity-30 rounded-xl focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent text-white"
                          rows="2"
                        />
                        <button
                          onClick={() => saveEdit(incident._id)}
                          className="px-4 py-1.5 md:px-5 md:py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-700 hover:to-fuchsia-700 transition-colors shadow-md text-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <p className="text-white text-base md:text-lg mb-2 md:mb-3">{incident.description}</p>
                    )}
  
                    <p className="text-xs md:text-sm text-purple-200 mb-3 md:mb-5 flex items-center truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {incident.location.placeName}
                    </p>
  
                    {/* Images Grid - 2 columns on mobile, 3 on desktop */}
                    {incident.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-5">
                        {incident.images.map((image, index) => (
                          <div key={index} className="relative rounded-xl overflow-hidden group">
                            <img
                              src={incident.images[index]}
                              alt={`Incident ${index}`}
                              className="w-full h-24 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        ))}
                      </div>
                    )}
  
                    {/* Action Buttons - Stack on mobile, inline on desktop */}
                    <div className="flex flex-wrap gap-2 md:gap-5 text-xs md:text-sm mt-3 md:mt-4">
                      <button
                        onClick={() => toggleComments(incident._id)}
                        className="flex-grow md:flex-grow-0 px-3 py-1.5 md:px-4 md:py-2 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-lg text-purple-100 flex items-center justify-center md:justify-start transition-colors border border-white border-opacity-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {visibleComments[incident._id] ? "Hide Comments" : "Show Comments"}
                      </button>
                      {user && user.id === incident.userId && (
                        <>
                          <button
                            onClick={() => handleEdit(incident._id, incident.description)}
                            className="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-lg text-purple-100 flex items-center justify-center md:justify-start transition-colors border border-white border-opacity-10"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => deleteIncident(incident._id)}
                            className="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 bg-red-500 bg-opacity-10 hover:bg-opacity-20 rounded-lg text-red-300 flex items-center justify-center md:justify-start transition-colors border border-red-500 border-opacity-20"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
  
                    {/* Comments Section with improved styling */}
                    {visibleComments[incident._id] && (
                      <div className="mt-6 pl-5 border-l-2 border-fuchsia-500 border-opacity-30">
                        {/* Add Comment with improved styling */}
                        <div className="mb-5">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="w-full p-4 bg-white bg-opacity-5 border border-purple-300 border-opacity-20 rounded-xl focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent text-white placeholder-purple-200 placeholder-opacity-40"
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && e.target.value.trim()) {
                                handleComment(incident._id, e.target.value);
                                e.target.value = "";
                              }
                            }}
                          />
                        </div>
  
                        {/* Comments List with improved styling */}
                        <div className="space-y-4">
                          {incident.comments.map((comment, index) => (
                            <div key={index} className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-10">
                              {editingCommentId === comment._id ? (
                                <div className="space-y-3">
                                  <textarea
                                    value={editedCommentText}
                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                    className="w-full p-3 bg-white bg-opacity-10 border border-purple-300 border-opacity-30 rounded-xl focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent text-white"
                                    rows="2"
                                  />
                                  <button
                                    onClick={() => saveEditedComment(incident._id, comment._id)}
                                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg transition-colors shadow-md"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-white">{comment.comment}</p>
                                  <div className="mt-3 flex items-center justify-between">
                                    <p className="text-xs text-purple-200 flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      User {comment.userId} • 
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {new Date(comment.timestamp).toLocaleString()}
                                    </p>
                                    {user && user.id === comment.userId && (
                                      <div className="flex items-center space-x-3">
                                        <button
                                          onClick={() => handleEditComment(comment._id, comment.comment)}
                                          className="text-xs text-purple-200 hover:text-white transition-colors flex items-center"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                          </svg>
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(incident._id, comment._id)}
                                          className="text-xs text-red-300 hover:text-red-200 transition-colors flex items-center"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;