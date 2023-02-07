const url = require('url');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiCache = require('apicache');

// Init Cache
let cache = apiCache.middleware;

// API KEY AND DOMAIN
const API_COIN_MARKET_DOMAIN = process.env.API_COIN_MARKET_DOMAIN;
const API_COIN_MARKET_KEY = process.env.API_COIN_MARKET_KEY;



router.get('/',cache('20 minutes'), async (req,res)=>{
    try{
        const params = new URLSearchParams(
            {
                ...url.parse(req.url,true).query,
            }
        );
        const options = {
            method: 'GET',
            url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?${params}`,
            headers: {
                'X-CMC_PRO_API_KEY': API_COIN_MARKET_KEY
            },
            params:{}
        };
        axios.request(options).then(function (response) {
            res.status(200).json(response.data);
    })}
    catch(err){
        // error
        console.log(err);
        reject(err);
    };
})

module.exports = router;
