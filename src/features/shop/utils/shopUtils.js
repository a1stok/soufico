// Shop utility functions for reusable basket operations

export const createBasketItem = (service) => {
  return {
    ...service,
    quantity: 1
  };
};

export const addToBasket = (basket, service) => {
  const existingItem = basket.find(item => item.id === service.id);
  
  if (existingItem) {
    return basket.map(item =>
      item.id === service.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  
  const newItem = createBasketItem(service);
  return [...basket, newItem];
};

export const removeFromBasket = (basket, itemId) => {
  return basket.filter(item => item.id !== itemId);
};

export const updateQuantity = (basket, itemId, newQuantity) => {
  // Validate quantity is a positive integer
  const validQuantity = Math.max(1, Math.floor(newQuantity));
  
  if (validQuantity <= 0) {
    return removeFromBasket(basket, itemId);
  }
  
  return basket.map(item =>
    item.id === itemId
      ? { ...item, quantity: validQuantity }
      : item
  );
};

export const decreaseQuantity = (basket, itemId) => {
  const item = basket.find(item => item.id === itemId);
  if (!item) return basket;
  
  return updateQuantity(basket, itemId, item.quantity - 1);
};

export const increaseQuantity = (basket, itemId) => {
  const item = basket.find(item => item.id === itemId);
  if (!item) return basket;
  
  return updateQuantity(basket, itemId, item.quantity + 1);
};

export const calculateBasketTotal = (basket) => {
  if (!Array.isArray(basket)) return 0;
  
  return basket.reduce((total, item) => {
    // Ensure price and quantity are valid numbers
    const price = typeof item.price === 'number' && item.price >= 0 ? item.price : 0;
    const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
    
    const itemTotal = price * quantity;
    return total + itemTotal;
  }, 0);
};

export const getBasketItemCount = (basket) => {
  return basket.reduce((count, item) => count + (item.quantity || 1), 0);
};

export const clearBasket = () => {
  return [];
};

export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};
