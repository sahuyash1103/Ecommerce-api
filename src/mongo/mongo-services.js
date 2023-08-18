const mongoose = require("mongoose");
const { MONGO_URI } = require("../utils/get-env");

function initMongo() {
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
        })
        .then(() => console.log("Connected to mongoDB..."))
        .catch((err) => console.log(`Error while connecting to mongoDB: ${err}`));
}

const isValidObjectId = (id) => {
    const ObjectId = mongoose.Types.ObjectId;
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
};

module.exports = { initMongo, isValidObjectId };
