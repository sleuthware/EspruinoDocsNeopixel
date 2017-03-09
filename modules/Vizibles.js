var viziblesFuncs = {
	"debug" : function() {
		this.at.debug();
	},
//AT+RST\r\n
	"reset" : function(callback) {
		if(this.serialStarted) {
			at.cmd("AT+RST\r\n", 1000, function() {
				return (function (d) {
					if( d!==undefined && d=='ERROR') if(callback!==undefined)return callback("Error");
					else if(callback!==undefined) return callback('Ok');
				});
			});
		}
	},
//AT+GETMAC\r\n
	"getMAC" : function(callback) {
		if(this.serialStarted) {
			at.cmd("AT+GETMAC\r\n", 1000, function() {
				return (function (d) {
					if(d=='ERROR') return callback("Error");
					else {
						m=d.split("=");
						return (callback(m[1]));
					}  
				});
			});
		}
	},
//AT+GETIP\r\n
	"getIP" : function(callback) {
		if(this.serialStarted) {
			at.cmd("AT+GETIP\r\n", 1000, function() {
				return (function (d) {
					if(d=='ERROR') return callback("Error");
					else {
						m=d.split("=");
						return (callback(m[1]));
					}  
				});
			});
		}
	},
///AT+WIFICONNECT="<SSID>","<password>"\r\n
	"WiFiConnect" : function(SSID, passwd, callback) {
		if(this.serialStarted) {
			at.unregisterLine('OK');
			at.unregisterLine('ERROR');
			at.registerLine('OK', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Ok');
			});
			at.registerLine('ERROR', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Error');
			});			
			at.write("AT+WIFICONNECT=\""+SSID+"\",\""+passwd+"\"\r\n");
		}
	},
//AT+SETOPTIONS="<option name>","<option value>"[,...]\r\n
	"setOptions" : function(options, callback){
		if(this.serialStarted) {
			at.unregisterLine('OK');
			at.unregisterLine('ERROR');
			at.registerLine('OK', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Ok');
			});
			at.registerLine('ERROR', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Error');
			});			
			at.write("AT+SETOPTIONS=");
			var i = 0;
			var keys = Object.keys(options).length;
			for (o in options) {
				at.write('"');
				at.write(o);
				at.write('","');
				at.write(options[o]);
				at.write('"');
				i++;
				if(i<keys){
					at.write(',');
				}
			}
			at.write('\r\n');			
		}
	},
//AT+UPDATE="<variable name>","<variable value>"[,...]\r\n
	"update" : function(variables, callback){
		if(this.serialStarted && this.connected) {
			at.unregisterLine('OK');
			at.unregisterLine('ERROR');
			at.registerLine('OK', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Ok');
			});
			at.registerLine('ERROR', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Error');
			});			
			at.write("AT+UPDATE=");
			var i = 0;
			var keys = Object.keys(variables).length;
			for (o in variables) {
				at.write('"');
				at.write(o);
				at.write('","');
				at.write(variables[o]);
				at.write('"');
				i++;
				if(i<keys){
					at.write(',');
				}
			}
			at.write('\r\n');			
		}
	},
//AT+EXPOSE="<function name>"\r\n
	"expose" : function(fName, cbFunction, callback){
		if(this.serialStarted && this.connected) {
			at.unregisterLine('OK');
			at.unregisterLine('ERROR');
			at.registerLine('OK', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Ok');
			});
			at.registerLine('ERROR', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Error');
			});			
			at.write('AT+EXPOSE="'+fName+'"\r\n');
			if(cbFunction!==undefined && cbFunction!==null) {
				viziblesFuncs.at.unregisterLine('+THINGDO="'+fName+'"');
				var cb = function (d) {
					var callName = '+THINGDO=';
					parameters = d.substring(d.indexOf(callName)+callName.length, d.length).split(',');
					cbFunction(parameters);
					return '';
				}
				viziblesFuncs.at.registerLine('+THINGDO="'+fName+'"', cb);
			}	
		}
	},
//AT+CONNECT[="<option name>","<option value>"[,...]]\r\n
	"connect" : function(options, callback, connectionCb, disconnectionCb){
		if(this.serialStarted && !this.connected) {
			at.unregisterLine('OK');
			at.unregisterLine('ERROR');
			at.registerLine('OK', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Ok');
			});
			at.registerLine('ERROR', function() {
				at.unregisterLine('OK');
				at.unregisterLine('ERROR');
				if(callback) callback('Error');
			});		
			if(connectionCb!==undefined && connectionCb!==null) this.connectedCallback = connectionCb;
			if(disconnectionCb!==undefined && disconnectionCb!==null) this.disconnectedCallback = disconnectionCb;
			at.write("AT+CONNECT");
			if(options===null || options ===undefined) at.write("\r\n");
			else{
				at.write("=");
				var i = 0;
				var keys = Object.keys(options).length;
				for (o in options) {
					at.write('"');
					at.write(o);
					at.write('","');
					at.write(options[o]);
					at.write('"');
					i++;
					if(i<keys){
						at.write(',');
					}
					
				}
				at.write('\r\n');
			}
			
		}
	},
	//AT+DISCONNECT\r\n
	"disconnect" : function(callback, disconnectionCb) {
		if(this.serialStarted && this.connected) {
			at.cmd("AT+DISCONNECT\r\n", 1000, function() {
				return (function (d) {
					if(d=='ERROR') return callback("Error");
					else //if(d.indexOf('OK')!=-1) 
						return callback("Ok");
				});
			});
			if(disconnectionCb!==undefined && disconnectionCb!==null) this.disconnectedCallback = disconnectionCb;
		}
	},
	//AT+GMR\r\n
	"version" : function (callback) {
		if(this.serialStarted) {
			at.cmd("AT+GMR\r\n", 1000, function() {
				return (function (d) {
					if(d=='ERROR'||d.indexOf('Vizibles AT')!=7) return callback("Error");
					else {
						m=d.substring(d.indexOf('='), d.indexOf('O'));
						return (callback(m));
					}  
				});
			});
		}
	}
};

exports.init = function(usart, startedCallback) {
	viziblesFuncs.at = at = require("AT").connect(usart);

	viziblesFuncs.serialStarted = false;
	viziblesFuncs.connected = false;
	viziblesFuncs.connectedCallback = null;
	viziblesFuncs.disconnectedCallback = null;
	
	viziblesFuncs.at.register('+VZ-READY>', function(data) {
		viziblesFuncs.serialStarted = true;
		startedCallback();
		return "";
	});    
	viziblesFuncs.at.unregisterLine('OK');
	viziblesFuncs.at.unregisterLine('ERROR');
	viziblesFuncs.at.registerLine('+CONNECTED', function(data) {
		viziblesFuncs.connected = true;
		if(viziblesFuncs.connectedCallback!==null) viziblesFuncs.connectedCallback();
		return "";
	});    
	viziblesFuncs.at.registerLine('+DISCONNECTED', function(data) {
		viziblesFuncs.connected = false;
		if(viziblesFuncs.disconnectedCallback!==null) viziblesFuncs.disconnectedCallback();
		return "";
	});    
	return viziblesFuncs;
};





