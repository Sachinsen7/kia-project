const jwt = require("jsonwebtoken");

const authMiddleware = (erq, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {
        return res.status(401).json({success: false, message: "Invalid or  expored token"});
      }

      req.user = decoded;
      next();
    })
  }
  catch(err) {
    res.status(500).json({success: false, message: "Auth middleware error", error: err.message});
  }
}