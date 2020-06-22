const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: {
        type: Boolean, 
        required: true, 
        default: true
    }
}, { timestamps: true, toJSON: { virtuals: true } });

// db.posts.insert({
//     name: 'Jonjo Shelvey',
//     isActive: true,
// })

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

schema.virtual('sequences', {
    ref: 'Sequence',
    localField: '_id',
    foreignField: 'sequence',
    justOne: false, // set true for one-to-one relationship
});

const Sequence = mongoose.model('Sequence', schema);

module.exports = Sequence;