import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;

    const newUser = new User({username, email, password: bcryptjs.hashSync(password, 10)})

    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(error);
    }
}

export const signin = async(req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email}); // Temukan pengguna dengan email tertentu
        if (!validUser) return next(errorHandler(404, 'User not found!')); // Jika tidak ditemukan maka kirim kode 404
        
        // Validator Password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        // Jika tidak valid maka kirim kode 401
        if (!validPassword) return next(errorHandler(401, 'Wrong crendentials!'));
        
        // Mendapatkan token
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)

        // Memisahkan data 'password' dan kirim ke user'
        const {password: pass, ...rest} = validUser._doc;
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest); 
 
    } catch (error) {
        next(error);
    }
}