var express = require('express');  
var router = express.Router();  
var sql = require("mssql");  
var conn = require("../connection/Connect")();
var commonFun = require("../Common/commonFun"); 
var logger = require('morgan');
var app = express();
var jwt = require('jsonwebtoken');
app.use(logger('dev'));
app.set('superSecret', "demo");

var routes = function(){
     
    router.route('/authenticate/')  
    .post(function (req, res) {
        
        var username = req.body.user;
        var password = req.body.password;
        var foundUser = {};
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("pAPIAuthKey", sql.VarChar, username)
            request.input("pInterfaceCode", sql.VarChar, password)     
            request.execute('APIMaster_Verify').then(function (recordset)   
                {  
                   var isUser = recordset.recordset; 
                   isUserFound = isUser[0].IsVerify;
                    //res.json(recordset.recordset);  
                    conn.close();                      if (isUser[0].IsVerify) {
                        var token = jwt.sign(foundUser, app.get('superSecret'), {
                            //expiresInMinutes: 1440 // expires in 24 hours
                            expiresIn : 60*60*24
                        });
                        //console.log(token);
                        res.json({
                            success: true,
                            token: token
                        });
                   
                } else {
                    res.status(403).json({
                        success: false,
                        message: '403 - Invalid API secret key.'
                    });
                }
                }) 
                .catch(function (err) { 
                    conn.close();  
                    commonFun.errorLog(err);
                    res.status(400).json( {
                        success: false,
                        message: '400 - Bad Request.'
                    });  
                    
                });  
        })
        .catch(function (err) { 
            conn.close();  
            commonFun.errorLog(err);
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            });
            
        });

        
    });
    return router;
};
module.exports=routes;
