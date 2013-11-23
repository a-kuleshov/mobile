function prepare_socket() {
	socket.onerror = function(error) {
		document.getElementById("label").innerHTML = "Возникли какие-то трудности";
	};
	socket.onclose = function (e) {
		document.getElementById("label").innerHTML = "Соединение закрыто";
		document.getElementById("form_for_chat").hidden = 1;
	};
}


function wait_token (event) {
	var msg = event.data;
	var node = document.getElementById("main").innerHTML = msg;
	this.onmessage = wait_of_master;
}

function wait_command (event) {
	document.write(event.data);
}

function get_token (form) {
	var data = JSON.stringify({
		action : "give_me_token",
		ip : ip,
	});
	socket.onmessage = wait_token;
	socket.send(data);
}

function wait_of_master (event) {
	var msg = event.data;
	if (msg == 'Partner_connected') {
		wait_command(this);
	}
}