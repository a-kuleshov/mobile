function wait_connect (event) {
	console.log(event);
	if (event.data == 'OK') {
		prepare_for_chat(this);
		window.addEventListener('deviceorientation', devOrientHandler, false);
	} else {
		alert(event.data); 
	}
}

function prepare_socket(e) {
	token = getParameterByName('t');
	socket.onerror = function(error) {
		document.getElementById("label").innerHTML = "Возникли какие-то трудности";
	};
	socket.onclose = function (e) {
		document.getElementById("label").innerHTML = "Соединение закрыто";
	};
	data = JSON.stringify({
		action : "trying_to_connect",
		data : {
			token : token,
		}
	});
	socket.onmessage = wait_connect;
	socket.send(data);
}

function devOrientHandler (e) {
	data = JSON.stringify({
		action : "message",
		data : {
			alpha : event.alpha,
			beta : event.beta,
			gamma : event.gamma,
		}
	});
	socket.send(data);
}