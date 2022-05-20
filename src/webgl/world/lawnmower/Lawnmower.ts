import type Loaders from "@/webgl/controllers/Loaders/Loaders";
import Experience from "@/webgl/Experience";
import anime from "animejs";
import { BoxBufferGeometry, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Vector2, Vector3 } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default class Lawnmower {
  private experience: Experience = new Experience();
  private loaders: Loaders = this.experience.loaders as Loaders;

  private PARAMS: any = {
    'speed': 2
  }

  private geometry: PlaneBufferGeometry | null = null;
  private material: MeshBasicMaterial | null = null;
  private mesh: Mesh | null = null;
  private model: GLTF | null = null;

  constructor() {
    this.setMesh();
    this.setControls();
  }

  setMesh() {
    this.model = this.loaders.items["lawnmower"] as GLTF;
    this.model.scene.position.y = .33;
    this.experience.scene?.add(this.model.scene);
    
  }

  setControls() {
    document.onkeydown = (e: KeyboardEvent) => {
        e = e || window.event;
    
        if (this.model?.scene) {
          let XZPos = new Vector2(this.model.scene.position.x, this.model.scene.position.z);
          if (e.key == 'ArrowUp') {
            XZPos.y -= this.PARAMS.speed;
            this.model.scene.rotation.y = Math.PI;
          }
          else if (e.key == 'ArrowDown') {
            XZPos.y += this.PARAMS.speed;
            this.model.scene.rotation.y = 0;
          }
          else if (e.key == 'ArrowLeft') {
            XZPos.x -= this.PARAMS.speed;
            this.model.scene.rotation.y = -Math.PI / 2;
          }
          else if (e.key == 'ArrowRight') {
            XZPos.x += this.PARAMS.speed;
            this.model.scene.rotation.y = Math.PI / 2;
          }

          const tl = anime.timeline({});
          tl.add(
            {
              targets: this.model.scene.position,
              x: XZPos.x,
              z: XZPos.y,
              duration: 500,
              easing: 'easeOutQuad',
              change: () => {
                this.experience.world?.ground?.grass?.updateLawnmower(this.model?.scene.position as Vector3);
              }
            },
            0
          );
        }
    }
  }

  destroy() {
    this.geometry?.dispose();
    this.material?.dispose();
    this.experience.scene?.remove(this.mesh as Mesh);
  }
}
