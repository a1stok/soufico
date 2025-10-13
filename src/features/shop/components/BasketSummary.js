import React from 'react';

const BasketSummary = ({ 
  basket, 
  basketTotal, 
  basketItemCount,
  onOrder, 
  onClearBasket, 
  onRemoveItem,
  onDecreaseQuantity,
  onIncreaseQuantity,
  isLoading 
}) => {
  return (
    <div className="basket-summary">
      <h3 className="heading-3">Your Basket ({basketItemCount} items)</h3>
      
      {basket.length === 0 ? (
        <div className="basket-empty">
          <p className="body-text">Your basket is empty.</p>
        </div>
      ) : (
        <>
          <div className="basket-items">
            {basket.map((item) => (
              <div key={item.id} className="basket-item card">
                <div className="basket-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="basket-item-details">
                  <h4 className="basket-item-name">{item.name}</h4>
                  <div className="basket-item-controls">
                    <div className="quantity-section">
                      <div className="quantity-controls">
                        <span 
                          className="quantity-decrease"
                          onClick={() => onDecreaseQuantity(item.id)}
                        >
                          -
                        </span>
                        <span className="quantity">{item.quantity}</span>
                        <span 
                          className="quantity-increase"
                          onClick={() => onIncreaseQuantity(item.id)}
                        >
                          +
                        </span>
                      </div>
                      {item.quantity > 1 && (
                        <div className="item-unit-price">${item.price.toFixed(2)} each</div>
                      )}
                    </div>
                    <span 
                      className="remove-text"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Remove
                    </span>
                  </div>
                </div>
                <div className="basket-item-price">
                  <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="basket-total">
            <strong>Total: ${basketTotal.toFixed(2)}</strong>
          </div>
          
          <div className="basket-actions">
            <button 
              onClick={onOrder} 
              disabled={isLoading} 
              className="btn btn-primary order-btn"
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
            <button 
              onClick={onClearBasket} 
              className="btn btn-secondary clear-btn"
            >
              Clear Basket
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BasketSummary;
