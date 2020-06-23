const express = require("express")
const router = express.Router();
const Species = require('../models/species')
const { isAuthenticated } = require('./middleware');
router
    .all(isAuthenticated)
    .get('/species', (req, res, next) => {
        Species.find({}).sort('-createdAt')
            .then(species => {
                res.status(200).json({ species: species });
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })

    })

// db.species.update({ _id: ObjectId('5eecee1dece5c2317c61df83')},{$set: {isActive: true}})
router
    // temp GG .all(isAuthenticated)
    .put('/species', (req, res, next) => {

        Species.findByIdAndUpdate(
            req.body.id,
            req.body,
            {new: true},
            (err, response) => {
                if (err) return res.status(500).send(err);

                res.status(200).json(response)
            }

        );
    })

router
    .all(isAuthenticated)
    .post('/species/new', (req, res, next) => {

        if (!req.body.name) {
            return res.status(500).json({ error: new Error("'Name' field required") });
        }

        new Species({
            name: req.body.name,
            isActive: true
        })
            .save()
            .then(savedSpecies => {
                res.status(200).json({ species: savedSpecies });
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err });
            })

    })

module.exports = router;