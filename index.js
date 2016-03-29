//set up on heroku 
//to do this on twilio, set up heroku endpoint under messaging


// node-twilio docs: http://twilio.github.io/twilio-node/
// TwiML xml response format docs: https://www.twilio.com/docs/api/twiml 

// npm install twilio
var twilio = require('twilio');

// npm install express
// setup express app
var express = require('express');
var app = express();

//setting up which port you listen on, here it's local but eventually do this with heroku
app.set('port', process.env.PORT || 3000); //look for an environment variable called port, set 3000 default
var http = require('http') //http built in
var server = http.Server(app); //make a server 
server.listen(app.get('port')); //set up the server to listen to the port that your app is running on

//test to make sure routes are working
app.get('/', function(req, res) {
  res.send('ok'); //display content - return an index.html page, etc.
});


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
  
  //here you determine what the content of your response will be
  if (msg == 'i feel good') {
    twiml.message('I am glad to hear that.'); //twiml.message is how you create a response 
  } else if (msg == 'i feel bad') {
    twiml.message('I am sorry to hear that.');
  } else {
    twiml.message('Say what?');
  }

  //then you send a response
  //encode the response as xml, then convert to a string, then send it back to the res object
  response.type('text/xml');
  response.send(twiml.toString());
});


