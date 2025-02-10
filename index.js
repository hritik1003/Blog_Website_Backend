const express = require("express");
const checkForAuthenticationCookie = require("./middlewares/authentication");
const { validateToken } = require("./services/authentication");
const Blog = require("./models/blog") ;
const path = require("path");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 8000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Move cookieParser before any middleware that accesses cookies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/')
    .then(() => console.log('MongoDb Connected'))
    .catch(err => console.error("Error connecting to MongoDb:", err));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

// Middleware for authentication
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            req.user = validateToken(token); // Decode JWT
        } catch (error) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
});

// Routes
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

app.use(checkForAuthenticationCookie('token'));  
app.use(express.static(path.resolve('./public'))) ;
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Home route
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}) ;
    console.log(allBlogs);
    res.render("home", {
        user: req.user,
        blogs:allBlogs,
    });
});


app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));
