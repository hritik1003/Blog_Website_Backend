const JWT = require("jsonwebtoken");

const secret ="$uperMan@123";  

function createTokenForUser(user) {
    if (!user) {
        throw new Error("User object is required to generate token!");
    }

    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    const token =  JWT.sign(payload, secret, { expiresIn: "1h" }); 
    return token 
}

function validateToken(token) {
    try {
        const payload = JWT.verify(token, "$uperMan@123");  // Secret key
        return payload;
    } catch (error) {
        return null;  // Return null if the token is invalid
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};
