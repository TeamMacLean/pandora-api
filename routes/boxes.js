const express = require("express")
const router = express.Router();
const Box = require('../models/box')
const { isAuthenticated } = require('./middleware');
router
    .all(isAuthenticated)
    .get('/boxes', (req, res, next) => {
        Box.find({}).sort('-createdAt')
            // .populate('bags')
            .then(boxes => {
                res.status(200).json({ boxes: boxes });
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })

    })

router
    .all(isAuthenticated)
    .get('/box', (req, res, next) => {

        Box.findOne({ code: req.query.code })
            .populate('bags')
            .then(box => {
                console.log(box.bags);
                if (box) {
                    res.status(200).json({ box: box });
                } else {
                    res.status(500).json({ error: new Error('Box not found') });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })
    })

router
    .all(isAuthenticated)
    .post('/boxes/new', (req, res, next) => {

        if (!req.body.bay) {
            return res.status(500).json({ error: new Error('value "bay" required') });
        }
        if (!req.body.shelf) {
            return res.status(500).json({ error: new Error('value "shelf" required') });
        }

        new Box({
            createdBy: req.user.username,
            bay: parseInt(req.body.bay),
            shelf: parseInt(req.body.shelf)
        })
            .save()
            .then(savedBox => {
                res.status(200).json({ box: savedBox });
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({ error: err });
            })

    })

module.exports = router;