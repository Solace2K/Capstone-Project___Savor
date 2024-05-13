const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String },
    email: { type: String },
    password: ( type: String ),
    createOn: { type: DataTransfer, default: new DataTransfer().getTime() },
});

module.export = mongoose.model("User", userSchema);