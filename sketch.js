const particles = [];
let numParticles = 100;
let gravityEnabled = false;
const planetSize = 40;

// UI elements
let manipulativesBtn;
let manipulativesVisible = false;
let numParticlesSlider;
let planetGravitySlider;
let cursorGravitySlider;
let downwardGravitySlider;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create UI elements
  createUI();

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(frameCount % 256, 50, 100, 25);

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
  manipulativesBtn.position(20, height - 50);
  manipulativesBtn.mousePressed(() => {
    manipulativesVisible = !manipulativesVisible;
  });

  numParticlesSlider = createSlider(0, 300, 100);
  numParticlesSlider.position(20, height - 100);
  numParticlesSlider.style('width', '200px');
  numParticlesSlider.style('rotate', '90deg');

  planetGravitySlider = createSlider(0, 5, 1, 0.1);
  planetGravitySlider.position(width - 60, height - 100);
  planetGravitySlider.style('width', '200px');
  planetGravitySlider.style('rotate', '90deg');

  cursorGravitySlider = createSlider(0, 5, 2, 0.1);
  cursorGravitySlider.position(width - 120, height - 100);
    cursorGravitySlider.style('width', '200px');
    cursorGravitySlider.style('rotate', '90deg');
  
    downwardGravitySlider = createSlider(0, 1, 0.1, 0.01);
    downwardGravitySlider.position(width / 2 - 100, height - 20);
    downwardGravitySlider.style('width', '200px');
  }
  
  function showUI() {
    numParticlesSlider.show();
    planetGravitySlider.show();
    cursorGravitySlider.show();
    downwardGravitySlider.show();
  }
  
  function hideUI() {
    numParticlesSlider.hide();
    planetGravitySlider.hide();
    cursorGravitySlider.hide();
    downwardGravitySlider.hide();
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
  
    applyGravityToPlanet(planetPos, strength) {
      const force = p5.Vector.sub(planetPos, this.pos);
      const distanceSq = constrain(force.magSq(), 100, 10000);
      const G = strength;
      const gForce = (G * planetSize) / distanceSq;
      force.setMag(gForce);
      this.acc.add(force);
    }
  
    checkEdges() {
      if (this.pos.x < 0 || this.pos.x > width) {
        this.vel.x *= -1;
      }
      if (this.pos.y < 0 || this.pos.y > height) {
        this.vel.y *= -0.9;
      }
    }
  }