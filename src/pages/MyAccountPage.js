import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { API_BASE_URL } from "../core/constants/api";
import "../styles/pages/MyAccountPage.css";

const MyAccountPage = () => {
  const location = useLocation();
  const uid = location.state?.uid || localStorage.getItem("uid");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [photoURL, setPhotoURL] = useState(localStorage.getItem("photoURL") || "");
  const [basket, setBasket] = useState([]);
  const [purchases, setPurchases] = useState([]); 
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const fetchUserData = useCallback(async () => {
    if (!uid) {
      console.error("User ID is missing.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}`);
      if (response.status === 404) {
        // User doesn't exist yet
        // User not found in database yet - this is normal for new users
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }
      const userData = await response.json();
      setName(userData.name || "");
      setPhotoURL(userData.photoURL || "");
      setBasket(userData.basket || []);
      setPurchases(userData.purchases || []); 

      localStorage.setItem("uid", uid);
      localStorage.setItem("name", userData.name || "");
      localStorage.setItem("photoURL", userData.photoURL || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [uid]);

  useEffect(() => {
    fetchUserData();
  }, [uid, fetchUserData]);

  const handleNameChange = (e) => setName(e.target.value);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setPhotoURL(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveUserInfo = async () => {
    if (!uid) {
      alert("User not logged in. Please log in first.");
      return;
    }

    // Validate required fields
    if (!name.trim()) {
      alert("Please enter a name.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/save`, {
        method: "POST",
        body: JSON.stringify({ uid, name, photoURL }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        alert("User information updated successfully!");
        localStorage.setItem("name", name);
        localStorage.setItem("photoURL", photoURL);
      } else {
        const errorResponse = await response.json();
        console.error("Save error:", errorResponse);
        alert(`Failed to update user information: ${errorResponse.error}`);
      }
    } catch (error) {
      console.error("Error saving user info:", error);
      alert("Failed to save user info. Please check your connection and try again.");
    }
  };

  const basketTotal = basket.reduce((total, item) => total + item.price * item.quantity, 0);
  const purchasesTotal = purchases.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (basket.length === 0) {
      alert("Your basket is empty!");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/payment/create-payment-intent`, {
        method: "POST",
        body: JSON.stringify({ basket }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to create payment intent.");
      }
  
      const { clientSecret } = await response.json();
  
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (error) {
        console.error("Payment failed:", error);
        setPaymentError(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        setPaymentError(null);
  
        const transactionId = paymentIntent.id; 
        const purchaseResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/users/complete-purchase`, {
          method: "POST",
          body: JSON.stringify({ uid, basket, transactionId }), 
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (purchaseResponse.ok) {
          const { purchases } = await purchaseResponse.json();
          // Clear basket and update purchases
          setBasket([]);
          setPurchases(purchases);
          alert("Purchase completed successfully!");
          // Refresh user data to ensure everything is up to date
          await fetchUserData();
        } else {
          console.error("Failed to complete purchase.");
          setPaymentError("Payment succeeded but failed to update your account. Please contact support.");
        }
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setPaymentError("An error occurred while processing your payment. Please try again.");
    }
  };
  

  return (
    <div className="my-account-page">
      <div className="glass-container">
        <h2>My Account</h2>
        <div className="profile-picture">
          <label htmlFor="photo-upload">
            <div className="photo-circle">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="profile-image" />
              ) : (
                <span className="photo-placeholder">Upload</span>
              )}
            </div>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="photo-input"
          />
        </div>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
          className="styled-input"
        />
        <button onClick={saveUserInfo} className="save-info-button">
          Save Info
        </button>
      </div>

      <div className="glass-container basket-summary">
        <h2>Your Basket</h2>
        {basket.length > 0 ? (
          <div className="basket-items">
            {basket.map((item, index) => (
              <div key={`basket-${item.id}-${index}`} className="basket-item">
                <div className="basket-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="basket-item-details">
                  <div className="basket-item-name">{item.name}</div>
                  <div className="basket-item-controls">
                    <div className="quantity-section">
                      <span className="quantity">Qty: {item.quantity}</span>
                    </div>
                    <div className="basket-item-price">
                      <div className="item-unit-price">${item.price.toFixed(2)} each</div>
                      <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="basket-empty">Your basket is empty.</div>
        )}
        <h3 className="basket-total" style={{ 
          userSelect: 'none', 
          pointerEvents: 'none', 
          cursor: 'default',
          color: '#333',
          fontWeight: 'bold'
        }}>
          Total: ${basketTotal.toFixed(2)}
        </h3>
        <div className="card-input-section">
  <div className="card-input-container">
    <CardElement />
  </div>
  <button className="button-81 purchase-button" onClick={handlePayment}>
    Purchase
  </button>
  {paymentError && <p className="error-message">{paymentError}</p>}
  {paymentSuccess && <p className="success-message">Payment Successful!</p>}
</div>
      </div>

      <div className="glass-container purchases-summary scrollable">
  <h2>Your Purchases</h2>
  {purchases.length > 0 ? (
    <div className="basket-items">
      {purchases.map((item, index) => (
        <div key={`purchase-${item.id}-${index}`} className="basket-item">
          <div className="basket-item-image">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="basket-item-details">
            <div className="basket-item-name">{item.name}</div>
            <div className="basket-item-controls">
              <div className="quantity-section">
                <span className="quantity">Qty: {item.quantity}</span>
                <div className="purchase-info">
                  <div className="purchase-date">Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</div>
                  <div className="transaction-id">Transaction: {item.transactionId || "N/A"}</div>
                </div>
              </div>
              <div className="basket-item-price">
                <div className="item-unit-price">${item.price.toFixed(2)} each</div>
                <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="basket-empty">You have no purchases yet.</div>
  )}
  <h3 className="basket-total" style={{ 
    userSelect: 'none', 
    pointerEvents: 'none', 
    cursor: 'default',
    color: '#333',
    fontWeight: 'bold'
  }}>
    Total: ${purchasesTotal.toFixed(2)}
  </h3>
</div>

    </div>
  );
};

export default MyAccountPage;