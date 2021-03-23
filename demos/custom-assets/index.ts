import * as o3 from "oasis-engine";
import { Material, PrimitiveMesh, Texture2D } from "oasis-engine";

const engine = new o3.WebGLEngine("o3-demo");

engine.canvas.resizeByClientSize();

const root = engine.sceneManager.activeScene.createRootEntity();
const box = root.createChild("box");
const renderer = box.addComponent(o3.MeshRenderer);
renderer.mesh = PrimitiveMesh.createCuboid(engine);
const mtl = new o3.UnlitMaterial(engine);
renderer.setMaterial(mtl);

const cameraEntity = root.createChild("camera");
const camera = cameraEntity.addComponent(o3.Camera);
camera.backgroundColor = new o3.Vector4(0.3, 0.3, 0.3, 1);
cameraEntity.transform.setPosition(10, 10, 10);
cameraEntity.transform.lookAt(new o3.Vector3(0, 0, 0));

engine.resourceManager.load<Texture2D>("/custom/px-texture.oasis").then((res) => {
  mtl.baseColorTexture = res;
});

const box2 = root.createChild("box");
box2.transform.setPosition(2, 0, 0);
const renderer2 = box2.addComponent(o3.MeshRenderer);
renderer2.mesh = PrimitiveMesh.createCuboid(engine);

engine.resourceManager.load<Material>("/custom/unlitMaterial.oasis").then((mtl) => {
  console.log(mtl);
  renderer2.setMaterial(mtl);
});

engine.run();
