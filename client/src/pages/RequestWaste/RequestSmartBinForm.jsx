import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Pricing configuration for different bin types and sizes
const binPricing = {
  general: {
    small: 2500,
    medium: 3500,
    large: 4500,
    xlarge: 6500
  },
  recycling: {
    small: 2000,
    medium: 3000,
    large: 4000,
    xlarge: 6000
  },
  compost: {
    small: 2000,
    medium: 3000,
    large: 4000,
    xlarge: 6000
  },
  paper: {
    small: 2000,
    medium: 3000,
    large: 4000,
    xlarge: 6000
  },
  plastic: {
    small: 2000,
    medium: 3000,
    large: 4000,
    xlarge: 6000
  }
};

// Component for requesting individual bins
const BinRequestForm = ({ handleBinRequestChange }) => {
  const [binData, setBinData] = useState({
    binType: "general",
    binSize: "medium",
    quantity: "1",
    description: "",
    price: binPricing.general.medium // Initialize with default price
  });

  // Update price when bin type or size changes
  useEffect(() => {
    const newPrice = binPricing[binData.binType][binData.binSize];
    setBinData(prev => ({
      ...prev,
      price: newPrice
    }));
  }, [binData.binType, binData.binSize]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBinData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBin = (e) => {
    e.preventDefault();
    // Validate quantity
    const qty = parseInt(binData.quantity);
    if (isNaN(qty) || qty < 1) {
      alert("Please enter a valid quantity");
      return;
    }
    
    // Calculate total price for this bin request
    const totalPrice = binData.price * qty;
    
    // Add bin with price to the request
    handleBinRequestChange([{
      ...binData,
      totalPrice
    }]);
    
    // Reset form for next entry
    setBinData({
      binType: "general",
      binSize: "medium",
      quantity: "1",
      description: "",
      price: binPricing.general.medium
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="binType" className="block text-sm font-medium text-gray-700 mb-1">
            Bin Type
          </label>
          <select
            id="binType"
            name="binType"
            value={binData.binType}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="general">General Waste</option>
            <option value="recycling">Glass</option>
            <option value="compost">Compost</option>
            <option value="paper">Paper</option>
            <option value="plastic">Plastic</option>
          </select>
        </div>
        <div>
          <label htmlFor="binSize" className="block text-sm font-medium text-gray-700 mb-1">
            Bin Size
          </label>
          <select
            id="binSize"
            name="binSize"
            value={binData.binSize}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="small">Small (120L) - Rs. {binPricing[binData.binType].small}</option>
            <option value="medium">Medium (240L) - Rs. {binPricing[binData.binType].medium}</option>
            <option value="large">Large (360L) - Rs. {binPricing[binData.binType].large}</option>
            <option value="xlarge">X-Large (660L) - Rs. {binPricing[binData.binType].xlarge}</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={binData.quantity}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Bin Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={binData.description}
            onChange={handleChange}
            placeholder="Additional details about this bin"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-gray-700">
          Price per bin: Rs. {binData.price} × {binData.quantity} = Rs. {binData.price * parseInt(binData.quantity || 0)}
        </div>
        <button
          type="button"
          onClick={handleAddBin}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Add Bin
        </button>
      </div>
    </div>
  );
};

// Main component
const RequestSmartBinForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
    binRequest: [],
    collectionFrequency: "weekly",
    preferredDayOfWeek: "",
    preferredTimeOfDay: "morning",
    date: "",
    immediate: false,
    accessCode: "",
    propertyType: "residential",
    specialInstructions: "",
    termsAccepted: false,
    paymentMethod: "creditCard",
  });

  // Calculate total price whenever bin requests change
  useEffect(() => {
    const newTotalPrice = formData.binRequest.reduce((sum, bin) => {
      return sum + (bin.totalPrice || 0);
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [formData.binRequest]);

  useEffect(() => {
    // Set a default user ID
    setFormData(prev => ({
      ...prev,
      userId: "bb797925-dfae-4531-aadd-294a87fd73f2"
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Handle immediate checkbox and date field interaction
    if (name === "immediate" && checked) {
      setFormData((prevData) => ({ ...prevData, date: "" }));
    }
    if (name === "date" && value) {
      setFormData((prevData) => ({ ...prevData, immediate: false }));
    }
  };

  const handleBinRequestChange = (newBinRequest) => {
    setFormData((prevState) => ({
      ...prevState,
      binRequest: [...prevState.binRequest, ...newBinRequest],
    }));
  };

  const removeBinRequest = (indexToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      binRequest: prevState.binRequest.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setSubmitError("");

    // Validate form
    if (!formData.termsAccepted) {
      setSubmitError("Please accept the terms and conditions to proceed.");
      return;
    }

    if (formData.binRequest.length === 0) {
      setSubmitError("Please add at least one bin to your request.");
      return;
    }

    try {
      // Set loading state
      setIsSubmitting(true);

      // Prepare submission data
      const submissionData = {
        userId: formData.userId,
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contactNo: formData.contactNo,
        },
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          zipCode: formData.zipCode,
          propertyType: formData.propertyType,
          accessCode: formData.accessCode,
        },
        binRequest: formData.binRequest,
        schedule: {
          scheduleDate: formData.immediate
            ? new Date().toISOString()
            : formData.date,
          collectionFrequency: formData.collectionFrequency,
          preferredDayOfWeek: formData.preferredDayOfWeek,
          preferredTimeOfDay: formData.preferredTimeOfDay,
          immediate: formData.immediate,
        },
        additionalInfo: {
          specialInstructions: formData.specialInstructions,
        },
        payment: {
          paymentMethod: formData.paymentMethod,
          currency: "LKR",
          totalAmount: totalPrice
        },
        termsAccepted: formData.termsAccepted,
      };

      console.log("Submitting form data:", submissionData);

      // Send data to API
      const response = await fetch("http://localhost:3000/api/BinRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      // Parse response
      const result = await response.json();

      // Check if request was successful
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit request");
      }

      console.log("Form submission successful:", result);

      // Navigate to payment page with request data and response data
      navigate("/CardPayment", {
        state: {
          requestData: submissionData,
          requestId: result.data.requestId,
          responseData: result.data,
          currency: "LKR",
          totalAmount: totalPrice
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error.message || "Failed to submit request. Please try again."
      );
    } finally {
      // Reset loading state
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const cancel = () => {
    if (window.confirm("Are you sure you want to cancel? All entered information will be lost.")) {
      navigate("/client");
    }
  };

  // Function to render the progress bar
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                i + 1 <= currentStep 
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
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Personal Info</span>
          <span>Address</span>
          <span>Bin Selection</span>
          <span>Collection</span>
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
            <h3 className="text-xl font-medium text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Delivery & Collection Location</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Street address, P.O. box, company name"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="institutional">Institutional</option>
                </select>
              </div>
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Access Code (Optional)
                </label>
                <input
                  type="text"
                  id="accessCode"
                  name="accessCode"
                  value={formData.accessCode}
                  onChange={handleChange}
                  placeholder="Gate code, building access code, etc."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Smart Bin Selection</h3>
            
            <BinRequestForm 
              handleBinRequestChange={handleBinRequestChange} 
            />
            
            {formData.binRequest.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Selected Bins</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bin Type
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.binRequest.map((bin, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {bin.binType.charAt(0).toUpperCase() + bin.binType.slice(1)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {bin.binSize.charAt(0).toUpperCase() + bin.binSize.slice(1)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {bin.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            Rs. {bin.totalPrice}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {bin.description || "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeBinRequest(index)}
                              className="text-red-600 hover:text-red-900 focus:outline-none"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100">
                        <td colSpan="3" className="px-4 py-3 text-right font-medium text-gray-700">
                          Total Price:
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          Rs. {totalPrice}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Collection Schedule & Finalize</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Collection Schedule</h4>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="immediate"
                  name="immediate"
                  checked={formData.immediate}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="immediate" className="ml-2 block text-sm text-gray-700">
                  I need immediate service (within 24-48 hours)
                </label>
              </div>

              {!formData.immediate && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Start Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      min={new Date().toISOString().split("T")[0]}
                      required={!formData.immediate}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="collectionFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Collection Frequency
                      </label>
                      <select
                        id="collectionFrequency"
                        name="collectionFrequency"
                        value={formData.collectionFrequency}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="onetime">One-time collection</option>
                      </select>
                    </div>

                    {formData.collectionFrequency !== "onetime" && (
                      <div>
                        <label htmlFor="preferredDayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Day
                        </label>
                        <select
                          id="preferredDayOfWeek"
                          name="preferredDayOfWeek"
                          value={formData.preferredDayOfWeek}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                          <option value="">No preference</option>
                          <option value="monday">Monday</option>
                          <option value="tuesday">Tuesday</option>
                          <option value="wednesday">Wednesday</option>
                          <option value="thursday">Thursday</option>
                          <option value="friday">Friday</option>
                          <option value="saturday">Saturday</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label htmlFor="preferredTimeOfDay" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time
                      </label>
                      <select
                        id="preferredTimeOfDay"
                        name="preferredTimeOfDay"
                        value={formData.preferredTimeOfDay}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      >
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 5PM)</option>
                        <option value="anytime">Anytime</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Special Instructions</h4>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows={3}
                placeholder="Any special instructions for delivery or collection"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Payment Method</h4>
              <p className="text-sm text-gray-600 mb-3">
                Select your preferred payment method. Details will be collected on the next page.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="creditCard"
                    name="paymentMethod"
                    type="radio"
                    value="creditCard"
                    checked={formData.paymentMethod === "creditCard"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="creditCard" className="ml-2 block text-sm text-gray-700">
                    Credit/Debit Card
                  </label>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Order Total:</span>
                  <span className="font-bold text-green-800 text-lg">Rs. {totalPrice}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center h-5">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                  I agree to the terms and conditions
                </label>
                <p className="text-gray-500">
                  By checking this box, you agree to our{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    Privacy Policy
                  </a>.
                </p>
              </div>
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
            <h1 className="text-3xl font-bold">Smart Waste Bin Request</h1>
            <p className="mt-2 text-green-100">
              Complete this form to request smart waste collection services
            </p>
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
                        "Proceed to Payment"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Request Summary Card */}
        {formData.binRequest.length > 0 && currentStep > 1 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-100">
              <h2 className="text-lg font-medium text-green-800">Request Summary</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{formData.email}</p>
                  <p className="mt-1 text-sm text-gray-500">{formData.contactNo}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 text-sm text-gray-900">{formData.addressLine1}</p>
                  {formData.addressLine2 && (
                    <p className="text-sm text-gray-900">{formData.addressLine2}</p>
                  )}
                  <p className="text-sm text-gray-900">
                    {formData.city}, {formData.zipCode}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 capitalize">
                    {formData.propertyType} property
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Bins Requested</h3>
                <div className="mt-1 text-sm text-gray-600">
                  {formData.binRequest.map((bin, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2">
                      {bin.quantity}× {bin.binType} ({bin.binSize})
                    </span>
                  ))}
                </div>
              </div>
              
              {(formData.date || formData.immediate) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {formData.immediate 
                      ? "Immediate service (24-48 hours)" 
                      : `Starting: ${new Date(formData.date).toLocaleDateString()}`
                    }
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {formData.collectionFrequency} collection
                    {formData.preferredDayOfWeek && ` on ${formData.preferredDayOfWeek}s`}
                    {formData.preferredTimeOfDay && `, ${formData.preferredTimeOfDay} time slot`}
                  </p>
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                  <p className="text-sm font-semibold text-gray-900">Rs. {totalPrice}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestSmartBinForm;