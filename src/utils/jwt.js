import { jwt } from  "jsonwebtoken";

const jwtToken = process.env.JWT_PASSWORD;

export const jwtPass =  (userId) => {
    return jwt.sign({userId} , jwtToken , { expiresIn : "7d" });
}

export const verifyToken =  (token) => {
    try {
        return jwt.verify(token , jwtToken);
    }catch (err) {
        throw new err ("Invalid or expired token"); 
    }
}