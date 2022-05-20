import type Sizes from "@/webgl/controllers/Sizes";
import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Experience from "../Experience";

export default class Camera {
  private experience: Experience = new Experience();
  private sizes: Sizes = this.experience.sizes as Sizes;
  private canvas: HTMLCanvasElement = this.experience.canvas as HTMLCanvasElement;
  public instance: PerspectiveCamera | null = null;
  public controls: OrbitControls | null = null;

  constructor() {
    this.instance = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000);
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.instance.position.set(0, 10, 15);
    this.experience.scene?.add(this.instance);

    this.controls.addEventListener('change', () => this.experience.world?.ground?.grass?.update());
  }

  update() {
    this.controls?.update();
  }

  resize() {
    if (this.instance) {
      this.instance.aspect = this.sizes.width / this.sizes.height;
    }
    this.instance?.updateProjectionMatrix();
  }
}
