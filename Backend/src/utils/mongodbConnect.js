const mongoose = require("mongoose");

const url = process.env.MONGO_URI;
const dbConnect = async () => {
    try {
        await mongoose.connect(url)
        console.log("MongodbConnected....")
    } catch(err) {
        console.log("Unknown Error Occured", err);
    }
}

module.exports = dbConnect;