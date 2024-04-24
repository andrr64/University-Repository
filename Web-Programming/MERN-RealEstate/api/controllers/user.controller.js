import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

const idFromCookiesAndUrlIsNotSame = (user_id, params_id) => {
    return user_id !== params_id;
}

export const test = (req, res) => {
    res.json({
        username:'John Doe'
    })
};

export const updateUser = async (req, res) => {
    const userHasRequestToChangePassword = () => {
        return req.body.password;
    }
    if(idFromCookiesAndUrlIsNotSame(req.user.id, req.params.id)){
        return next(errorHandler(401, "You can only delete your own account"));
    }
    try {
        if (userHasRequestToChangePassword()){
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

export const deleteUser = async (req, res, next) => {
    if (idFromCookiesAndUrlIsNotSame(req.user.id, req.params.id)){
        // req.user._id = id pengguna yang berasal dari cookie
        // req.params.id = id pengguna yang berasal dari URL
        return next(errorHandler(401, 'You can only delete your own account!'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
}