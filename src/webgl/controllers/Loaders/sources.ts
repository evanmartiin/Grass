import type { ISource } from "@/models/webgl/source.model";

const Sources: ISource[] = [
  {
    name: "lawnmower",
    type: "gltfModel",
    path: "/models/lawnmower.glb",
  },
  {
    name: "housev1texture",
    type: "texture",
    path: "/textures/housev4.jpg",
  },
];

export default Sources;
