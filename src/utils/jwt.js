import jwt from "jsonwebtoken";

export const jwtPass = (userId) => {
  // Make sure you have JWT_SECRET in your .env file
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  
  return jwt.sign({ userId }, secret, { expiresIn: "24h" });
};

export const verifyJWT = (token) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};