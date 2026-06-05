const express = require('express');
const session = require('express-session')
const jwt = require('jsonwebtoken');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    let authToken = req.headers['authorization'];
    let token = authToken && authToken.split(' ')[1];
    if (!token){
        return res.status(401).json({message:"Access denied. No token provided."});
    }
    jwt.verify(token, 'fingerprint_customer', (err, decodedPayload) => {
        if (err) {
            return res.status(403).json({message:"Token is invalid or expired."});
        }
        req.user = decodedPayload;
        next();
    });
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT =5000;
app.listen(PORT,()=>console.log(`Server is running on http://localhost:${PORT}`));