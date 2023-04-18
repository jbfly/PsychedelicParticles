const particles = [];
const numParticles = 100;
let gravityEnabled = false;
const planetSize = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(frameCount % 256, 50, 100, 25);

  const planetPos = createVector(width / 2, height / 2);
  fill((frameCount * 2) % 256, 100, 255);
  ellipse(planetPos.x, planetPos.y, planetSize);

  for (const particle of particles) {
    particle.update();
    particle.display();

    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      particle.follow(createVector(mouseX, mouseY));
    }

    if (gravityEnabled) {
      particle.applyGravity();
    }

    particle.applyGravityToPlanet(planetPos);
  }
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

  follow(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.normalize();
    desired.mult(2);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(0.05);
    this.acc.add(steer);
  }

  scatter() {
    const scatterForce = p5.Vector.random2D();
    scatterForce.mult(5);
    this.acc.add(scatterForce);
  }

  applyGravity() {
    const gravity = createVector(0, 0.1);
    this.acc.add(gravity);
  }

  applyGravityToPlanet(planetPos) {
    const force = p5.Vector.sub(planetPos, this.pos);
    const distanceSq = constrain(force.magSq(), 100, 10000);
    const G = 1;
    const strength = (G * planetSize) / distanceSq;
    force.setMag(strength);
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
