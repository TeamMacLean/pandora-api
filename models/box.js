const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // name: { type: String, required: true },
    createdBy: { type: String, required: true },
    code: {
        required: true,
        type: Number,
        unique: true,
    },
    shelf: {
        required: true,
        type: Number
    },
    bay: {
        required: true,
        type: String
    }
}, { timestamps: true, toJSON: { virtuals: true } });

// generating a non-duplicate Code
schema.pre('validate', function (next) {  // can't use arror function, or this will be undefinded. fat arrow is lexically scoped.
    let ctx = this

    ctx.constructor.findOne({}).sort({ createdAt: -1 })
        .then(found => {
            console.log('found', found);
            ctx.code = found ? found.code + 1 : 1
            next()
        })
        .catch(err => {
            next(err)
        })

})

schema.virtual('bags', {
    ref: 'Bag',
    localField: '_id',
    foreignField: 'box',
    justOne: false, // set true for one-to-one relationship
});

const Box = mongoose.model('Box', schema);

module.exports = Box;