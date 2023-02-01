const {model,Schema} = require("mongoose");


const PaymentSchema = new Schema({
    transactionType: String,
    transactionID: String,
    transactionTime: Date,
    BillRefNumber: String,
    Amount: String,
    phoneNumber: String,
})

module.exports = model("Payment",PaymentSchema);