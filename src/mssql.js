var sql = require('mssql');

function Mssql(config){

	this.connection = new sql.Connection({
		user: config.user,
		password: config.password,
		server:  config.server,
		port  : config.port,
		database: config.db
	});
	
	this.connection.on("error", function(err){
		console.log(err);
	})
	
	this.connection.on("connect", function(){
		console.log("db connect");
	})
	
	this.connection.on("close", function(){
		console.log("db close");
	})
	
	this.connected =  false;
}

module.exports = Mssql;

Mssql.prototype.connect = function(callback){
	
	this.connection.connect(function(err) {
	
		if(err){
			callback({result : -1});
		} else {
			this.connected = true;
			callback({result : 0});
		}
	
	});

}

Mssql.prototype.close = function(callback){
	
	this.connection.close();
	this.connected = false;

}

Mssql.prototype.query = function(param, callback){
	var request = this.connection.request();
    request.query('select top 10 *  from CLIENT', function(err, recordset) {
		var retObj = {};
		if(err){
			retObj.result = -15;
		} else {
			retObj.result = 0;
			retObj.data = recordset;
			
		}
			
		callback(retObj);
		console.dir(recordset);
    });

}

