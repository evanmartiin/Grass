import type Sizes from "@/webgl/controllers/Sizes";
import {
  CineonToneMapping,
  Object3D,
  PCFSoftShadowMap,
  Raycaster,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
  type Intersection,
} from "three";
import Experience from "./Experience";

export default class Renderer {
  private experience: Experience = new Experience();
  public canvas: HTMLCanvasElement = this.experience.canvas as HTMLCanvasElement;
  private sizes: Sizes = this.experience.sizes as Sizes;
  public instance: WebGLRenderer | null = null;
  public raycaster: Raycaster = new Raycaster();
  public intersects: Intersection[] = [];
  public hoveredScene: Object3D | undefined;

  constructor() {
    this.setInstance();
  }

  setInstance() {
    const isRetinaScreen = window.devicePixelRatio > 1;
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: !isRetinaScreen,
      powerPreference: "high-performance",
    });
    this.instance.outputEncoding = sRGBEncoding;
    this.instance.toneMapping = CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = PCFSoftShadowMap;
    this.instance.setClearColor("#0C1B51");
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  resize() {
    this.instance?.setSize(this.sizes.width, this.sizes.height);
    this.instance?.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    if (this.experience.camera?.instance && this.instance) {
      this.instance.render(this.experience.scene as Scene, this.experience.camera?.instance);
    }
  }
}
