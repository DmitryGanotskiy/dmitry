import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { CSS3DRenderer } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';
import TWEEN from "https://cdn.skypack.dev/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from './FirstPersonControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { Stars } from './stars.js';
import {AnimatedText} from './text.js';
import {ObjectManager} from './loader.js';


class TerrainScene {
	constructor() {
		this.worldWidth = 256;
		this.worldDepth = 256;
		this.clock = new THREE.Clock();
        this.gravity = 9.8;
        this.velocityY = 0;
        this.objectRadius = 60;
        this.centerPoint = new THREE.Vector3(239, 67, -944);
		this.columnMeshes = [];
		this.previousCameraPosition = new THREE.Vector3();
		this.previousCameraPosition1 = new THREE.Vector3();
        
		this.init();
        this.loadModelsInCircle();
	}

	init() {
		this.container = document.getElementById('container');
        const loader = new GLTFLoader()

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
		this.controls.movementSpeed = 50;
		this.controls.lookSpeed = 0.1;
        this.controls.enableDamping = true;

		this.walls()


		this.stats = new Stats();
        this.animatedText = new AnimatedText(this.scene, new THREE.Vector3(81, 110, -620));

		this.container.appendChild(this.stats.dom);

        this.stars = new Stars(this.scene, 50);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
        this.scene.add(ambientLight);
		
        this.loadModel = new ObjectManager(this.scene);

		window.addEventListener('resize', () => this.onWindowResize());
	}

    loadModelsInCircle(){
		const numFrames = 4;
		for (let i = 0; i < numFrames; i++) {
			// Adjust the angle calculation to cover half of the circle
			const angle = ((i / (numFrames - 1)) * Math.PI) - (Math.PI / 2);
		
			// Calculate position using polar coordinates
			const x = this.centerPoint.x + this.objectRadius * Math.cos(angle);
			const z = this.centerPoint.z + this.objectRadius * Math.sin(angle);
		
			// Calculate rotation
			const rotationY = angle + Math.PI / 2; // Adjust rotation if necessary
		
			// Load model with calculated position and rotation
			this.loadModel.loadModel('./img/frame.glb', { x: x, y: 58, z: z }, rotationY);
		}

		//load monument
		this.loadModel.loadModel('./img/statue.glb', { x: 250, y: 75, z: -620 }, Math.PI/2);
		this.loadModel.loadModel('./img/postament.glb', { x: 250, y: 65, z: -620 }, Math.PI);
		//load temple
		this.loadModel.loadModel('./img/temple.glb', { x: 250, y: 43, z: -750 }, Math.PI);
		this.loadModel.loadModel('./img/temple1.glb', { x: 250, y: 43, z: -950 }, Math.PI/-2.5);
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

	walls() {
        let wallGeometry = new THREE.CylinderGeometry(500, 500, 150, 16, 16, true);
        let wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0 });
        this.wall = new THREE.Mesh(wallGeometry, wallMaterial);
        this.wall.position.set(81, 60, -800);
        this.scene.add(this.wall);
    }

	collideWalls() {
        const directions = [
            new THREE.Vector3(1, 0, 0), // Right
            new THREE.Vector3(-1, 0, 0), // Left
            new THREE.Vector3(0, 0, 1), // Forward
            new THREE.Vector3(0, 0, -1) // Backward
        ];

        for (const direction of directions) {
            const raycaster = new THREE.Raycaster(this.camera.position, direction.clone().normalize());
            const intersects = raycaster.intersectObject(this.wall, true);

            if (intersects.length > 0 && intersects[0].distance < 10) {
                this.camera.position.copy(this.previousCameraPosition);
                return;
            }
        }

        // Save the current position as the previous position before updating it
        this.previousCameraPosition.copy(this.camera.position);
    }

    collision(){
        this.velocityY -= this.gravity * this.clock.getDelta();
		const deltaMove = new THREE.Vector3(0, this.velocityY, 0);
		const raycaster = new THREE.Raycaster(this.camera.position, deltaMove.clone().normalize());
		const intersects = raycaster.intersectObject(this.mesh);

		if (intersects.length > 0) {
			const distance = intersects[0].distance;
			const collisionPoint = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(distance));
			this.camera.position.y = collisionPoint.y + 15;
            
			this.velocityY = 0;
		} else {
			this.camera.position.add(deltaMove);
		}
    }

	collideTemple(coll) {
		if (coll){
			const directions = [
				new THREE.Vector3(1, 0, 0), // Right
				new THREE.Vector3(-1, 0, 0), // Left
				new THREE.Vector3(0, 0, 1), // Forward
				new THREE.Vector3(0, 0, -1) // Backward
			];
		
			for (const direction of directions) {
				const raycaster = new THREE.Raycaster(this.camera.position, direction.clone().normalize());
				const intersects = raycaster.intersectObject(coll, true);
		
				if (intersects.length > 0 && intersects[0].distance < 10) {
					this.camera.position.copy(this.previousCameraPosition); 
					return;
				}
			}
		
			// Save the current position as the previous position before updating it
			this.previousCameraPosition.copy(this.camera.position);
		}
	}
	collideTemple1(coll) {
		if (coll){
			const directions = [
				new THREE.Vector3(1, 0, 0), // Right
				new THREE.Vector3(-1, 0, 0), // Left
				new THREE.Vector3(0, 0, 1), // Forward
				new THREE.Vector3(0, 0, -1) // Backward
			];
		
			for (const direction of directions) {
				const raycaster = new THREE.Raycaster(this.camera.position, direction.clone().normalize());
				const intersects = raycaster.intersectObject(coll, true);
		
				if (intersects.length > 0 && intersects[0].distance < 10) {
					this.camera.position.copy(this.previousCameraPosition1); 
					return;
				}
			}
		
			// Save the current position as the previous position before updating it
			this.previousCameraPosition1.copy(this.camera.position);
		}
	}

	collisionColumn() {

	}

	animate() {
		this.render();
		this.stats.update();
	}

	render() {
		this.controls.update(this.clock.getDelta());
        this.collision();
		this.collisionColumn();
		this.collideWalls()

		this.collideTemple(this.loadModel.temple);
		this.collideTemple1(this.loadModel.temple1);
		
        this.animatedText.update();
        console.log(this.camera.position, this.camera.rotation)
        //this.stars.update();
		this.renderer.render(this.scene, this.camera);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const terrainScene = new TerrainScene();
});
