import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
        username:'John Doe'
    })
};

export const updateUser = async (req, res) => {
    const userAccountIdFromCookies = req.user.id;
    const userAccountIdFromURL = req.params.id;
    const idFromCookiesAndUrlIsNotSame = () => {
        return userAccountIdFromCookies != userAccountIdFromURL;
    }
    const userRequestToChangePassword = () => {
        return req.body.password;
    }
    if(idFromCookiesAndUrlIsNotSame()){
        return next(errorHandler(401, "You can only update your own account"));
    }
    try {
        if (userRequestToChangePassword()){
            const newHashedPassword = bcryptjs.hashSync(req.body.password, 10);
            req.body.password = newHashedPassword;
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true});
        // buat variabel 'rest' yang datanya dari updateUser._doc namun hapus key 'password'
        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}