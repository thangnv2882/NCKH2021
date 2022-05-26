import { GUI } from "../lib/lil-gui.module.min.js";

import { OrbitControls } from "../modules/OrbitControls.js";
import { DragControls } from "../modules/DragControls.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var option = $(".sofaOption");

let scene, camera, renderer, mesh;
let meshFloor1,
  meshFloor2,
  meshFloor3,
  meshFloor4,
  meshFloor5,
  meshFloor6,
  ambientLight,
  light;

let keyboard = {};
let player = { height: 1.8, speed: 0.15, turnSpeed: Math.PI * 0.005 };
let USE_WIREFRAME = false;
let loadingManager = null;
let RESOURCES_LOADED = false;

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Models index
var models = JSON.parse(localStorage.getItem(MODELS_KEY) || "[]");

let meshes = [];
let meshesAdd = [];
let modelsAdd = [];

let meter;
function calMeter(meter) {
  return meter * 1.3;
}

camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / innerHeight,
  0.1,
  1000
);

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x73777b);

  loadingManager = new THREE.LoadingManager();
  mesh = new THREE.Mesh();

  loadingManager.onLoad = function () {
    // load floor
    onLoadFloor();

    // load model
    onResourcesLoaded();
  };

  // add light
  addLight(calMeter(4), calMeter(5), calMeter(4));
  addLight(-calMeter(4), calMeter(5), -calMeter(4));

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  multiModel();

  camera.position.set(0, player.height, -5);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  animate();
}

function onLoadFloor() {
  meshFloor1 = new THREE.Mesh(
    new THREE.BoxGeometry(calMeter(10), calMeter(10), 0.1),
    new THREE.MeshPhongMaterial({
      color: 0xe8f9fd,
      wireframe: USE_WIREFRAME,
    })
  );
  meshFloor1.rotation.x -= Math.PI / 2;
  meshFloor1.receiveShadow = true;

  meshFloor2 = new THREE.Mesh(
    new THREE.PlaneGeometry(calMeter(10), calMeter(5)),
    new THREE.MeshPhongMaterial({
      color: 0xe8f9fd,
      wireframe: USE_WIREFRAME,
    })
  );
  meshFloor2.rotation.x -= Math.PI;
  meshFloor2.position.set(0, calMeter(2.5), calMeter(5));
  meshFloor2.receiveShadow = true;

  meshFloor3 = new THREE.Mesh(
    new THREE.PlaneGeometry(calMeter(10), calMeter(5)),
    new THREE.MeshPhongMaterial({
      color: 0xe8f9fd,
      wireframe: USE_WIREFRAME,
    })
  );
  meshFloor3.rotation.x -= 2 * Math.PI;
  meshFloor3.position.set(0, calMeter(2.5), -calMeter(5));
  meshFloor3.receiveShadow = true;

  meshFloor4 = new THREE.Mesh(
    new THREE.PlaneGeometry(calMeter(10), calMeter(5)),
    new THREE.MeshPhongMaterial({
      color: 0xe8f9fd,
      wireframe: USE_WIREFRAME,
    })
  );
  meshFloor4.rotation.y -= Math.PI / 2;
  meshFloor4.position.set(calMeter(5), calMeter(2.5), 0);
  meshFloor4.receiveShadow = true;

  meshFloor5 = new THREE.Mesh(
    new THREE.PlaneGeometry(calMeter(10), calMeter(5)),
    new THREE.MeshPhongMaterial({
      color: 0xe8f9fd,
      wireframe: USE_WIREFRAME,
    })
  );
  meshFloor5.rotation.y -= Math.PI / 2;
  meshFloor5.rotation.y -= Math.PI;
  meshFloor5.position.set(-calMeter(5), calMeter(2.5), 0);
  meshFloor5.receiveShadow = true;

  meshFloor6 = new THREE.Mesh(
    new THREE.PlaneGeometry(calMeter(10), calMeter(10)),
    new THREE.MeshPhongMaterial({
      color: 0xe8f9fd,
      wireframe: USE_WIREFRAME,
    })
  );
  meshFloor6.rotation.x -= Math.PI / 2;
  meshFloor6.rotation.x -= Math.PI;

  meshFloor6.position.set(0, calMeter(5), 0);
  meshFloor6.receiveShadow = true;

  let texture = new THREE.TextureLoader().load("./models/texture/floor1.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.set(5, 5);
  scene.add(meshFloor1);

  let texture2 = new THREE.TextureLoader().load("./models/texture/wall1.jpg");
  texture2.wrapS = THREE.RepeatWrapping;
  texture2.wrapT = THREE.RepeatWrapping;
  // texture2.repeat.set(50, 50);

  meshFloor1.material.map = texture;
  meshFloor2.material.map = texture2;
  meshFloor3.material.map = texture2;
  meshFloor4.material.map = texture2;
  meshFloor5.material.map = texture2;
  meshFloor6.material.map = texture2;

  scene.add(meshFloor1);
  scene.add(meshFloor2);
  scene.add(meshFloor3);
  scene.add(meshFloor4);
  scene.add(meshFloor5);
  scene.add(meshFloor6);
}

function addLight(x, y, z) {
  light = new THREE.PointLight(0xffffff, 1, 40);
  light.position.set(x, y, z);
  light.castShadow = true;
  light.shadow.bias = -0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 100;
  scene.add(light);
}

function multiModel() {
  for (const item of models) {
    generateModel(item);
  }
}

const generateModel = (item) => {
  var mtlLoader = new THREE.MTLLoader(loadingManager);
  mtlLoader.load(item.mtl, function (materials) {
    materials.preload();

    let objLoader = new THREE.OBJLoader(loadingManager);

    // const material = new THREE.MeshPhongMaterial({
    //   color: 0xbdb76b,
    //   wireframe: false,
    // });

    // objLoader.setMaterials(materials);
    objLoader.load(item.obj, function (mesh) {
      let texture = new THREE.TextureLoader().load(item.texture);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(50, 50);

      mesh.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          node.material.map = texture;
        }
      });
      item.mesh = mesh;
    });
  });
};

let loadingManager2 = null;
const generateAModel = (item) => {
  loadingManager2 = new THREE.LoadingManager();

  var mtlLoader = new THREE.MTLLoader(loadingManager2);
  mtlLoader.load(item.mtl, function (materials) {
    materials.preload();

    let objLoader = new THREE.OBJLoader(loadingManager2);

    const material = new THREE.MeshPhongMaterial({
      color: 0xbdb76b,
      wireframe: false,
    });

    objLoader.setMaterials(materials);
    objLoader.load(item.obj, function (mesh) {
      let texture = new THREE.TextureLoader().load(item.texture);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(50, 50);

      mesh.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          node.material.map = texture;
        }
      });
      item.mesh = mesh;
    });
  });
};

var modalCurrent;
let domEvents = new THREEx.DomEvents(camera, renderer.domElement);

var objects = [];

const loadAModel = (index) => {
  meshesAdd[index] = modelsAdd[index].mesh.clone();
  meshesAdd[index].translateX(-6);
  meshesAdd[index].translateY(0.05);
  meshesAdd[index].translateZ(6);
  // meshes[`${i}`].scale.set(3,3,3);

  scene.add(meshesAdd[index]);

  objects.push(meshesAdd[index].children[0]);

  clickModel(index);
};
let example = new THREE.Object3D();

// Runs when all resources are loaded
function onResourcesLoaded() {
  for (let i = 0; i < models.length; i++) {
    meshes[`${i}`] = models[i].mesh.clone();
    meshes[`${i}`].translateX(-6);
    meshes[`${i}`].translateY(0.05);
    meshes[`${i}`].translateZ(6);
    // meshes[`${i}`].scale.set(3,3,3);
    scene.add(meshes[`${i}`]);

    objects.push(meshes[`${i}`].children[0]);

    // var objects3D = new THREE.Object3D();
    // objects3D.add(meshes[`${i}`]);
    // var tControl = new TransformControls(camera, renderer.domElement);
    // tControl.addEventListener("change", render);
    // tControl.addEventListener("dragging-changed", (e) => {
    //   oControl.enabled = !e.value;
    // });
    // try {
    //   tControl.attach(objects3D);
    //   // tControl.attach(meshes[`${i}`]);
    // } catch (error) {
    //   console.log(error);
    // }
    // scene.add(tControl);
    // // tControl.setMode("rotate");

    clickModel(i);
    clickHiddenModel(i)
  }

  // console.log(modelsAdd.length);
  // loadModelAdd();

  var controlsDrag = new THREE.DragControls(
    objects,
    camera,
    renderer.domElement
  );
  controlsDrag.addEventListener("dragstart", dragStartCallback);
  controlsDrag.addEventListener("dragend", dragEndCallback);
  controlsDrag.addEventListener("drag", (event) => {
    event.object.position.y = 0;
  });
}
function dragStartCallback(event) {
  oControl.enabled = false;
}
function dragEndCallback(event) {
  oControl.enabled = true;
}

const clickModel = (i) => {
  domEvents.addEventListener(meshes[i], "click", () => {
    //   meshes["sofa"].scale.set(4, 4, 4);
    option.click();
    modalCurrent = i;
  });
};
const clickHiddenModel = (i) => {
  domEvents.addEventListener(meshes[i], "contextmenu", () => {
    // scene.remove(meshes[i])
    meshes[i].visible = false
  });
};

const setTexture = (textureInput) => {
  const item = models[modalCurrent];
  let texture = new THREE.TextureLoader().load(textureInput);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  item.mesh.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.map = texture;
    }
  });
};

var oControl = new OrbitControls(camera, renderer.domElement);

oControl.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
oControl.dampingFactor = 0.05;

oControl.screenSpacePanning = false;

oControl.maxPolarAngle = Math.PI / 2;

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.02;

  if (keyboard[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[65]) {
    // A key
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if (keyboard[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  if (keyboard[37]) {
    // left arrow key
    camera.rotation.y -= player.turnSpeed;
  }
  if (keyboard[39]) {
    // right arrow key
    camera.rotation.y += player.turnSpeed;
  }

  oControl.update();

  render();
}

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

// window.addEventListener('resize', onWindowResize);

// document.addEventListener( 'click', onClick );
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onload = init;

document.addEventListener("DOMContentLoaded", function () {
  var $ = document.querySelector.bind(document);
  var $$ = document.querySelectorAll.bind(document);

  var sofaTExture = $(".sofa_texture");
  const textureBox = $(".textureBox");
  const addModelBox = $(".addModelBox");

  const app = {
    html([first, ...string], ...values) {
      return values
        .reduce((acc, cur) => acc.concat(cur, string.shift()), [first])
        .filter((x) => (x && x !== true) || x === 0)
        .join("");
    },

    textureList: JSON.parse(localStorage.getItem(TEXTURE_SOFA_KEY) || "[]"),
    modelsAddList: JSON.parse(localStorage.getItem(MODELS_ADD_KEY) || "[]"),

    renderTextureBox() {
      textureBox.innerHTML = app.html`
          ${app.textureList.map((texture, index) => {
            return app.html`
                  <div class="sofa_texture p-3">
                      <div class="sofa_texture_img" style="background: url('${texture.texture}') no-repeat center center / cover">
                      </div>
                      
                  </div>
              `;
          })}`;
    },

    renderAddModelsBox() {
      addModelBox.innerHTML = app.html`
            ${app.modelsAddList.map((model, index) => {
              return app.html`
                    <div class="model_add p-3">
                        <div class="sofa_texture_img" style="background: url('${model.img}') no-repeat center center / cover">
                        </div>
                        
                    </div>
                `;
            })}`;
    },

    handleEvents: function () {
      const _this = this;
      var listTextureItem = $$(".sofa_texture");
      var listModelAdd = $$(".model_add");

      // Set texture for model
      listTextureItem.forEach((texture, index) => {
        texture.onclick = () => {
          setTexture(this.textureList[index].texture);
        };
      });

      // Add model
      listModelAdd.forEach((item, index) => {
        item.onclick = () => {
          modelsAdd.push(app.modelsAddList[index]);

          generateAModel(modelsAdd[index]);
          loadingManager2 = new THREE.LoadingManager();
          loadingManager2.onLoad = () => {
            loadAModel(index);
          };

          // modelsAdd.forEach((item, index) => {
          //   scene.add(meshesAdd[index]);
          // })
          // setTexture(this.textureList[index].texture);
        };
      });
    },

    render: function () {
      this.renderTextureBox();

      this.renderAddModelsBox();
    },

    start: function () {
      // Render playlist
      this.render();

      // Handle event
      this.handleEvents();
    },
  };

  app.start();
});
