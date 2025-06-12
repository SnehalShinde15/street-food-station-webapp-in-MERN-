import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import './Verify.css'

const Verify = () => {
  const { url } = useContext(StoreContext)
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      if (!orderId) {
        setError("Order ID is missing");
        setVerifying(false);
        return;
      }

      const response = await axios.post(url + "/api/order/verify", { success, orderId });
      
      if (response.data.success) {
        toast.success("Payment verified successfully!");
        navigate("/myorders");
      } else {
        setError(response.data.message || "Payment verification failed");
        setVerifying(false);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.response?.data?.message || "Failed to verify payment");
      setVerifying(false);
    }
  }

  useEffect(() => {
    verifyPayment();
  }, [])

  return (
    <div className='verify'>
      {verifying ? (
        <div className="spinner"></div>
      ) : (
        <div className="verification-result">
          <h2>Payment Verification</h2>
          {error ? (
            <>
              <p className="error-message">{error}</p>
              <button onClick={() => navigate("/cart")}>Return to Cart</button>
            </>
          ) : (
            <p>Redirecting to your orders...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Verify
