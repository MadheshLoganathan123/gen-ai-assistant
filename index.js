const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const EXCHANGE_RATE_API_KEY = "6b995dd220d6100edcb0b240"; // Get from ExchangeRate-API
const BASE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/`;

app.post("/webhook", async (req, res) => {
    const parameters = req.body.queryResult.parameters;
    const amount = parameters.amount;
    const fromCurrency = parameters["currency-from"];
    const toCurrency = parameters["currency-to"];

    try {
        const response = await axios.get(`${BASE_URL}${fromCurrency}`);
        const rate = response.data.conversion_rates[toCurrency];

        if (!rate) {
            return res.json({ fulfillmentText: "Sorry, I couldn't find the exchange rate." });
        }

        const convertedAmount = (amount * rate).toFixed(2);
        res.json({ fulfillmentText: `${amount} ${fromCurrency} is approximately ${convertedAmount} ${toCurrency}.` });
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        res.json({ fulfillmentText: "Sorry, an error occurred while fetching exchange rates." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
