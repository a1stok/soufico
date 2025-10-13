import React from 'react';
import ServiceCard from '../components/ServiceCard';
import BasketSummary from '../components/BasketSummary';
import { useShop } from '../hooks/useShop';
import '../../../styles/features/shop/ShopPage.css';

import letterboxImg from '../../../images/letterbox.png';
import sponsormeImg from '../../../images/sponsorme.jpg';
import mymediaImg from '../../../images/mymedia.png';

const services = [
  {
    id: 1,
    name: "Letterboxd One-Liner Review",
    description: "Get a concise review of any film you choose. Perfect for quick insights and recommendations.",
    price: 0.99,
    image: letterboxImg,
  },
  {
    id: 2,
    name: "Film Playlist",
    description: "Create a custom playlist with unlimited credits. Monthly subscription available for continuous access.",
    price: 2.99,
    image: mymediaImg,
  },
  {
    id: 3,
    name: "Support Me",
    description: "Support my work and help me create more amazing content. Every contribution makes a difference.",
    price: 3.33,
    image: sponsormeImg,
  },
];

const ShopPage = () => {
  const {
    basket,
    isLoading,
    basketTotal,
    basketItemCount,
    handleAddToBasket,
    handleRemoveFromBasket,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleOrder,
    handleClearBasket
  } = useShop();

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="heading-1">Our Services</h1>
        <p className="subtitle">Choose from our premium services to enhance your experience</p>
      </div>
      
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onAddToBasket={handleAddToBasket}
          />
        ))}
      </div>
      
      <BasketSummary
        basket={basket}
        basketTotal={basketTotal}
        basketItemCount={basketItemCount}
        onOrder={handleOrder}
        onClearBasket={handleClearBasket}
        onRemoveItem={handleRemoveFromBasket}
        onDecreaseQuantity={handleDecreaseQuantity}
        onIncreaseQuantity={handleIncreaseQuantity}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ShopPage;
