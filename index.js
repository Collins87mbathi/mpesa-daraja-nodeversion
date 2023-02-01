const express = require("express");
const request = require("request");
const app = express();
const accessToken = require("./utils/auth");
const CONNECTDB = require("./Database/connect");
const Payment = require("./models/Payment");
const cors = require("cors");
const { json } = require("express");
const port = 5000;
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//database
CONNECTDB(process.env.MONGO_DB_URL);

app.get("/", (req, res) => {
  res.send("its mpesa api");
});

app.get("/register", accessToken, (req, res) => {
  const auth = "Bearer " + req.safaricom_access_token;
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  try {
    request(
      {
        url: url,
        method: "POST",
        headers: {
          Authorization: auth,
        },
        json: {
          ShortCode: "600999",
          ResponseType: "Completed",
          ConfirmationURL: "https://collinsrenter.onrender.com/confirmation",
          ValidationURL: "https://collinsrenter.onrender.com/validation",
        },
      },
      function (e, response, body) {
        if (e) {
          console.error(e);
          res.status(502).send({
            message: "Error with the register URL",
            error: e,
          });
        } else {
          res.status(200).json(body);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/simulate", accessToken, (req, res) => {
  const auth = "Bearer " + req.safaricom_access_token;
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
  try {
    request(
      {
        url: url,
        method: "POST",
        headers: {
          Authorization: auth,
        },
        json: {
          ShortCode: "600999",
          CommandID: "CustomerBuyGoodsOnline",
          Amount: "10",
          Msisdn: "254708374149",
        },
      },
      function (e, response, body) {
        if (e) {
          console.error(e);
          res.status(502).send({
            message: "Error with the Simulate",
            error: e,
          });
        } else {
          res.status(200).json(body);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/confirmation", async (req, res) => {
  try {
    let year = req.body.TransTime.slice(0, 4);
    let month = req.body.TransTime.slice(4, 6);
    let day = req.body.TransTime.slice(6, 8);
    let hourString = req.body.TransTime.slice(8, 10);
    let hour = parseInt(hourString) + 3;
    let minute = req.body.TransTime.slice(10, 12);
    let second = req.body.TransTime.slice(12, 14);

    let transactionDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    let transaction = new Payment({
      transactionType: req.body.TransactionType,
      transactionID: req.body.TransID,
      transactionTime: transactionDate,
      Amount: req.body.TransAmount,
      phoneNumber: req.body.MSISDN,
    });
    await transaction.save();

    res.status(200).json({
      message: "the transaction was successfully made",
      id: transaction._id,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/validation", (req, res) => {
  res.status(200).json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
});

app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});
