const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // name: { type: String, required: true },
    count: {
        type: Number
    },
    all: {
        type: Boolean
    },
    by: {
        type: String,
        required: true
    },
    bag: { type: mongoose.Schema.Types.ObjectId, ref: 'Bag', required: true },
}, { timestamps: true, toJSON: { virtuals: true } });

// generating a non-duplicate Code
// schema.pre('validate', function (next) {  // can't use arror function, or this will be undefinded. fat arrow is lexically scoped.
//     let ctx = this

//     ctx.constructor.findOne({}).sort({ createdAt: -1 })
//         .then(found => {
//             console.log('found', found);
//             ctx.code = found ? found.code + 1 : 1
//             next()
//         })
//         .catch(err => {
//             next(err)
//         })

// })

const Log = mongoose.model('Log', schema);

module.exports = Log;