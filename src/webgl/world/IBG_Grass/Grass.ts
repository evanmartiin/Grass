import Experience from "@/webgl/Experience";
import { BackSide, Color, Float32BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, ShaderMaterial } from "three";
import type Debug from "@/webgl/controllers/Debug";
import type { TabPageApi } from "tweakpane";

import vert from "./vertex.glsl?raw"
import frag from "./fragment.glsl?raw"

export default class Grass {
  private experience: Experience = new Experience();
  private debug: Debug = this.experience.debug as Debug;
  private debugTab: TabPageApi | undefined = undefined;

  private PARAMS: any = {
    'instances': 1000,
    'spreadRatio': 10,
    'color': new Color("#00FF00")
  }

  private geometry: InstancedBufferGeometry | null = null;
  private material: ShaderMaterial | null = null;
  private mesh: Mesh | null = null;

  private offsetsArray: Float32Array | null = null;
  private offsetsAttribute: InstancedBufferAttribute | null = null;

  constructor() {
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setDebug();
  }

  setGeometry() {
    this.geometry = new InstancedBufferGeometry();
    this.geometry.instanceCount = this.PARAMS.instances;
    const positions = [];
    positions.push(-.1, 0, 0);
    positions.push(0, 1, 0);
    positions.push(.1, 0, 0);
    this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3)); // Base geometry vertices positions

    this.offsetsArray = new Float32Array(this.PARAMS.instances * 3);
    this.offsetsAttribute = new InstancedBufferAttribute(this.offsetsArray, 3);
    this.geometry.setAttribute('aOffset', this.offsetsAttribute); // Offset

    for (let i = 0; i < this.PARAMS.instances * 3; i+=3) {
      this.offsetsArray[i + 0] = (Math.random() - .5) * this.PARAMS.spreadRatio;
      this.offsetsArray[i + 1] = 0;
      this.offsetsArray[i + 2] = (Math.random() - .5) * this.PARAMS.spreadRatio;
    }
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      uniforms: {
        uColor: { value: this.PARAMS.color }
      },
      vertexShader: vert,
      fragmentShader: frag,
      side: BackSide
    });
  }

  setMesh() {
    if (this.geometry && this.material) {
      this.mesh = new Mesh(this.geometry, this.material);
      this.experience.scene?.add(this.mesh);
    }
  }

  regenerate() {
    this.geometry?.dispose();
    this.material?.dispose();
    this.experience.scene?.remove(this.mesh as Mesh);

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  update() {
    
  }

  setDebug() {
    if (this.debug.active) {
      this.debugTab = this.debug.ui?.pages[0];
      const instancesInput = this.debugTab?.addInput(this.PARAMS, 'instances', { min: 0, max: 10000 });
      const spreadInput = this.debugTab?.addInput(this.PARAMS, 'spreadRatio', { min: 0, max: 10 });
      const colorInput = this.debugTab?.addInput(this.PARAMS, 'color');

      instancesInput?.on('change', () => this.regenerate());
      spreadInput?.on('change', () => this.regenerate());
      colorInput?.on('change', () => this.regenerate());
    }
  }
}
