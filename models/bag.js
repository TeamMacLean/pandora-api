const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // name: { type: String, required: true },
    createdBy: { type: String, required: true },
    code: {
        required: true,
        type: String,
        unique: true,
    },
    shortName: {
        required: true,
        type: String
    },
    species: {
        required: true,
        type: String
    },
    accession: {
        required: true,
        type: String
    },
    box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
}, { timestamps: true, toJSON: { virtuals: true } });

// generating a non-duplicate Code
schema.pre('validate', function (next) {  // can't use arror function, or this will be undefinded. fat arrow is lexically scoped.
    let ctx = this
    ctx.constructor.count({ box: ctx.id, shortName: ctx.shortName })
        .then(count => {
            ctx.code = `${ctx.shortName}_${("000" + count).slice(-4)}`
            next()
        })
        .catch(err => {
            next(err)
        })
})

schema.virtual('logs', {
    ref: 'Log',
    localField: '_id',
    foreignField: 'bag',
    justOne: false, // set true for one-to-one relationship
});

const Bag = mongoose.model('Bag', schema);

module.exports = Bag;