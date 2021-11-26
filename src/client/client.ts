import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { WEBGL as webGL } from 'three/examples/jsm/WebGL'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x222222)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.x = 200
camera.position.y = 50

// const testCubeGeometry = new THREE.BoxGeometry()
// const testCubeMaterial = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
//     wireframe: true,
// })

// const testCube = new THREE.Mesh(testCubeGeometry, testCubeMaterial)
// testCube.position.set(0, 0, 0)
// scene.add(testCube)

// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xffffff, 4, 100)
pointLight.position.set(0, 0, 0)
scene.add(pointLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 100)
// scene.add(directionalLightHelper)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AxesHelper(10))

// BULB
const bulbShape = new THREE.Shape();
bulbShape.moveTo(0, 0);
bulbShape.absarc(0, 0, 10, 0, 2 * Math.PI, false);
bulbShape.moveTo(0, 0);
// const bulbTexture = new THREE.TextureLoader().load('/assets/lightbulb-wire.png')
const bulbMetallicTexture = new THREE.TextureLoader().load('/assets/metallic-texture.jpg')
// const bulbMaterial = new THREE.MeshLambertMaterial({
//   color: 0xf7880E,
//   wireframe: false,
//   map: bulbTexture,
// })
// const bulbExtrudeSettings = {
// 	steps: 2,
// 	depth: 3,
// 	bevelEnabled: false,
// }
// const bulbGeometry = new THREE.ExtrudeGeometry(bulbShape, bulbExtrudeSettings)
// const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial)
// var bulbTriangleShape = new THREE.Shape();
// const bulbTriangleX = 0
// const bulbTriangleY = 0
// bulbTriangleShape.moveTo(bulbTriangleX - 10, bulbTriangleY - 10);
// bulbTriangleShape.lineTo(bulbTriangleX + 10, bulbTriangleY - 10);
// bulbTriangleShape.lineTo(bulbTriangleX, bulbTriangleY + 7);
// const bulbTriangleGeometry = new THREE.ExtrudeGeometry(bulbTriangleShape, bulbExtrudeSettings)
// const bulbTriangle = new THREE.Mesh(bulbTriangleGeometry, bulbMaterial)
// bulb.translateZ(-1)
// bulbTriangle.rotateX(Math.PI)
// bulbTriangle.translateY(10)
// bulbTriangle.translateZ(-3)
// scene.add(bulb)
// bulb.add(bulbTriangle)


const cloudMaterial = new THREE.MeshLambertMaterial({
  color: 0xfcfceb,
  wireframe: false,
})

const objLoader = new OBJLoader()
objLoader.load('assets/lightbulb.obj',
  (object) => {
    object.traverse(child => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "Sphere001") {
          // child.material.map = bulbTexture
          // child.material = new THREE.MeshPhongMaterial({
          //   color: 0xffffff,
          //   wireframe: false,
          //   transparent: true,
          //   opacity: 0.5,
          //   emissive: 0xf7880E
          // })
          const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(2048)
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 1.0,
            roughness: 0.2,
            envMap: cubeRenderTarget.texture,
            refractionRatio: 0.95,
            transparent: true,
            opacity: 0.5,
            transmission: 0.3,
            side: THREE.FrontSide,
            clearcoat: 1.0,
            clearcoatRoughness: 0.39
          })
          cubeRenderTarget.texture.mapping = THREE.CubeRefractionMapping
        } else if (child.name === "Cylinder001") {
          child.material.map = bulbMetallicTexture
        } else {
          child.material.map = bulbMetallicTexture
        }
      }
    })
    scene.add(object)
  },
  (xhr) => {
    console.log(`Lightbulb ${(xhr.loaded / xhr.total) * 100}% loaded`)
  },
  (error) => {
    console.error(error)
  }
)

const gltfLoader = new GLTFLoader()
let cloudCircle: any
gltfLoader.load('assets/cloud-circle.gltf',
  (gltf) => {
    cloudCircle = gltf.scene
    scene.add(gltf.scene)
  },
  (xhr) => {
    console.log(`Clouds ${xhr.total > 0 ? (xhr.loaded / xhr.total) * 100 : 100}% loaded`)
  },
  (error) => {
    console.error(error)
  }
)

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

window.addEventListener('resize', onWindowResize, false)

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
// const bulbFolder = gui.addFolder('Bulb')
// bulbFolder.add(bulb.rotation, 'x', 0, Math.PI * 2)
// bulbFolder.add(bulb.rotation, 'y', 0, Math.PI * 2)
// bulbFolder.add(bulb.rotation, 'z', 0, Math.PI * 2)
// bulbFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

const animate = () => {
  requestAnimationFrame(animate)
  cloudCircle ? cloudCircle.rotation.y += 0.001 : null
  render()

  stats.update()
}

const render = () => {
  renderer.render(scene, camera)
}

if (webGL.isWebGLAvailable()) {
  animate()
} else {
  const warning = webGL.getWebGLErrorMessage()
  let warningContainer = document.getElementById('container')
	if (warningContainer) (warningContainer as HTMLElement).appendChild(warning)
}