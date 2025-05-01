import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CardPayment = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // In a real app, you'd get the userId from your authentication context
  const userId = localStorage.getItem('userId') || 'bb797925-dfae-4531-aadd-294a87fd73f2';

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [billingInfo, setBillingInfo] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  // Amount would typically come from the request details
  const [amount, setAmount] = useState(49.99);

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setCardInfo(prevState => ({
        ...prevState,
        [name]: formattedValue
      }));
    }
    // Format expiry date with slash
    else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;

      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }

      setCardInfo(prevState => ({
        ...prevState,
        [name]: formatted
      }));
    }
    // Other fields
    else {
      setCardInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Prepare the data to send to the backend
      const paymentData = {
        userId,
        requestId: requestId || 'demo-request-id', // In a real app, this would come from the URL or context
        cardNumber: cardInfo.cardNumber.replace(/\s/g, ''), // Remove spaces
        cardHolder: cardInfo.cardHolder,
        expiryDate: cardInfo.expiryDate,
        cvv: cardInfo.cvv,
        amount,
        currency: 'USD',
        billingAddress: billingInfo
      };

      // Send data to the backend
      const response = await fetch('http://localhost:3000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        alert('Payment processed successfully!');

        // Navigate to receipt page
        navigate(`/payments/receipt/${result.data.transactionId}`);
      } else {
        setError(result.message || 'Failed to process payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-green-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border-t-4 border-green-600">
        <div className="flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-xl font-bold text-green-800">Card Payment</h3>
        </div>

        {/* Payment Summary */}
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800 mb-2">Payment Summary</h4>
          <div className="flex justify-between">
            <span className="text-gray-600">Collection Service:</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
          <div className="border-t border-green-200 my-2"></div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h4 className="text-sm font-semibold text-green-800 mb-3">Card Information</h4>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="flex items-center mb-2 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7z"></path>
              </svg>
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardInfo.cardNumber}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              maxLength="19"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cardHolder" className="flex items-center mb-2 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
              Card Holder
            </label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={cardInfo.cardHolder}
              onChange={handleCardChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex mb-6 space-x-4">
            <div className="w-1/2">
              <label htmlFor="expiryDate" className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                </svg>
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={cardInfo.expiryDate}
                onChange={handleCardChange}
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                maxLength="5"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="cvv" className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                </svg>
                CVV
              </label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                value={cardInfo.cvv}
                onChange={handleCardChange}
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                maxLength="4"
                required
              />
            </div>
          </div>

          <h4 className="text-sm font-semibold text-green-800 mb-3">Billing Address</h4>

          <div className="mb-4">
            <label htmlFor="street" className="block mb-2 text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={billingInfo.street}
              onChange={handleBillingChange}
              placeholder="123 Main St"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={billingInfo.city}
                onChange={handleBillingChange}
                placeholder="New York"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={billingInfo.state}
                onChange={handleBillingChange}
                placeholder="NY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="postalCode" className="block mb-2 text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={billingInfo.postalCode}
                onChange={handleBillingChange}
                placeholder="10001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                </svg>
                Pay ${amount.toFixed(2)} Now
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex justify-center space-x-4">
          <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2v2H8V2H6v2H5c-1.11 0-1.99.89-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.11-.9-2-2-2h-1V2h-2zm3 17H5V9h14v10z"></path>
          </svg>
          <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"></path>
          </svg>
          <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"></path>
          </svg>
        </div>

        <div className="mt-4 text-xs text-center text-gray-500">
          Your payment information is securely processed. We never store your full credit card details.
        </div>
      </div>
    </div>
  );
};

export default CardPayment;