// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateMovieTitle = (title) => {
  return title && title.trim().length > 0;
};

export const validateRating = (rating) => {
  const num = parseFloat(rating);
  return num >= 1 && num <= 10;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return num > 0;
};
