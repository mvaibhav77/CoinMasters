const url = require('url');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiCache = require('apicache');

// Init Cache
let cache = apiCache.middleware;

// API KEY AND DOMAIN
const API_YOUTUBE_KEY = process.env.API_YOUTUBE_KEY;

router.get('/',cache('60 minutes'), async (req,res)=>{
    try{
        const params = new URLSearchParams(
            {
                ...url.parse(req.url,true).query,
            }
        );
        const options = {
            method: 'GET',
            url: `https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=relevance&relevanceLanguage=en&key=${API_YOUTUBE_KEY}&${params}`
        };
        axios.request(options).then(function (response) {
            res.status(200).json(response.data);
    })}catch(err){
        res.json({Error : err});
    };
})


module.exports = router