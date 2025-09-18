const User = require("../users/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
    try{
        const {email, password, confirmPassword, firstName, lastName, region, country, nationality} = req.body;

        if(password != confirmPassword) return res.status(400).json({message: "passwords does not match"});

        const existingUser = await  User.findOne({email});

        if(existingUser) return res.status(400).json({message: "Email already exists"});
        const salt = 10;
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            password: hashed,
            firstName,
            lastName,
            region,
            country,
            nationality
        })
        res.status(201).json({message: "signup successfull"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "sercer error"});
    }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({mesasge: "invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.sttus(400).json({message: "invalid credentials"});

        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

    }
    catch(err) {
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports = { signUp, login };