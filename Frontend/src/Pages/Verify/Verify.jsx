import React, { useEffect, useContext } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderDbId');
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleVerification = async () => {
      if (success === 'true') {
        // ✅ Payment successful
        setTimeout(() => {
          alert('✅ Payment successful! Redirecting to My Orders...');
          navigate('/myorders');
        }, 1500);
      } else {
        // ❌ Payment failed → delete order
        try {
          await axios.post(
            `${url}/api/order/delete`,
            { orderDbId: orderId },
            { headers: { token } }
          );
        } catch (err) {
          console.error('Failed to delete order:', err);
        }
        alert('❌ Payment failed. Redirecting to Home.');
        navigate('/');
      }
    };

    handleVerification();
  }, [success, orderId, navigate, url, token]);

  return (
    <div className='verify'>
      <div className='spinner'></div>
      <p>Verifying your payment...</p>
    </div>
  );
};

export default Verify;
