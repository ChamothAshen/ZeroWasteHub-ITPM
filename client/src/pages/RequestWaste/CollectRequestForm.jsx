import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CollectRequestForm = () => {
  const navigate = useNavigate();
  const [uId, setUId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Price constants in LKR (Sri Lankan Rupees)
  const wastePrices = {
    general: 500, // LKR 500 per unit for general waste
    compost: 300, // LKR 300 per unit for organic waste
    paper: 200,   // LKR 200 per unit for paper
    hazardous: 750 // LKR 750 per unit for plastic (hazardous)
  };

  // Form data state
  const [formData, setFormData] = useState({
    binType: "",
    location: "",
    contactNo: "",
    description: "",
    specialInstructions: "",
    quantity: "1",
    date: "",
    immediate: ""
  });

  useEffect(() => {
    setUId('bb797925-dfae-4531-aadd-294a87fd73f2');
  }, []);

  useEffect(() => {
    if (uId) {
      console.log("User ID set:", uId);
    }
  }, [uId]);

  // Calculate price whenever bin type or quantity changes
  useEffect(() => {
    calculatePrice();
  }, [formData.binType, formData.quantity]);

  // Function to calculate the price
  const calculatePrice = () => {
    if (!formData.binType || !formData.quantity) {
      setCalculatedPrice(0);
      return;
    }
    
    const basePrice = wastePrices[formData.binType] || 0;
    const quantity = parseInt(formData.quantity, 10) || 1;
    
    // Calculate total price
    let totalPrice = basePrice * quantity;
    
    // Add urgency fee if immediate collection is requested (20% extra)
    if (formData.immediate) {
      totalPrice = totalPrice * 1.2;
    }
    
    setCalculatedPrice(totalPrice);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // If immediate is checked, clear the date and recalculate price
    if (name === "immediate" && checked) {
      setFormData((prevData) => ({ ...prevData, date: "" }));
      setTimeout(calculatePrice, 0);
    }
    // If date is set, uncheck immediate and recalculate price
    if (name === "date" && value) {
      setFormData((prevData) => ({ ...prevData, immediate: false }));
      setTimeout(calculatePrice, 0);
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.binType) {
        setSubmitError("Please select a waste type");
        return;
      }
      if (!formData.location) {
        setSubmitError("Please enter a collection location");
        return;
      }
      if (!formData.contactNo) {
        setSubmitError("Please enter a contact number");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.description) {
        setSubmitError("Please provide a waste description");
        return;
      }
      if (!formData.quantity || formData.quantity < 1) {
        setSubmitError("Please enter a valid quantity");
        return;
      }
    }

    setSubmitError("");
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setSubmitError("");
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Final validation
    if (!formData.immediate && !formData.date) {
      setSubmitError("Please select a date or choose immediate collection");
      return;
    }

    try {
      setIsSubmitting(true);

      // Ensure we're using the current value of uId
      if (!uId) {
        setSubmitError("User ID is not available. Please try again.");
        return;
      }

      let formattedDate;
      if (formData.immediate) {
        formattedDate = new Date().toISOString();
      } else if (formData.date) {
        formattedDate = new Date(formData.date).toISOString();
      } else {
        setSubmitError("Please select a date or choose immediate collection");
        return;
      }

      // Calculate the final price before submission
      calculatePrice();

      const submissionData = {
        userId: uId,
        scheduleDate: formattedDate,
        location: formData.location,
        binType: formData.binType,
        quantity: parseInt(formData.quantity, 10) || 1,
        description: formData.description,
        contactNo: formData.contactNo,
        specialInstructions: formData.specialInstructions || "",
        price: calculatedPrice // Include the calculated price
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
        // Navigate to the Card Payment page
        navigate("/CardPayment", {
          state: {
            data: submissionData,
            requestId: result.data.requestId,
            price: calculatedPrice // Pass the price to the payment page
          }
        });
      } else {
        throw new Error(result.message || "Failed to submit collection request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(`Failed to submit request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = () => {
    if (window.confirm("Are you sure you want to cancel? All entered information will be lost.")) {
      navigate("/client");
    }
  };

  // Format the price with LKR and thousand separators
  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString('en-LK')}`;
  };

  // Waste type icons and display names
  const wasteTypes = {
    general: { icon: "🗑️", name: "General Waste" },
    compost: { icon: "🌱", name: "Organic Waste" },
    paper: { icon: "📄", name: "Paper" },
    hazardous: { icon: "⚠️", name: "Plastic" }
  };

  // Function to render the progress bar
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${i + 1 <= currentStep
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-white">
          <span>Waste Type</span>
          <span>Details</span>
          <span>Schedule</span>
        </div>
      </div>
    );
  };

  // Function to render different form sections based on the current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Waste Type Information</h3>

            <div>
              <label htmlFor="binType" className="block text-sm font-medium text-gray-700 mb-1">
                Waste Type
              </label>
              <select
                id="binType"
                name="binType"
                value={formData.binType}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              >
                <option value="">Select Waste Type</option>
                {Object.entries(wasteTypes).map(([key, { icon, name }]) => (
                  <option key={key} value={key}>
                    {icon} {name} - {formatPrice(wastePrices[key])} per unit
                  </option>
                ))}
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Waste Details</h3>

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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                rows="4"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions (Optional)
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="Any special handling or access instructions"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                rows="4"
              ></textarea>
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
                className="w-full md:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            {/* Display price calculation */}
            {formData.binType && (
              <div className="p-4 bg-green-50 rounded-md border border-green-200">
                <h4 className="font-medium text-gray-800 mb-2">Price Calculation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price ({wasteTypes[formData.binType].name}):</span>
                    <span>{formatPrice(wastePrices[formData.binType])}/unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{formData.quantity} units</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-800 pt-2 border-t border-green-200">
                    <span>Subtotal:</span>
                    <span>{formatPrice(wastePrices[formData.binType] * parseInt(formData.quantity, 10))}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Note: Urgent collection (ASAP) adds 20% to the total price
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Collection Schedule</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Collection Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  disabled={formData.immediate}
                  required={!formData.immediate}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="immediate"
                  name="immediate"
                  checked={formData.immediate}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="immediate" className="ml-2 block text-sm text-gray-700">
                  Urgent Collection (ASAP) - 20% additional charge
                </label>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-6">
              <h4 className="font-medium text-gray-800 mb-2">Request Summary</h4>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="sm:col-span-1">
                  <dt className="text-gray-500">Waste Type:</dt>
                  <dd className="font-medium text-gray-900">
                    {formData.binType ? wasteTypes[formData.binType].name : "—"}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-gray-500">Quantity:</dt>
                  <dd className="font-medium text-gray-900">{formData.quantity} bags/bins</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-gray-500">Location:</dt>
                  <dd className="font-medium text-gray-900">{formData.location || "—"}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-gray-500">Contact:</dt>
                  <dd className="font-medium text-gray-900">{formData.contactNo || "—"}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-gray-500">Collection Date:</dt>
                  <dd className="font-medium text-gray-900">
                    {formData.immediate
                      ? "As soon as possible"
                      : formData.date
                        ? new Date(formData.date).toLocaleDateString()
                        : "Not specified"}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-gray-500">Total Price:</dt>
                  <dd className="font-medium text-green-600 text-lg">
                    {formatPrice(calculatedPrice)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-500 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Waste Collection Request</h1>
            <p className="mt-2 text-green-100">
              Schedule a pickup for your waste materials
            </p>
            {calculatedPrice > 0 && (
              <div className="mt-4 text-white bg-green-600 inline-block px-4 py-2 rounded-md">
                <span className="text-green-100">Estimated Cost:</span> <span className="font-bold">{formatPrice(calculatedPrice)}</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <p className="flex items-center font-medium">
                {submitError}
              </p>
            </div>
          )}

          {/* Form Content */}
          <div className="px-6 py-8">
            {renderProgressBar()}

            <form onSubmit={handleSubmit}>
              {renderFormStep()}

              {/* Navigation Buttons */}
              <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Back
                    </button>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={cancel}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Request Overview */}
        {currentStep > 1 && (
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6 bg-green-50">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Collection Request Overview</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Details of your waste collection request</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                {formData.binType && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Waste Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                      <span className="mr-2">{wasteTypes[formData.binType].icon}</span>
                      {wasteTypes[formData.binType].name} ({formatPrice(wastePrices[formData.binType])}/unit)
                    </dd>
                  </div>
                )}

                {formData.location && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Collection Location</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.location}</dd>
                  </div>
                )}

                {formData.contactNo && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.contactNo}</dd>
                  </div>
                )}

                {currentStep > 2 && formData.description && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.description}</dd>
                  </div>
                )}

                {currentStep > 2 && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Estimated Volume</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.quantity} bags/bins</dd>
                  </div>
                )}

                {formData.specialInstructions && currentStep > 2 && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Special Instructions</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.specialInstructions}</dd>
                  </div>
                )}

                {currentStep === 3 && (formData.date || formData.immediate) && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Collection Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formData.immediate
                        ? "As soon as possible (urgent)"
                        : new Date(formData.date).toLocaleDateString()}
                    </dd>
                  </div>
                )}

                {/* Display the price in the overview */}
                {calculatedPrice > 0 && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Total Price</dt>
                    <dd className="mt-1 text-lg font-bold text-green-600 sm:mt-0 sm:col-span-2">
                      {formatPrice(calculatedPrice)}
                      {formData.immediate && (
                        <span className="block text-xs text-gray-500 font-normal">
                          Includes 20% urgency fee
                        </span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectRequestForm;