var express = require('express');  
var app = express();  
var port = process.env.port || 82;  
var apiurl = "/api/v1.0/";
var bodyParser = require('body-parser');  
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 


var mastersController = require('./Controller/MastersController')();  
var registrationController = require('./Controller/RegistrationController')(); 
var usersController = require('./Controller/UsersController')(); 
var projectController = require('./Controller/ProjectController')();   
var proposalController = require('./Controller/ProposalController')(); 
var authController = require('./Controller/AuthController')(); 

app.use(""+apiurl+"masters", mastersController)
app.use(""+apiurl+"registration", registrationController)
app.use(""+apiurl+"users", usersController)
app.use(""+apiurl+"project", projectController)
app.use(""+apiurl+"proposal", proposalController)
app.use(""+apiurl+"auth", authController)

app.listen(port, function () {  
    var datetime = new Date();  
    var message = "Server runnning on Port:- " + port + " Started at :- " + datetime;  
    console.log(message);  
}); 

