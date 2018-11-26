var sql = require("mssql");  
var connect = function()  
{  
    var conn = new sql.ConnectionPool({ 
        user: 'sa',  
        password: 'tawreeq@123',  
        server: 'daraltawreeq.fortiddns.com',
        database: 'AMLTH',
        options: {           
            encrypt: false
        }
      
    });  
  
    return conn;  
};  
  
module.exports = connect; 