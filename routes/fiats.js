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



router.get('/',cache('60 minutes'), async (req,res)=>{
    try{
        const params = new URLSearchParams(
            {
                ...url.parse(req.url,true).query,
            }
        );
        const options = {
            method: 'GET',
            url: `https://pro-api.coinmarketcap.com/v1/fiat/map?${params}`,
            headers: {
                'X-CMC_PRO_API_KEY': API_COIN_MARKET_KEY
            },
            params:{
                sort:"id",
            }
        };
        axios.request(options).then(function (response) {
            res.status(200).json(response.data);
    })}
    catch(err){
        res.status(500).json({Error : err});
    };
})

module.exports = router;
