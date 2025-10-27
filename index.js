const express = require('express');
const path = require('path');
const cookieParser =require('cookie-parser')
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');
const {restrictTo,checkForAuthentication}= require('./middlewares/auth')

const urlRoute = require("./routes/url");
const staticRoute =require("./routes/staticRouter");
const userRoute = require('./routes/user');


const app = express();
const PORT = 8001;

connectToMongoDB('mongodb+srv://himanshukushwaha:0mBGjUCvOOqe03s1@himanshu01.u3pkx52.mongodb.net/')
.then(() => console.log("Connected to MongoDB"));

app.set('view engine', 'ejs');
app.set('views',path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use((req, res, next) => {
    if (req.path === "/user/login" || req.path === "/user/register") {
        return next(); 
        }
    return checkForAuthentication(req, res, next);
});



app.use("/url", restrictTo("NORMAL"),urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);



app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    if (!entry) {
        return res.status(404).send('Short URL not found');
    }
    res.redirect(entry.redirectURL);
});


app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));