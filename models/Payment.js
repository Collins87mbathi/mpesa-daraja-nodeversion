const {model,Model,Schema} = require("mongoose");


const PaymentSchema = new Schema({
    TransactionType:{
        type:String,
    },
    TransTime:{
      type:String
    },
    TransAmount:{
        type:String
    },
    BusinessShortCode:{
        type:String,
    },
    BillRefNumber:{
        type:String,
    },
    MSISDN:{
        type:String,
    },
})

module.exports = model("Payment",PaymentSchema);