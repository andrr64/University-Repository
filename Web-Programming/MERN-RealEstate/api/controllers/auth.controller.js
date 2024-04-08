import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

const signup = async (req, res) => {
    const {username, email, password} = req.body;

    const newUser = new User({username, email, password: bcryptjs.hashSync(password, 10)})

    await newUser.save(); //Menyimpan data ke server mongodb ke server yang terhubung di index.js
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export default signup;