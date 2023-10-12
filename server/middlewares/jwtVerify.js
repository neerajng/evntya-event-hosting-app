const jwt = require('jsonwebtoken');

const jwtVerify = (req, res, next) => {    
    // Get the token from the request headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1].replace(/"/g, ''); 
    // Verify the token
    if (!token) {
        return res.status(401).json({ message: 'Please do login.' });
    }
    try {
      // console.log("jwtverfied");
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
  }
};

module.exports = jwtVerify;
