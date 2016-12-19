/**
* Client
*
*/
function Client() {
	console.log("Client Iniciated");
    this.response;
};

Client.prototype.constructor = Client;

Client.prototype.getPrologRequest = function(requestString, onSuccess, onError, port) {
	var requestPort = port || 8081;
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};

Client.prototype.moveIsValid = function(requestString) {
	this.getPrologRequest(requestString, this.setResponse);
    return this.response;
};

Client.prototype.setResponse = function(data) {
	this.response = data.target.response;
};
