import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

const signup = async (req, res, next) => {
    const {username, email, password} = req.body;

    const newUser = new User({username, email, password: bcryptjs.hashSync(password, 10)})

    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(errorHandler(550, 'error from internal server`'));
    }
}

export default signup;