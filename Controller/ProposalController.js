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
    router.route('/ListAll/:id')
    .get(function(req,res){
        var _id = req.params.id;
        //res.header("Content-Type", "application/json");
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptpf_id", sql.Int, _id)    
            request.execute('ProposalFinancier_ListAll').then(function (recordset)   
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

    router.route('/Add/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptpf_price", sql.Decimal, req.body.tpf_price);
                request.input("ptpf_price_currency_ref", sql.Int, req.body.tpf_price_currency_ref);
                request.input("ptpf_finance_tenure_value", sql.Int, req.body.tpf_finance_tenure_value);
                request.input("ptpf_finance_tenure_ref", sql.Int, req.body.tpf_finance_tenure_ref);
                request.input("ptpf_tax_percent", sql.Decimal, req.body.tpf_tax_percent);
                request.input("ptpf_emi_amount", sql.Decimal, req.body.tpf_emi_amount);
                request.input("ptpf_late_fine_amount", sql.Decimal, req.body.tpf_late_fine_amount);
                request.input("ptpf_total_amount", sql.Int, req.body.tpf_total_amount);
                request.input("ptpf_validity_value", sql.Int, req.body.tpf_validity_value);
                request.input("ptpf_validity_ref", sql.Int, req.body.tpf_validity_ref);
                request.input("ptpf_validity_end_on", sql.DateTime,new Date(req.body.tpf_validity_end_on));
                request.input("ptpf_remarks", sql.Text, req.body.tpf_remarks);
                request.input("ptpf_file", sql.VarChar, req.body.tpf_file);
                request.input("ptpf_posted", sql.DateTime, new Date(req.body.tpf_posted));
                request.input("ptpf_project_ref", sql.Int, req.body.tpf_project_ref);
                request.input("ptpf_project_user_ref", sql.Int, req.body.tpf_project_user_ref);
                request.input("ptpf_user_ref", sql.Int, req.body.tpf_user_ref);
                request.input("ptpf_beneficiary_accept", sql.Int, req.body.tpf_beneficiary_accept);
                request.input("ptpf_beneficiary_accept_time", sql.DateTime, new Date(req.body.tpf_beneficiary_accept_time));
                request.input("ptpf_beneficiary_accept_read", sql.Int, req.body.tpf_beneficiary_accept_read);
                request.input("ptpf_beneficiary_read", sql.Int, req.body.tpf_beneficiary_read);
                request.input("ptpf_awardStatus", sql.Int, req.body.tpf_awardStatus);
                request.input("ptpf_payment_cycles", sql.Int, req.body.tpf_payment_cycles);
                request.input("ptpf_fpayment_status", sql.Int, req.body.tpf_fpayment_status);
                request.input("ptpf_fpayment_time", sql.DateTime, new Date(req.body.tpf_fpayment_time));
                request.input("ptpf_fpayment_confirm_status", sql.Text, req.body.tpf_fpayment_confirm_status);
                request.input("ptpf_bpayment_status", sql.Text, req.body.tpf_bpayment_status);
                request.input("ptpf_bpayment_initiate_time", sql.DateTime, new Date(req.body.tpf_bpayment_initiate_time));
                request.input("ptpf_last_benif_payment_cycle", sql.Int, req.body.tpf_last_benif_payment_cycle);
                request.input("ptpf_last_benif_payment_date", sql.Int, req.body.tpf_last_benif_payment_date);
                request.input("ptpf_bpayment_complete_status", sql.Int, req.body.tpf_bpayment_complete_status);
                request.input("ptpf_fstartingDate", sql.DateTime, new Date(req.body.tpf_fstartingDate));
                request.input("ptpf_fclosingDate", sql.DateTime, new Date(req.body.tpf_fclosingDate));
                request.input("ptpf_project_completion_request", sql.Int, req.body.tpf_project_completion_request);
                request.input("ptpf_beneficiary_accept_project_completion_request", sql.Int, req.body.tpf_beneficiary_accept_project_completion_request);
                request.input("ptpf_beneficiary_edit_mode", sql.Int, req.body.tpf_beneficiary_edit_mode);
                request.input("ptpf_beneficiary_request_message", sql.Text, req.body.tpf_beneficiary_request_message);
                request.input("ptest_mode", sql.Int, req.body.test_mode);
                request.input("ptxn_status", sql.VarChar, req.body.txn_status);
                request.input("ptxn_id", sql.Text, req.body.txn_id);
                request.input("pprow_deleted", sql.Int, req.body.row_deleted);
                request.execute("ProposalFinancier_Add").then(function () {  
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
    
    router.route('/Update/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id; 
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptpf_id", sql.Int, _id);
                request.input("ptpf_price", sql.Decimal, req.body.tpf_price);
                request.input("ptpf_price_currency_ref", sql.Int, req.body.tpf_price_currency_ref);
                request.input("ptpf_finance_tenure_value", sql.Int, req.body.tpf_finance_tenure_value);
                request.input("ptpf_finance_tenure_ref", sql.Int, req.body.tpf_finance_tenure_ref);
                request.input("ptpf_tax_percent", sql.Decimal, req.body.tpf_tax_percent);
                request.input("ptpf_emi_amount", sql.Decimal, req.body.tpf_emi_amount);
                request.input("ptpf_late_fine_amount", sql.Decimal, req.body.tpf_late_fine_amount);
                request.input("ptpf_total_amount", sql.Int, req.body.tpf_total_amount);
                request.input("ptpf_validity_value", sql.Int, req.body.tpf_validity_value);
                request.input("ptpf_validity_ref", sql.Int, req.body.tpf_validity_ref);
                request.input("ptpf_validity_end_on", sql.DateTime, new Date(req.body.tpf_validity_end_on));
                request.input("ptpf_remarks", sql.Text, req.body.tpf_remarks);
                request.input("ptpf_file", sql.VarChar, req.body.tpf_file);
                request.input("ptpf_posted", sql.DateTime, new Date(req.body.tpf_posted));
                request.input("ptpf_project_ref", sql.Int, req.body.tpf_project_ref);
                request.input("ptpf_project_user_ref", sql.Int, req.body.tpf_project_user_ref);
                request.input("ptpf_user_ref", sql.Int, req.body.tpf_user_ref);
                request.input("ptpf_beneficiary_accept", sql.Int, req.body.tpf_beneficiary_accept);
                request.input("ptpf_beneficiary_accept_time", sql.DateTime, new Date(req.body.tpf_beneficiary_accept_time));
                request.input("ptpf_beneficiary_accept_read", sql.Int, req.body.tpf_beneficiary_accept_read);
                request.input("ptpf_beneficiary_read", sql.Int, req.body.tpf_beneficiary_read);
                request.input("ptpf_awardStatus", sql.Int, req.body.tpf_awardStatus);
                request.input("ptpf_payment_cycles", sql.Int, req.body.tpf_payment_cycles);
                request.input("ptpf_fpayment_status", sql.Int, req.body.tpf_fpayment_status);
                request.input("ptpf_fpayment_time", sql.DateTime, new Date(req.body.tpf_fpayment_time));
                request.input("ptpf_fpayment_confirm_status", sql.Text, req.body.tpf_fpayment_confirm_status);
                request.input("ptpf_bpayment_status", sql.Text, req.body.tpf_bpayment_status);
                request.input("ptpf_bpayment_initiate_time", sql.DateTime, new Date(req.body.tpf_bpayment_initiate_time));
                request.input("ptpf_last_benif_payment_cycle", sql.Int, req.body.tpf_last_benif_payment_cycle);
                request.input("ptpf_last_benif_payment_date", sql.Int, req.body.tpf_last_benif_payment_date);
                request.input("ptpf_bpayment_complete_status", sql.Int, req.body.tpf_bpayment_complete_status);
                request.input("ptpf_fstartingDate", sql.DateTime, new Date(req.body.tpf_fstartingDate));
                request.input("ptpf_fclosingDate", sql.DateTime, new Date(req.body.tpf_fclosingDate));
                request.input("ptpf_project_completion_request", sql.Int, req.body.tpf_project_completion_request);
                request.input("ptpf_beneficiary_accept_project_completion_request", sql.Int, req.body.tpf_beneficiary_accept_project_completion_request);
                request.input("ptpf_beneficiary_edit_mode", sql.Int, req.body.tpf_beneficiary_edit_mode);
                request.input("ptpf_beneficiary_request_message", sql.Text, req.body.tpf_beneficiary_request_message);
                request.input("ptest_mode", sql.Int, req.body.test_mode);
                request.input("ptxn_status", sql.VarChar, req.body.txn_status);
                request.input("ptxn_id", sql.Text, req.body.txn_id);
                request.input("pprow_deleted", sql.Int, req.body.row_deleted);
                request.execute("ProposalFinancier_Update").then(function () {  
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

    router.route('/ProviderAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptpp_price", sql.Decimal, req.body.tpp_price);
                request.input("ptpp_price_currency_ref", sql.Int, req.body.tpp_price_currency_ref);
                request.input("ptpp_tax_percent", sql.Decimal, req.body.tpp_tax_percent);
                request.input("ptpp_total_amount", sql.Decimal, req.body.tpp_total_amount);
                request.input("ptpp_validity_value", sql.Int, req.body.tpp_validity_value);
                request.input("ptpp_validity_ref", sql.Int, req.body.tpp_validity_ref);
                request.input("ptpp_validity_end_on", sql.DateTime, new Date(req.body.tpp_validity_end_on));
                request.input("ptpp_delivery_type", sql.Text, req.body.tpp_delivery_type);
                request.input("ptpp_delivery_lead_time_value", sql.Int, req.body.tpp_delivery_lead_time_value);
                request.input("ptpp_delivery_lead_time_ref", sql.Int, req.body.tpp_delivery_lead_time_ref);
                request.input("ptpp_remarks", sql.Text, req.body.tpp_remarks);
                request.input("ptpp_file", sql.VarChar, req.body.tpp_file);
                request.input("ptpp_completion_time_value", sql.Int, req.body.tpp_completion_time_value);
                request.input("ptpp_completion_time_ref", sql.Int, req.body.tpp_completion_time_ref);
                request.input("ptpp_posted", sql.DateTime, new Date(req.body.tpp_posted));
                request.input("ptpp_project_ref", sql.Int, req.body.tpp_project_ref);
                request.input("ptpp_project_user_ref", sql.Int, req.body.tpp_project_user_ref);
                request.input("ptpp_beneficiary_edit_mode", sql.Int, req.body.tpp_beneficiary_edit_mode);
                request.input("ptpp_beneficiary_request_message", sql.Text, req.body.tpp_beneficiary_request_message);
                request.input("ptpp_contract_mode", sql.Int, req.body.tpp_contract_mode);
                request.input("ptpp_contract_amount", sql.Decimal, req.body.tpp_contract_amount);
                request.input("ptpp_bpayment_status", sql.VarChar, req.body.tpp_bpayment_status);
                request.input("ptpp_bpayment_txn_id", sql.Text, req.body.tpp_bpayment_txn_id);
                request.input("ptpp_user_ref", sql.Int, req.body.tpp_user_ref);
                request.input("ptpp_beneficiary_accept", sql.Int, req.body.tpp_beneficiary_accept);
                request.input("ptpp_beneficiary_accept_time", sql.DateTime, new Date(req.body.tpp_beneficiary_accept_time));
                request.input("ptpp_beneficiary_accept_read", sql.Int, req.body.tpp_beneficiary_accept_read);
                request.input("ptpp_beneficiary_read", sql.Int, req.body.tpp_beneficiary_read);
                request.input("ptpp_project_completion_request", sql.Int, req.body.tpp_project_completion_request);
                request.input("ptpp_beneficiary_accept_project_completion_request", sql.Int, req.body.tpp_beneficiary_accept_project_completion_request);
                request.input("ptpp_shipment_number", sql.VarChar, req.body.tpp_shipment_number);
                request.input("ptpp_shipment_details", sql.Text, req.body.tpp_shipment_details);
                request.input("ptpp_shipment_date", sql.DateTime, new Date(req.body.tpp_shipment_date));
                request.input("ptpp_rejected", sql.TinyInt, req.body.tpp_rejected);
                request.input("ptpp_rejection_msg", sql.Text, req.body.tpp_rejection_msg);
                request.input("pprow_deleted", sql.Int, req.body.row_deleted);
                request.execute("ProposalProvider_Add").then(function () {  
                   
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

    router.route('/ProviderUpdate/:id')  
    .put(function (req, res)  
     {  
        var _id = req.params.id;  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptpp_id", sql.Int, _id);
                request.input("ptpp_price", sql.Decimal, req.body.tpp_price);
                request.input("ptpp_price_currency_ref", sql.Int, req.body.tpp_price_currency_ref);
                request.input("ptpp_tax_percent", sql.Decimal, req.body.tpp_tax_percent);
                request.input("ptpp_total_amount", sql.Decimal, req.body.tpp_total_amount);
                request.input("ptpp_validity_value", sql.Int, req.body.tpp_validity_value);
                request.input("ptpp_validity_ref", sql.Int, req.body.tpp_validity_ref);
                request.input("ptpp_validity_end_on", sql.DateTime, new Date(req.body.tpp_validity_end_on));
                request.input("ptpp_delivery_type", sql.Text, req.body.tpp_delivery_type);
                request.input("ptpp_delivery_lead_time_value", sql.Int, req.body.tpp_delivery_lead_time_value);
                request.input("ptpp_delivery_lead_time_ref", sql.Int, req.body.tpp_delivery_lead_time_ref);
                request.input("ptpp_remarks", sql.Text, req.body.tpp_remarks);
                request.input("ptpp_file", sql.VarChar, req.body.tpp_file);
                request.input("ptpp_completion_time_value", sql.Int, req.body.tpp_completion_time_value);
                request.input("ptpp_completion_time_ref", sql.Int, req.body.tpp_completion_time_ref);
                request.input("ptpp_posted", sql.DateTime, new Date(req.body.tpp_posted));
                request.input("ptpp_project_ref", sql.Int, req.body.tpp_project_ref);
                request.input("ptpp_project_user_ref", sql.Int, req.body.tpp_project_user_ref);
                request.input("ptpp_beneficiary_edit_mode", sql.Int, req.body.tpp_beneficiary_edit_mode);
                request.input("ptpp_beneficiary_request_message", sql.Text, req.body.tpp_beneficiary_request_message);
                request.input("ptpp_contract_mode", sql.Int, req.body.tpp_contract_mode);
                request.input("ptpp_contract_amount", sql.Decimal, req.body.tpp_contract_amount);
                request.input("ptpp_bpayment_status", sql.VarChar, req.body.tpp_bpayment_status);
                request.input("ptpp_bpayment_txn_id", sql.Text, req.body.tpp_bpayment_txn_id);
                request.input("ptpp_user_ref", sql.Int, req.body.tpp_user_ref);
                request.input("ptpp_beneficiary_accept", sql.Int, req.body.tpp_beneficiary_accept);
                request.input("ptpp_beneficiary_accept_time", sql.DateTime, new Date(req.body.tpp_beneficiary_accept_time));
                request.input("ptpp_beneficiary_accept_read", sql.Int, req.body.tpp_beneficiary_accept_read);
                request.input("ptpp_beneficiary_read", sql.Int, req.body.tpp_beneficiary_read);
                request.input("ptpp_project_completion_request", sql.Int, req.body.tpp_project_completion_request);
                request.input("ptpp_beneficiary_accept_project_completion_request", sql.Int, req.body.tpp_beneficiary_accept_project_completion_request);
                request.input("ptpp_shipment_number", sql.VarChar, req.body.tpp_shipment_number);
                request.input("ptpp_shipment_details", sql.Text, req.body.tpp_shipment_details);
                request.input("ptpp_shipment_date", sql.DateTime, new Date(req.body.tpp_shipment_date));
                request.input("ptpp_rejected", sql.TinyInt, req.body.tpp_rejected);
                request.input("ptpp_rejection_msg", sql.Text, req.body.tpp_rejection_msg);
                request.input("pprow_deleted", sql.Int, req.body.row_deleted);
                request.execute("ProposalProvider_Update").then(function () {  
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

    router.route('/FinancierFilesAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptpfsf_filename", sql.VarChar, req.body.tpfsf_filename);
                request.input("ptpfsf_proposal_ref", sql.Int, req.body.tpfsf_proposal_ref);
                request.input("ptpfsf_file_index", sql.Int, req.body.tpfsf_file_index);
                request.input("ptpfsf_file_type", sql.Int, req.body.tpfsf_file_type);
                request.input("ptpfsf_created", sql.DateTime,new Date(req.body.tpfsf_created));
                request.input("ptpfsf_row_deleted", sql.Int, req.body.tpfsf_row_deleted);
                request.execute("ProposalFinancierSubmittedFiles_Add").then(function () {  
                   
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

    router.route('/SuppplierFilesAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.input("ptpssf_filename", sql.VarChar, req.body.tpssf_filename);
                request.input("ptpssf_proposal_ref", sql.Int, req.body.tpssf_proposal_ref);
                request.input("ptpssf_file_index", sql.Int, req.body.tpssf_file_index);
                request.input("ptpssf_file_type", sql.Int, req.body.tpssf_file_type);
                request.input("ptpssf_created", sql.DateTime, new Date(req.body.tpssf_created));
                request.input("ptpssf_row_deleted", sql.Int, req.body.tpssf_row_deleted);
                request.execute("ProposalSupplierSsubmittedFiles_Add").then(function () {  
                   
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

   
    return router;

};
module.exports=routes;
