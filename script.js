// 3D Rubik's Cube Viewer with Smooth Scramble + Solve

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

const colors = ['red', 'green', 'blue', 'orange', 'white', 'yellow'];

function createCubie(x, y, z) {
  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
  const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));
  const cube = new THREE.Mesh(geometry, materials);
  cube.position.set(x, y, z);
  return cube;
}

// Create Rubik's cube group
const group = new THREE.Group();
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const cubie = createCubie(x, y, z);
      group.add(cubie);
    }
  }
}
scene.add(group);

let scrambleSteps = [];
let isAnimating = false;
let currentStep = 0;
let isScrambled = false;

function scrambleCube() {
  if (isAnimating) return;

  scrambleSteps = [];
  currentStep = 0;
  isAnimating = true;

  // Generate 10 random steps
  for (let i = 0; i < 10; i++) {
    const axis = ['x', 'y', 'z'][Math.floor(Math.random() * 3)];
    const angle = (Math.PI / 2);
    scrambleSteps.push({ axis, angle });
  }
}

function solveCube() {
  if (isAnimating || !isScrambled) return;

  // Reverse the scramble steps
  scrambleSteps = scrambleSteps.map(step => ({
    axis: step.axis,
    angle: -step.angle
  })).reverse();

  currentStep = 0;
  isAnimating = true;
  isScrambled = false;
}

function animate() {
  requestAnimationFrame(animate);

  // Smooth rotation animation for scramble/solve
  if (isAnimating && currentStep < scrambleSteps.length) {
    const step = scrambleSteps[currentStep];
    group.rotation[step.axis] += step.angle / 20;

    step.counter = (step.counter || 0) + 1;
    if (step.counter >= 20) {
      currentStep++;
    }
  } else if (isAnimating) {
    isAnimating = false;
    scrambleSteps = [];
    currentStep = 0;
    isScrambled = true;
  }

  // Idle spin
  if (!isAnimating) {
    group.rotation.y += 0.003;
  }

  renderer.render(scene, camera);
}
animate();

// Responsive resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Expose for buttons
window.scrambleCube = scrambleCube;
window.solveCube = solveCube;
