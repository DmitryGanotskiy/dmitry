import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

class Stars {
    constructor(scene, count=150, size=10) {
        this.scene = scene;
        this.count = count;
        this.size = size;
        this.geometry = new THREE.BufferGeometry();
        this.materials = [];

        this.init();
    }

    init() {
        let positions = new Float32Array(this.count * 3);

        for (let i = 0; i < this.count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 4500; // x
            positions[i * 3 + 1] = Math.random() * 100 + 1000; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4500; // z
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        let sprite = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');

        for (let i = 0; i < 100; i++) { // Reduced the number of materials
            let material = new THREE.PointsMaterial({
                size: this.size,
                map: sprite,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true
            });

            material.color.setHSL(Math.random(), 0.3, 0.7);

            let particles = new THREE.Points(this.geometry, material); // Reusing the geometry

            this.scene.add(particles);
            this.materials.push(material);
        }
    }

    animate() {
        let time = Date.now() * 0.00005;

        this.materials.forEach((material, i) => {
            let hue = ((360 * (i / this.materials.length)) + time) % 360;
            material.color.setHSL(hue / 360, 0.3, 0.7);
        });
    }
}

export { Stars }
