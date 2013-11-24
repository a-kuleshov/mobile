function Ball() {
	var m = {
		pos : {
			x : 0,
			y : 0,
		},
		V : {
			x : 0,
			y : 0,
		},
		a : {
			x : 0,
			y : 0,
		},

		angle : {
			alpha : 0,
			beta : 0,
		},

		angle2a : 1,
		a2V : 1,
		V2pos : 1,
	};

	updateMechanics = function() {
		this.a.x = this.angle.alpha * this.angle2a;
		this.a.y = this.angle.beta * this.angle2a;

		this.V.x += this.a.x * this.a2V;
		this.V.y += this.a.y * this.a2V;

		this.pos.x += this.V.x * this.V2pos;
		this.pos.y += this.V.y * this.V2pos;

		console.log('x: ' + this.pos.x + ' y: ' + this.pos.y + 'Vx: ' + this.V.x + ' Vy: ' + this.V.y + 'ax: ' + this.a.x + ' ay: ' + this.a.y); 
	};

	m.runTimer = function (ms) {
		if (!ms) {
			ms = 200;
		};
		item = this;
		setInterval(function () {
			item.updateMechanics();
		}, ms);
	};

	m.updateAngles = updateAngles;
	m.updateMechanics = updateMechanics;

	return m;
};

updateAngles = function(alpha, beta) {
	this.angle.alpha = alpha;
	this.angle.beta = beta;
};



function prepare_socket() {
	socket.onerror = function(error) {
		document.getElementById("label").innerHTML = "Возникли какие-то трудности";
	};
	socket.onclose = function (e) {
		document.getElementById("label").innerHTML = "Соединение закрыто";
	};
}

function get_token (form) {
	var data = JSON.stringify({
		action : "give_me_token",
		ip : ip,
	});
	socket.onmessage = wait_token;
	socket.send(data);
}

function wait_token (event) {
	var msg = event.data;
	var node = document.getElementById("main").innerHTML = msg;
	this.onmessage = wait_of_master;
}

function wait_of_master (event) {
	var msg = event.data;
	if (msg == 'Partner_connected') {
		console.log(msg);
		Mechanics = new Ball();
		Mechanics.runTimer(2000);
		var node = document.getElementById("main").innerHTML = "<canvas height='320' width='480' id='canvas'>Обновите браузер</canvas>";
		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.arc(80, 100, 56, 0, 2*Math.PI, true);
		ctx.stroke();
		this.onmessage = wait_command;
	}
}

function wait_command (event) {
	data = JSON.parse(event.data);
	if (data.action == 'command') {
		Mechanics.updateAngles(data.data.alpha, data.data.beta);
	}
}
