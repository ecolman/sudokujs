import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filter, times } from 'lodash';

import { actions as gameActions, selectors as gameSelectors } from 'redux/game';

import './styles.less';

let SCREEN_WIDTH = window.innerWidth - 4;
let SCREEN_HEIGHT = window.innerHeight - 4;

// taken from https://jsfiddle.net/dtrooper/dA7sM/
function Fireworks() {
  const dispatch = useDispatch();
  const showSolved = useSelector(gameSelectors.getShowSolved);
  const setShowSolved = show => dispatch(gameActions.SET_SHOW_SOLVED(show));

  const context = useRef(null);
  const MAX_PARTICLES = 400;

  let particles = [];
  let rockets = [];

  useEffect(() => {
    if (showSolved) {
      let launchInterval = setInterval(launch, 500);
      let loopInterval = setInterval(loop, 1000 / 50);
      document.addEventListener('click', handleClick);

      return () => {
        clearInterval(launchInterval);
        clearInterval(loopInterval);
        document.removeEventListener('click', handleClick);
      }
    }
  }, [showSolved])

  function launch() {
    launchFrom(Math.floor(Math.random() * SCREEN_WIDTH));
  }

  function launchFrom(x) {
    if (rockets.length < 6) {
      let rocket = new Rocket(x);
      rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
      rocket.vel.y = Math.random() * -3 - 4;
      rocket.vel.x = Math.random() * 4 - 2;
      rocket.size = 8;
      rocket.shrink = 0.999;
      rocket.gravity = 0.01;
      rockets.push(rocket);
    }
  }

  function loop() {
    // update screen size
    if (SCREEN_WIDTH != window.innerWidth) {
      SCREEN_WIDTH = window.innerWidth - 4;
    }

    if (SCREEN_HEIGHT != window.innerHeight) {
      SCREEN_HEIGHT = window.innerHeight - 4;
    }

    let canvasContext = context.current.getContext('2d');

    // clear canvas
    canvasContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
    canvasContext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    rockets = filter(rockets, rocket => {
      rocket.update();
      rocket.render(canvasContext);

      // calculate distance with Pythagoras
      //let distance = Math.sqrt(Math.pow(mousePos.x - rockets[i].pos.x, 2) + Math.pow(mousePos.y - rockets[i].pos.y, 2));
      let distance = 55;

      // random chance of 1% if rockets is above the middle
      let randomChance = rocket.pos.y < (SCREEN_HEIGHT * 2 / 3) ? (Math.random() * 100 <= 1) : false;

      /* Explosion rules
          - 80% of screen
          - going down
          - close to the mouse
          - 1% chance of random explosion
      */
      if (rocket.pos.y < SCREEN_HEIGHT / 5 || rocket.vel.y >= 0 || distance < 50 || randomChance) {
        rocket.explode(particles);
      } else {
        return true;
      }
    });

    particles = filter(particles, particle => {
      particle.update();

      // render and save particles that can be rendered
      if (particle.exists()) {
        particle.render(canvasContext);
        return true;
      }
    });

    while (particles.length > MAX_PARTICLES) {
      particles.shift();
    }
  }

  function handleClick() {
    setShowSolved(false);
  }

  return showSolved
    ? (
      <canvas width={SCREEN_WIDTH} height={SCREEN_HEIGHT}
        ref={context}
        styleName={'fireworks'} />
    )
    : null;
}

class Particle {
  constructor(pos) {
    this.pos = {
      x: pos ? pos.x : 0,
      y: pos ? pos.y : 0
    };
    this.vel = {
        x: 0,
        y: 0
    };
    this.shrink = .97;
    this.size = 2;

    this.resistance = 1;
    this.gravity = 0;

    this.flick = false;

    this.alpha = 1;
    this.fade = 0;
    this.color = 0;
  }

  update() {
    // apply resistance
    this.vel.x *= this.resistance;
    this.vel.y *= this.resistance;

    // gravity down
    this.vel.y += this.gravity;

    // update position based on speed
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // shrink
    this.size *= this.shrink;

    // fade out
    this.alpha -= this.fade;
  }

  render(c) {
    if (!this.exists()) {
      return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    let x = this.pos.x;
    let y = this.pos.y;
    let r = this.size / 2;

    let gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, `rgba(0, 0, 0, ${this.alpha})`);
    gradient.addColorStop(0.8, `hsla(${this.color}, 100%, 50%, ${this.alpha})`);
    gradient.addColorStop(1, `hsla(${this.color}, 100%, 50%, 0.1)`);

    c.fillStyle = gradient;

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
  }

  exists() {
    return this.alpha >= 0.1 && this.size >= 1;
  }
}

class Rocket extends Particle {
  constructor(x) {
    super({ x, y: SCREEN_HEIGHT});

    this.explosionColor = 0;
  }

  explode(particles) {
    // decide explosion shape for this rocket
    let explosionFunction;

    switch (Math.floor(Math.random() * 4)) {
      case 0:
          explosionFunction = this.heartShape;
          break;
      case 1:
          explosionFunction = this.starShape;
          break;
      default:
          explosionFunction = this.sphereShape;
    }

    // number of particles to be generated
    let count = Math.random() * 10 + 100;

    // create particles
    times(count, c => {
      let particle = new Particle(this.pos);

      // delegate to a random chosen function
      particle.vel = explosionFunction();

      particle.size = 10;

      particle.gravity = 0.2;
      particle.resistance = 0.92;
      particle.shrink = Math.random() * 0.05 + 0.93;

      particle.flick = true;
      particle.color = this.explosionColor;

      particles.push(particle);
    });
  }

  sphereShape() {
    let angle = Math.random() * Math.PI * 2;

    // emulate 3D effect by using cosine and put more particles in the middle
    let speed = Math.cos(Math.random() * Math.PI / 2) * 15;

    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
  }

  starShape() {
    let angle = Math.random() * Math.PI * 2;
    // sin(5*r) creates a star, need to add PI to rotate 180 degrees
    let speed = Math.sin(5 * angle + Math.PI) * 12 + Math.random() * 3;

    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
  }

  heartShape() {
    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 0.2 + 0.6;

    // invert y speed to display heart in the right orientation
    return {
      x: (16 * Math.pow(Math.sin(angle), 3)) * speed,
      y: (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * -speed
    };
  }

  render(c) {
    if (!this.exists()) {
      return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    let x = this.pos.x;
    let y = this.pos.y;
    let r = this.size / 2;

    let gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, `rgba(255, 255, 255, ${this.alpha})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${this.alpha})`);

    c.fillStyle = gradient;

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
  }
}

export default Fireworks;
