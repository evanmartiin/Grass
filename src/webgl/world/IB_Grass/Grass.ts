import Experience from "@/webgl/Experience";
import { BackSide, BufferAttribute, Color, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, InterleavedBuffer, InterleavedBufferAttribute, Mesh, ShaderMaterial, Vector3 } from "three";
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
    'spreadRatio': 1,
    'color': new Color("#00FF00"),
    'width': .2
  }

  private geometry: InstancedBufferGeometry | null = null;
  public material: ShaderMaterial | null = null;
  private mesh: InstancedMesh | null = null;

  constructor() {
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setDebug();
  }

  setGeometry() {
    this.geometry = new InstancedBufferGeometry();

    // model: x,y,z,u,v
    const vertexBuffer = new InterleavedBuffer(new Float32Array([
      - this.PARAMS.width/2, 0, 0, 0, 0,
      0, 1, 0, .5, 1,
      this.PARAMS.width/2, 0, 0, 1, 0
    ]), 5);

    const positions = new InterleavedBufferAttribute(vertexBuffer, 3, 0);
    this.geometry.setAttribute('position', positions);

    const uvs = new InterleavedBufferAttribute(vertexBuffer, 2, 3);
    this.geometry.setAttribute('uv', uvs);

    const indices = new Uint16Array([0, 1, 2]);
    this.geometry.setIndex(new BufferAttribute(indices, 1));

		const instanceBuffer = new InstancedInterleavedBuffer(new Float32Array(this.PARAMS.instances * 5), 5, 1);
		const offsets = new InterleavedBufferAttribute(instanceBuffer, 3, 0);
		const scales = new InterleavedBufferAttribute(instanceBuffer, 1, 3);
    const cuts = new InterleavedBufferAttribute(instanceBuffer, 1, 4);

    const size = this.experience.world?.ground?.PARAMS.size ? this.experience.world?.ground?.PARAMS.size : 10;

		for (let i = 0; i < offsets.count; i++) {
			const x = (Math.random() - .5) * size * this.PARAMS.spreadRatio;
			const y = 0;
			const z = (Math.random() - .5) * size * this.PARAMS.spreadRatio;
			offsets.setXYZ(i, x, y, z);

      const scale = Math.random();
      scales.setX(i, scale);

      const cut = 1;
      cuts.setX(i, cut);
		}

		this.geometry.setAttribute('offset', offsets);
		this.geometry.setAttribute('scale', scales);
		this.geometry.setAttribute('cut', cuts);
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      uniforms: {
        uColor: { value: this.PARAMS.color },
        uCameraPos: { value: this.experience.camera?.instance?.position },
        uLawnmowerPos: { value: new Vector3(0, 0, 0) }
      },
      vertexShader: vert,
      fragmentShader: frag,
      side: BackSide
    });
  }

  setMesh() {
    if (this.geometry && this.material) {
      this.mesh = new InstancedMesh(this.geometry, this.material, this.PARAMS.instances);
      this.experience.scene?.add(this.mesh);
    }
  }

  regenerate() {
    this.destroy();

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  destroy() {
    this.geometry?.dispose();
    this.material?.dispose();
    this.experience.scene?.remove(this.mesh as Mesh);
  }

  update() {
    if (this.material) {
      this.material.uniforms.uCameraPos.value = this.experience.camera?.instance?.position;
    }
  }

  updateLawnmower(lawnmowerPosition: Vector3) {
    if (this.material && this.geometry) {
      this.material.uniforms.uLawnmowerPos.value = lawnmowerPosition;

      const offsets = this.geometry.attributes.offset.array;
      const cuts = this.geometry.attributes.cut.array;

      for (let i = 0; i < this.PARAMS.instances * 5; i+=5) {
        const pos = new Vector3(offsets[i + 0], offsets[i + 1], offsets[i + 2]);
        const distance = pos.distanceTo(lawnmowerPosition);
        if (distance < .5 && cuts[i + 4] > 0) {
          cuts[i + 4] = .2;
        }
      }

      this.geometry.attributes.cut.needsUpdate = true;
    }
  }

  setDebug() {
    if (this.debug.active) {
      this.debugTab = this.debug.ui?.pages[0];
      const instancesInput = this.debugTab?.addInput(this.PARAMS, 'instances', { min: 0, max: 200000 });
      const spreadInput = this.debugTab?.addInput(this.PARAMS, 'spreadRatio', { min: 0, max: 1 });
      const widthInput = this.debugTab?.addInput(this.PARAMS, 'width', { min: 0, max: 1 });
      const colorInput = this.debugTab?.addInput(this.PARAMS, 'color');

      instancesInput?.on('change', () => this.regenerate());
      spreadInput?.on('change', () => this.regenerate());
      widthInput?.on('change', () => this.regenerate());
      colorInput?.on('change', () => this.regenerate());
    }
  }
}
