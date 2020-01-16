const mongoose = require('mongoose')
const generate = require('nanoid/generate')


const schema = new mongoose.Schema({
    // name: { type: String, required: true },
    createdBy: { type: String, required: true },
    code: {
        required: true,
        type: String,
        unique: true,
    },
    species: {
        required: true,
        type: String
    },
    box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
}, { timestamps: true, toJSON: { virtuals: true } });

// generating a non-duplicate Code
schema.pre('validate', function (next) {  // can't use arror function, or this will be undefinded. fat arrow is lexically scoped.
    let ctx = this
    attempToGenerate(ctx, next)
})
function attempToGenerate(ctx, callback) {
    let newCode = generate('1234567890ACDEFGH', 8)
    ctx.constructor.findOne({ 'code': newCode }).then((course) => {
        if (course) {
            attempToGenerate(ctx, callback)
        }
        else {
            ctx.code = newCode
            callback();
        }
    }, (err) => {
        callback(err)
    })
}

const Bag = mongoose.model('Bag', schema);

module.exports = Bag;