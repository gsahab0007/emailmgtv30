const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dev_db_url = "mongodb://127.0.0.1:27017/emailmgt";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoDB);
        console.log('MongoDB Connected ✅');
    } catch (error) {
        console.log('MongoDB Error ❌:', error.message);
        process.exit(1);
    }
}

module.exports = { connectDB, mongoDB };


// -----------------------------------------------------------------------

// const mongoose = require('mongoose');

// const mongoDB = process.env.MONGODB_URI;

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(mongoDB);
//         console.log('MongoDB Connected ✅');
//     } catch (error) {
//         console.log('MongoDB Error ❌:', error.message);
//         process.exit(1);
//     }
// };

// module.exports = { connectDB, mongoDB };