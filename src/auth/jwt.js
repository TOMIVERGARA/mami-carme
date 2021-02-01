const { verify } = require('crypto');
const jwt = require('jsonwebtoken');

module.exports.createJwt = async data => {
  try {
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return token;
  } catch (error) {
    throw error;
  }
}

module.exports.validateJwt = async token => {
  try {
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    return verification;
  } catch (error) {
    return false;
  }
}