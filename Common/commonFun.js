var express = require('express');
var sql = require("mssql");  
var conn = require("../connection/Connect")();  
var logger = require('morgan');
var app = express();
var jwt = require('jsonwebtoken');
app.use(logger('dev'));
app.set('superSecret', "demo");
var moment = require('moment');
  
module.exports ={

    tokenGen:function(token, req, res, next){
        if (token) {
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        message: '1008 - Failed to authenticate.'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: '1009 - Failed to authenticate, token is not passing.'
            });
        }
    },

    errorLog: function(ErrString){
        var dateTime = new Date();
         var data ='\r\n************************** Start '+dateTime+' **************************\r\n\r\n'+
         ''+ErrString+''+
         '\r\n\r\n************************** End **************************\r\n\r\n'
         ;
     
         dateTime = moment(dateTime).format('DD-MM-YYYY');
         var filename = 'log/'+dateTime+'.txt';
         var fs = require('fs');
         fs.appendFile(filename,data,'utf8',(error)=>{
             //console.log(error);
         });     
    }
};