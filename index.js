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
                "Amount": 1,
                "Msisdn": 254791686851,
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

app.post("/confirmation",async(req,res)=>{
    try {
        await Payment.create(req.body);
        res.status(200).json(req.body);
        //  console.log(req.body);  
    } catch (error) {
       res.status(500).json(error); 
    }
  
});


app.post("/validation",(req,res)=>{
res.status(200).json(req.body);
// console.log(req.body);
})

app.listen(port,()=> {
    console.log(`server is listening to port ${port}`);
})