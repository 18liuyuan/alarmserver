'user strict';

var net = require('net');
var Mssql = require('./src/mssql.js');

var mssql = new Mssql({
	server : "192.168.1.223",
	port : 1433,
	user : "sa",
	password : "1",
	db    : "ALARM"
});

mssql.connect(function(data){
	console.log(JSON.stringify(data));
	/*
	mssql.query("", function(dbData){
		console.log(JSON.stringify(dbData));
	});
	*/
});

process.on('uncaughtException', function(err) {
	console.log(err);
});

var server = net.createServer(function(socket){
	
	console.log( "receive client connect :" +socket.remoteAddress + ':' + socket.remotePort);
	
	socket.on("data", function(data){
		console.log( "receive client data :" + data);
		resClient(data, socket);
	});
	
	socket.on("end", function(data){
		console.log(" client end:"+data);
	})
	
	socket.on("close", function(data){
		console.log( " client close :" + data);
	});
	
});


var resClient = function(data, client){

	var res = {};
	var req = JSON.parse(data);
	console.log("receive req  :" + JSON.stringify(data));
	if(req.cmd === "login"){
		
		res.cmd = req.cmd;
		if(req.username === "test" && req.password === "1234"){
			res.result = 0;
		} else {
			res.result = -2;
			res.msg = "id or password error";
		}
		client.write(JSON.stringify(res));
	} else if(req.cmd === "get_real_alarm"){
		mssql.query("select top 10 * from CLIENT", function(dbData){
			res.cmd = req.cmd;
			if(dbData.result == 0){
				
				res.result = dbData.result;
				res.data = dbData.data;
			} else {
				res.resutl = -1;
			}
			client.write(JSON.stringify(res));
		});
	} else {
		res.result = -1;
		res.msg = "unknowed cmd";
	}
	
	
}
server.listen(6000);