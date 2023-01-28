const express = require("express");
const request = require("request");
const app = express();
const accessToken = require("./utils/auth");
const port = 5000;





app.use(express.json());


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

app.post("/confirmation",(req,res)=>{
res.status(200).json(req.body);
 console.log(req.body);
});

app.post("/validation",(req,res)=>{
res.status(200).json(req.body);
console.log(req.body);
})

app.listen(port,()=> {
    console.log(`server is listening to port ${port}`);
})