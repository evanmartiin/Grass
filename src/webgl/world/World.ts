import type Debug from "@/webgl/controllers/Debug";
import type Loaders from "@/webgl/controllers/Loaders/Loaders";
import Experience from "@/webgl/Experience";
import { AxesHelper, DirectionalLight } from "three";
import type { FolderApi } from "tweakpane";
import Ground from "./ground/Ground";

export default class World {
  private experience: Experience = new Experience();
  private loaders: Loaders = this.experience.loaders as Loaders;
  public ground: Ground | null = null;
  private debugTab: FolderApi | undefined = undefined;
  private debug: Debug = this.experience.debug as Debug;

  constructor() {
    this.loaders.on("ready", () => {
      this.ground = new Ground();

      this.setLight();
      this.setAxis(),
      this.setDebug();
    });
  }

  setLight() {
    const sunLight = new DirectionalLight("#ffffff", 4);
    sunLight.castShadow = true;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.normalBias = 0.05;
    sunLight.position.set(200, 0, 200);
    this.experience.scene?.add(sunLight);
  }

  setAxis() {
    const axis = new AxesHelper(1);
    this.experience.scene?.add(axis);
  }

  setDebug() {
    
  }
}
