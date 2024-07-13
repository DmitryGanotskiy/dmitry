import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { CSS3DRenderer } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js';
import TWEEN from "https://cdn.skypack.dev/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonControls } from './FirstPersonControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { Stars } from './stars.js';
import {AnimatedText} from './text.js';
import {ObjectManager} from './loader.js';
import {CharacterManager} from './character.js';
import {MobileControls} from './mobile.js';

class TerrainScene {
	constructor() {
		this.worldWidth = 256;
		this.worldDepth = 256;
		this.clock = new THREE.Clock();
        this.gravity = 9.8;
        this.velocityY = 0;
        this.objectRadius = 80;
        this.centerPoint = new THREE.Vector3(81, 98, -800);
		this.previousCameraPosition = new THREE.Vector3();
		this.previousCameraPosition1 = new THREE.Vector3();
		this.previousCameraPositionTorch = new THREE.Vector3();
		this.previousCameraPositionThrone = new THREE.Vector3();
		this.previousCameraPositionRoman = new THREE.Vector3();
        this.previousCameraPositionWalls = new THREE.Vector3();
		this.previousCameraPositionDiane = new THREE.Vector3();
        this.previousCameraPositionDavid = new THREE.Vector3();
		this.characterManager = null;
		this.characterManagerSeat = null;
		this.isMoving = false;
		this.isShowing = false;
		this.ifMobile = window.innerWidth < 1000
		this.book = document.getElementById('canvas');
        this.paths = [
            { name: 'hugo', path: 'art/hugo.jpg', position: { x: 230, y: 125, z: -1180 }, rotation: Math.PI },
            { name: 'napoleon', path: 'art/napoleon.jpg', position: { x: 320, y: 125, z: -1081 }, rotation: Math.PI /2 },
            { name: 'rembrandt', path: 'art/rembrandt.jpg', position: { x: 272, y: 125, z: -1031 }, rotation: Math.PI *3.15 },
            { name: 'shakespear', path: 'art/shakespear.jpg', position: { x: 180, y: 125, z: -1114 }, rotation: Math.PI *1.5 },
			{ name: 'dostoyevskiy', path: 'art/dostoyevskiy.jpg', position: { x: 230, y: 80, z: -1180 }, rotation: Math.PI },
            { name: 'caesar', path: 'art/caesar.jpg', position: { x: 320, y: 80, z: -1081 }, rotation: Math.PI /2 },
            { name: 'michelangelo', path: 'art/michelangelo.jpg', position: { x: 272, y: 80, z: -1031 }, rotation: Math.PI *3.15 },
            { name: 'rubens', path: 'art/rubens.jpg', position: { x: 180, y: 80, z: -1114 }, rotation: Math.PI *1.5 },
            { name: '1', path: 'me/1.png', position: { x: 209, y: 80, z: -810 }, rotation: Math.PI /2 },
			{ name: '2', path: 'me/2.png', position: { x: 209, y: 80, z: -774 }, rotation: Math.PI /2 },
			{ name: '3', path: 'me/3.png', position: { x: 209, y: 80, z: -740 }, rotation: Math.PI /2 },
			{ name: '4', path: 'me/4.png', position: { x: 209, y: 80, z: -705 }, rotation: Math.PI /2 },
			{ name: '5', path: 'me/5.png', position: { x: 209, y: 80, z: -670 }, rotation: Math.PI /2 },
			{ name: '6', path: 'me/6.png', position: { x: 290, y: 80, z: -810 }, rotation: Math.PI *1.5 },
			{ name: '7', path: 'me/7.png', position: { x: 290, y: 80, z: -774 }, rotation: Math.PI *1.5 },
			{ name: '8', path: 'me/8.png', position: { x: 290, y: 80, z: -740 }, rotation: Math.PI *1.5 },
			{ name: '9', path: 'me/9.png', position: { x: 290, y: 80, z: -705 }, rotation: Math.PI *1.5 },
			{ name: '10', path: 'me/10.png', position: { x: 290, y: 80, z: -670 }, rotation: Math.PI *1.5 },
			{ name: 'novel', path: 'me/novel.jpg', position: { x: -290, y: 110, z: -884 }, rotation: Math.PI/1.1 },
			{ name: 'article', path: 'me/article.jpg', position: { x: -245, y: 110, z: -1050 }, rotation: Math.PI/1.1 },
        ];

		this.init();
        this.loadModelsInCircle();
		this.loadResources();
		document.getElementById('back').addEventListener('click', this.moveCameraBack.bind(this));
		
		if (this.ifMobile) {
			this.mobile = new MobileControls(this.scene, this.camera, this.renderer, this.controls, this.mesh, this.clock)
		}
	
	}

	init() {
		this.container = document.getElementById('container');
        const loader = new GLTFLoader()

		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		this.scene = new THREE.Scene();

		this.scene.background = new THREE.Color(0x0a0a0a); // Darker background
		this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.005);

		const data = this.generateHeight(this.worldWidth, this.worldDepth);

		this.camera.position.set(81, 110, -800);
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

        this.animatedText = new AnimatedText(this.scene, new THREE.Vector3(70, 110, -620));

        this.stars = new Stars(this.scene, 50);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1); // soft white light
        this.scene.add(ambientLight);
		
        this.loadModel = new ObjectManager(this.scene);

		window.addEventListener('resize', () => this.onWindowResize());
	}

	loadModelsInCircle() {
		// Load monument facing towards the center
		this.loadModel.loadModel('./img/statue.glb', { x: 250, y: 83, z: -625 }, Math.PI / 2);
		this.loadModel.loadModel('./img/postament.glb', { x: 250, y: 73, z: -625 }, Math.PI);
		// Load temple facing towards the center
		this.loadModel.loadModel('./img/temple.glb', { x: 250, y: 43, z: -830 }, Math.PI);
		this.loadModel.loadModel('./img/temple1.glb', { x: 250, y: 43, z: -1100 }, -Math.PI / 4);
		//castle
		this.loadModel.loadModel('./img/torch.glb', { x: 10, y: 65, z: -1050 }, Math.PI/1.5);
		const torchPosition = { x: 10, y: 110, z: -1050 };

		const pointLight = new THREE.PointLight(0xffa500, 1, 200);
		pointLight.position.set(torchPosition.x, torchPosition.y + 10, torchPosition.z);
		this.scene.add(pointLight);
		const spriteMap = new THREE.TextureLoader().load('./img/light.png');
		const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffa500 });
		this.sprite = new THREE.Sprite(spriteMaterial);
		this.sprite.position.set(torchPosition.x, torchPosition.y, torchPosition.z);
		this.sprite.scale.set(80, 80, 1);
		this.scene.add(this.sprite);

		//corridor
		this.loadModel.loadModel('./img/throne.glb', { x: -120, y: 70, z: -670 }, Math.PI/1.5);
		//statues
		this.loadModel.loadModel('./img/roman.glb', { x: -130, y: 57, z: -920 }, Math.PI/2.5);
		this.loadModel.loadModel('./img/diane.glb', { x: 240, y: 57, z: -1120 }, Math.PI);
		this.loadModel.loadModel('./img/david.glb', { x: 270, y: 57, z: -1080 }, Math.PI*1.5);
		this.loadModel.loadModel('./img/stand.glb', { x: -284, y: 75, z: -974 }, Math.PI/2.5);
		this.loadModel.loadModel('./img/shelf.glb', { x: -372, y: 73, z: -935 }, Math.PI/2.5);
		this.loadModel.loadModel('./img/shelf.glb', { x: -350, y: 73, z: -995 }, Math.PI/2.5);
		this.loadModel.loadModel('./img/shelf.glb', { x: -330, y: 73, z: -1050 }, Math.PI/2.5);

		const imageLoadPromises = this.paths.map(path => this.loadModel.loadImages(path));
    }

	loadResources() {
		try {
			this.characterManager = new CharacterManager(this.scene, this.camera, "knight", "talk", new THREE.Vector3(250, 57, -1100), Math.PI*1.7, new THREE.Vector3(0.15,0.15,0.15));
			this.characterManagerSeat = new CharacterManager(this.scene, this.camera, "demon", "seat", new THREE.Vector3(-107, 76, -677), Math.PI/1.4, new THREE.Vector3(0.3,0.3,0.3));
			console.log("Resources loaded successfully");
		} catch (error) {
			console.error("Error loading resources:", error);
		}
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
        let wallGeometry = new THREE.CylinderGeometry(1700, 1700, 150, 16, 16, true);
        let wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0 });
        this.wall = new THREE.Mesh(wallGeometry, wallMaterial);
        this.wall.position.set(81, 60, -800);
        this.scene.add(this.wall);
    }

    collision(){
        this.velocityY -= this.gravity * this.clock.getDelta();
		const deltaMove = new THREE.Vector3(0, this.velocityY, 0);
		const raycaster = new THREE.Raycaster(this.camera.position, deltaMove.clone().normalize());
		const intersects = raycaster.intersectObject(this.mesh);

		if (intersects.length > 0) {
			const distance = intersects[0].distance;
			const collisionPoint = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(distance));
			this.camera.position.y = collisionPoint.y + 30;
			this.velocityY = 0;
		}
		else {
			this.camera.position.add(deltaMove);
		}
    }

	collideWithModel(model) {
		if (model) {
			const directions = [
				new THREE.Vector3(1, 0, 0), // Right
				new THREE.Vector3(-1, 0, 0), // Left
				new THREE.Vector3(0, 0, 1), // Forward
				new THREE.Vector3(0, 0, -1) // Backward
			];
	
			for (const direction of directions) {
				const raycaster = new THREE.Raycaster(this.camera.position, direction.clone().normalize());
				const intersects = raycaster.intersectObject(model, true);
	
				if (intersects.length > 0 && intersects[0].distance < 10) {
					this.camera.position.copy(this.previousCameraPosition);
					if(this.mobile)this.mobile.ifCollision = true;
					return;
				}
			}
		}
	}

	appear(symbol, opacity){
		document.getElementById("back").style.zIndex = `${symbol}`;
		if(!this.ifMobile){
			this.book.style.zIndex = `${symbol}`;
			this.book.style.opacity = `${opacity}`;
		} else if(this.ifMobile){
			let carouselImages = document.querySelectorAll('.carousel-image');
			for (let i = 0; i < carouselImages.length; i++) carouselImages[i].style.zIndex = `${symbol}`;

			let arrows = document.querySelectorAll('.arrow');
			for (let i = 0; i < arrows.length; i++) arrows[i].style.zIndex = `${symbol}`;

			let imgs = document.querySelectorAll('.mobile-image');
			for (let i = 0; i < imgs.length; i++) imgs[i].style.zIndex = `${symbol * -1}`;
		}
	}

	standMove() {
		if (this.loadModel.stand && !this.isMoving) {
			const standModel = this.loadModel.stand;
			const distance = this.camera.position.distanceTo(standModel.position);
	
			if (distance < 40) {
				this.isMoving = true;
				
				if(this.mobile) this.mobile.ifCollision = true;
				this.controls.enabled = false;
				const newPosition = new THREE.Vector3(standModel.position.x + 4, standModel.position.y + 35, standModel.position.z + 1);
				const lookAtTarget = new THREE.Vector3(standModel.position.x, standModel.position.y + 26, standModel.position.z - 0.3);
	
				TWEEN.removeAll();
	
				new TWEEN.Tween(this.camera.position)
					.to(newPosition, 2000)
					.easing(TWEEN.Easing.Quadratic.Out)
					.onUpdate(() => {
						this.camera.lookAt(lookAtTarget);
					})
					.onComplete(() => {
						this.appear(100, 1);
					})
					.start();
			}
		}
	}

	moveCameraBack() {
		if (this.isMoving) {						
			if (!this.ifMobile) this.controls.enabled = true;
			if (this.mobile) this.mobile.ifCollision = false;
			this.appear(-100, 0);
	
			this.book.style.zIndex = "-10";
			this.book.style.opacity = "0";
	
			const backDistance = 50;
			const backwardVector = this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-backDistance);
			const newPosition = this.camera.position.clone().add(backwardVector);
	
			TWEEN.removeAll();
	
			new TWEEN.Tween(this.camera.position)
				.to({ x: -200, y: 75, z: -974 }, 500)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onUpdate(() => {
					// Update camera orientation to look at the center (0, 0, 0)
					this.camera.lookAt(new THREE.Vector3(0, 0, 0));
					this.camera.updateProjectionMatrix();
				})
				.onComplete(() => {
					this.isMoving = false;
					// Ensure the camera is correctly oriented towards the center
					this.camera.lookAt(new THREE.Vector3(0, 0, 0));
					this.camera.updateProjectionMatrix();
					// Reset any mobile control variables that might interfere
					if (this.mobile) {
						this.mobile.stopMoving();
						this.mobile.stopTurning();
					}
				})
				.start();
		}
	}
	
	
	animate() {
		this.previousCameraPosition.copy(this.camera.position);
		this.render();
	}

    render() {
        const delta = this.clock.getDelta();
		this.controls.update(delta);
		this.sprite.lookAt(this.camera.position);
		if (this.characterManager) {
            this.characterManager.update(delta);
        }
		if (this.characterManagerSeat) {
            this.characterManagerSeat.update(delta);
        }

		if(this.mobile)this.mobile.ifCollision = false;
        this.collision();
		this.collideWithModel(this.wall);
		this.collideWithModel(this.loadModel.temple);
		this.collideWithModel(this.loadModel.temple1);
		this.collideWithModel(this.loadModel.torch);
		this.collideWithModel(this.loadModel.throne);
		this.collideWithModel(this.loadModel.roman);
		this.collideWithModel(this.loadModel.diane);
		this.collideWithModel(this.loadModel.david);
		this.collideWithModel(this.loadModel.stand);
		this.collideWithModel(this.loadModel.shelf);
 
		this.standMove()
		
		//console.log(this.camera.position)
        this.animatedText.update();
		TWEEN.update();
		this.renderer.render(this.scene, this.camera);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const terrainScene = new TerrainScene();
});
