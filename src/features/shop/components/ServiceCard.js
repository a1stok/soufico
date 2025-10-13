import React from 'react';

const ServiceCard = ({ service, onAddToBasket }) => {

  return (
    <div className="service-card">
      <div className="service-top-section">
        <figure className="service-image-container">
          <img src={service.image} alt={service.name} className="service-image" />
        </figure>
        <div className="service-info">
          <h3 className="service-name heading-3">{service.name}</h3>
          <p className="service-description body-text">{service.description}</p>
        </div>
      </div>
      <div className="price-section">
        <span className="price">${service.price.toFixed(2)}</span>
        <button 
          onClick={() => onAddToBasket(service)}
          className="btn btn-primary add-to-basket-btn"
        >
          Add to Basket
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
