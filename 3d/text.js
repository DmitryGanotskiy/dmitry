import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';

class AnimatedText {
  constructor(scene, position = new THREE.Vector3(0, 0, 0)) {
    this.scene = scene;
    this.position = position;
    this.uniforms = { amplitude: { value: 0.0 } };
    this.mesh = null;
    this.cameraCollision = false;

    this.init();
  }

  init() {
    const loader = new FontLoader();
    loader.load('fonts/typeface.json', (font) => {
      this.createTextMesh(font);
    });
  }

  createTextMesh(font) {
    let geometry = new TextGeometry('    DMITRY\nGANOTSKIY', {
      font: font,
      size: 30,
      height: 5,
      curveSegments: 3,
      bevelThickness: 2,
      bevelSize: 1,
      bevelEnabled: true,
    });

    geometry.center();

    const tessellateModifier = new TessellateModifier(8, 6);
    geometry = tessellateModifier.modify(geometry);

    const numFaces = geometry.attributes.position.count / 3;

    const colors = new Float32Array(numFaces * 3 * 3);
    const displacement = new Float32Array(numFaces * 3 * 3);

    const color = new THREE.Color();

    for (let f = 0; f < numFaces; f++) {
      const index = 9 * f;

      const h = 0.6 + 0.1 * Math.random();
      const s = 0.7 + 0.3 * Math.random();
      const l = 0.5 + 0.3 * Math.random();

      color.setHSL(h, s, l);

      const d = 10 * (0.5 - Math.random());

      for (let i = 0; i < 3; i++) {
        colors[index + 3 * i] = color.r;
        colors[index + 3 * i + 1] = color.g;
        colors[index + 3 * i + 2] = color.b;

        displacement[index + 3 * i] = d;
        displacement[index + 3 * i + 1] = d;
        displacement[index + 3 * i + 2] = d;
      }
    }

    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('fragmentshader').textContent,
    });

    this.mesh = new THREE.Mesh(geometry, shaderMaterial);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = Math.PI;
    this.scene.add(this.mesh);
  }

  update() {
    const time = Date.now() * 0.001;
    this.uniforms.amplitude.value = 1.0 + Math.sin(time * 0.5);
  }
}

export {AnimatedText};
