import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CollectRequestForm = () => {
    const navigate = useNavigate();
    const [uId, setuId] = useState("");

    useEffect(() => {
        setuId('bb797925-dfae-4531-aadd-294a87fd73f2');
    }, []);

    const [formData, setFormData] = useState({
        userId: uId,
        binType: "",
        location: "",
        contactNo: "",
        description: "",
        specialInstructions: "",
        quantity: "1",
        date: "",
        immediate: false
    });

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
            const submissionData = {
                userId: uId,
                scheduleDate: formData.immediate ? new Date().toISOString() : formData.date,
                location: formData.location,
                binType: formData.binType,
                quantity: formData.quantity,
                description: formData.description,
                contactNo: formData.contactNo,
                specialInstructions: formData.specialInstructions
            };

            // Temporary alert implementation
            alert("Collection request submitted successfully!");
            navigate("/client");
        } catch (error) {
            // Temporary alert implementation
            alert("Failed to submit collection request. Please try again.");
        }
    };

    const cancel = () => {
        // Temporary confirm implementation
        if (window.confirm("Are you sure you want to cancel?")) {
            navigate("/client");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-8 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800">Waste Collection Request</h2>
                        <p className="mt-2 text-gray-600">Fill out the form below to schedule a waste collection</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                        <div>
                            <label htmlFor="binType" className="block text-sm font-medium text-gray-700 mb-1">
                                Waste Type
                            </label>
                            <select
                                id="binType"
                                name="binType"
                                value={formData.binType}
                                onChange={handleChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                                required
                            >
                                <option value="">Select Waste Type</option>
                                <option value="general">General Waste</option>
                                <option value="recycling">Recycling</option>
                                <option value="compost">Organic Waste</option>
                                <option value="paper">Paper/Cardboard</option>
                                <option value="electronics">Electronic Waste</option>
                                <option value="hazardous">Hazardous Waste</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Collection Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter complete address"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
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
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Waste Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the waste to be collected"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
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
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Estimated Volume (in bags/bins)
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                className="w-full md:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                                required
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="flex-grow">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferred Collection Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                                    disabled={formData.immediate}
                                />
                            </div>
                            <div className="flex items-center pt-6">
                                <input
                                    type="checkbox"
                                    id="immediate"
                                    name="immediate"
                                    checked={formData.immediate}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                    disabled={formData.date !== ""}
                                />
                                <label htmlFor="immediate" className="text-sm text-gray-700">
                                    Urgent Collection (ASAP)
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-4 border-t border-gray-200">
                            <button
                                type="button"
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={cancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CollectRequestForm;