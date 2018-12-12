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

router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization'];
    commonFun.tokenGen(token,req, res, next);
});

var routes = function(){
    router.route('/ProjectTypeList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("pID", sql.Int, _id)    
            request.execute('ProjectTypeMaster_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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

    router.route('/ProjectTypeAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("pcName", sql.VarChar, req.body.cName)  
                request.input("pimagePath", sql.VarChar, req.body.imagePath )  
                request.input("pstartDate", sql.DateTime, new Date(req.body.startDate))
                request.input("pupdateDate", sql.DateTime, new Date(req.body.updateDate)) 
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("ProjectTypeMaster_Add").then(function () {  
                   
                    transaction.commit().then(function (err, recordset) {
                        //res.json(recordSet.recordset);
                       res.status(200).json( {
                        success: true,
                        message: 'successful'
                    });
                    conn.close();  
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);      
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });  
                });  
            }).catch(function (err) {  
                conn.close();     
                commonFun.errorLog(err);  
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
            conn.close();     
            commonFun.errorLog(err);   
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            }); 
           
        });  
    });  
    
    router.route('/ProjectTypeUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("pID", sql.Int, _id)    
                request.input("pcName", sql.VarChar, req.body.cName)  
                request.input("pimagePath", sql.VarChar, req.body.imagePath )  
                request.input("pstartDate", sql.DateTime, new Date(req.body.startDate))
                request.input("pupdateDate", sql.DateTime, new Date(req.body.updateDate)) 
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("ProjectTypeMaster_Update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        res.status(200).json( {
                            success: true,
                            message: 'successful'
                        });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });   
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });   
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(500).json({
                    success: false,
                    message: '500 - Server error.'
                });  
            });  
    });

    router.route('/CountryList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfc_id", sql.Int, _id)    
            request.execute('Countrymaster_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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

    router.route('/CountryAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfc_code", sql.VarChar, req.body.ptfc_code);
                request.input("ptfc_name", sql.VarChar, req.body.ptfc_name);
                request.input("ptfc_phonecode", sql.VarChar, req.body.ptfc_phonecode);
                request.execute("CountryMaster_Add").then(function () {  
                   
                    transaction.commit().then(function (err, recordset) {
                        //res.json(recordSet.recordset);
                       res.status(200).json( {
                        success: true,
                        message: 'successful'
                    });
                    conn.close();  
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);      
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });  
                });  
            }).catch(function (err) {  
                conn.close();     
                commonFun.errorLog(err);  
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
            conn.close();     
            commonFun.errorLog(err);   
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            }); 
           
        });  
    });

    router.route('/CountryUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfc_id", sql.Int, _id);
                request.input("ptfc_code", sql.VarChar, req.body.ptfc_code);
                request.input("ptfc_name", sql.VarChar, req.body.ptfc_name);
                request.input("ptfc_phonecode", sql.VarChar, req.body.ptfc_phonecode);
                request.input("prow_deleted", sql.Int, req.body.prow_deleted);
                request.execute("CountryMaster_Update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        res.status(200).json( {
                            success: true,
                            message: 'successful'
                        });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });   
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });   
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(500).json({
                    success: false,
                    message: '500 - Server error.'
                });  
            });  
    });

    router.route('/CurrencyList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfcu_id", sql.Int, _id)    
            request.execute('CurrencyMaster_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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

    router.route('/StateList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfs_id", sql.Int, _id)    
            request.execute('StateMaster_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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

    router.route('/StateAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfs_name", sql.VarChar, req.body.ptfs_name);
                request.input("ptfs_country_ref", sql.Int, req.body.ptfs_country_ref);
                request.input("prow_deleted", sql.Int, req.body.prow_deleted);
                request.execute("StateMaster_Add").then(function () {  
                   
                    transaction.commit().then(function (err, recordset) {
                        //res.json(recordSet.recordset);
                       res.status(200).json( {
                        success: true,
                        message: 'successful'
                    });
                    conn.close();  
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);      
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });  
                });  
            }).catch(function (err) {  
                conn.close();     
                commonFun.errorLog(err);  
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
            conn.close();     
            commonFun.errorLog(err);   
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            }); 
           
        });  
    });

    router.route('/StateUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfs_id", sql.Int, _id);
                request.input("ptfs_name", sql.VarChar, req.body.ptfs_name);
                request.input("ptfs_country_ref", sql.Int, req.body.ptfs_country_ref);
                request.input("prow_deleted", sql.Int, req.body.prow_deleted);
                request.execute("StateMaster_Update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        res.status(200).json( {
                            success: true,
                            message: 'successful'
                        });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });   
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });   
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(500).json({
                    success: false,
                    message: '500 - Server error.'
                });  
            });  
    });


    router.route('/UnitList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfun_id", sql.Int, _id)    
            request.execute('UnitMaster_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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


    router.route('/UnitAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfun_name", sql.VarChar, req.body.ptfun_name);
                request.execute("UnitMaster_Add").then(function () {  
                   
                    transaction.commit().then(function (err, recordset) {
                        //res.json(recordSet.recordset);
                       res.status(200).json( {
                        success: true,
                        message: 'successful'
                    });
                    conn.close();  
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);      
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });  
                });  
            }).catch(function (err) {  
                conn.close();     
                commonFun.errorLog(err);  
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
            conn.close();     
            commonFun.errorLog(err);   
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            }); 
           
        });  
    });

    router.route('/UnitUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfun_id", sql.Int, _id);
                request.input("ptfun_name", sql.VarChar, req.body.ptfun_name);
                request.execute("UnitMaster_Update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        res.status(200).json( {
                            success: true,
                            message: 'successful'
                        });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });   
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });   
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(500).json({
                    success: false,
                    message: '500 - Server error.'
                });  
            });  
    });

    router.route('/SubscriptionList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfs_id", sql.Int, _id);
            request.execute('Subscription_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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

    router.route('/SubscriptionAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfs_email", sql.VarChar, req.body.tfs_email)  
                request.input("ptfs_created", sql.DateTime, new Date(req.body.tfs_created))
                request.input("ptfs_active", sql.Int, req.body.tfs_active)
                request.execute("Subscription_Add").then(function () {  
                   
                    transaction.commit().then(function (err, recordset) {
                        //res.json(recordSet.recordset);
                       res.status(200).json( {
                        success: true,
                        message: 'successful'
                    });
                    conn.close();  
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);      
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });  
                });  
            }).catch(function (err) {  
                conn.close();     
                commonFun.errorLog(err);  
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
            conn.close();     
            commonFun.errorLog(err);   
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            }); 
           
        });  
    });

    router.route('/NotificationList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfn_id", sql.Int, _id)    
            request.execute('NotificationMaster_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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

    router.route('/NotificationAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("pnotify_type", sql.VarChar, req.body.notify_type) 
                request.input("pnotify_id", sql.Int, req.body.notify_id)
                request.input("pnotify_for_user", sql.Int, req.body.notify_for_user)
                request.input("pnotify_for_user_type", sql.Int, req.body.notify_for_user_type)
                request.input("pnotify_for_project", sql.Int, req.body.notify_for_project)
                request.input("pnotify_for_proposal", sql.Int, req.body.notify_for_proposal)
                request.input("pnotify_user_ref", sql.Int, req.body.notify_user_ref)
                request.input("pnotify_user_type_ref", sql.Int, req.body.notify_user_type_ref) 
                request.input("pnotify_text", sql.Text, req.body.notify_text) 
                request.input("pnotify_time", sql.DateTime, new Date(req.body.notify_time))
                request.input("pnotify_read", sql.Int, req.body.notify_read)
                request.input("ptfn_created", sql.DateTime, new Date(req.body.tfn_created))
                request.execute("NotificationMaster_Add").then(function () {  
                   
                    transaction.commit().then(function (err, recordset) {
                        //res.json(recordSet.recordset);
                       res.status(200).json( {
                        success: true,
                        message: 'successful'
                    });
                    conn.close();  
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);      
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });  
                });  
            }).catch(function (err) {  
                conn.close();     
                commonFun.errorLog(err);  
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
            conn.close();     
            commonFun.errorLog(err);   
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            }); 
           
        });  
    });

    router.route('/IndustryList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("pID", sql.Int, _id)    
            request.execute('IndustryMaster_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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

    router.route('/IndustryAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("pcName", sql.VarChar, req.body.cName)  
                request.input("pimagePath", sql.VarChar, req.body.imagePath )  
                request.input("pcreateDate", sql.DateTime, new Date(req.body.createDate))
                request.input("pupdateDate", sql.DateTime, new Date(req.body.updateDate)) 
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("IndustryMaster_Add").then(function () {  
                   
                    transaction.commit().then(function (err, recordset) {
                        //res.json(recordSet.recordset);
                       res.status(200).json( {
                        success: true,
                        message: 'successful'
                    });
                    conn.close();  
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);      
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });  
                });  
            }).catch(function (err) {  
                conn.close();     
                commonFun.errorLog(err);  
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
            conn.close();     
            commonFun.errorLog(err);   
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            }); 
           
        });  
    });

    router.route('/IndustryUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("pID", sql.Int, _id)    
                request.input("pcName", sql.VarChar, req.body.cName)  
                request.input("pimagePath", sql.VarChar, req.body.imagePath)  
                request.input("pcreateDate", sql.DateTime, new Date(req.body.createDate))
                request.input("pupdateDate", sql.DateTime, new Date(req.body.updateDate)) 
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("IndustryMaster_update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        res.status(200).json( {
                            success: true,
                            message: 'successful'
                        });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });   
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });   
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(500).json({
                    success: false,
                    message: '500 - Server error.'
                });  
            });  
    });

    router.route('/SectorList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("pID", sql.Int, _id)    
            request.execute('SectorMaster_ListAll').then(function (recordset)   
                {  
                    res.status(200).json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();    
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
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

    router.route('/SectorAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("psectorName", sql.VarChar, req.body.sectorName)  
                request.input("psector_image", sql.VarChar, req.body.sector_image)
                request.input("pindustry_ref", sql.Int, req.body.industry_ref)  
                request.input("pstartDate", sql.DateTime, new Date(req.body.startDate))
                request.input("pupdateDate", sql.DateTime, new Date(req.body.updateDate)) 
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("SectorMaster_Add").then(function () {  
                   
                    transaction.commit().then(function (err, recordset) {
                        //res.json(recordSet.recordset);
                       res.status(200).json( {
                        success: true,
                        message: 'successful'
                    });
                    conn.close();  
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);      
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });  
                });  
            }).catch(function (err) {  
                conn.close();     
                commonFun.errorLog(err);  
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
            conn.close();     
            commonFun.errorLog(err);   
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            }); 
           
        });  
    });

    router.route('/SectorUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("pID", sql.Int, _id)    
                request.input("psectorName", sql.VarChar, req.body.sectorName)  
                request.input("psector_image", sql.VarChar, req.body.sector_image)
                request.input("pindustry_ref", sql.Int, req.body.industry_ref)   
                request.input("pstartDate", sql.DateTime, new Date(req.body.startDate))
                request.input("pupdateDate", sql.DateTime, new Date(req.body.updateDate)) 
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("SectorMaster_Update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        res.status(200).json( {
                            success: true,
                            message: 'successful'
                        });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });   
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });   
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(400).json( {
                    success: false,
                    message: '400 - Bad Request.'
                });  
            });  
        }).catch(function (err) {  
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
