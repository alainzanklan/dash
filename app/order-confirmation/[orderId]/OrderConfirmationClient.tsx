'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

// Clears the cart once the confirmation page mounts — after redirect has completed
const OrderConfirmationClient = () => {
  const { handleClearCart } = useCart();

  useEffect(() => {
    handleClearCart();
  }, []);

  return null;
};

export default OrderConfirmationClient;
