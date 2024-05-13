const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = newSchema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    createdOn: { type: DataTransfer, default: newDataTransfer().getTime() },
});

module.export = mongoose.model("User", userSchema);