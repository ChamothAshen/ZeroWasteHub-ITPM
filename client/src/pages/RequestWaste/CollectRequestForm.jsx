import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CollectRequestForm = () => {
    const navigate = useNavigate();
    const [uId, setuId] = useState("");

    useEffect(() => {
        setuId('bb797925-dfae-4531-aadd-294a87fd73f2');
    }, []);

    const [formData, setFormData] = useState({
        binType: "",
        location: "",
        contactNo: "",
        description: "",
        specialInstructions: "",
        quantity: "1",
        date: "",
        immediate: false
    });

    useEffect(() => {
        if (uId) {
            console.log("User ID set:", uId);
        }
    }, [uId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));

        // If immediate is checked, clear the date
        if (name === "immediate" && checked) {
            setFormData((prevData) => ({ ...prevData, date: "" }));
        }
        // If date is set, uncheck immediate
        if (name === "date" && value) {
            setFormData((prevData) => ({ ...prevData, immediate: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Ensure we're using the current value of uId
            if (!uId) {
                alert("User ID is not available. Please try again.");
                return;
            }

            let formattedDate;
            if (formData.immediate) {
                formattedDate = new Date().toISOString();
            } else if (formData.date) {
                formattedDate = new Date(formData.date).toISOString();
            } else {
                alert("Please select a date or choose immediate collection");
                return;
            }

            const submissionData = {
                userId: uId,
                scheduleDate: formattedDate,
                location: formData.location,
                binType: formData.binType,
                quantity: parseInt(formData.quantity, 10) || 1,
                description: formData.description,
                contactNo: formData.contactNo,
                specialInstructions: formData.specialInstructions || ""
            };

            console.log("Submitting data:", submissionData);

            // Submit the data to the API
          const response = await fetch('http://localhost:3000/api/collection-requests', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(submissionData),
});

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Server responded with status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();
            console.log("Response data:", result);

            if (result.success) {
                alert("Collection request submitted successfully!");
                // Navigate to the Card Payment page
                navigate("/CardPayment", {
                    state: {
                        data: submissionData,
                        requestId: result.data.requestId
                    }
                });
            } else {
                alert(result.message || "Failed to submit collection request");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert(`Failed to submit collection request: ${error.message}`);
        }
    };

    const cancel = () => {
        // Temporary confirm implementation
        if (window.confirm("Are you sure you want to cancel?")) {
            navigate("/client");
        }
    };

    // Icons for waste types
    const wasteTypeIcons = {
        general: "🗑️",
        recycling: "♻️",
        compost: "🌱",
        paper: "📄",
        electronics: "💻",
        hazardous: "⚠️"
    };

    return (
        <div className="min-h-screen bg-green-50">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-green-200">
                    <div className="px-6 py-8 border-b border-green-200 bg-gradient-to-r from-green-600 to-green-400 text-white">
                        <h2 className="text-3xl font-bold text-white flex items-center">
                            <span className="mr-2">♻️</span> Waste Collection Request
                        </h2>
                        <p className="mt-2 text-white opacity-90">Fill out the form below to schedule a waste collection</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                        <div>
                            <label htmlFor="binType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <span className="mr-1">🗑️</span> Waste Type
                            </label>
                            <select
                                id="binType"
                                name="binType"
                                value={formData.binType}
                                onChange={handleChange}
                                className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                                required
                            >
                                <option value="">Select Waste Type</option>
                                <option value="general">{wasteTypeIcons.general} General Waste</option>
                                <option value="recycling">{wasteTypeIcons.recycling} Recycling</option>
                                <option value="compost">{wasteTypeIcons.compost} Organic Waste</option>
                                <option value="paper">{wasteTypeIcons.paper} Paper/Cardboard</option>
                                <option value="electronics">{wasteTypeIcons.electronics} Electronic Waste</option>
                                <option value="hazardous">{wasteTypeIcons.hazardous} Hazardous Waste</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <span className="mr-1">📍</span> Collection Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter complete address"
                                className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                id="contactNo"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                                placeholder="Phone number for collection coordination"
                                className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <span className="mr-1">📝</span> Waste Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the waste to be collected"
                                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                                    Special Instructions
                                </label>
                                <textarea
                                    id="specialInstructions"
                                    name="specialInstructions"
                                    value={formData.specialInstructions}
                                    onChange={handleChange}
                                    placeholder="Any special handling or access instructions"
                                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <span className="mr-1">🔢</span> Estimated Volume (in bags/bins)
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                className="w-full md:w-1/4 rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                                required
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="flex-grow">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <span className="mr-1">📅</span> Preferred Collection Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                                    disabled={formData.immediate}
                                    required={!formData.immediate}
                                />
                            </div>
                            <div className="flex items-center pt-6">
                                <input
                                    type="checkbox"
                                    id="immediate"
                                    name="immediate"
                                    checked={formData.immediate}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500 mr-2"
                                    disabled={formData.date !== ""}
                                />
                                <label htmlFor="immediate" className="text-sm text-gray-700 flex items-center">
                                    <span className="ml-1 mr-1">⚡</span> Urgent Collection (ASAP)
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-4 border-t border-green-200">
                            <button
                                type="button"
                                className="px-4 py-2 bg-white border border-green-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                onClick={cancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                            >
                                <span className="mr-1">✅</span> Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CollectRequestForm;