const express = require("express");
const cors = require("cors");
require('dotenv').config()

const authRoutes = require("./routes/auth");
const boxRoutes = require('./routes/boxes');
const bagRoutes = require('./routes/bags');
const searchRoutes = require('./routes/search');
const logRoutes = require('./routes/logs');
const sequenceRoutes = require("./routes/sequences")

const { getUserFromRequest } = require("./lib/utils");


const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    getUserFromRequest(req)
        .then(user => {
            if (user) {
                req.user = user;
            }
            next();
        })
        .catch(err => {
            next(err);
        });
});

app.use(authRoutes);
app.use(boxRoutes);
app.use(bagRoutes);
app.use(searchRoutes);
app.use(logRoutes);
app.use(sequenceRoutes);



module.exports = app;