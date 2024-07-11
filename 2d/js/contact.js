// contact.js

import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

class ThreeJSScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.targetX = 0;
        this.targetY = 0;
        this.mouseX = 0;
        this.mouseY = 0;

        this.earth = null;
        this.moon = null;
        this.moonOrbitRadius = 70; // Adjusted orbit radius for better visibility
        this.moonOrbitSpeed = 0.001; // Adjusted orbit speed for slower animation

        this.init();
        this.setupListeners();
        this.animate();

        // Call sphere method to create the earth and moon with textures
        this.sphere('earth', { x: -150, y: -160, z: 50 }, 50); // Earth at center
        this.sphere('moon', { x: this.moonOrbitRadius, y: -160, z: 50 }, 5); // Moon initial position
        this.createMoonOrbit();
    }

    init() {
        this.camera.position.set(0, 0, 150); // Adjusted camera position
        this.camera.lookAt(this.scene.position); // Camera looks at the scene center

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(this.renderer.domElement);

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            '2d/img/posx.jpg',
            '2d/img/negx.jpg',
            '2d/img/posy.jpg',
            '2d/img/negy.jpg',
            '2d/img/posz.jpg',
            '2d/img/negz.jpg',
        ]);
        this.scene.background = texture;
    }

    setupListeners() {
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = (event.clientY / window.innerHeight) * 2 + 1;

        // Adjust sensitivity and scaling factor as needed
        this.targetX = this.mouseX * 0.5; 
        this.targetY = this.mouseY * 0.5; 
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update camera rotation towards the mouse cursor direction
        this.camera.rotation.x += (-this.targetY - this.camera.rotation.x) * 0.05;
        this.camera.rotation.y += (-this.targetX - this.camera.rotation.y) * 0.05;

        if (this.moon) {
            // Calculate moon's position in orbit around the earth
            const time = Date.now() * this.moonOrbitSpeed;
            this.moon.position.x = this.earth.position.x + Math.cos(time) * this.moonOrbitRadius;
            this.moon.position.y = this.earth.position.y + Math.sin(time) * this.moonOrbitRadius;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    sphere(path, position, size) {
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(`2d/img/${path}.jpg`);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.set(position.x, position.y, position.z);
        this.scene.add(sphere);

        if (path === 'earth') {
            this.earth = sphere;
            this.earth.rotation.z = Math.PI / 2;
        } else if (path === 'moon') {
            this.moon = sphere;
        }
    }

    createMoonOrbit() {
        const orbitGeometry = new THREE.CircleGeometry(this.moonOrbitRadius, 64);
        orbitGeometry.vertices.shift(); 
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);

        orbit.rotation.x = Math.PI / 2; // Rotate the orbit to be in the xy-plane
        this.scene.add(orbit);
    }
}

// Initialize the scene
const app = new ThreeJSScene();
