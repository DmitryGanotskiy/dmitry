import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { CSS3DRenderer } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';
import TWEEN from "https://cdn.skypack.dev/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from './FirstPersonControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

class TerrainScene {
	constructor() {
		this.worldWidth = 256;
		this.worldDepth = 256;
		this.clock = new THREE.Clock();
        this.gravity = 9.8;
        this.velocityY = 0;
        this.objectRadius = 80;
        this.centerPoint = new THREE.Vector3(81, 98, -800);
		this.frameMeshes = [];
		this.previousCameraPositionFrame = new THREE.Vector3();
		this.previousCameraPosition = new THREE.Vector3();
		this.previousCameraPosition1 = new THREE.Vector3();
		this.previousCameraPositionTorch = new THREE.Vector3();
		this.previousCameraPositionThrone = new THREE.Vector3();
		this.previousCameraPositionRoman = new THREE.Vector3();
        this.previousCameraPositionWalls = new THREE.Vector3()
		this.characterManager = null;
		this.characterManagerSeat = null;

		this.init();
	}

	init() {
		this.container = document.getElementById('container');
        const loader = new GLTFLoader()

		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		this.scene = new THREE.Scene();
        const texture = loader.load([
            '2d/img/posx.jpg',
            '2d/img/negx.jpg',
            '2d/img/posy.jpg',
            '2d/img/negy.jpg',
            '2d/img/posz.jpg',
            '2d/img/negz.jpg',
        ]);
        this.scene.background = texture;


		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setAnimationLoop(() => this.animate());
		this.container.appendChild(this.renderer.domElement);

		this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
		this.controls.movementSpeed = 50;
		this.controls.lookSpeed = 0.1;
        this.controls.enableDamping = true;



		this.stats = new Stats();
		this.container.appendChild(this.stats.dom);



		window.addEventListener('resize', () => this.onWindowResize());
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.controls.handleResize();
	}


	
	animate() {
		this.render();
		this.stats.update();
	}

    render() {
        const delta = this.clock.getDelta();
		this.controls.update(delta);

		
		this.renderer.render(this.scene, this.camera);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const terrainScene = new TerrainScene();
});
