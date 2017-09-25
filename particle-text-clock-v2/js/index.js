'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = undefined,
    ctx = undefined;

var scl = 10;
var speedLimit = 0.9 * scl;
var friction = 0.75;
var roboto = undefined;
var particles = [];
var oldDate = '';
var textStringArgs = [0, 0, 2 * scl];
var timeStringParts = ['Hour', 'Minute', 'Second'].map(function (n) {
	return 'get' + n + 's';
});
var textString = '';
var textBounds = {};
var points = {};
var textPoints = [];
var order = [];

function preload() {
	roboto = loadFont('https://alca.tv/static/codepen/pens/common/RobotoMono-Bold.ttf');
}

function setup() {
	var _roboto;

	canvas = createCanvas(windowWidth, windowHeight);
	ctx = canvas.drawingContext;

	for (var i = 0; i < 180 * scl; i++) {
		var p = new Particle();
		p.applyForce(p5.Vector.random2D().mult(random(1 * scl, 2 * scl)));
		particles.push(p);
	}

	textBounds = (_roboto = roboto).textBounds.apply(_roboto, ['0'].concat(textStringArgs));

	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ':'].forEach(renderCharacter);
}

function draw() {
	ctx.clearRect(0, 0, width, height);
	fill(255);
	translate(width / 2, height / 2);

	var changed = getDate();

	ctx.beginPath();

	particles.forEach(function (p, i) {
		var index = floor(map(i, 0, particles.length, 0, textPoints.length));
		var textPoint = textPoints[index % textPoints.length];

		p.draw().attractTo(textPoint).update();
	});

	ctx.fillStyle = 'hsl(210, 100%, 50%)';
	ctx.fill();

	if (changed) {
		// Rotate the particles
		for (var i = 0; i < particles.length * 0.333; i++) {
			var p = particles.pop();
			p.applyForce(-18 * scl, -10 * scl);
			particles.unshift(p);
		}
	}
}

function renderCharacter(c) {
	var _roboto2;

	var pts = (_roboto2 = roboto).textToPoints.apply(_roboto2, [c + ''].concat(textStringArgs, [{ sampleFactor: 0.875 }])).map(function (n) {
		return createVector(n.x, n.y).add(-textBounds.w * 0.5, textBounds.h * 0.5).sub(8 * textBounds.w * 0.5 + textBounds.advance * 7).mult(scl);
	});
	pts[0].z = -1; // First
	pts[pts.length - 1].z = 1; // Last
	points[c] = pts;
}

function getDate() {
	var _ref;

	var date = new Date();
	if (oldDate.toString() === date.toString()) {
		return false;
	}
	oldDate = date;
	textString = timeStringParts.map(function (n) {
		return date[n]();
	}).map(function (n) {
		return ('0' + n).slice(-2);
	}).join(':').split('');
	textPoints = (_ref = []).concat.apply(_ref, textString.map(function (n, i) {
		var offset = i * textBounds.w * textBounds.advance * scl;
		return points[n].map(function (p) {
			return p.copy().add(offset, 0);
		});
	}));
	return true;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

var Particle = function () {
	function Particle() {
		_classCallCheck(this, Particle);

		this.pos = createVector();
		this.vel = createVector();
		this.acc = createVector();
	}

	Particle.prototype.applyForce = function applyForce() {
		var _acc;

		(_acc = this.acc).add.apply(_acc, arguments);
		return this;
	};

	Particle.prototype.attractTo = function attractTo(vec) {
		if (vec === undefined) {
			return this;
		}
		var v = vec.copy().sub(this.pos).limit(speedLimit);
		this.applyForce(v);
		return this;
	};

	Particle.prototype.update = function update() {
		var pos = this.pos;
		var vel = this.vel;
		var acc = this.acc;

		vel.add(acc);
		acc.set(0, 0);
		vel.mult(friction);
		pos.add(vel);
		return this;
	};

	Particle.prototype.draw = function draw() {
		var _pos = this.pos;
		var x = _pos.x;
		var y = _pos.y;

		ctx.moveTo(x + 3, y);
		ctx.arc(x, y, 3, 0, TAU);
		return this;
	};

	return Particle;
}();