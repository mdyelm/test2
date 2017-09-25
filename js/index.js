'use strict';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
var envMapURLs = ['x', 'y', 'z'].reduce(function (p, d) {
	return p.concat(['p', 'n'].map(function (n) {
		return '' + n + d + '.jpg';
	}));
}, []);
var reflectionCube = new THREE.CubeTextureLoader().setCrossOrigin('').setPath('https://alca.tv/static/codepen/pens/common/SwedishRoyalCastle/').load(envMapURLs);
reflectionCube.format = THREE.RGBFormat;
// reflectionCube.mapping = THREE.CubeRefractionMapping;
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({ antialias: true });
var middle = new THREE.Vector3();

renderer.setClearColor(0x000000);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = reflectionCube;

var light = new THREE.PointLight(0xffffff, 1, 0);
light.position.set(100, 200, 100);
scene.add(light);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshStandardMaterial({
	color: 0xFFFFFF,
	roughness: 0.0,
	metalness: 1.0,
	envMap: reflectionCube
});

var cubes = [];
var cubeCount = 100;
for (var i = 0; i < cubeCount; i++) {
	var cube = new THREE.Mesh(geometry, material);

	var t = i / cubeCount * Math.PI * 2;
	cube.t = t;

	cube.rotation.set(t, t, t);

	scene.add(cube);
	cubes.push(cube);
}

function draw() {
	requestAnimationFrame(draw);

	var time = Date.now() * 0.001;

	cubes.forEach(function (cube) {
		var t = cube.t + time;

		cube.rotation.x += 0.01;
		cube.rotation.y -= 0.02;
		cube.rotation.z -= 0.02;

		cube.position.set(Math.cos(t) * 2, Math.sin(t) * 2, Math.tan(t) * 2);
	});

	camera.position.set(Math.cos(time) * 10, Math.cos(time * 0.25), Math.sin(time) * 10);

	camera.lookAt(middle);

	renderer.render(scene, camera);
}

draw();

window.addEventListener('resize', function () {
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth, innerHeight);
}, false);