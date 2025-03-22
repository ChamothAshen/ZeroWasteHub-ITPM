import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequestSmartBinForm = () => {
  const navigate = useNavigate();
  const [uId, setUId] = useState("");

  useEffect(() => {
    setUId('bb797925-dfae-4531-aadd-294a87fd73f2');
  }, []);

  const [formData, setFormData] = useState({
    userId: uId,
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",

    // Address Information
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",

    // Bin Request Details
    binType: "",
    binSize: "medium",
    quantity: "1",

    // Collection Schedule
    collectionFrequency: "weekly",
    preferredDayOfWeek: "",
    preferredTimeOfDay: "morning",
    date: "",
    immediate: false,

    // Additional Information
    accessCode: "", // For gated communities
    propertyType: "residential",
    description: "",
    specialInstructions: "",

    // Consent
    termsAccepted: false,

    // Payment Information (kept minimal as payment will be on next page)
    paymentMethod: "creditCard"
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "immediate" && checked) {
      setFormData((prevData) => ({ ...prevData, date: "" }));
    }
    if (name === "date" && value) {
      setFormData((prevData) => ({ ...prevData, immediate: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    try {
      const submissionData = {
        userId: uId,
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contactNo: formData.contactNo
        },
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          zipCode: formData.zipCode
        },
        binRequest: {
          binType: formData.binType,
          binSize: formData.binSize,
          quantity: formData.quantity
        },
        schedule: {
          scheduleDate: formData.immediate ? new Date().toISOString() : formData.date,
          collectionFrequency: formData.collectionFrequency,
          preferredDayOfWeek: formData.preferredDayOfWeek,
          preferredTimeOfDay: formData.preferredTimeOfDay
        },
        additionalInfo: {
          accessCode: formData.accessCode,
          propertyType: formData.propertyType,
          description: formData.description,
          specialInstructions: formData.specialInstructions
        },
        paymentMethod: formData.paymentMethod
      };

      console.log("Form Submitted:", submissionData);

      navigate("/CardPayment", { state: { requestData: submissionData } }); // Pass data to payment page
    } catch (error) {
      alert("Failed to submit collection request. Please try again.");
      console.error("Form submission error:", error);
    }
  };

  const cancel = () => {
    if (window.confirm("Are you sure you want to cancel? All entered information will be lost.")) {
      navigate("/client");
    }
  };

  // Icons for sections
  const sectionIcons = {
    personal: "👤",
    address: "🏠",
    bin: "♻️",
    schedule: "📅",
    additional: "ℹ️",
    payment: "💳"
  };

  // Bin type icons
  const binTypeIcons = {
    general: "🗑️",
    recycling: "♻️",
    compost: "🌱",
    paper: "📄",
    glass: "🥛",
    plastic: "🧴",
    metal: "🥫",
    electronics: "💻",
    hazardous: "⚠️",
    construction: "🏗️",
    medical: "🩺"
  };

  // Days of week icons
  const dayIcons = {
    monday: "1️⃣",
    tuesday: "2️⃣",
    wednesday: "3️⃣",
    thursday: "4️⃣",
    friday: "5️⃣",
    saturday: "6️⃣"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-green-200">
          <div className="px-6 py-8 border-b border-green-200 bg-gradient-to-r from-green-600 to-green-400 text-white">
            <h2 className="text-3xl font-bold flex items-center">
              <span className="text-4xl mr-2">🌎</span>
              Request Smart Waste Bin
            </h2>
            <p className="mt-2 opacity-90">Fill out the form below to request a smart waste collection bin for your location</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Personal Information Section */}
            <div className="border-b border-green-100 pb-4">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">{sectionIcons.personal}</span> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
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
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-1">✉️</span> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-1">📞</span> Contact Number
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
              </div>
            </div>

            {/* Address Section */}
            <div className="border-b border-green-100 pb-4">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">{sectionIcons.address}</span> Bin Delivery & Collection Location
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-1">📍</span> Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Street address, P.O. box, company name"
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
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
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <span className="mr-1">🏙️</span> City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
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
                      className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-1">🏢</span> Property Type
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                  >
                    <option value="residential">🏠 Residential</option>
                    <option value="commercial">🏬 Commercial</option>
                    <option value="industrial">🏭 Industrial</option>
                    <option value="institutional">🏛️ Institutional</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-1">🔑</span> Access Code (Optional)
                  </label>
                  <input
                    type="text"
                    id="accessCode"
                    name="accessCode"
                    value={formData.accessCode}
                    onChange={handleChange}
                    placeholder="Gate code, building access code, etc."
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                  />
                </div>
              </div>
            </div>

            {/* Bin Request Details Section */}
            <div className="border-b border-green-100 pb-4">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">{sectionIcons.bin}</span> Bin Request Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="binType" className="block text-sm font-medium text-gray-700 mb-1">
                    Waste Type
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
                    <option value="general">{binTypeIcons.general} General Waste</option>
                    <option value="recycling">{binTypeIcons.recycling} Recycling</option>
                    <option value="compost">{binTypeIcons.compost} Organic Waste</option>
                    <option value="paper">{binTypeIcons.paper} Paper/Cardboard</option>
                    <option value="glass">{binTypeIcons.glass} Glass</option>
                    <option value="plastic">{binTypeIcons.plastic} Plastic</option>
                    <option value="metal">{binTypeIcons.metal} Metal</option>
                    <option value="electronics">{binTypeIcons.electronics} Electronic Waste</option>
                    <option value="hazardous">{binTypeIcons.hazardous} Hazardous Waste</option>
                    <option value="construction">{binTypeIcons.construction} Construction/Demolition</option>
                    <option value="medical">{binTypeIcons.medical} Medical Waste</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="binSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Bin Size
                  </label>
                  <select
                    id="binSize"
                    name="binSize"
                    value={formData.binSize}
                    onChange={handleChange}
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                    required
                  >
                    <option value="small"> Small (120L)</option>
                    <option value="medium"> Medium (240L)</option>
                    <option value="large">Large (360L)</option>
                    <option value="xlarge">Extra Large (660L)</option>
                    <option value="commercial">Commercial (1100L)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-1">🔢</span> Quantity
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num.toString()}>
                        {num === 1 ? "" :
                          num === 2 ? "" :
                            num === 3 ? "" :
                              num === 4 ? "" : ""} {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-1">📝</span> Waste Description (Optional)
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of waste materials"
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                  />
                </div>
              </div>
            </div>

            {/* Collection Schedule Section */}
            <div className="border-b border-green-100 pb-4">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">{sectionIcons.schedule}</span> Collection Schedule
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-md border border-green-100">
                  <input
                    type="checkbox"
                    id="immediate"
                    name="immediate"
                    checked={formData.immediate}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                  />
                  <label htmlFor="immediate" className="ml-2 block text-sm text-gray-900 flex items-center">
                    <span className="mr-1">⚡</span> I need immediate service (within 24-48 hours)
                  </label>
                </div>

                {!formData.immediate && (
                  <>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <span className="mr-1">📆</span> Preferred Start Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                        min={new Date().toISOString().split('T')[0]}
                        required={!formData.immediate}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="collectionFrequency" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <span className="mr-1">🔄</span> Collection Frequency
                        </label>
                        <select
                          id="collectionFrequency"
                          name="collectionFrequency"
                          value={formData.collectionFrequency}
                          onChange={handleChange}
                          className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
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
                            className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                          >
                            <option value="">No preference</option>
                            <option value="monday"> Monday</option>
                            <option value="tuesday"> Tuesday</option>
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
                          className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                        >
                          <option value="morning">Morning (8AM - 12PM)</option>
                          <option value="afternoon">Afternoon (12PM - 5PM)</option>
                          <option value="anytime">Anytime</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Instructions */}
            <div className="border-b border-green-100 pb-4">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">{sectionIcons.additional}</span> Additional Information
              </h3>
              <div>
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <span className="mr-1">📋</span> Special Instructions (Optional)
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any special instructions for delivery or collection (e.g., place bin at side gate, call before delivery, etc.)"
                  className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
                />
              </div>
            </div>

            {/* Payment Method Preview */}
            <div className="border-b border-green-100 pb-4">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">{sectionIcons.payment}</span> Payment Method
              </h3>
              <div>
                <p className="text-sm text-gray-600 mb-2">Select your preferred payment method. Details will be collected on the next page.</p>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-green-50 rounded-md border border-green-100">
                    <input
                      id="creditCard"
                      name="paymentMethod"
                      type="radio"
                      value="creditCard"
                      checked={formData.paymentMethod === "creditCard"}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300"
                    />
                    <label htmlFor="creditCard" className="ml-2 block text-sm text-gray-900 flex items-center">
                      <span className="mr-1">💳</span> Credit/Debit Card
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pb-4">
              <div className="flex items-start p-3 bg-green-50 rounded-md border border-green-100">
                <div className="flex items-center h-5">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="termsAccepted" className="font-medium text-gray-700 flex items-center">
                    <span className="mr-1">📜</span> I agree to the terms and conditions
                  </label>
                  <p className="text-gray-500">
                    By checking this box, you agree to our{" "}
                    <a href="#" className="text-green-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-green-600 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-green-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                onClick={cancel}
              >
                <span className="mr-1">❌</span> Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-1"></span> Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestSmartBinForm;