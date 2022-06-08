
const express= require('express');
const bodyParser=require('body-parser');
const firebase = require('firebase');
// import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV7Lzi4kwbV_F_iao3YZHALg23GEfn1lg",
  authDomain: "spo2trackerlogin.firebaseapp.com",
  databaseURL: "https://spo2trackerlogin-default-rtdb.firebaseio.com",
  projectId: "spo2trackerlogin",
  storageBucket: "spo2trackerlogin.appspot.com",
  messagingSenderId: "1030568387976",
  appId: "1:1030568387976:web:d5308f441fbf8962e3863d"
};

const fbapp = firebase.initializeApp(firebaseConfig);
const database = firebase.database()
const app=express();

app.use(bodyParser.urlencoded({extended: true}));


const insertIntoBase = async (patientID,spo2_value,bpm_value)=>{
  var database_ref = database.ref()
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;


  var user_data = {
    spo2 : spo2_value,
    bpm : bpm_value,
    timestamp : dateTime
  }

  database_ref.child('values/'+patientID+"/"+dateTime).set(user_data)
}

app.get('/value/:patientID/:spo2/:bpm',(req,res)=>{
    var patID = parseInt(req.params.patientID);
    var oxydata = parseInt(req.params.spo2);
    var bpmdata = parseInt(req.params.bpm);
    if((!isNaN(oxydata))&&(!isNaN(bpmdata)))
      {
        res.send("patientID "+patID+" spo2 "+ oxydata +" bpm  "+bpmdata);
        insertIntoBase(req.params.patientID,req.params.spo2,req.params.bpm);
      }
      else{
        res.send("ER:WRNG DATA"); //trying to use less than 16 characters so that it is visible on the 16*2 LCD screen
      }
});


app.listen(process.env.PORT || 5000);
