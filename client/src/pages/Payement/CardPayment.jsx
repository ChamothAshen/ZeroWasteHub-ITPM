import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const CardPayment = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const location = useLocation();
  
  // Get data sent from the BinRequestForm
  const requestData = location.state?.requestData;
  const responseData = location.state?.responseData;
  const binRequestId = location.state?.requestId || requestId;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const userId = localStorage.getItem('userId') || (requestData?.userId || 'bb797925-dfae-4531-aadd-294a87fd73f2');

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
    country: 'Sri Lanka',
  });

  const [amount, setAmount] = useState(0);
  const [paymentSummary, setPaymentSummary] = useState([]);

  // Fetch request details if navigated directly to this page
  useEffect(() => {
    const fetchRequestData = async () => {
      if (!requestData && binRequestId) {
        try {
          const response = await fetch(`http://localhost:3000/api/BinRequest/${binRequestId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch request details');
          }
          
          const data = await response.json();
          setPaymentDetails(data.data);
          
          // Calculate total amount from the fetched bin requests
          if (data.data && data.data.binRequest) {
            const total = data.data.binRequest.reduce((sum, bin) => {
              return sum + (bin.totalPrice || 0);
            }, 0);
            
            setAmount(total);
            
            // Create summary items
            const summaryItems = data.data.binRequest.map(bin => ({
              description: `${bin.quantity}× ${bin.binType} (${bin.binSize})`,
              amount: bin.totalPrice
            }));
            
            setPaymentSummary(summaryItems);
          }
        } catch (error) {
          console.error('Error fetching request details:', error);
          setError('Could not load request details. Please try again.');
        }
      }
      setPageLoading(false);
    };

    // If we have data from navigation state, use it
    if (location.state && location.state.totalAmount) {
      setAmount(location.state.totalAmount);
      
      // Create summary items from bin requests
      if (requestData && requestData.binRequest) {
        const summaryItems = requestData.binRequest.map(bin => ({
          description: `${bin.quantity}× ${bin.binType} (${bin.binSize})`,
          amount: bin.totalPrice
        }));
        
        setPaymentSummary(summaryItems);
      }
      
      setPageLoading(false);
    } else {
      fetchRequestData();
    }
    
    // Pre-fill billing info if available from request data
    if (requestData && requestData.address) {
      setBillingInfo({
        street: requestData.address.addressLine1 || '',
        city: requestData.address.city || '',
        state: '', // Usually not in the request form
        postalCode: requestData.address.zipCode || '',
        country: 'Sri Lanka'
      });
    }
  }, [binRequestId, location.state, requestData]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, ' $1').trim();
      setCardInfo((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
      setCardInfo((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setCardInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const paymentData = {
        userId,
        requestId: binRequestId,
        cardNumber: cardInfo.cardNumber.replace(/\s/g, ''),
        cardHolder: cardInfo.cardHolder,
        expiryDate: cardInfo.expiryDate,
        cvv: cardInfo.cvv,
        amount,
        currency: location.state?.currency || 'LKR',
        billingAddress: {
          street: billingInfo.street,
          city: billingInfo.city,
          state: billingInfo.state,
          postalCode: billingInfo.postalCode,
          country: billingInfo.country
        }
      };

      const response = await fetch('http://localhost:3000/api/card-payment/processCardPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        // Update bin request status to paid
        if (binRequestId) {
          await fetch(`http://localhost:3000/api/BinRequest/${binRequestId}/update-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'paid', paymentId: result.data.transactionId }),
          });
        }

        // Try to download receipt if available
        if (result.receiptUrl) {
          try {
            const receiptResponse = await fetch(result.receiptUrl);
            
            if (receiptResponse.ok) {
              const blob = await receiptResponse.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${result.data.transactionId}_receipt.pdf`;
              document.body.appendChild(link);
              link.click();
              link.remove();
            }
          } catch (error) {
            console.error('Receipt download error:', error);
            // Continue with success flow even if receipt download fails
          }
        }

        // Navigate to receipt/success page
        navigate(`/payments/receipt/${result.data.transactionId}`, {
          state: {
            transactionData: result.data,
            requestData: requestData || paymentDetails,
            amount
          }
        });
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

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-green-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border-t-4 border-green-600">
        <div className="flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-bold text-green-800">Complete Your Payment</h3>
        </div>

        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800 mb-2">Payment Summary</h4>
          
          {paymentSummary.length > 0 ? (
            <>
              {paymentSummary.map((item, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.description}</span>
                  <span className="font-medium">Rs. {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Smart Waste Collection Services</span>
              <span className="font-medium">Rs. {amount.toLocaleString()}</span>
            </div>
          )}
          
          <div className="border-t border-green-200 my-2"></div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>Rs. {amount.toLocaleString()}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h4 className="text-sm font-semibold text-green-800 mb-3">Card Information</h4>

          <InputField
            id="cardNumber"
            name="cardNumber"
            label="Card Number"
            value={cardInfo.cardNumber}
            onChange={handleCardChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />

          <InputField
            id="cardHolder"
            name="cardHolder"
            label="Card Holder"
            value={cardInfo.cardHolder}
            onChange={handleCardChange}
            placeholder="John Doe"
            required
          />

          <div className="flex mb-6 space-x-4">
            <InputField
              id="expiryDate"
              name="expiryDate"
              label="Expiry Date"
              value={cardInfo.expiryDate}
              onChange={handleCardChange}
              placeholder="MM/YY"
              maxLength={5}
              required
              half
            />
            <InputField
              id="cvv"
              name="cvv"
              label="CVV"
              value={cardInfo.cvv}
              onChange={handleCardChange}
              placeholder="123"
              type="password"
              maxLength={4}
              required
              half
            />
          </div>

          <h4 className="text-sm font-semibold text-green-800 mb-3">Billing Address</h4>

          <InputField
            id="street"
            name="street"
            label="Street Address"
            value={billingInfo.street}
            onChange={handleBillingChange}
            placeholder="123 Main St"
            required
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              id="city"
              name="city"
              label="City"
              value={billingInfo.city}
              onChange={handleBillingChange}
              placeholder="Colombo"
              required
            />
            <InputField
              id="state"
              name="state"
              label="Province/State"
              value={billingInfo.state}
              onChange={handleBillingChange}
              placeholder="Western"
              required
            />
          </div>

          <InputField
            id="postalCode"
            name="postalCode"
            label="Postal Code"
            value={billingInfo.postalCode}
            onChange={handleBillingChange}
            placeholder="10001"
            required
          />

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
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Pay Rs. {amount.toLocaleString()} Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ id, name, label, value, onChange, placeholder, type = 'text', maxLength, required, half }) => (
  <div className={`${half ? 'w-1/2' : 'mb-4'}`}>
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      maxLength={maxLength}
      required={required}
    />
  </div>
);

export default CardPayment;