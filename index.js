// index.js
const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePhoneNumber = (phoneNumber) => {
  return validator.isMobilePhone(phoneNumber);
};

module.exports = {
  validateEmail,
  validatePhoneNumber
};
