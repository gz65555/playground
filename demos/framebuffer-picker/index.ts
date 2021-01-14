import { OrbitControl } from "@oasis-engine/controls";
import { FramebufferPicker } from "@oasis-engine/framebuffer-picker";
import {
  AssetType,
  Camera,
  EnvironmentMapLight,
  Logger,
  MeshRenderer,
  SystemInfo,
  Vector3,
  Vector4,
  WebGLEngine
} from "oasis-engine";

Logger.enable();

const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;
const scene = engine.sceneManager.activeScene;
const rootNode = scene.createRootEntity();
//-- create engine object

let envLightNode = rootNode.createChild("env_light");
let envLight = envLightNode.addComponent(EnvironmentMapLight);

//-- create camera
let cameraNode = rootNode.createChild("camera_node");
cameraNode.transform.position = new Vector3(0, 0, 30);
const camera = cameraNode.addComponent(Camera);
cameraNode.addComponent(OrbitControl);

/** ResourceList.ts */
const ResourceList = [
  "https://gw.alipayobjects.com/os/bmw-prod/83219f61-7d20-4704-890a-60eb92aa6159.gltf",
  {
    urls: [
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*Bk5FQKGOir4AAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_cPhR7JMDjkAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*trqjQp1nOMQAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_RXwRqwMK3EAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*q4Q6TroyuXcAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*DP5QTbTSAYgAAAAAAAAAAAAAARQnAQ"
    ],
    type: AssetType.TextureCube
  },
  {
    urls: [
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5w6_Rr6ML6IAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*TiT2TbN5cG4AAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*8GF6Q4LZefUAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*D5pdRqUHC3IAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_FooTIp6pNIAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*CYGZR7ogZfoAAAAAAAAAAAAAARQnAQ"
    ],
    type: AssetType.TextureCube
  }
];

engine.resourceManager.load(ResourceList).then((res) => {
  const gltf = res[0];

  let mesh = gltf.meshes[0];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      let testNode = rootNode.createChild("test_mesh" + x + y);
      testNode.transform.position = new Vector3((x - 2) * 5, (y - 2) * 5, 0);
      testNode.transform.rotation = new Vector3(90, 0, 0);

      const meshRender = testNode.addComponent(MeshRenderer);
      meshRender.mesh = mesh;
      meshRender.setSharedMaterial(0, gltf.materials[0]);
    }
  }

  envLight.diffuseTexture = res[1];
  envLight.specularTexture = res[2];

  // framebuffer picker
  let lastMaterial;
  let laseBaseColor;
  let framebufferPicker = rootNode.addComponent(FramebufferPicker);
  framebufferPicker.camera = camera;
  framebufferPicker.onPick = (obj) => {
    if (lastMaterial) lastMaterial.baseColorFactor = laseBaseColor;

    if (obj) {
      const { primitive, component } = obj;
      const idx = component.mesh.primitives.indexOf(primitive);
      let material = component.getInstanceMaterial(idx);
      if (!material) {
        material = component.getSharedMaterial(idx).clone();
        component.setMaterial(idx, material);
      }

      lastMaterial = material;
      laseBaseColor = material.baseColorFactor;
      material.baseColorFactor = new Vector4(1, 0, 0, 1);
    }
  };

  document.getElementById("o3-demo").addEventListener("mousedown", (e) => {
    // console.log(e.offsetX, e.offsetY);
    framebufferPicker.pick(e.offsetX, e.offsetY);
  });
});

//-- run
engine.run();
