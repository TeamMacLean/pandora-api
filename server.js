const app = require('./app')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3001;

try {
    mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, { useNewUrlParser: true });
} catch (err) {
    console.error(err);
}



app.listen(PORT, () => console.log(`API running on port ${PORT}!`));