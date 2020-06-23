const xlsx = require('xlsx')
const Species = require('../models/species');
const workbook = xlsx.readFile('Specieslist.xlsx');

Promise.all(
	workbook.Strings.map(s=>{
		Species.find({name:s.t})
		.then(found=>{
			if(!found.length){
				return new Species({name:s.t}).save()
			} else {
				return Promise.resolve()
			}
		})
	})
)
.then(()=>{
	console.log('done');
})
.catch(err=>{
	console.error(err);
})
