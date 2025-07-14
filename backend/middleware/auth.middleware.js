import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

export const protectRoute = async (req,res,next) => {
    try {
        const token= req.cookies.token;
        if(!token){
            return res.status(401).json({message:'Not authorised'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password')
        
        if (!req.user){
             return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}