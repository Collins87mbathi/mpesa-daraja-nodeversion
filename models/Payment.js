const {model,Schema} = require("mongoose");


const PaymentSchema = new Schema({
    transactionType: String,
    transactionID: String,
    transactionTime: Date,
    Amount: String,
    phoneNumber: String,
})

module.exports = model("Payment",PaymentSchema);