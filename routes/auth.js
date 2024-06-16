const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'surajsir'

const app = express();

app.use(express.json());

router.post('/createuser', [
    body('name', "enter a valid name").isLength({ min: 3 }),
    body('email', "enter a valid email").isEmail(),
    body('password', "enter a valid password").isLength({ min: 5 }),

], async (req, res) => {
    let success =false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success ,error: "This email is already" });
        }


        //creating a new user , POST : "api/auth/creatreuser" : login not required         
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        }
        )
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send(success ,"Internal Server Error");
    }
});





//authenticate a user, POST : "api/auth/login" : login not required


router.post('/login', [
    body('email', "enter a valid email").isEmail(),
    body('password', "password can not be blank").exists(),
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ success, errors: errors.array() })
    }


    const{email,password}=req.body;

    try {
        let user=await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({success ,error:"Enter valid credentials"});
        }

        const comparePassword= await bcrypt.compare(password,user.password);
        if(!comparePassword){
            success=false;
            return res.status(400).json({success , error:"Enter valid credentials"})
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success =true;
        res.json({success, authtoken });


    } catch (error) {
        console.error(error.message);
        res.status(500).send(success,"Internal Server Error");
    }

})


// Get User Details that is logged In , POST : "api/auth/getuser" : login required


router.post('/getuser', fetchuser, async (req, res) => {


try {
    const userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
    
} catch (error) {
    console.error(error.message);
        res.status(500).send(success, "Internal Server Error");
}
});

module.exports = router;
