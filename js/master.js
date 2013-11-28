function wait_connect (event) {
	console.log(event);
	if (event.data == 'OK') {
		prepare_for_chat(this);
		document.addEventListener('touchstart', function (e) {

			touchX = e.touches[0].pageX;
			touchY = e.touches[0].pageY;
			document.getElementById("label").innerHTML = 'touchstart';
			document.addEventListener('touchmove', touches_opopop );
//			document.removeEventListner(touches_opopop);
		});
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
		action : "command",
		data : {
			command : 'update_angles',
			alpha : event.alpha,
			beta : event.beta,
			gamma : event.gamma,
		}
	});
	document.getElementById("main").innerHTML = "alpha:"  + event.alpha + "<br> beta: " + event.beta + "<br>gamma: " + event.gamma ;
	socket.send(data);
}

function touches_opopop(event) {
	event.preventDefault();
	var dX = event.touches[0].pageX - touchX;
	touchX = event.touches[0].pageX;
	var dY = event.touches[0].pageY - touchY;
	touchY = event.touches[0].pageY;
	console.log(dX + "::" + dY);
	socket.send( JSON.stringify({
		action : "command",
		data : {
			command : 'update_radius',
			dX : dX,
			dY : dY,
		}
	}));
}