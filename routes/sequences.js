const express = require("express")
const router = express.Router();
const Sequence = require('../models/sequence')
const { isAuthenticated } = require('./middleware');
router
    .all(isAuthenticated)
    .get('/sequences', (req, res, next) => {
        console.log('hardwick b stakes')
        Sequence.find({}).sort('-createdAt')
            .then(sequences => {
                res.status(200).json({ sequences: sequences });
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })

    })

// db.sequences.update({ _id: ObjectId('5eecee1dece5c2317c61df83')},{$set: {isActive: true}})
router
    // temp GG .all(isAuthenticated)
    .put('/sequence', (req, res, next) => {

        Sequence.findByIdAndUpdate(
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
    .post('/sequences/new', (req, res, next) => {

        if (!req.body.name) {
            return res.status(500).json({ error: new Error("'Name' field required") });
        }

        new Sequence({
            name: req.body.name,
            isActive: true
        })
            .save()
            .then(savedSequence => {
                res.status(200).json({ sequence: savedSequence });
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err });
            })

    })

module.exports = router;