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
    router.route('/InvitesList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfpi_id", sql.Int, _id)    
            request.execute('ProjectInvites_ListAll').then(function (recordset)   
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

    router.route('/InvitesAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfpi_project_ref", sql.Int, req.body.tfpi_project_ref);
                request.input("ptfpi_user_ref", sql.Int, req.body.tfpi_user_ref);
                request.input("ptfpi_user_type", sql.Int, req.body.tfpi_user_type);
                request.input("ptfpi_invite", sql.Int, req.body.tfpi_invite);
                request.input("ptfpi_accept", sql.Int, req.body.tfpi_accept);
                request.input("ptfpi_read", sql.Int, req.body.tfpi_read);
                request.input("ptfpi_created", sql.DateTime, new Date(req.body.tfpi_created));
                request.input("prow_deleted", sql.Int, req.body.row_deleted);
                request.execute("ProjectInvites_Add").then(function () {  
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

    router.route('/InvitesUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfpi_id", sql.Int, _id);
                request.input("ptfpi_project_ref", sql.Int, req.body.tfpi_project_ref);
                request.input("ptfpi_user_ref", sql.Int, req.body.tfpi_user_ref);
                request.input("ptfpi_user_type", sql.Int, req.body.tfpi_user_type);
                request.input("ptfpi_invite", sql.Int, req.body.tfpi_invite);
                request.input("ptfpi_accept", sql.Int, req.body.tfpi_accept);
                request.input("ptfpi_read", sql.Int, req.body.tfpi_read);
                request.input("ptfpi_created", sql.DateTime, new Date(req.body.tfpi_created));
                request.input("prow_deleted", sql.Int, req.body.row_deleted);
                request.execute("ProjectInvites_Update").then(function () {  
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

    router.route('/MsgBoardList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptfpmb_id", sql.Int, _id)    
            request.execute('ProjectMessageBoard_ListAll').then(function (recordset)   
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

    router.route('/MsgBoardAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfpmb_message", sql.Text, req.body.tfpmb_message);
                request.input("ptfpmb_file", sql.VarChar, req.body.tfpmb_file);
                request.input("ptfpmb_project_ref", sql.Int, req.body.tfpmb_project_ref);
                request.input("ptfpmb_sender_ref", sql.Int, req.body.tfpmb_sender_ref);
                request.input("ptfpmb_sender_type_ref", sql.Int, req.body.tfpmb_sender_type_ref);
                request.input("ptfpmb_receiver_ref", sql.Int, req.body.tfpmb_receiver_ref);
                request.input("ptfpmb_receiver_type_ref", sql.Int, req.body.tfpmb_receiver_type_ref);
                request.input("ptfpmb_created", sql.DateTime, new Date(req.body.tfpmb_created));
                request.input("prow_deleted", sql.Int, req.body.row_deleted);
                request.input("ptfpmb_receiver_notification_read", sql.Int, req.body.tfpmb_receiver_notification_read);
                request.input("ptfpmb_receiver_message_read", sql.Int, req.body.tfpmb_receiver_message_read);
                request.execute("ProjectMessageBoard_Add").then(function () {  
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

    router.route('/MsgBoardUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptfpmb_id", sql.Int, _id);
                request.input("ptfpmb_message", sql.Text, req.body.tfpmb_message);
                request.input("ptfpmb_file", sql.VarChar, req.body.tfpmb_file);
                request.input("ptfpmb_project_ref", sql.Int, req.body.tfpmb_project_ref);
                request.input("ptfpmb_sender_ref", sql.Int, req.body.tfpmb_sender_ref);
                request.input("ptfpmb_sender_type_ref", sql.Int, req.body.tfpmb_sender_type_ref);
                request.input("ptfpmb_receiver_ref", sql.Int, req.body.tfpmb_receiver_ref);
                request.input("ptfpmb_receiver_type_ref", sql.Int, req.body.tfpmb_receiver_type_ref);
                request.input("ptfpmb_created", sql.DateTime, new Date(req.body.tfpmb_created));
                request.input("prow_deleted", sql.Int, req.body.row_deleted);
                request.input("ptfpmb_receiver_notification_read", sql.Int, req.body.tfpmb_receiver_notification_read);
                request.input("ptfpmb_receiver_message_read", sql.Int, req.body.tfpmb_receiver_message_read);
                request.execute("ProjectMessageBoard_Update").then(function () {  
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

    router.route('/PostsList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("pID", sql.Int, _id)    
            request.execute('ProjectPosts_ListAll').then(function (recordset)   
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

    router.route('/PostsAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptitle", sql.VarChar, req.body.title);
                request.input("pdescription", sql.Text, req.body.description);
                request.input("ppimage", sql.VarChar, req.body.pimage);
                request.input("pattachFiles", sql.VarChar, req.body.attachFiles);
                request.input("pmainCategoryId", sql.Int, req.body.mainCategoryId);
                request.input("pcontractID", sql.Int, req.body.contractID);
                request.input("prefnum", sql.VarChar, req.body.refnum);
                request.input("psectors", sql.Text, req.body.sectors);
                request.input("pstateID", sql.Int, req.body.stateID);
                request.input("pcountryID", sql.Int, req.body.countryID);
                request.input("pcurrency_ref", sql.Int, req.body.currency_ref);
                request.input("pfixedBudget", sql.Decimal, req.body.fixedBudget);
                request.input("pfinalBudget", sql.Decimal, req.body.finalBudget);
                request.input("puserID", sql.Int, req.body.userID);
                request.input("puserType", sql.Int, req.body.userType);
                request.input("pcancelProject", sql.Int, req.body.cancelProject);
                request.input("pruningProject", sql.Int, req.body.runingProject);
                request.input("pfinishProject", sql.Int, req.body.finishProject);
                request.input("ppostDate", sql.DateTime,new Date(req.body.postDate));
                request.input("ppostdate_timestr", sql.VarChar, req.body.postdate_timestr);
                request.input("pcountry_name", sql.VarChar, req.body.country_name);
                request.input("pindustry_name", sql.VarChar, req.body.industry_name);
                request.input("pcompany_name", sql.VarChar, req.body.company_name);
                request.input("pcontract_name", sql.VarChar, req.body.contract_name);
                request.input("pclosingDate", sql.DateTime, new Date(req.body.closingDate));
                request.input("ppcompletedDate", sql.DateTime, new Date(req.body.pcompletedDate));
                request.input("pfcompletedDate", sql.DateTime, new Date(req.body.fcompletedDate));
                request.input("ppstartingDate", sql.DateTime, new Date(req.body.pstartingDate));
                request.input("pppaidDate", sql.DateTime, new Date(req.body.ppaidDate));
                request.input("ppbeneficiaryConfirmDate", sql.DateTime, new Date(req.body.pbeneficiaryConfirmDate));
                request.input("pfstartingDate", sql.DateTime, new Date(req.body.fstartingDate));
                request.input("pcompletedDate", sql.DateTime, new Date(req.body.completedDate));
                request.input("pupdatingDate", sql.DateTime, new Date(req.body.updatingDate));
                request.input("prequestStartDate", sql.DateTime, new Date(req.body.requestStartDate));
                request.input("prequestFinishDate", sql.DateTime, new Date(req.body.requestFinishDate));
                request.input("pfeatured", sql.Int, req.body.featured);
                request.input("pfinancing", sql.Int, req.body.financing);
                request.input("pfinancing_currency_ref", sql.Int, req.body.financing_currency_ref);
                request.input("pfinancing_amount", sql.Decimal, req.body.financing_amount);
                request.input("pfinancing_tenure_value", sql.Int, req.body.financing_tenure_value);
                request.input("pfinancing_tenure_ref", sql.Int, req.body.financing_tenure_ref);
                request.input("pfinance_xdc_msg", sql.VarChar, req.body.finance_xdc_msg);
                request.input("pfinance_xdc_txnid", sql.Text, req.body.finance_xdc_txnid);
                request.input("pisDraft", sql.Int, req.body.isDraft);
                request.input("pspecial_remarks", sql.Text, req.body.special_remarks);
                request.input("pagreement_document", sql.VarChar, req.body.agreement_document);
                request.input("pfeedback", sql.Int, req.body.feedback);
                request.input("pvisibility", sql.Int, req.body.visibility);
                request.input("padmin_approval", sql.Int, req.body.admin_approval);
                request.input("prejection_reason", sql.Text, req.body.rejection_reason);
                request.input("pview_counts", sql.VarChar, req.body.view_counts);
                request.input("pawarded_provider", sql.Int, req.body.awarded_provider);
                request.input("pawarded_financier", sql.Int, req.body.awarded_financier);
                request.input("pprovider_completion_request", sql.Int, req.body.provider_completion_request);
                request.input("pfinancier_completion_request", sql.Int, req.body.financier_completion_request);
                request.input("pawardStatus", sql.VarChar, req.body.awardStatus);
                request.input("prow_deleted", sql.Int, req.body.row_deleted);
                request.execute("ProjectPosts_Add").then(function () {  
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

    router.route('/PostsUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("pID", sql.Int, _id);
                request.input("ptitle", sql.VarChar, req.body.title);
                request.input("pdescription", sql.Text, req.body.description);
                request.input("ppimage", sql.VarChar, req.body.pimage);
                request.input("pattachFiles", sql.VarChar, req.body.attachFiles);
                request.input("pmainCategoryId", sql.Int, req.body.mainCategoryId);
                request.input("pcontractID", sql.Int, req.body.contractID);
                request.input("prefnum", sql.VarChar, req.body.refnum);
                request.input("psectors", sql.Text, req.body.sectors);
                request.input("pstateID", sql.Int, req.body.stateID);
                request.input("pcountryID", sql.Int, req.body.countryID);
                request.input("pcurrency_ref", sql.Int, req.body.currency_ref);
                request.input("pfixedBudget", sql.Decimal, req.body.fixedBudget);
                request.input("pfinalBudget", sql.Decimal, req.body.finalBudget);
                request.input("puserID", sql.Int, req.body.userID);
                request.input("puserType", sql.Int, req.body.userType);
                request.input("pcancelProject", sql.Int, req.body.cancelProject);
                request.input("pruningProject", sql.Int, req.body.runingProject);
                request.input("pfinishProject", sql.Int, req.body.finishProject);
                request.input("ppostDate", sql.DateTime,new Date(req.body.postDate));
                request.input("ppostdate_timestr", sql.VarChar, req.body.postdate_timestr);
                request.input("pcountry_name", sql.VarChar, req.body.country_name);
                request.input("pindustry_name", sql.VarChar, req.body.industry_name);
                request.input("pcompany_name", sql.VarChar, req.body.company_name);
                request.input("pcontract_name", sql.VarChar, req.body.contract_name);
                request.input("pclosingDate", sql.DateTime, new Date(req.body.closingDate));
                request.input("ppcompletedDate", sql.DateTime, new Date(req.body.pcompletedDate));
                request.input("pfcompletedDate", sql.DateTime, new Date(req.body.fcompletedDate));
                request.input("ppstartingDate", sql.DateTime, new Date(req.body.pstartingDate));
                request.input("pppaidDate", sql.DateTime, new Date(req.body.ppaidDate));
                request.input("ppbeneficiaryConfirmDate", sql.DateTime, new Date(req.body.pbeneficiaryConfirmDate));
                request.input("pfstartingDate", sql.DateTime, new Date(req.body.fstartingDate));
                request.input("pcompletedDate", sql.DateTime, new Date(req.body.completedDate));
                request.input("pupdatingDate", sql.DateTime, new Date(req.body.updatingDate));
                request.input("prequestStartDate", sql.DateTime, new Date(req.body.requestStartDate));
                request.input("prequestFinishDate", sql.DateTime, new Date(req.body.requestFinishDate));
                request.input("pfeatured", sql.Int, req.body.featured);
                request.input("pfinancing", sql.Int, req.body.financing);
                request.input("pfinancing_currency_ref", sql.Int, req.body.financing_currency_ref);
                request.input("pfinancing_amount", sql.Decimal, req.body.financing_amount);
                request.input("pfinancing_tenure_value", sql.Int, req.body.financing_tenure_value);
                request.input("pfinancing_tenure_ref", sql.Int, req.body.financing_tenure_ref);
                request.input("pfinance_xdc_msg", sql.VarChar, req.body.finance_xdc_msg);
                request.input("pfinance_xdc_txnid", sql.Text, req.body.finance_xdc_txnid);
                request.input("pisDraft", sql.Int, req.body.isDraft);
                request.input("pspecial_remarks", sql.Text, req.body.special_remarks);
                request.input("pagreement_document", sql.VarChar, req.body.agreement_document);
                request.input("pfeedback", sql.Int, req.body.feedback);
                request.input("pvisibility", sql.Int, req.body.visibility);
                request.input("padmin_approval", sql.Int, req.body.admin_approval);
                request.input("prejection_reason", sql.Text, req.body.rejection_reason);
                request.input("pview_counts", sql.VarChar, req.body.view_counts);
                request.input("pawarded_provider", sql.Int, req.body.awarded_provider);
                request.input("pawarded_financier", sql.Int, req.body.awarded_financier);
                request.input("pprovider_completion_request", sql.Int, req.body.provider_completion_request);
                request.input("pfinancier_completion_request", sql.Int, req.body.financier_completion_request);
                request.input("pawardStatus", sql.VarChar, req.body.awardStatus);
                request.input("prow_deleted", sql.Int, req.body.row_deleted);
                request.execute("ProjectPosts_Update").then(function () {  
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
    
    router.route('/PostFilesList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptppf_id", sql.Int, _id);
            request.execute('ProjectsPostFiles_ListAll').then(function (recordset)   
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

    router.route('/PostFilesAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptppf_filename", sql.VarChar, req.body.tppf_filename);
                request.input("ptppf_project_ref", sql.Int, req.body.tppf_project_ref);
                request.input("ptppf_file_index", sql.Int, req.body.tppf_file_index);
                request.input("ptppf_project_type", sql.Int, req.body.tppf_project_type);
                request.input("ptppf_created", sql.DateTime,new Date(req.body.tppf_created));
                request.input("ptppf_row_deleted", sql.Int, req.body.tppf_row_deleted);
                request.execute("ProjectsPostFiles_Add").then(function () {  
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

    router.route('/OTPAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfro_otp_val", sql.VarChar, req.body.tfro_otp_val);
                request.input("ptfro_uid", sql.VarChar, req.body.tfro_uid);
                request.input("ptfro_row_deleted", sql.Int, req.body.tfro_row_deleted);
                request.execute("RegisterOTP_Add").then(function () {  
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

    router.route('/FeedbackList/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("pfeedbackID", sql.Int, _id);
            request.execute('ProjectFeedback_ListAll').then(function (recordset)   
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

    router.route('/FeedbackAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("pprojectID", sql.Int, req.body.projectID);
                request.input("psenderID", sql.Int, req.body.senderID);
                request.input("preceiverID", sql.Int, req.body.receiverID);
                request.input("prating", sql.VarChar, req.body.rating);
                request.input("pquality", sql.VarChar, req.body.quality);
                request.input("pexpertise", sql.VarChar, req.body.expertise);
                request.input("pcost", sql.Decimal, req.body.cost);
                request.input("pschedule", sql.VarChar, req.body.schedule);
                request.input("presponse", sql.VarChar, req.body.response);
                request.input("pprofessional", sql.VarChar, req.body.professional);
                request.input("pcomments", sql.Text, req.body.comments);
                request.input("pstatus", sql.VarChar, req.body.status);
                request.input("psendDate", sql.DateTime,new Date(req.body.sendDate));
                request.execute("ProjectFeedback_Add").then(function () {  
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

    router.route('/GalleryAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptfpg_name", sql.VarChar, req.body.tfpg_name);
                request.input("ptfpg_created", sql.DateTime, new Date(req.body.tfpg_created));
                request.execute("ProjectGallery_Add").then(function () {  
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
