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
    //1. Destruktur data dari request client
    const {email, password} = req.body;
    console.log(req.body);
    try {
        // 2. Cari apakah ada user dengan email yang sama
        const validUser = await User.findOne({email});
            // 2a. Jika tidak ada atau user tidak ditemukan, maka kirim response: 404, User not found
        if (!validUser) return next(errorHandler(404, 'User not found!'));        
        // 3. Validasi password dari client dengan database
        const validPassword = bcryptjs.compareSync(password, validUser.password);
            // 3a. Jika tidak sama/salah password maka kirim response: 401, Wrong credentials 
        if (!validPassword) return next(errorHandler(401, 'Wrong crendentials!'));
        
        // 4. Membuat token
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)

        // 5. Memisahkan data 'password' lalu kirim data yang sudah bersih ke client
        const {password: pass, ...rest} = validUser._doc;
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest); 
    } catch (error) {
        next(error);
    }
}