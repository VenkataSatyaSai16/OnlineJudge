import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {

    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];


    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error(error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
