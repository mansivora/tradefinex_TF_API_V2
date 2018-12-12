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

    router.route('/UserList/:id')
    .get(function(req,res){
        var _id = req.params.id;  
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfu_id", sql.Int, _id)    
            request.execute('Usermaster_Listall').then(function (recordset)   
                {  
                    res.json(recordset.recordset);  
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

    router.route('/UserAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfu_usern", sql.VarChar, req.body.tfu_usern)
                request.input("ptfu_passwd", sql.VarChar, req.body.tfu_passwd)
                request.input("ptfu_utype", sql.Int, req.body.tfu_utype)
                request.input("ptfu_hash", sql.VarChar, req.body.tfu_hash)
                request.input("ptfu_xdc_walletID", sql.Text, req.body.tfu_xdc_walletID)
                request.input("ptfu_xdc_balance", sql.VarChar, req.body.tfu_xdc_balance)    
                request.input("ptfu_bank_acc_number", sql.VarChar, req.body.tfu_bank_acc_number)
                request.input("ptfu_bank_acc_name", sql.Text, req.body.tfu_bank_acc_name)  
                request.input("ptfu_bank_address", sql.Text, req.body.tfu_bank_address)  
                request.input("ptfu_bank_country", sql.Int, req.body.tfu_bank_country)  
                request.input("ptfu_bank_city", sql.VarChar, req.body.tfu_bank_city)  
                request.input("ptfu_domain_name", sql.VarChar, req.body.tfu_domain_name)  
                request.input("ptfu_back_acc_holder", sql.VarChar, req.body.tfu_back_acc_holder)  
                request.input("ptfu_bank_ifsc", sql.VarChar, req.body.tfu_bank_ifsc)
                request.input("ptfu_bank_swift", sql.VarChar, req.body.tfu_bank_swift)  
                request.input("ptfu_bank_bic", sql.VarChar, req.body.tfu_bank_bic)  
                request.input("ptfu_linkedin", sql.Text, req.body.tfu_linkedin) 
                request.input("ptfu_designation", sql.VarChar, req.body.tfu_designation)  
                request.input("ptfu_domain_type", sql.VarChar, req.body.tfu_domain_type)  
                request.input("ptfu_created", sql.Date, new Date(req.body.tfu_created))
                request.input("ptfu_logged", sql.Date, new Date(req.body.tfu_logged))
                request.input("ptfu_current_logged", sql.Int, req.body.tfu_current_logged)  
                request.input("ptfu_active", sql.Int, req.body.tfu_active)
                request.input("ptfu_membership_status", sql.Int, req.body.tfu_membership_status)
                request.input("ptfu_admin_blocked", sql.Int, req.body.tfu_admin_blocked)
                request.execute("Usermaster_Add").then(function () {  
                    transaction.commit().then(function (err, recordSet) {
                        conn.close();  
                        //res.json(recordSet.recordset);
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
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
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
    
    router.route('/UserUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfu_id", sql.Int, _id) 
                request.input("ptfu_usern", sql.VarChar, req.body.tfu_usern)
                request.input("ptfu_passwd", sql.VarChar, req.body.tfu_passwd)
                request.input("ptfu_utype", sql.Int, req.body.tfu_utype)
                request.input("ptfu_hash", sql.VarChar, req.body.tfu_hash)
                request.input("ptfu_xdc_walletID", sql.Text, req.body.tfu_xdc_walletID)
                request.input("ptfu_xdc_balance", sql.VarChar, req.body.tfu_xdc_balance)    
                request.input("ptfu_bank_acc_number", sql.VarChar, req.body.tfu_bank_acc_number)
                request.input("ptfu_bank_acc_name", sql.Text, req.body.tfu_bank_acc_name)  
                request.input("ptfu_bank_address", sql.Text, req.body.tfu_bank_address)  
                request.input("ptfu_bank_country", sql.Int, req.body.tfu_bank_country)  
                request.input("ptfu_bank_city", sql.VarChar, req.body.tfu_bank_city)  
                request.input("ptfu_domain_name", sql.VarChar, req.body.tfu_domain_name)  
                request.input("ptfu_back_acc_holder", sql.VarChar, req.body.tfu_back_acc_holder)  
                request.input("ptfu_bank_ifsc", sql.VarChar, req.body.tfu_bank_ifsc)
                request.input("ptfu_bank_swift", sql.VarChar, req.body.tfu_bank_swift)  
                request.input("ptfu_bank_bic", sql.VarChar, req.body.tfu_bank_bic)  
                request.input("ptfu_linkedin", sql.Text, req.body.tfu_linkedin) 
                request.input("ptfu_designation", sql.VarChar, req.body.tfu_designation)  
                request.input("ptfu_domain_type", sql.VarChar, req.body.tfu_domain_type)  
                request.input("ptfu_created", sql.Date, new Date(req.body.tfu_created))
                request.input("ptfu_logged", sql.Date, new Date(req.body.tfu_logged))
                request.input("ptfu_current_logged", sql.Int, req.body.tfu_current_logged)  
                request.input("ptfu_active", sql.Int, req.body.tfu_active)
                request.input("ptfu_membership_status", sql.Int, req.body.tfu_membership_status)
                request.input("ptfu_admin_blocked", sql.Int, req.body.tfu_admin_blocked)
                request.execute("UserMaster_Update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        //res.status(200).send(req.body);  
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
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
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
    router.route('/ProductList/:id')
    .get(function(req,res){
        var _id = req.params.id;  
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfup_id", sql.Int, _id)    
            request.execute('UserProducts_ListAll').then(function (recordset)   
                {  
                    res.json(recordset.recordset);  
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

    router.route('/ProductAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfup_name", sql.Text, req.body.tfup_name)  
                request.input("ptfup_imagename", sql.VarChar, req.body.tfup_imagename)
                request.input("ptfup_description", sql.Text, req.body.tfup_description)
                request.input("ptfup_category_ref", sql.Int, req.body.tfup_category_ref)  
                request.input("ptfup_user_ref", sql.Int, req.body.tfup_user_ref)  
                request.input("ptfup_user_type_ref", sql.Int, req.body.tfup_user_type_ref)  
                request.input("ptfup_admin_approval", sql.Int, req.body.tfup_admin_approval) 
                request.input("ptfup_rejection_reason", sql.VarChar, req.body.tfup_rejection_reason)
                request.input("ptfup_created", sql.DateTime, new Date(req.body.tfup_created))
                request.input("ptfup_updated", sql.DateTime, new Date(req.body.tfup_updated)) 
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("UserProducts_Add").then(function () {  
                    transaction.commit().then(function (err, recordSet) {
                        conn.close();  
                        //res.json(recordSet.recordset);
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
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
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

    router.route('/ProductUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfup_id", sql.Int, _id) 
                request.input("ptfup_name", sql.Text, req.body.tfup_name)  
                request.input("ptfup_imagename", sql.VarChar, req.body.tfup_imagename)
                request.input("ptfup_description", sql.Text, req.body.tfup_description)
                request.input("ptfup_category_ref", sql.Int, req.body.tfup_category_ref)  
                request.input("ptfup_user_ref", sql.Int, req.body.tfup_user_ref)  
                request.input("ptfup_user_type_ref", sql.Int, req.body.tfup_user_type_ref)  
                request.input("ptfup_admin_approval", sql.Int, req.body.tfup_admin_approval) 
                request.input("ptfup_rejection_reason", sql.VarChar, req.body.tfup_rejection_reason)
                request.input("ptfup_created", sql.DateTime, new Date(req.body.tfup_created))
                request.input("ptfup_updated", sql.DateTime, new Date(req.body.tfup_updated)) 
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("UserProducts_Update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        //res.status(200).send(req.body);  
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
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
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

    router.route('/AdminList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfa_id", sql.Int, _id)    
            request.execute('AdminUserMaster_ListAll').then(function (recordset)   
                {  
                    res.json(recordset.recordset);  
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

    router.route('/AdminAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfa_usern", sql.VarChar, req.body.tfa_usern)
                request.input("ptfa_passwd", sql.VarChar, req.body.tfa_passwd)
                request.input("ptfa_pic", sql.VarChar, req.body.tfa_pic)
                request.input("ptfa_utype", sql.Int, req.body.tfa_utype)
                request.input("ptfa_fname", sql.VarChar, req.body.tfa_fname)
                request.input("ptfa_lname", sql.VarChar, req.body.tfa_lname)
                request.input("ptfa_email", sql.VarChar, req.body.tfa_email)
                request.input("ptfa_created", sql.DateTime,new Date(req.body.tfa_created))
                request.input("ptfa_active", sql.Int, req.body.tfa_active)
                request.execute("AdminUserMaster_Add").then(function () {  
                    transaction.commit().then(function (err, recordSet) {
                        conn.close();  
                        //res.json(recordSet.recordset);
                        res.status(200).json( {
                            success: true,
                            message: 'successful'
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
    
    router.route('/AdminUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfa_id", sql.Int, _id);
                request.input("ptfa_usern", sql.VarChar, req.body.tfa_usern);
                request.input("ptfa_passwd", sql.VarChar, req.body.tfa_passwd);
                request.input("ptfa_pic", sql.VarChar, req.body.tfa_pic);
                request.input("ptfa_utype", sql.Int, req.body.tfa_utype);
                request.input("ptfa_fname", sql.VarChar, req.body.tfa_fname);
                request.input("ptfa_lname", sql.VarChar, req.body.tfa_lname);
                request.input("ptfa_email", sql.VarChar, req.body.tfa_email);
                request.input("ptfa_created", sql.DateTime,new Date(req.body.tfa_created));
                request.input("ptfa_active", sql.Int, req.body.tfa_active);
                request.execute("AdminUserMaster_Update").then(function () {  
                    transaction.commit().then(function (recordSet) {  
                        conn.close();  
                        //res.status(200).send(req.body);  
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

    router.route('/RatingList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfur_id", sql.Int, _id);
            request.execute('UserRating_ListAll').then(function (recordset)   
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

    router.route('/RatingAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfur_project_ref", sql.Int, req.body.tfur_project_ref)  
                request.input("ptfur_rating_value", sql.VarChar, req.body.tfur_rating_value)
                request.input("ptfur_rating_user_from", sql.Int, req.body.tfur_rating_user_from)  
                request.input("ptfur_rating_user_type_from", sql.Int, req.body.tfur_rating_user_type_from)  
                request.input("ptfur_rating_user_to", sql.Int, req.body.tfur_rating_user_to)  
                request.input("ptfur_rating_user_type_to", sql.Int, req.body.tfur_rating_user_type_to) 
                request.input("ptfur_created", sql.DateTime, new Date(req.body.tfur_created))
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("UserRating_Add").then(function () {  
                    transaction.commit().then(function (err, recordSet) {
                        conn.close();  
                        //res.json(recordSet.recordset);
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
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
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

    router.route('/SavedProjectList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfusp_id", sql.Int, _id);
            request.execute('UserSavedProject_ListAll').then(function (recordset)   
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

    router.route('/SavedProjectAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfusp_user_ref", sql.Int, req.body.tfusp_user_ref)  
                request.input("ptfusp_user_type", sql.Int, req.body.tfusp_user_type)  
                request.input("ptfusp_project_ref", sql.Int, req.body.tfusp_project_ref)  
                request.input("ptfusp_row_deleted", sql.Int, req.body.tfusp_row_deleted) 
                request.input("ptfusp_created", sql.DateTime, new Date(req.body.tfusp_created))
                request.execute("UserSavedProject_Add").then(function () {  
                    transaction.commit().then(function (err, recordSet) {
                        conn.close();  
                        //res.json(recordSet.recordset);
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
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
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

    router.route('/ServicesList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfus_id", sql.Int, _id);
            request.execute('UserServices_ListAll').then(function (recordset)   
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

    router.route('/ServicesAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfus_id", sql.Int, req.body.tfus_id)  
                request.input("ptfus_name", sql.Text, req.body.tfus_name)
                request.input("ptfus_description", sql.Text, req.body.tfus_description)  
                request.input("ptfus_category_ref", sql.Int, req.body.tfus_category_ref)  
                request.input("ptfus_user_ref", sql.Int, req.body.tfus_user_ref)  
                request.input("ptfus_user_type_ref", sql.Int, req.body.tfus_user_type_ref) 
                request.input("ptfus_admin_approval", sql.Int, req.body.tfus_admin_approval) 
                request.input("ptfus_rejection_reason", sql.Text, req.body.tfus_rejection_reason)
                request.input("ptfus_created", sql.DateTime, new Date(req.body.tfus_created))
                request.input("ptfus_updated", sql.DateTime, new Date(req.body.tfus_updated))
                request.input("prow_deleted", sql.Int, req.body.row_deleted)
                request.execute("UserServices_Add").then(function () {  
                    transaction.commit().then(function (err, recordSet) {
                        conn.close();  
                        //res.json(recordSet.recordset);
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
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
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

    router.route('/ServicesUpdate/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfus_id", sql.Int, _id);
                request.input("ptfus_name", sql.Text, req.body.ptfus_name);
                request.input("ptfus_description", sql.Text, req.body.ptfus_description);
                request.input("ptfus_category_ref", sql.Int, req.body.ptfus_category_ref);
                request.input("ptfus_user_ref", sql.Int, req.body.ptfus_user_ref);
                request.input("ptfus_user_type_ref", sql.Int, req.body.ptfus_user_type_ref);
                request.input("ptfus_admin_approval", sql.Int, req.body.ptfus_admin_approval);
                request.input("ptfus_rejection_reason", sql.Text, req.body.ptfus_rejection_reason);
                request.input("prow_deleted", sql.Int, req.body.prow_deleted);
                request.execute("UserServices_Update").then(function () {  
                    transaction.commit().then(function (err, recordSet) {
                        conn.close();  
                        //res.json(recordSet.recordset);
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
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
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
