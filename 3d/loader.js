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
                    object.scale.set(0.1, 0.1, 0.1);
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
                    object.scale.set(5, 5, 5);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.temple = object;
                } else if (filename === "temple1.glb") {
                    object.scale.set(15, 15, 15);
                    object.position.set(position.x, position.y, position.z); 
                    object.rotation.y = rotation;
                    this.temple1 = object;
                }
    
                this.scene.add(object);
                //console.log("Model loaded:", filename);
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
        textureLoader.load(`img/${img.path}.jpg`, (texture) => {
            const geometry = new THREE.PlaneGeometry(2.3, 3.1);
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
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
