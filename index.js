const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.static('./public'));
app.use('/news',express.static('./public/news.html'));
app.use('/crypto',express.static('./public/crypto.html'));
app.use('/about',express.static('./public/about.html'));
app.use('/contact',express.static('./public/contact_us.html'));
app.use('/privacy',express.static('./public/privacy.html'));
app.use('/converter',express.static('./public'));



app.use(express.json())

app.post('/', (req,res)=>{
    console.log(req.body);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth : {
        user: 'shukla.vaibhav1077@gmail.com',
        pass: process.env.GMAILPASSWORD
      }
    })

    const mailOptions = {
      from: req.body.email,
      to: 'vaibhav@coinmasters.in',
      subject: `Message from ${req.body.name}(${req.body.email})`,
      text: `Name: ${req.body.name}
email: ${req.body.email}
message: ${req.body.message}`
    }

    transporter.sendMail(mailOptions, (err,info)=>{
      if(err){
        console.log(err);
        res.send('Error');
      }else{
        console.log(`Email Sent : ` + info.response);
        res.send('success');
      }
    });
})

app.use('/news/',(req,res)=>{
  res.redirect("/news")
});
app.use('/news/',(req,res)=>{
  res.redirect("/news");
});
app.use('/crypto/',(req,res)=>{
  res.redirect("/crypto");
});
app.use('/about/',(req,res)=>{
  res.redirect("/about");
});
app.use('/contact/',(req,res)=>{
  res.redirect("/contact");
});



// Routes
// API
app.use('/news-data',require('./routes/news'));
app.use('/conversion',require('./routes/conversion'));
app.use('/coins',require('./routes/coins'));
app.use('/coin',require('./routes/coin'));
app.use('/fiats',require('./routes/fiats'));
app.use('/listings',require('./routes/listings'));
app.use('/youtube',require('./routes/youtube'));
app.use('/coinStats',require('./routes/coinStats'));
app.use('/quoteLatest',require('./routes/quoteLatest'));


app.get('/converter/:from/:to/:amount/', (req,res)=>{
    res.render("converterToAmt.ejs",{
      from: req.params['from'],
      to : req.params['to'],
      amount : req.params['amount']
    });
})

app.get('/converter/:from/:to/:amount', (req,res) =>{
    res.render("converterToAmt.ejs",{
      from: req.params['from'],
      to : req.params['to'],
      amount : req.params['amount']
    });
})

app.get('/converter/:from/:to', (req,res) =>{
    res.render("converterTo.ejs",{
      from: req.params['from'],
      to : req.params['to']
    })
})

app.get('/converter/:from', (req,res) =>{
  const from = req.params.from;

  res.render("converter.ejs", {from: from})

})




app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
