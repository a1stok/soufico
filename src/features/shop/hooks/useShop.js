import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../core/constants/api';
import { 
  addToBasket, 
  removeFromBasket, 
  decreaseQuantity, 
  increaseQuantity, 
  calculateBasketTotal, 
  getBasketItemCount, 
  clearBasket 
} from '../utils/shopUtils';

export const useShop = () => {
  const navigate = useNavigate();
  const [basket, setBasket] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const basketTotal = calculateBasketTotal(basket);
  const basketItemCount = getBasketItemCount(basket);

  const handleAddToBasket = useCallback((service) => {
    setBasket(prevBasket => addToBasket(prevBasket, service));
  }, []);

  const handleRemoveFromBasket = useCallback((itemId) => {
    setBasket(prevBasket => removeFromBasket(prevBasket, itemId));
  }, []);

  const handleDecreaseQuantity = useCallback((itemId) => {
    setBasket(prevBasket => decreaseQuantity(prevBasket, itemId));
  }, []);

  const handleIncreaseQuantity = useCallback((itemId) => {
    setBasket(prevBasket => increaseQuantity(prevBasket, itemId));
  }, []);

  const handleClearBasket = useCallback(() => {
    setBasket(clearBasket());
  }, []);

  const handleOrder = useCallback(async () => {
    if (basket.length === 0) {
      alert('Your basket is empty!');
      return;
    }

    setIsLoading(true);
    try {
      // Get user ID
      const uid = localStorage.getItem('uid');
      if (!uid) {
        alert('Please log in to place an order.');
        setIsLoading(false);
        return;
      }

      // Save basket
      const response = await fetch(`${API_BASE_URL}/users/save-basket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, basket }),
      });

      if (response.ok) {
        // Clear basket
        setBasket([]);
        // Redirect to account
        navigate('/my-account');
        alert('Items added to your basket! You can now complete your purchase.');
      } else {
        const errorData = await response.json();
        alert(`Failed to save basket: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving basket:', error);
      alert('Failed to save basket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [basket, navigate]);

  return {
    basket,
    isLoading,
    basketTotal,
    basketItemCount,
    handleAddToBasket,
    handleRemoveFromBasket,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleOrder,
    handleClearBasket,
  };
};
