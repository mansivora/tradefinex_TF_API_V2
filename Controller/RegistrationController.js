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
    router.route('/BeneficiaryList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfb_id", sql.Int, _id)    
            request.execute('Beneficiary_ListAll').then(function (recordset)   
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

    router.route('/BeneficiaryAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfb_fname", sql.VarChar, req.body.tfb_fname);
                request.input("ptfb_lname", sql.VarChar, req.body.tfb_lname);
                request.input("ptfb_email", sql.VarChar, req.body.tfb_email);
                request.input("ptfb_address", sql.Text, req.body.tfb_address);
                request.input("ptfb_contact", sql.VarChar, req.body.tfb_contact);
                request.input("ptfb_pic_file", sql.VarChar, req.body.tfb_pic_file);
                request.input("ptfb_financier_notification", sql.Int, req.body.tfb_financier_notification);
                request.input("ptfb_provider_notification", sql.Int, req.body.tfb_provider_notification);
                request.input("ptfb_project_post_visibility", sql.Int, req.body.tfb_project_post_visibility);
                request.input("ptfb_project_expiration_visibility", sql.Int, req.body.tfb_project_expiration_visibility);
                request.input("ptfb_financier_list", sql.Text, req.body.tfb_financier_list);
                request.input("ptfb_provider_list", sql.Text, req.body.tfb_provider_list);
                request.input("ptfb_user_ref", sql.Int, req.body.tfb_user_ref);
                request.execute("Beneficiary_Add").then(function () {  
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

    router.route('/BeneficiaryUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfb_id", sql.Int, _id);
                request.input("ptfb_fname", sql.VarChar, req.body.tfb_fname);
                request.input("ptfb_lname", sql.VarChar, req.body.tfb_lname);
                request.input("ptfb_email", sql.VarChar, req.body.tfb_email);
                request.input("ptfb_address", sql.Text, req.body.tfb_address);
                request.input("ptfb_contact", sql.VarChar, req.body.tfb_contact);
                request.input("ptfb_pic_file", sql.VarChar, req.body.tfb_pic_file);
                request.input("ptfb_financier_notification", sql.Int, req.body.tfb_financier_notification);
                request.input("ptfb_provider_notification", sql.Int, req.body.tfb_provider_notification);
                request.input("ptfb_project_post_visibility", sql.Int, req.body.tfb_project_post_visibility);
                request.input("ptfb_project_expiration_visibility", sql.Int, req.body.tfb_project_expiration_visibility);
                request.input("ptfb_financier_list", sql.Text, req.body.tfb_financier_list);
                request.input("ptfb_provider_list", sql.Text, req.body.tfb_provider_list);
                request.input("ptfb_user_ref", sql.Int, req.body.tfb_user_ref);
                request.execute("Beneficiary_Update").then(function () {  
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

    router.route('/CompanyList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfcom_id", sql.Int, _id)    
            request.execute('Company_ListAll').then(function (recordset)   
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

    router.route('/CompanyAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfcom_name", sql.VarChar, req.body.tfcom_name);
                request.input("ptfcom_regno", sql.VarChar, req.body.tfcom_regno);
                request.input("ptfcom_address", sql.Text, req.body.tfcom_address);
                request.input("ptfcom_business_overview", sql.Text, req.body.tfcom_business_overview);
                request.input("ptfcom_contact1_fname", sql.VarChar, req.body.tfcom_contact1_fname);
                request.input("ptfcom_contact1_lname", sql.VarChar, req.body.tfcom_contact1_lname);
                request.input("ptfcom_contact1_email", sql.VarChar, req.body.tfcom_contact1_email);
                request.input("ptfcom_contact1_number", sql.VarChar, req.body.tfcom_contact1_number);
                request.input("ptfcom_contact2_fname", sql.VarChar, req.body.tfcom_contact2_fname);
                request.input("ptfcom_contact2_lname", sql.VarChar, req.body.tfcom_contact2_lname);
                request.input("ptfcom_contact2_email", sql.VarChar, req.body.tfcom_contact2_email);
                request.input("ptfcom_contact2_number", sql.VarChar, req.body.tfcom_contact2_number);
                request.input("ptfcom_contact2_linkedin", sql.Text, req.body.tfcom_contact2_linkedin);
                request.input("ptfcom_contact2_designation", sql.VarChar, req.body.tfcom_contact2_designation);
                request.input("ptfcom_cat_ref", sql.Int, req.body.tfcom_cat_ref);
                request.input("ptfcom_sectors", sql.Text, req.body.tfcom_sectors);
                request.input("ptfcom_country_ref", sql.Int, req.body.tfcom_country_ref);
                request.input("ptfcom_web_url", sql.VarChar, req.body.tfcom_web_url);
                request.input("ptfcom_wikipedia_url", sql.Text, req.body.tfcom_wikipedia_url);
                request.input("ptfcom_legal_form", sql.VarChar, req.body.tfcom_legal_form);
                request.input("ptfcom_linkedin", sql.Text, req.body.tfcom_linkedin);
                request.input("ptfcom_incorporation_year", sql.VarChar, req.body.tfcom_incorporation_year);
                request.input("ptfcom_logo_file", sql.VarChar, req.body.tfcom_logo_file);
                request.input("ptfcom_created", sql.DateTime, new Date(req.body.tfcom_created));
                request.input("ptfcom_updated", sql.DateTime, new Date(req.body.tfcom_updated));
                request.input("ptfcom_user_ref", sql.Int, req.body.tfcom_user_ref);
                request.input("ptfcom_active", sql.Int, req.body.tfcom_active);
                request.input("prow_deleted", sql.Int, req.body.row_deleted);
                request.execute("Company_Add").then(function () {  
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

    router.route('/CompanyUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfcom_id", sql.Int, _id);
                request.input("ptfcom_name", sql.VarChar, req.body.tfcom_name);
                request.input("ptfcom_regno", sql.VarChar, req.body.tfcom_regno);
                request.input("ptfcom_address", sql.Text, req.body.tfcom_address);
                request.input("ptfcom_business_overview", sql.Text, req.body.tfcom_business_overview);
                request.input("ptfcom_contact1_fname", sql.VarChar, req.body.tfcom_contact1_fname);
                request.input("ptfcom_contact1_lname", sql.VarChar, req.body.tfcom_contact1_lname);
                request.input("ptfcom_contact1_email", sql.VarChar, req.body.tfcom_contact1_email);
                request.input("ptfcom_contact1_number", sql.VarChar, req.body.tfcom_contact1_number);
                request.input("ptfcom_contact2_fname", sql.VarChar, req.body.tfcom_contact2_fname);
                request.input("ptfcom_contact2_lname", sql.VarChar, req.body.tfcom_contact2_lname);
                request.input("ptfcom_contact2_email", sql.VarChar, req.body.tfcom_contact2_email);
                request.input("ptfcom_contact2_number", sql.VarChar, req.body.tfcom_contact2_number);
                request.input("ptfcom_contact2_linkedin", sql.Text, req.body.tfcom_contact2_linkedin);
                request.input("ptfcom_contact2_designation", sql.VarChar, req.body.tfcom_contact2_designation);
                request.input("ptfcom_cat_ref", sql.Int, req.body.tfcom_cat_ref);
                request.input("ptfcom_sectors", sql.Text, req.body.tfcom_sectors);
                request.input("ptfcom_country_ref", sql.Int, req.body.tfcom_country_ref);
                request.input("ptfcom_web_url", sql.VarChar, req.body.tfcom_web_url);
                request.input("ptfcom_wikipedia_url", sql.Text, req.body.tfcom_wikipedia_url);
                request.input("ptfcom_legal_form", sql.VarChar, req.body.tfcom_legal_form);
                request.input("ptfcom_linkedin", sql.Text, req.body.tfcom_linkedin);
                request.input("ptfcom_incorporation_year", sql.VarChar, req.body.tfcom_incorporation_year);
                request.input("ptfcom_logo_file", sql.VarChar, req.body.tfcom_logo_file);
                request.input("ptfcom_created", sql.DateTime, new Date(req.body.tfcom_created));
                request.input("ptfcom_updated", sql.DateTime, new Date(req.body.tfcom_updated));
                request.input("ptfcom_user_ref", sql.Int, req.body.tfcom_user_ref);
                request.input("ptfcom_active", sql.Int, req.body.tfcom_active);
                request.input("prow_deleted", sql.Int, req.body.row_deleted);
                request.execute("Company_Update").then(function () {  
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

    router.route('/FinancierList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptff_id", sql.Int, _id)    
            request.execute('Financier_ListAll').then(function (recordset)   
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

    router.route('/FinancierAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptff_fname", sql.VarChar, req.body.tff_fname);
                request.input("ptff_lname", sql.VarChar, req.body.tff_lname);
                request.input("ptff_email", sql.VarChar, req.body.tff_email);
                request.input("ptff_address", sql.Text, req.body.tff_address);
                request.input("ptff_contact", sql.VarChar, req.body.tff_contact);
                request.input("ptff_pic_file", sql.VarChar, req.body.tff_pic_file);
                request.input("ptff_benif_notification", sql.Int, req.body.tff_benif_notification);
                request.input("ptff_posted_project_visibility", sql.Int, req.body.tff_posted_project_visibility);
                request.input("ptff_public_visibility", sql.TinyInt, req.body.tff_public_visibility);
                request.input("ptff_posted_project_list", sql.Text, req.body.tff_posted_project_list);
                request.input("ptff_user_ref", sql.Int, req.body.tff_user_ref);
                request.execute("Financier_Add").then(function () {  
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

    router.route('/FinancierUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptff_id", sql.Int, _id);
                request.input("ptff_fname", sql.VarChar, req.body.tff_fname);
                request.input("ptff_lname", sql.VarChar, req.body.tff_lname);
                request.input("ptff_email", sql.VarChar, req.body.tff_email);
                request.input("ptff_address", sql.Text, req.body.tff_address);
                request.input("ptff_contact", sql.VarChar, req.body.tff_contact);
                request.input("ptff_pic_file", sql.VarChar, req.body.tff_pic_file);
                request.input("ptff_benif_notification", sql.Int, req.body.tff_benif_notification);
                request.input("ptff_posted_project_visibility", sql.Int, req.body.tff_posted_project_visibility);
                request.input("ptff_public_visibility", sql.TinyInt, req.body.tff_public_visibility);
                request.input("ptff_posted_project_list", sql.Text, req.body.tff_posted_project_list);
                request.input("ptff_user_ref", sql.Int, req.body.tff_user_ref);
                request.execute("Financier_Update").then(function () {  
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

    router.route('/ServiceProviderList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfsp_id", sql.Int, _id)    
            request.execute('ServiceProviderMaster_ListAll').then(function (recordset)   
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

    router.route('/ServiceProviderAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfsp_fname", sql.VarChar, req.body.tfsp_fname);
                request.input("ptfsp_lname", sql.VarChar, req.body.tfsp_lname);
                request.input("ptfsp_email", sql.VarChar, req.body.tfsp_email);
                request.input("ptfsp_address", sql.Text, req.body.tfsp_address);
                request.input("ptfsp_contact", sql.VarChar, req.body.tfsp_contact);
                request.input("ptfsp_pic_file", sql.VarChar, req.body.tfsp_pic_file);
                request.input("ptfsp_benif_notification", sql.Int, req.body.tfsp_benif_notification);
                request.input("ptfsp_user_ref", sql.Int, req.body.tfsp_user_ref);
                request.input("ptfsp_posted_project_visibility", sql.Int, req.body.tfsp_posted_project_visibility);
                request.input("ptfsp_public_visibility", sql.TinyInt, req.body.tfsp_public_visibility);
                request.input("ptfsp_posted_project_list", sql.Text, req.body.tfsp_posted_project_list);
                request.execute("ServiceProviderMaster_Add").then(function () {  
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

    router.route('/ServiceProviderUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfsp_id", sql.Int, _id);
                request.input("ptfsp_fname", sql.VarChar, req.body.tfsp_fname);
                request.input("ptfsp_lname", sql.VarChar, req.body.tfsp_lname);
                request.input("ptfsp_email", sql.VarChar, req.body.tfsp_email);
                request.input("ptfsp_address", sql.Text, req.body.tfsp_address);
                request.input("ptfsp_contact", sql.VarChar, req.body.tfsp_contact);
                request.input("ptfsp_pic_file", sql.VarChar, req.body.tfsp_pic_file);
                request.input("ptfsp_benif_notification", sql.Int, req.body.tfsp_benif_notification);
                request.input("ptfsp_user_ref", sql.Int, req.body.tfsp_user_ref);
                request.input("ptfsp_posted_project_visibility", sql.Int, req.body.tfsp_posted_project_visibility);
                request.input("ptfsp_public_visibility", sql.TinyInt, req.body.tfsp_public_visibility);
                request.input("ptfsp_posted_project_list", sql.Text, req.body.tfsp_posted_project_list);
                request.execute("ServiceProviderMaster_Update").then(function () {  
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

    router.route('/MembershipList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("pid", sql.Int, _id); 
            request.execute('Membership_ListAll').then(function (recordset)   
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

    router.route('/MembershipAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfu_user_ref", sql.Int, req.body.tfu_user_ref);
                request.input("pamount", sql.Int, req.body.amount);
                request.input("pstatus", sql.Int, req.body.status);
                request.execute("Membership_Add").then(function () {  
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

    router.route('/MembershipUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("pid", sql.Int, _id);
                request.input("ptfu_user_ref", sql.Int, req.body.tfu_user_ref);
                request.input("pamount", sql.Int, req.body.amount);
                request.input("pstatus", sql.Int, req.body.status);
                request.execute("Membership_Update").then(function () {  
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


    router.route('/ContractSupplierList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfss_id", sql.Int, _id);
            request.execute('SubContractSupplier_ListAll').then(function (recordset)   
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



    router.route('/ContractSupplierAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfss_user_ref", sql.Int, req.body.tfss_user_ref);
                request.input("ptfss_contract_issued_by_user_ref", sql.Int, req.body.tfss_contract_issued_by_user_ref);
                request.input("ptfss_contract_issued_by_user_type_ref", sql.Int, req.body.tfss_contract_issued_by_user_type_ref);
                request.input("ptfss_contract_amount", sql.Decimal, req.body.tfss_contract_amount);
                request.input("ptfss_proposal_ref", sql.Int, req.body.tfss_proposal_ref);
                request.input("ptfss_contract_status", sql.Int, req.body.tfss_contract_status);
                request.input("ptfss_contract_deadline", sql.DateTime, new Date(req.body.tfss_contract_deadline));
                request.input("ptfss_added", sql.DateTime, new Date(req.body.tfss_added));
                request.input("pprow_deleted", sql.Int, req.body.prow_deleted);
                request.execute("SubContractSupplier_Add").then(function () {  
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
    
    router.route('/SupplierReasonList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfssrr_id", sql.Int, _id);
            request.execute('SupplierShipmentRejectionReason_ListAll').then(function (recordset)   
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

    router.route('/SupplierReasonAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfssrr_shipment_number", sql.VarChar, req.body.tfssrr_shipment_number);
                request.input("ptfssrr_shipment_details", sql.Text, req.body.tfssrr_shipment_details);
                request.input("ptfssrr_shipment_date", sql.DateTime,new Date(req.body.tfssrr_shipment_date));
                request.input("ptfssrr_rejection_msg", sql.Text, req.body.tfssrr_rejection_msg);
                request.input("ptfssrr_proposal_ref", sql.Int, req.body.tfssrr_proposal_ref);
                request.input("ptfssrr_project_ref", sql.Int, req.body.tfssrr_project_ref);
                request.input("ptfssrr_user_ref", sql.Int, req.body.tfssrr_user_ref);
                request.input("ptfssrr_contractor_mode", sql.TinyInt, req.body.tfssrr_contractor_mode);
                request.input("ptfssrr_added", sql.DateTime, new Date(req.body.tfssrr_added));
                request.input("ptfssrr_row_deleted", sql.Int, req.body.tfssrr_row_deleted);
                request.execute("SupplierShipmentRejectionReason_Add").then(function () {  
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

    return router;

};
module.exports=routes;
