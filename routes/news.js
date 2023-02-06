const url = require('url');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiCache = require('apicache');

// Init Cache
let cache = apiCache.middleware;

// API KEY AND DOMAIN
const API_NEWS_DOMAIN = process.env.API_NEWS_DOMAIN;
const API_NEWS_KEY = process.env.API_NEWS_KEY;

router.get('/',cache('2 minute'), async (req,res)=>{
    try{
        const params = new URLSearchParams(
            {
                ...url.parse(req.url,true).query,
            }
        );
        const options = {
            method: 'GET',
            url: `https://free-news.p.rapidapi.com/v1/search?${params}`,
            params: {q: 'cryptocurrency bitcoin', lang: 'en'},
            headers: {
                'X-RapidAPI-Key': API_NEWS_KEY,
                'X-RapidAPI-Host': API_NEWS_DOMAIN
            }
        };
        axios.request(options).then(function (response) {
            res.status(200).json(response.data);
    })}catch(err){
        res.status(500).json({Error : err});
    };
})


module.exports = router