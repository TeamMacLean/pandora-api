const express = require("express")
const router = express.Router();
const Bag = require('../models/bag')
const { isAuthenticated } = require('./middleware');
// router
//     .all(isAuthenticated)
//     .get('/boxes', (req, res, next) => {

//         Box.find({}).sort('-createdAt')
//             .then(boxes => {
//                 res.status(200).json({ boxes: boxes });
//             })
//             .catch(err => {
//                 res.status(500).json({ error: err });
//             })

//     })

router
    .all(isAuthenticated)
    .get('/bag', (req, res, next) => {

        Bag.findOne({ code: req.query.code })
            .populate('box')
            .populate({ path: 'logs', options: { sort: { 'createdAt': -1 } } })
            .then(bag => {
                if (bag) {
                    res.status(200).json({ bag: bag });
                } else {
                    res.status(500).json({ error: new Error('Bag not found') });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })
    })

router
    .all(isAuthenticated)
    .post('/bags/new', (req, res, next) => {


        if (!req.body.species) {
            return res.status(500).json({ error: new Error('value "species" required') });
        }
        if (!req.body.accession) {
            return res.status(500).json({ error: new Error('value "accession" required') });
        }
        if (!req.body.boxID) {
            return res.status(500).json({ error: new Error('value "boxID" required') });
        }




        new Bag({
            createdBy: req.user.username,
            box: req.body.boxID,
            species: req.body.species,
            accession: req.body.accession
        })
            .save()
            .then(savedBag => {
                res.status(200).json({ bag: savedBag });
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })

    })

module.exports = router;
