import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js";

class CharacterManager {
    constructor(scene, camera, path, initialAnimation, position, rotation, scale) {
        this.scene = scene;
        this.camera = camera;
        this.path = path;
        this.initialAnimation = initialAnimation;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale
        this.mixers = [];
        this.currentAction = null;
        this.currentMixer = null;
        this.animations = {};
        this.gravity = 9.8;
        this.velocityY = 0;
        this.model = null;  // Store the model object here
        this.loadModelAndAnimations();
    }

    loadModelAndAnimations() {
        const loader = new FBXLoader();

        loader.load(`./hero/${this.path}.fbx`, (object) => {
            object.scale.set(this.scale.x, this.scale.y, this.scale.z); 
            object.position.set(this.position.x, this.position.y, this.position.z);
            object.rotation.y = this.rotation;
            this.scene.add(object);
            this.model = object;  // Store the model object

            const mixer = new THREE.AnimationMixer(object);
            this.mixers.push(mixer);
            this.currentMixer = mixer;

            const animLoader = new FBXLoader();

            animLoader.load(`./hero/${this.initialAnimation}.fbx`, (anim) => {
                const action = mixer.clipAction(anim.animations[0]);
                action.setLoop(THREE.LoopRepeat);
                this.animations[this.initialAnimation] = action;
                action.play();
                this.currentAction = action;
            }, undefined, (error) => {
                console.error('An error occurred while loading the animation:', error);
            });

        }, undefined, (error) => {
            console.error('An error occurred while loading the model:', error);
        });
    }

    change(animationName) {
        if (this.currentMixer && this.animations[animationName]) {
            if (this.currentAction) this.currentAction.stop();

            const action = this.animations[animationName];
            action.play();
            this.currentAction = action;
        }
    }

    collisionCamera() {
        if (this.path === 'demon' && this.currentAction) {
            const distance = this.camera.position.distanceTo(this.position);
            if (distance < 50 && this.currentAction !== this.animations['talk']) {
                this.change('talk');
            } else if (distance >= 50 && this.currentAction !== this.animations['wave']) {
                this.change('wave');
            }
        }
    }

    update(delta) {
        this.velocityY -= this.gravity * delta;

        if (this.model) {
            this.model.rotation.y = this.rotation;  // Apply y-axis rotation
        }

        this.collisionCamera();
        this.mixers.forEach(mixer => {
            mixer.update(delta); 
        });
    }
}

export { CharacterManager };
