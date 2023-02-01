const express = require("express");
const request = require("request");
const app = express();
const accessToken = require("./utils/auth");
const CONNECTDB = require("./Database/connect");
const Payment = require("./models/Payment");
const port = 5000;
require("dotenv").config();


app.use(express.json());
app.use(express.urlencoded({extended:true}))

//database
CONNECTDB(process.env.MONGO_DB_URL)

app.get('/',(req,res)=>{
  res.send("its mpesa api")
})

app.get('/register',accessToken, (req,res)=> {
    const auth = "Bearer " + req.safaricom_access_token;
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    try {
      request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": 600980,
                "ResponseType": "Completed",
                "ConfirmationURL": "https://collinsrenter.onrender.com/confirmation",
                "ValidationURL": "https://collinsrenter.onrender.com/validation"
              }
        },
        function (e, response, body) {
            if (e) {
                console.error(e)
                res.status(502).send({
                    message:"Error with the register URL",
                    error : e
                })
            } else {
                res.status(200).json(body)
            }
        }
    )
    } catch (error) {
      console.log(error);
    }   
})

app.get('/simulate',accessToken, (req,res)=> {
    const auth = "Bearer " + req.safaricom_access_token;
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
    try {
      request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": 600980,
                "CommandID": "CustomerPayBillOnline",
                "Amount": "10",
                "Msisdn": "254791686851",
                "BillRefNumber": "A5"
              }
        },
        function (e, response, body) {
            if (e) {
                console.error(e)
                res.status(502).send({
                    message:"Error with the Simulate",
                    error : e
                })
            } else {
                res.status(200).json(body)
            }
        }
    )
    } catch (error) {
      console.log(error);
    } 
});

app.post("/confirmation",(req,res)=> {
    let year =  (req.body.TransTime).slice(0, 4);
    let month = (req.body.TransTime).slice(4, 6);
    let day = (req.body.TransTime).slice(6, 8);
    let hourString = (req.body.TransTime).slice(8, 10);
    let hour = parseInt(hourString) + 3;
    let minute = (req.body.TransTime).slice(10, 12);
    let second = (req.body.TransTime).slice(12, 14);

    let transactionDate = (`${year}-${month}-${day} ${hour}:${minute}:${second}`);

    let transaction = new Payment ( {
        transacType: req.body.TransactionType,
        transactionID: req.body.TransID,
        transactionTime: transactionDate,
        Amount: req.body.TransAmount,
        OrganizationBalance: req.body.OrgAccountBalance,
        phoneNumber: req.body.MSISDN,
        firstName: req.body.FirstName,
        lasteName: req.body.LastName,
    });
    transaction.save ()
    .then ( (transaction) => {
        res
        .status(201)
        .json ({
            message: 'Transaction saved to the database successfully',
            id: transaction._id
        });
    })
    .catch ( (err) => {
        res
        .status(500)
        .json (
            err.massage
        );
    })
});


app.post("/validation",(req,res)=>{
    res
    .status (200)
    .json({
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    })

})

app.listen(port,()=> {
    console.log(`server is listening to port ${port}`);
})