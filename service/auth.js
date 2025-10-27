const jwt = require('jsonwebtoken');
const secret = "Himanshu#85805106";

// token generate karne ke liye
function setUser(user){
    return jwt.sign(
        { 
            _id: user._id, 
          email: user.email ,
          role:user.role,
        },  
        secret,
        
    );
}

// token verify karne ke liye
function getUser(token){
    if (!token) return null;

    try {
        return jwt.verify(token, secret);
    } catch (err) {
        console.error("JWT VERIFY ERROR:", err.message);
        return null;
    }
}

module.exports = { setUser, getUser };
