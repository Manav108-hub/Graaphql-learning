import { verifyJWT } from "../utils/jwt.js";

export const getAuthContext = ({ req }) => {
  let user = null;

  try {
    const authheader = req.headers.authorization;
    if (authheader) {
      const token = authheader.replace("Bearer ", "");
      user = verifyJWT(token); // ✅ Fixed: was "user, verifyJWT(token);"
    }
  } catch (error) {
    console.log("Invalid token : " + error.message);
  }

  return { user };
};