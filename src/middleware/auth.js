import { verifyToken } from "../utils/jwt";

export const getAuthContext = ({ req }) => {
  let user = null;

  try {
    const authheader = req.headers.authorization;
    if (authheader) {
      const token = authheader.replace("Bearer ", "");
      user, verifyToken(token);
    }
  } catch (error) {
    console.log("Invalid token : " + error.message);
  }

  return { user };
};
