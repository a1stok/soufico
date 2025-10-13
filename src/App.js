import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShopPage from "./features/shop/pages/ShopPage";
import SubscriptionsPage from "./features/playlists/pages/SubscriptionsPage";
import SpotifyCallback from "./pages/SpotifyCallback";
import MyAccountPage from "./pages/MyAccountPage";
import MovieDetailsPage from "./features/movies/pages/MovieDetailsPage";
import MyCollectionPage from "./pages/MyCollectionPage"; 
import CheckoutForm from "./components/CheckoutForm";
import "./styles/App.css";

// Initialize Stripe with environment variable
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 
  "pk_test_placeholder_key_please_set_in_environment"
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/my-account" element={
          <Elements stripe={stripePromise}>
            <MyAccountPage />
          </Elements>
        } />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/my-playlist" element={<MyCollectionPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/checkout" element={<CheckoutForm />} />
      </Routes>
    </Router>
  );
}

export default App;