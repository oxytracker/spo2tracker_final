const express = require('express');
const bodyParser = require('body-parser');
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
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));


const insertValue = async (patientID, spo2_value, bpm_value) => {
  var database_ref = database.ref()
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;


  var user_data = {
    spo2: spo2_value,
    bpm: bpm_value,
    timestamp: dateTime
  }

  database_ref.child('values/' + patientID + "/" + dateTime).set(user_data)
}


const insertPatientID = async (patientID) => {
  var database_ref = database.ref();
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;

  var table3_data = {
    patientID: patientID,
    timestamp: dateTime
  }
  database_ref.child("table3/" + patientID).set(table3_data);

  database_ref.child("ID/IDsync").get().then((snapshot) => {
    var data = snapshot.val();
    console.log(data);
    var nstr = data.replace('e', '');
    var arr = nstr.split('a')
    arr.push(patientID)
    // console.log(arr);
    arr.sort(function(a, b) {
      return a - b;
    });
    var res = '';
    for (i in arr) {
      res = res.concat(arr[i], 'a')
    }
    res = res.slice(0, -1).concat('e')
    console.log(res)
    database_ref.child('ID/IDsync').set(res);
  })
}

app.get('/value/:patientID/:spo2/:bpm', (req, res) => {
  var patID = parseInt(req.params.patientID);
  var oxydata = parseInt(req.params.spo2);
  var bpmdata = parseInt(req.params.bpm);
  if ((!isNaN(oxydata)) && (!isNaN(bpmdata))) {
    res.send("patientID " + patID + " spo2 " + oxydata + " bpm  " + bpmdata);
    insertValue(req.params.patientID, req.params.spo2, req.params.bpm);
  } else {
    res.send("ER:WRNG DATA"); //trying to use less than 16 characters so that it is visible on the 16*2 LCD screen
  }
});


app.get('/IDreg/:id', (req, res) => {
  var database_ref = database.ref();
  var patientID = parseInt(req.params.id);
  database_ref.child("table3/" + patientID).get().then((snapshot) => {
    var data = snapshot.val()
    if (data == null) {
      res.send("patientID " + patientID);
      insertPatientID(req.params.id);
    } else {
      res.send("ID already exists!!");
    }
  })
});


app.get('/IDsync', (req, res) => {
  var database_ref = database.ref();
  database_ref.child("ID/IDsync").get().then((snapshot) => {
    res.send(snapshot.val())
  })
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server running!!!");
});
