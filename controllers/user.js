const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secret = "MovieCatalogSystemAPI";

module.exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password are required"
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).send({
                message: "Email already exists"
            });
        }

        const newUser = new User({
            email,
            password: bcrypt.hashSync(password, 10)
        });

        await newUser.save();

        return res.status(201).send({
            message: "Registered Successfully"
        });
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).send({
                message: "Email already exists"
            });
        }

        return res.status(500).send({
            message: "Error registering user"
        });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).send({
                message: "Incorrect password"
            });
        }

        const access = jwt.sign({
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }, secret);

        return res.status(200).send({ access });
    } catch (error) {
        return res.status(500).send({
            message: "Error logging in"
        });
    }
};

module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        return res.status(200).send({ user });
    } catch (error) {
        return res.status(500).send({
            message: "Error retrieving user details"
        });
    }
};

module.exports.verify = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).send({
            auth: "Failed. No Token"
        });
    }

    const token = authorization.slice(7);

    try {
        req.user = jwt.verify(token, secret);
        return next();
    } catch (error) {
        return res.status(403).send({
            auth: "Failed",
            message: error.message
        });
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send({
            message: "Admin access required"
        });
    }

    return next();
};
