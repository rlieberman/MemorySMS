//Thanks to Sam Slover and Lauren McCarthy
//https://github.com/sslover/designing-for-data-personalization/blob/master/week10/Twilio-SMS-setup.md
//https://github.com/lmccart/itp-convo-comp/tree/master/Twilio/twilio_text_server

//DOCUMENTATION
// node-twilio docs: http://twilio.github.io/twilio-node/
// TwiML xml response format docs: https://www.twilio.com/docs/api/twiml 

//TO RUN CODE
//in terminal, cd to folder
//type heroku logs --tail to see the log of what's coming in to the heroku app

// npm install twilio
var twilio = require('twilio');

// npm install express
// setup express app
var express = require('express');
var app = express();

//require firebase
var Firebase = require('firebase');

//setting up which port you listen on, here it's local but eventually do this with heroku
app.set('port', process.env.PORT || 3000); //look for an environment variable called port, set 3000 default
var http = require('http') //http built in
var server = http.Server(app); //make a server 
server.listen(app.get('port')); //set up the server to listen to the port that your app is running on

//set up a public folder where i can serve a static index.html page
app.use(express.static('public'));

//create a new global reference
var myFirebaseRef = new Firebase('https://boiling-torch-5856.firebaseio.com/');


//test to make sure routes are working
// app.get('/', function(req, res) {
//   res.send('ok'); //display content - return an index.html page, etc.
// });


// set up routes - this is where stuff is actually happening
//when you get an incoming text, it hits this url with an http request
app.get('/twilio-callback', function(request, response) {

  //this is where you get the actual text, from the request object
  console.log("request: " + request);
  var msg = request.query.Body.toLowerCase(); 

  console.log("message: " + msg);
  //how to save all the messages --
  //you can write to files locally but heroku doesn't let you write to files 
  //write to a database
  //heroku allows you to add resources, you can write to a mongo DB database
  //then you can use the node mongodb package 


  //twiml is a response format for sending messages back to someone from a phone
  //here, create a new response object
  var twiml = new twilio.TwimlResponse();
  
  //send the content of the incoming message to firebase, send it as an object
  myFirebaseRef.push({
    promptNum: "no prompt number in the sms version",
    memory: msg
      
  });


  //here you determine what the content of your response will be
  if (msg == 'i feel good') {
    twiml.message('I am glad to hear that.'); //twiml.message is how you create a response 
  } else if (msg == 'i feel bad') {
    twiml.message('I am sorry to hear that.');
  } else { //prepare the twiml
    // twiml.message('testing right back at you!');
    twiml.message(function(){ //this works but not when you try to send an image using this.media
      this.body('testing right back at you!');
      // this.media('http://animals.sandiegozoo.org/sites/default/files/juicebox_slides/owl_horned.jpg');
    });
  }

  // //passing this to twiml.message did not work
  // function() {
  //       this.body('Trust Pound!');
  //       this.media('http://i.imgur.com/Act0Q.gif');
  //   }

  // Render an XML response
  response.type('text/xml');
  response.send(twiml.toString());
});
