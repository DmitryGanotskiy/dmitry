import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { CSS3DRenderer } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';
import TWEEN from "https://cdn.skypack.dev/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from './scripts/FirstPersonControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { Stars } from './scripts/stars.js';

class TerrainScene {
	constructor() {
		this.worldWidth = 256;
		this.worldDepth = 256;
		this.clock = new THREE.Clock();
        this.gravity = 9.8;
        this.velocityY = 0;

		this.init();
	}

	init() {
		this.container = document.getElementById('container');

		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		this.scene = new THREE.Scene();

		this.scene.background = new THREE.Color(0x0a0a0a); // Darker background
		this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.005);

		const data = this.generateHeight(this.worldWidth, this.worldDepth);

		this.camera.position.set(81, 98, -800);
		this.camera.lookAt(2, 1, -2);

		const geometry = new THREE.PlaneGeometry(7500, 7500, this.worldWidth - 1, this.worldDepth - 1);
		geometry.rotateX(-Math.PI / 2);

		const vertices = geometry.attributes.position.array;
		for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
			vertices[j + 1] = data[i];
		}

		this.texture = new THREE.CanvasTexture(this.generateTexture(data, this.worldWidth, this.worldDepth));
		this.texture.wrapS = THREE.ClampToEdgeWrapping;
		this.texture.wrapT = THREE.ClampToEdgeWrapping;
		this.texture.colorSpace = THREE.SRGBColorSpace;

		this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: this.texture }));
		this.scene.add(this.mesh);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setAnimationLoop(() => this.animate());
		this.container.appendChild(this.renderer.domElement);

		this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
		this.controls.movementSpeed = 150;
		this.controls.lookSpeed = 0.1;
        this.controls.enableDamping = true;


		this.stats = new Stats();
		this.container.appendChild(this.stats.dom);

        this.stars = new Stars(this.scene, 50);

		window.addEventListener('resize', () => this.onWindowResize());
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.controls.handleResize();
	}

	generateHeight(width, height) {
		let seed = Math.PI / 4;
		window.Math.random = function () {
			const x = Math.sin(seed++) * 10000;
			return x - Math.floor(x);
		};

		const size = width * height, data = new Uint8Array(size);
		const perlin = new ImprovedNoise(), z = Math.random() * 100;
		let quality = 1;

		for (let j = 0; j < 4; j++) {
			for (let i = 0; i < size; i++) {
				const x = i % width, y = ~~(i / width);
				data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
			}
			quality *= 5;
		}

		return data;
	}

	generateTexture(data, width, height) {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext('2d');
		context.fillStyle = '#000';
		context.fillRect(0, 0, width, height);

		const image = context.getImageData(0, 0, canvas.width, canvas.height);
		const imageData = image.data;

		const vector3 = new THREE.Vector3(0, 0, 0);
		const sun = new THREE.Vector3(1, 1, 1);
		sun.normalize();

		for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
			vector3.x = data[j - 2] - data[j + 2];
			vector3.y = 2;
			vector3.z = data[j - width * 2] - data[j + width * 2];
			vector3.normalize();
			const shade = vector3.dot(sun);

			imageData[i] = (32 + shade * 64) * (0.2 + data[j] * 0.01);  // Adjusted for darker texture
			imageData[i + 1] = (32 + shade * 64) * (0.2 + data[j] * 0.01);
			imageData[i + 2] = (32 + shade * 64) * (0.2 + data[j] * 0.01);
		}

		context.putImageData(image, 0, 0);

		const canvasScaled = document.createElement('canvas');
		canvasScaled.width = width * 4;
		canvasScaled.height = height * 4;
		const contextScaled = canvasScaled.getContext('2d');
		contextScaled.scale(4, 4);
		contextScaled.drawImage(canvas, 0, 0);

		const imageScaled = contextScaled.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
		const imageDataScaled = imageScaled.data;

		for (let i = 0, l = imageDataScaled.length; i < l; i += 4) {
			const v = ~~(Math.random() * 5);
			imageDataScaled[i] += v;
			imageDataScaled[i + 1] += v;
			imageDataScaled[i + 2] += v;
		}

		contextScaled.putImageData(imageScaled, 0, 0);

		return canvasScaled;
	}

    collision(){
        this.velocityY -= this.gravity * this.clock.getDelta();
		const deltaMove = new THREE.Vector3(0, this.velocityY, 0);
		const raycaster = new THREE.Raycaster(this.camera.position, deltaMove.clone().normalize());
		const intersects = raycaster.intersectObject(this.mesh);

		if (intersects.length > 0) {
			const distance = intersects[0].distance;
			const collisionPoint = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(distance));
			this.camera.position.y = collisionPoint.y + 10; // Adjust this value based on camera height
			this.velocityY = 0; // Stop vertical velocity on collision
		} else {
			this.camera.position.add(deltaMove);
		}
    }

	animate() {
		this.render();
		this.stats.update();
	}

	render() {
		this.controls.update(this.clock.getDelta());
        this.collision();
        //console.log(this.camera.position, this.camera.rotation)
        //this.stars.update();
		this.renderer.render(this.scene, this.camera);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const terrainScene = new TerrainScene();
});
