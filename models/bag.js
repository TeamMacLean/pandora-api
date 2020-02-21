const mongoose = require('mongoose')

function Padder(len, pad) {
    if (len === undefined) {
      len = 1;
    } else if (pad === undefined) {
      pad = '0';
    }
  
    var pads = '';
    while (pads.length < len) {
      pads += pad;
    }
  
    this.pad = function (what) {
      var s = what.toString();
      return pads.substring(0, pads.length - s.length) + s;
    };
  }

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
    accession: {
        required: true,
        type: String
    },
    box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
}, { timestamps: true, toJSON: { virtuals: true } });

schema.statics.generateBagShortName = function generateBagShortName(species) {

    return Bag.count({
        "species":
            { $regex: new RegExp("^" + species.toLowerCase() + '$', "i") }
    })
        .then(count => {
            const zero4 = new Padder(4);
            const num = zero4.pad(count);
            let shortName
            const splitsville = species.split(' ');
            if (splitsville.length > 1 && splitsville[1].length > 0) {
                shortName = `${splitsville[0][0].toUpperCase()}.${splitsville[1].toLowerCase()}_${num}`
            } else {
                shortName = `${species}_${num}`
            }

            return shortName;

        })

}

// generating a non-duplicate Code
schema.pre('validate', function (next) {  // can't use arror function, or this will be undefinded. fat arrow is lexically scoped.
    let ctx = this

    ctx.constructor.generateBagShortName(ctx.species)
        .then(shortName => {
            ctx.code = shortName
            next();
        })
        .catch(err => {
            console.error(err);
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