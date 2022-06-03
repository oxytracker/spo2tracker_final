
const express= require('express');
const bodyParser=require('body-parser');

const app=express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/getdata',function(req,res){
  console.log(req.query);
  res.send(req.query);
});

app.listen(process.env.PORT || 5000);
