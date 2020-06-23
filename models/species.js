const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: {
        type: Boolean, 
        required: true, 
        default: true
    }
}, { timestamps: true, toJSON: { virtuals: true } });

// generating a non-duplicate Code
schema.pre('validate', function (next) {  // can't use arrow function, or this will be undefinded. fat arrow is lexically scoped.
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

schema.virtual('species', {
    ref: 'Species',
    localField: '_id',
    foreignField: 'species',
    justOne: false, // set true for one-to-one relationship
});

const Species = mongoose.model('Species', schema);

module.exports = Species;