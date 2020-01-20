const express = require("express")
const router = express.Router();
const Log = require('../models/log')
const { isAuthenticated } = require('./middleware');

router
    .all(isAuthenticated)
    .get('/logs', (req, res, next) => {

        Log.find({})
            .populate('bag')
            .then(logs => {
                if (logs) {
                    res.status(200).json({ logs: logs });
                } else {
                    res.status(500).json({ error: new Error('no logs found') });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err });
            })
    })

router
    .all(isAuthenticated)
    .post('/logs/new', (req, res, next) => {

        if (!req.body.count && !req.body.all) {
            return res.status(500).json({ error: new Error('value "count" or "all" required') });
        }
        if (!req.body.bagID) {
            return res.status(500).json({ error: new Error('value "bagID" required') });
        }
        

        new Log({
            by: req.user.username,
            bag: req.body.bagID,
            count: req.body.count,
            all: req.body.all
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