import  jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    // Get token from cookies, headers, or query params for flexibility
    const token = 
        (req.cookies && req.cookies.access_token) || 
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
            ? req.headers.authorization.split(' ')[1] 
            : null) ||
        req.query.token;
    
    if(!token) return next(errorHandler(401,'You are not authenticated'));
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(errorHandler(403,'Token is not valid'));
        req.user = user;
        next();
    });
};

export const verifyAdmin = (req, res, next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to perform this action. Admin privileges required.'));
    }
    next();
};

