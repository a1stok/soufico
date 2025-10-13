# Soufico

Soufico is a modern web application that generates Spotify playlists based on movies, with integrated shopping functionality and user account management. Create personalized music experiences inspired by your favorite films while enjoying a seamless e-commerce platform.

## Presentation

![Soufico Demo](public/Soufico.gif)

## Installation

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Spotify Developer Account
- TMDb Account
- Firebase Project
- Stripe Account

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/soufico.git
cd soufico
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (this project is for personal use, replace placeholders with your project credentials):
```env
# Database
MONGO_URI=mongodb://localhost:27017/soufico

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Firebase
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# Spotify
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id

# TMDb
REACT_APP_TMDB_ACCESS_TOKEN=your_tmdb_v4_access_token

# API
REACT_APP_API_URL=http://localhost:3001
```

4. Start the backend server:
```bash
npm run start-backend
```

### Frontend Setup

1. In a new terminal, start the React development server:
```bash
npm run start-frontend
```

2. Or run both simultaneously:
```bash
npm run dev
```

## Usage

1. Visit `http://localhost:3000`
2. Sign in (Firebase)
3. Search a movie and connect Spotify to generate a playlist
4. Optionally use Shop and My Account pages

## Features

- Movie-based Spotify playlist generation
- Spotify OAuth integration
- Firebase authentication
- Shop and account pages

## Technology Stack

- **Frontend**: React.js 18, React Router DOM, CSS3
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Firebase Auth
- **API Integrations**: Spotify Web API, TMDb API, Stripe API
- **Deployment**: Render, MongoDB Atlas

## Contributing

This project does not accept external contributions at this time and is intended for personal use. Feel free to fork the repository for your own learning or private projects. Replace all placeholders in the `.env` with your own project credentials (Firebase, Stripe, Spotify, TMDb) before running locally or deploying.

## License

This project is licensed under the MIT License.
