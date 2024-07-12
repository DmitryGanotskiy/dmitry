import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import TWEEN from "https://cdn.skypack.dev/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";

class MobileControls {
    constructor(scene, camera, renderer, controls, mech, clock) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.mech = mech;
        this.clock = clock;
        this.gravity = 9.8;
        this.velocityY = 0;
        this.controls.enabled = false;
        this.ifCollision = false;

        // Bind event listeners for touch events
        if (document.getElementById('right')) {
            document.getElementById('right').addEventListener('touchstart', this.startTurningRight.bind(this));
            document.getElementById('right').addEventListener('touchend', this.stopTurning.bind(this));
        }
        if (document.getElementById('left')) {
            document.getElementById('left').addEventListener('touchstart', this.startTurningLeft.bind(this));
            document.getElementById('left').addEventListener('touchend', this.stopTurning.bind(this));
        }
        if (document.getElementById('up')) {
            document.getElementById('up').addEventListener('touchstart', this.startMovingForward.bind(this));
            document.getElementById('up').addEventListener('touchend', this.stopMoving.bind(this));
        }
        if (document.getElementById('down')) {
            document.getElementById('down').addEventListener('touchstart', this.startMovingBackward.bind(this));
            document.getElementById('down').addEventListener('touchend', this.stopMoving.bind(this));
        }

        // Flag variables to track button states
        this.isTurningLeft = false;
        this.isTurningRight = false;
        this.isMovingForward = false;
        this.isMovingBackward = false;

        // Animation variables
        this.moveAnimation = null;
        this.turnAnimation = null;

        // Center of the screen
        this.screenCenter = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

        // Listener for window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.screenCenter.set(window.innerWidth / 2, window.innerHeight / 2);
    }

    startMovingForward() {
        if (!this.isMovingForward && !this.ifCollision) {
            this.isMovingForward = true;
            this.moveForward();
        }
    }

    stopMoving() {
        this.isMovingForward = false;
        this.isMovingBackward = false;
        if (this.moveAnimation) {
            this.moveAnimation.stop();
        }
    }

    startMovingBackward() {
        if (!this.isMovingBackward) {
            this.isMovingBackward = true;
            this.moveBackward();
        }
    }

    startTurningLeft() {
        if (!this.isTurningLeft) {
            this.isTurningLeft = true;
            this.turnLeft();
        }
    }

    startTurningRight() {
        if (!this.isTurningRight) {
            this.isTurningRight = true;
            this.turnRight();
        }
    }

    stopTurning() {
        this.isTurningLeft = false;
        this.isTurningRight = false;
        if (this.turnAnimation) {
            this.turnAnimation.stop();
        }
    }

    moveForward() {
        if(!this.ifCollision){
            const moveDistance = 25;
            const forwardVector = this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(moveDistance);

            this.moveAnimation = new TWEEN.Tween(this.camera.position)
            .to({
                x: this.camera.position.x + forwardVector.x,
                y: this.camera.position.y + forwardVector.y,
                z: this.camera.position.z + forwardVector.z
            }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.collision()
            })
            .onComplete(() => {
                if (this.isMovingForward) {
                    this.moveForward();
                } else if (this.isMovingBackward) {
                    this.moveBackward();
                }
            })
            .start();
        }
    }

    moveBackward() {
        const moveDistance = 25;
        const backwardVector = this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-moveDistance);

        this.moveAnimation = new TWEEN.Tween(this.camera.position)
            .to({
                x: this.camera.position.x + backwardVector.x,
                y: this.camera.position.y + backwardVector.y,
                z: this.camera.position.z + backwardVector.z
            }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.collision()
            })
            .onComplete(() => {
                if (this.isMovingBackward) {
                    this.moveBackward();
                } else if (this.isMovingForward) {
                    this.moveForward();
                }
            })
            .start();
    }

    turnLeft() {
        const turnAngle = Math.PI / 8;

        this.turnAnimation = new TWEEN.Tween(this.camera.rotation)
            .to({ y: this.camera.rotation.y - turnAngle }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                if (this.isTurningLeft) {
                    this.turnLeft();
                }
            })
            .start();
    }

    turnRight() {
        const turnAngle = Math.PI / 8;

        this.turnAnimation = new TWEEN.Tween(this.camera.rotation)
            .to({ y: this.camera.rotation.y + turnAngle }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                if (this.isTurningRight) {
                    this.turnRight();
                }
            })
            .start();
    }

    collision() {
        if (this.mech) {
            this.velocityY -= this.gravity * this.clock.getDelta();
            const deltaMove = new THREE.Vector3(0, this.velocityY, 0);
            const raycaster = new THREE.Raycaster(this.camera.position, deltaMove.clone().normalize());
            const intersects = raycaster.intersectObject(this.mech);
    
            if (intersects.length > 0) {
                const distance = intersects[0].distance;
                const collisionPoint = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(distance));
                this.camera.position.y = collisionPoint.y + 30;
                this.velocityY = 0;
            } else {
                this.camera.position.add(deltaMove);
            }
        }
    }
    
}

export { MobileControls };
