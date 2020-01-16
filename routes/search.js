const express = require("express")
const router = express.Router();
const Bag = require('../models/bag')
const Box = require('../models/box')
const { isAuthenticated } = require('./middleware');

router
    .all(isAuthenticated)
    .get('/search', (req, res, next) => {

        const search = req.query.search;

        Bag.find(
            {
                $or: [
                    { "species": { "$regex": search, "$options": "i" } },
                    { "code": { "$regex": search, "$options": "i" } },
                ]
            }
        )
            .populate('box')
            .then(bagsFound => {
                res.status(200).json({ bags: bagsFound });
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })



    })

module.exports = router;