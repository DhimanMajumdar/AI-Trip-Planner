import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Import sonner

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    location: "",
    noOfDays: "",
    budget: "",
    traveler: "",
  });

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    console.log("Final Form Data:", formData);
  }, [formData]); // Logs only when formData changes, not on every keystroke

  const handleInputChange = (name, value) => {
    if (name === "noOfDays" && value > 5) {
      toast.error("❌ Please enter Trip Days less than 5");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { location, noOfDays, budget, traveler } = formData;

    if (!location || !noOfDays || !budget || !traveler) {
      toast.error("⚠️ Please fill out all fields before submitting!");
      return;
    }

    toast.success("🎉 Trip successfully created!");
    console.log("🚀 Final Form Data before submission:", formData);
  };

  const fetchPlaces = async (inputValue) => {
    if (!inputValue) return setSuggestions([]);

    const options = {
      method: "GET",
      url: "https://place-autocomplete1.p.rapidapi.com/autocomplete/json",
      params: { input: inputValue, radius: "500" },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
        "x-rapidapi-host": "place-autocomplete1.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 flex flex-col items-center">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      {/* Location Input */}
      <div className="mt-20 mb-10 w-full">
        <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => {
            handleInputChange("location", e.target.value);
            fetchPlaces(e.target.value);
          }}
          className="border p-2 rounded w-full"
          placeholder="Enter a place..."
        />
        {suggestions.length > 0 && (
          <ul className="border mt-2 rounded bg-white shadow-lg">
            {suggestions.map((place, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleInputChange("location", place.description);
                  setSuggestions([]);
                }}
              >
                {place.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* No. of Days Input */}
      <div className="w-full">
        <h2 className="text-xl my-3 font-medium">How many days are you planning the trip?</h2>
        <Input
          placeholder="Ex. 3, Max(5)"
          type="number"
          value={formData.noOfDays}
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
      </div>

      {/* Budget Selection */}
      <div className="w-full mt-5">
        <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
        <div className="grid grid-cols-3 gap-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
                formData.budget === item.title ? "border-blue-500" : ""
              }`}
              onClick={() => handleInputChange("budget", item.title)}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-600">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Traveler Selection */}
      <div className="w-full mt-5">
        <h2 className="text-xl my-3 text-center font-medium">
          Who do you plan on traveling with?
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${
                formData.traveler === item.people ? "border-blue-500" : ""
              }`}
              onClick={() => handleInputChange("traveler", item.people)}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-600">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="my-20">
        <Button onClick={handleSubmit}>Generate Trip</Button>
      </div>
    </div>
  );
};

export default CreateTrip;
