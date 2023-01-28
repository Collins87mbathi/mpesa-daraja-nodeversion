const request = require("request");

const accessToken = (req, res, next)=> {
    try{
        let consumerkey = "3IRKiNGCok6aIxQyebAuzrXqoTwW9kqH";
        let consumersecret = "gAi2PzJgLAZIFbie";
        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
       
        const auth = new Buffer.from(`${consumerkey}:${consumersecret}`).toString('base64')

        request(
            {
                url: url,
                headers: {
                    "Authorization": "Basic " + auth
                }
            },
            (error, response, body) => {
                if (error) {
                    res.status(401).send({
                        "message": 'Something went wrong when trying to process your payment',
                        "error":error.message
                    })
                }
                else {
                    req.safaricom_access_token = JSON.parse(body).access_token
                    next()
                }
            }
        )
    }catch (error) {

        console.error("Access token error ", error)
        res.status(401).send({
            "message": 'Something went wrong when trying to process your payment',
            "error":error.message
        })
    }

}

module.exports = accessToken;