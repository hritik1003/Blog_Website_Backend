const {Router} = require('express') ;
const User = require('../models/user') ;
const router = Router() ;

router.get('/signin',(req,res) =>{
    return res.render("signin")
})

router.get('/signup',(req,res) =>{
    return res.render("signup")
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/")    
});

router.post("/signin",async(req,res) =>{
    const {email,password} = req.body ;
    try{
        const token =await User.matchPasswordAndGenerateToken(email,password) ;
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 3600000,
        });
        const temp = res.redirect("/") ;
        return temp ;
    }
    catch(error){
        return res.render('signin',{
            error:"Incorrect Email or Password"
        });
    }
});

router.post("/signup",async (req,res) => {
    const {fullName,email,password,salt} = req.body ;
    await User.create({
        fullName,
        email,
        password,
        salt,
    });
    res.redirect("/")
});

module.exports = router ;