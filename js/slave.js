function Ball() {
	var m = {
		pref : {
			controling : getParameterByName('c'),
		},
		geometry : {
			radius : 10,
		},
		pos : {
			x : 400,
			y : 400,
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

		convert : {
			angle2a : 0.001,
			a2V : 1,
			V2pos : 1,
			angle2V : 0.05,
		}
	};

	updateMechanics = function() {
		if (this.pref.controling == 'velocity') {
			this.V.x = this.angle.alpha * this.convert.angle2V;
			this.V.y = this.angle.beta * this.convert.angle2V;
		} else {
			this.a.x = this.angle.alpha * this.convert.angle2a;
			this.a.y = this.angle.beta * this.convert.angle2a;
			this.V.x += this.a.x * this.convert.a2V;
			this.V.y += this.a.y * this.convert.a2V;
		}

		this.pos.x += this.V.x * this.convert.V2pos;
		this.pos.y += this.V.y * this.convert.V2pos;
		if ( this.pos.x > canvas_width - this.geometry.radius )
			this.pos.x=canvas_width - this.geometry.radius;
		if ( this.pos.y > canvas_height - this.geometry.radius )
			this.pos.y=canvas_height - this.geometry.radius;
		if ( this.pos.y <  this.geometry.radius )
			this.pos.y=this.geometry.radius;
		if ( this.pos.x < this.geometry.radius )
			this.pos.x=this.geometry.radius;		

//		console.log('x: ' + this.pos.x + ' y: ' + this.pos.y + 'Vx: ' + this.V.x + ' Vy: ' + this.V.y + 'ax: ' + this.a.x + ' ay: ' + this.a.y); 
	};

	m.runTimer = function (ms) {
		if (!ms) {
			ms = 200;
		};
		item = this;
		setInterval(function () {
			var canvas = document.getElementById("canvas");
			var ctx = canvas.getContext('2d');
			item.updateMechanics();
			drawcircle(ctx, item.pos.x, item.pos.y, {
				radius : item.geometry.radius,
			});
		}, ms);

	};

	m.updateAngles = updateAngles;
	m.updateMechanics = updateMechanics;

	return m;
};

updateAngles = function(beta, gamma) {
	this.angle.alpha = gamma;
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
		document.getElementById("main").innerHTML = "<canvas height='" + canvas_height +"' width='" + canvas_width + "' id='canvas'>Обновите браузер</canvas>";
		Mechanics = new Ball();
		Mechanics.runTimer(10);
		this.onmessage = wait_command;
	}
}

function wait_command (event) {
	data = JSON.parse(event.data);
	if (data.action == 'command') {
		if (data.data.command == 'update_angles') {
			Mechanics.updateAngles(data.data.beta, data.data.gamma);
		}
		if (data.data.command == 'update_radius') {
			console.log(data.data.dX);
			Mechanics.geometry.radius += data.data.dX;
			if (Mechanics.geometry.radius < 0)
				Mechanics.geometry.radius = 0;
		}
	}
}

function drawcircle (ctx, x, y, p) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);	
	ctx.beginPath();
	ctx.arc(x, y, p.radius, 0, 2*Math.PI, true);
	ctx.stroke(); 
}