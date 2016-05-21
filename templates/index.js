import THREE from 'three'
import createLoop from 'canvas-fit-loop'

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

const canvas = renderer.domElement
document.body.appendChild(canvas)

// Init
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
const scene = new THREE.Scene()

const app = createLoop(canvas, {
  scale: window.devicePixelRatio
})

app.on('resize', () => {
  let [width, height] = app.shape

  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
})

app.on('tick', (dt) => {
  renderer.render(scene, camera)
})

app.start()
