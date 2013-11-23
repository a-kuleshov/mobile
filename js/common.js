var ip = "192.168.1.108"; 
var ip = "192.168.1.40"; 
var host = "ws://" + ip + ":8080";

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function message_got (event) {
	console.log(event);	
	var message = JSON.parse(event.data);
	if( message.action = 'message') {message
		console.log(message);
		document.getElementById("window_for_messages").innerHTML += '<b>Он:</b>' + message.data + '<br>';
	}
}

function prepare_for_chat (s) {
	s.onmessage = message_got;
	document.getElementById("label").innerHTML="Партнер присоединился.";
	document.getElementById("main").innerHTML = document.getElementById("template").innerHTML;
	document.getElementById("send_button").onclick = send_messege;
	document.getElementById("close_connection").onclick = function () {
		socket.send( JSON.stringify({action : 'close'}) );
	};
}


function send_messege (argument) {
	console.log( '///' );
	console.log( this.form.text.value );
	var data = JSON.stringify({
		action : "message",
		data: this.form.text.value
	});
	socket.send(data);
	document.getElementById("window_for_messages").innerHTML += '<b> Я:</b>' + this.form.text.value + '<br>';
}

function close_connection () {
	socket.send( JSON.stringify({
		action: 'close'
	}));
}

