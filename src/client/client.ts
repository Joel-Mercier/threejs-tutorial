import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
camera.position.z = 3

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5)
scene.add(hemisphereLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 100)
// scene.add(directionalLightHelper)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AxesHelper(10))


// BULB
const bulbShape = new THREE.Shape();
bulbShape.moveTo( 0, 0 );
bulbShape.absarc( 0, 0, 10, 0, 2 * Math.PI, false );
bulbShape.moveTo( 0, 0 );
const bulbMaterial = new THREE.MeshLambertMaterial({
  color: 0xf7880E,
  wireframe: false,
})
const bulbExtrudeSettings = {
	steps: 2,
	depth: 3,
	bevelEnabled: false,
}
const bulbGeometry = new THREE.ExtrudeGeometry(bulbShape, bulbExtrudeSettings)
const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial)
var bulbTriangleShape = new THREE.Shape();
const bulbTriangleX = 0
const bulbTriangleY = 0
bulbTriangleShape.moveTo(bulbTriangleX - 10, bulbTriangleY - 10);
bulbTriangleShape.lineTo(bulbTriangleX + 10, bulbTriangleY - 10);
bulbTriangleShape.lineTo(bulbTriangleX, bulbTriangleY + 7);
const bulbTriangleGeometry = new THREE.ExtrudeGeometry(bulbTriangleShape, bulbExtrudeSettings)
const bulbTriangle = new THREE.Mesh(bulbTriangleGeometry, bulbMaterial)
bulb.translateZ(-1)
bulbTriangle.rotateX(Math.PI)
bulbTriangle.translateY(10)
bulbTriangle.translateZ(-3)
scene.add(bulb)
bulb.add(bulbTriangle)

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
const bulbFolder = gui.addFolder('Bulb')
bulbFolder.add(bulb.rotation, 'x', 0, Math.PI * 2)
bulbFolder.add(bulb.rotation, 'y', 0, Math.PI * 2)
bulbFolder.add(bulb.rotation, 'z', 0, Math.PI * 2)
bulbFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

const animate = () => {
  requestAnimationFrame(animate)

  // bulb.rotation.y += 0.01

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
	document.getElementById("container").appendChild(warning)
}