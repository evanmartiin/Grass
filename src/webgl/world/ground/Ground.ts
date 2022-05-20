import type Debug from "@/webgl/controllers/Debug";
import Experience from "@/webgl/Experience";
import { Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three";
import type { TabPageApi } from "tweakpane";
import Grass from "../IB_Grass/Grass";
import Lawnmower from "../lawnmower/Lawnmower";

export default class Ground {
  private experience: Experience = new Experience();
  private debug: Debug = this.experience.debug as Debug;
  private debugTab: TabPageApi | undefined = undefined;

  public PARAMS: any = {
    'size': 10
  }

  private geometry: PlaneBufferGeometry | null = null;
  private material: MeshBasicMaterial | null = null;
  private mesh: Mesh | null = null;
  public grass: Grass | null = null;
  public lawnmower: Lawnmower | null = null;

  constructor() {
    this.grass = new Grass();
    this.lawnmower = new Lawnmower();

    this.setMesh();
    this.setDebug();
  }

  setMesh() {
    this.geometry = new PlaneBufferGeometry(this.PARAMS.size, this.PARAMS.size);
    this.material = new MeshBasicMaterial({ color: 'darkgreen' });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotateX(Math.PI * -.5);
    this.experience.scene?.add(this.mesh);
  }

  regenerate() {
    this.destroy();

    this.grass?.regenerate();
    this.setMesh();
  }

  destroy() {
    this.geometry?.dispose();
    this.material?.dispose();
    this.experience.scene?.remove(this.mesh as Mesh);
  }

  setDebug() {
    if (this.debug.active) {
      this.debugTab = this.debug.ui?.pages[0];
      const instancesInput = this.debugTab?.addInput(this.PARAMS, 'size', { min: 0, max: 100 });

      instancesInput?.on('change', () => this.regenerate());
    }
  }
}
