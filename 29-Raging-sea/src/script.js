import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Shaders
 */
import waterVertexShader from './Shaders/Water/vertex.glsl'
import waterFragmentShader from './Shaders/Water/fragment.glsl'
/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });
const debugObject = {}
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial(
{
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    side: THREE.DoubleSide,
    uniforms:
    {
        uBigWavesElevation: { value: 0.2 },
        uBigWavesSpeed: { value: 0.75 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uTime: { value : 0 },
        uDepthColor: { value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3.0 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4.0 }
    }
});


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
// water.scale.set(20.0, 20.0, 20.0);
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


const wavesUI = gui.addFolder('Waves');
const wavesColorUI = gui.addFolder('WavesColor');
const wavesSmallUI = gui.addFolder('SmallWaves');

wavesUI
    .add(waterMaterial.uniforms.uBigWavesElevation, 'value')
    .min(-1.0)
    .max(1.0)
    .step(0.01)
    .name('BigWaveElevation')

wavesUI
    .add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
    .min(0.0)
    .max(10.0)
    .step(0.01)
    .name('BigWaveSpeed')

wavesUI
    .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
    .min(1.0)
    .max(20.0)
    .step(0.01)
    .name('BigWaveFrequencyX')

wavesUI
    .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
    .min(1.0)
    .max(20.0)
    .step(0.01)
    .name('BigWaveFrequencyY')



wavesColorUI
    .addColor(debugObject, 'depthColor')
    .onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })

wavesColorUI
    .addColor(debugObject, 'surfaceColor')
    .onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })


wavesColorUI
    .add(waterMaterial.uniforms.uColorOffset, 'value')
    .min(0.0)
    .max(1.0)
    .step(0.001)
    .name('ColorOffset')


wavesColorUI
    .add(waterMaterial.uniforms.uColorMultiplier, 'value')
    .min(0.0)
    .max(10.0)
    .step(0.001)
    .name('ColorMultiplier')


wavesSmallUI
    .add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
    .min(0.0)
    .max(1.0)
    .step(0.001)
    .name('SmallWaveElevation')


wavesSmallUI
    .add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
    .min(0.0)
    .max(30.0)
    .step(0.001)
    .name('SmallWaveFrequency')


wavesSmallUI
    .add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
    .min(0.0)
    .max(4.0)
    .step(0.001)
    .name('SmallWaveSpeed')


wavesSmallUI
    .add(waterMaterial.uniforms.uSmallIterations, 'value')
    .min(0.0)
    .max(5.0)
    .step(1.0)
    .name('SmallWaveIterations')



wavesUI.close();
wavesColorUI.close();
wavesSmallUI.close();