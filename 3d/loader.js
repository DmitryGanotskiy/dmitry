import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

class ObjectManager {
    constructor(scene) {
        this.scene = scene;
        this.clickableObjects = [];
        this.frame = null;
        this.door = null;
        this.road = null;
        this.column = null;
        this.statue = null;
        this.postament = null;
        this.temple = null;
        this.temple1 = null;
        this.torch = null;
        this.throne = null;
        this.roman = null;
        this.david = null;
        this.diane = null;
        this.collision = [];
    }

    loadModel(path, position, rotation, callback) {
        const loader = new GLTFLoader();
        loader.load(
            path,
            (glb) => {
                const object = glb.scene;
    
                const filename = path.split('/').pop();
    
                if (filename === "frame.glb") {
                    object.scale.set(0.15, 0.15, 0.15);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.frame = object;
                } else if (filename === "door.glb") {
                    object.scale.set(13, 13, 13);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.door = object;
                } else if (filename === "column.glb") {
                    object.scale.set(0.5, 0.5, 0.5);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.column = object;
                } else if (filename === "statue.glb") {
                    object.scale.set(80,80,80);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.statue = object;
                } else if (filename === "postament.glb") {
                    object.scale.set(10, 10, 10);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.postament = object;
                } else if (filename === "temple.glb") {
                    object.scale.set(8, 8, 8);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.temple = object;
                } else if (filename === "temple1.glb") {
                    object.scale.set(15, 15, 15);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.temple1 = object;
                } else if (filename === "torch.glb") {
                    object.scale.set(0.15, 0.15, 0.15);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.torch = object;
                } else if (filename === "throne.glb") {
                    object.scale.set(0.3, 0.3, 0.3);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.throne = object;
                } else if (filename === "roman.glb") {
                    object.scale.set(30, 30, 30);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    
                    // Make the model slightly darker by adjusting material properties
                    object.traverse((child) => {
                        if (child.isMesh) {
                            child.material.color.multiplyScalar(0.8); // Adjust the scalar to control darkness
                        }
                    });
                
                    this.roman = object;
                } else if (filename === "diane.glb") {
                    object.scale.set(3, 3, 3);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.diane = object;
                } else if (filename === "david.glb") {
                    object.scale.set(100, 100, 100);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.david = object;
                }
                
    
                this.scene.add(object);
                console.log("Model loaded:", filename);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );
    }    

    loadImages(img) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(`./img/${img.path}`, (texture) => {
            const geometry = new THREE.PlaneGeometry(24, 40);
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(img.position.x, img.position.y, img.position.z);
            plane.rotation.y = img.rotation;
            this.scene.add(plane);
    
            plane.userData.clickable = true;
            this.clickableObjects.push(plane);
        });
    }
}

export { ObjectManager };
