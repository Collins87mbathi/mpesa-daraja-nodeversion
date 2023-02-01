const {model,Schema} = require("mongoose");


const PaymentSchema = new Schema({
    transacType: String,
    transactionID: String,
    transactionTime: Date,
    Amount: String,
    OrganizationBalance: String,
    phoneNumber: String,
    firstName: String,
    lasteName: String,
})

module.exports = model("Payment",PaymentSchema);