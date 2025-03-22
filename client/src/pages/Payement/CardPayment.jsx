import React, { useState } from 'react';

const CardPayment = ({ onSubmit }) => {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cardInfo);
  };

  return (
    <div className=' flex justify-center items-center h-full w-full'>
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto ">
      <h3 className="text-xl font-bold mb-4">Card Payment</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block mb-2">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={cardInfo.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cardHolder" className="block mb-2">Card Holder</label>
          <input
            type="text"
            id="cardHolder"
            name="cardHolder"
            value={cardInfo.cardHolder}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="expiryDate" className="block mb-2">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={cardInfo.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="cvv" className="block mb-2">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={cardInfo.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Pay Now
        </button>
      </form>
    </div>
    </div>
  );
};

export default CardPayment;