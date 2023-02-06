const express=require('express');
const router = express.Router();
const apiCache = require('apicache');

// Init Cache
let cache = apiCache.middleware;

router.get('/',cache('60 minutes'), (req,res) =>{
    res.render("converter.ejs",{from:'asda'});
    // console.log(req.params['from'])
})

// router.get('/from', (req,res) =>{
//     res.render("converter.ejs", {from: 'req.params.from'});
// })

module.exports = router;