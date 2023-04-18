const particles = [];
let numParticles = 100;
let gravityEnabled = false;
let planetSize = 40;

// UI elements
let manipulativesBtn;
let manipulativesVisible = false;
let numParticlesSlider;
let planetGravitySlider;
let cursorGravitySlider;
let downwardGravitySlider;
let planetSizeSlider;
let planetSizeLabel;


// Add UI element variables
let numParticlesLabel;
let planetGravityLabel;
let cursorGravityLabel;
let downwardGravityLabel;

//Color Array
const colors = [
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255],
  [255, 255, 0],
  [255, 0, 255],
  [0, 255, 255],
];

let currentColorIndex = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create UI elements
  createUI();

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(colors[currentColorIndex][0], colors[currentColorIndex][1], colors[currentColorIndex][2], 25);

  if (frameCount % 120 === 0) {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
  }
   
  let contrastColor = getContrastColor(frameCount % 256);
  fill(contrastColor);


   // Add this line to set the text color of the labels
   numParticlesLabel.style('color', `rgb(${contrastColor}, ${contrastColor}, ${contrastColor})`);
   planetGravityLabel.style('color', `rgb(${contrastColor}, ${contrastColor}, ${contrastColor})`);
   cursorGravityLabel.style('color', `rgb(${contrastColor}, ${contrastColor}, ${contrastColor})`);
   downwardGravityLabel.style('color', `rgb(${contrastColor}, ${contrastColor}, ${contrastColor})`);
   planetSizeLabel.style('color', `rgb(${contrastColor}, ${contrastColor}, ${contrastColor})`);

  // Update variables based on UI
  numParticles = numParticlesSlider.value();
  const planetGravity = planetGravitySlider.value();
  const cursorGravity = cursorGravitySlider.value();
  const downwardGravity = downwardGravitySlider.value();

  // Update UI visibility
  manipulativesVisible ? showUI() : hideUI();

  // Adjust the particle count
  while (particles.length < numParticles) {
    particles.push(new Particle(random(width), random(height)));
  }
  while (particles.length > numParticles) {
    particles.pop();
  }

  const planetPos = createVector(width / 2, height / 2);
  fill((frameCount * 2) % 256, 100, 255);
  ellipse(planetPos.x, planetPos.y, planetSize);
  planetSize = planetSizeSlider.value();
  
  for (const particle of particles) {
    particle.update();
    particle.display();

    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      particle.follow(createVector(mouseX, mouseY), cursorGravity);
    }

    if (gravityEnabled) {
      particle.applyGravity(downwardGravity);
    }

    particle.applyGravityToPlanet(planetPos, planetGravity);
  }
}

function createUI() {
  manipulativesBtn = createButton('manipulatives');
  manipulativesBtn.position(50, height - 110);
  manipulativesBtn.mousePressed(() => {
    manipulativesVisible = !manipulativesVisible;
  });

  numParticlesSlider = createSlider(0, 300, 100);
  numParticlesSlider.position(20, height - 180);
  numParticlesSlider.style('width', '100px');
  numParticlesSlider.style('rotate', '-90deg');
  numParticlesLabel = createP('Particle Count');
  numParticlesLabel.position(5, height - 220);
  numParticlesLabel.style('rotate', '90deg');

  planetGravitySlider = createSlider(0, 20, 1, 0.1); // Increase max value from 5 to 10  
  planetGravitySlider.position(60, height - 180);
  planetGravitySlider.style('width', '100px');
  planetGravitySlider.style('rotate', '-90deg');
  planetGravityLabel = createP('Planet Gravity');
  planetGravityLabel.position(45, height - 220);
  planetGravityLabel.style('rotate', '90deg');

  cursorGravitySlider = createSlider(0, 5, 2, 0.1);
  cursorGravitySlider.position(100, height - 180);
  cursorGravitySlider.style('width', '100px');
  cursorGravitySlider.style('rotate', '-90deg');
  cursorGravityLabel = createP('Cursor Gravity');
  cursorGravityLabel.position(85, height - 220);
  cursorGravityLabel.style('rotate', '90deg');

  downwardGravitySlider = createSlider(0, 1, 0.1, 0.01);
  downwardGravitySlider.position(140, height - 180);
  downwardGravitySlider.style('width', '100px');
  downwardGravitySlider.style('rotate', '-90deg');
  downwardGravityLabel = createP('Downward Gravity [press g]');
  downwardGravityLabel.position(80, height - 220);
  downwardGravityLabel.style('rotate', '90deg');

  planetSizeSlider = createSlider(10, 200, planetSize, 1);
  planetSizeSlider.position(180, height - 180);
  planetSizeSlider.style('width', '100px');
  planetSizeSlider.style('rotate', '-90deg');
  planetSizeLabel = createP('Planet Size');
  planetSizeLabel.position(180, height - 220);
  planetSizeLabel.style('rotate', '90deg');
}

function getContrastColor(colorValue) {
  return (colorValue > 128) ? 0 : 255;
}

  
function showUI() {
  numParticlesSlider.show();
  planetGravitySlider.show();
  cursorGravitySlider.show();
  downwardGravitySlider.show();
  numParticlesLabel.show();
  planetGravityLabel.show();
  cursorGravityLabel.show();
  downwardGravityLabel.show();
  planetSizeLabel.show();
  planetSizeSlider.show();
}

  
function hideUI() {
  numParticlesSlider.hide();
  planetGravitySlider.hide();
  cursorGravitySlider.hide();
  downwardGravitySlider.hide();
  numParticlesLabel.hide();
  planetGravityLabel.hide();
  cursorGravityLabel.hide();
  downwardGravityLabel.hide();
  planetSizeLabel.hide();
  planetSizeSlider.hide();
}

  
  function mousePressed() {
    for (const particle of particles) {
      particle.scatter();
    }
  }
  
  function keyPressed() {
    if (key === "g" || key === "G") {
      gravityEnabled = !gravityEnabled;
    }
  }
  
  class Particle {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector();
      this.acc = createVector();
      this.size = random(4, 10);
      this.mass = this.size * 0.1;
    }
  
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
  
      this.checkEdges();
    }
  
    display() {
      const distToMouse = dist(this.pos.x, this.pos.y, mouseX, mouseY);
      const fillColor = map(distToMouse, 0, width / 2, 255, 0);
      fill((frameCount * 5 + fillColor) % 256, 100, 255);
      ellipse(this.pos.x, this.pos.y, this.size);
    }
  
    follow(target, strength) {
      const desired = p5.Vector.sub(target, this.pos);
      desired.normalize();
      desired.mult(2);
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(strength * 0.05);
      this.acc.add(steer);
    }
  
    scatter() {
      const scatterForce = p5.Vector.random2D();
      scatterForce.mult(5);
      this.acc.add(scatterForce);
    }
  
    applyGravity(force) {
      const gravity = createVector(0, force);
      this.acc.add(gravity);
    }
  
    applyGravityToPlanet(planetPos) {
      const force = p5.Vector.sub(planetPos, this.pos);
      const distanceSq = constrain(force.magSq(), 100, 10000);
      const G = 1;
      const strength = (G * planetSize * this.mass) / distanceSq;
      force.setMag(strength);
      this.acc.add(force);
    }
  
    checkEdges() {
      if (this.pos.x < -100 || this.pos.x > width + 100) {
        this.vel.x *= -1;
      }
    
      if (this.pos.y < 0) {
        this.vel.y *= -0.9;
      } else if (this.pos.y > height && gravityEnabled) {
        this.vel.y *= -0.9;
        this.pos.y = height;
      }
    }
  }