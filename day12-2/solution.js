// Each moon has an x y and z position AND velocity.
// The velocity begins at 0.

// First update the velocity of each moon by applying gravity.
// Once all the moons velocities have been updated, update the position of every moon by applying velocity.

// To apply gravity, consider every PAIR of moons.
// Io, Europa, Ganymede, and Callisto.

// On each axis, the velocity of each moon changes by +-1 to pull the moons together.

// This occurs on every axis that the moons do not share the same value on.

// Once gravity has been applied, apply velocity.
// Every planet has a velocity value for each axis,
// apply all of these.

// <x=-4, y=3, z=15>
// <x=-11, y=-10, z=13>
// <x=2, y=2, z=18>
// <x=7, y=-1, z=0>

const planets = [
  {
    name: 'Io',
    x: -4,
    y: 3,
    z: 15
  },
  {
    name: 'Europa',
    x: -11,
    y: -10,
    z: 13
  },
  {
    name: 'Ganymede',
    x: 2,
    y: 2,
    z: 18
  },
  {
    name: 'Callisto',
    x: 7,
    y: -1,
    z: 0
  }
];

const test1 = [
  {
    name: 'Io',
    x: -1,
    y: 0,
    z: 2
  },
  {
    name: 'Europa',
    x: 2,
    y: -10,
    z: -7
  },
  {
    name: 'Ganymede',
    x: 4,
    y: -8,
    z: 8
  },
  {
    name: 'Callisto',
    x: 3,
    y: 5,
    z: -1
  }
];

const test2 = [
  {
    name: 'Io',
    x: -8,
    y: -10,
    z: 0
  },
  {
    name: 'Europa',
    x: 5,
    y: 5,
    z: 10
  },
  {
    name: 'Ganymede',
    x: 2,
    y: -7,
    z: 3
  },
  {
    name: 'Callisto',
    x: 9,
    y: -8,
    z: -3
  }
];

for (const planet of planets) {
  planet.velX = 0;
  planet.velY = 0;
  planet.velZ = 0;
}

for (const planet of test1) {
  planet.velX = 0;
  planet.velY = 0;
  planet.velZ = 0;
}

// step(planets);

function applyGravity(planets) {
  for (const planet of planets) {
    for (const otherPlanet of planets) {
      if (planet.name === otherPlanet.name) {}
      else {
        if (planet.x < otherPlanet.x) planet.velX++;
        if (planet.x > otherPlanet.x) planet.velX--;
        if (planet.y < otherPlanet.y) planet.velY++;
        if (planet.y > otherPlanet.y) planet.velY--;
        if (planet.z < otherPlanet.z) planet.velZ++;
        if (planet.z > otherPlanet.z) planet.velZ--;
      }
    }
  }
}

function applyVelocity(planets) {
  for (const planet of planets) {
    planet.x += planet.velX;
    planet.y += planet.velY;
    planet.z += planet.velZ;
  }
}

function potentialEnergy(planet) {
  let potentialE = 0;

  potentialE += Math.abs(planet.x);
  potentialE += Math.abs(planet.y);
  potentialE += Math.abs(planet.z);

  return potentialE;
}

function kineticEnergy(planet) {
  let kineticE = 0;

  kineticE += Math.abs(planet.velX);
  kineticE += Math.abs(planet.velY);
  kineticE += Math.abs(planet.velZ);

  return kineticE;
}

function SystemEnergy(planets) {
  let totalEnergy = 0;

  for (const planet of planets) {
    totalEnergy += potentialEnergy(planet) * kineticEnergy(planet)
  }

  return totalEnergy;
}

function recordPlanets(memory, planets) {
  let currentMemory = '';
  for (const planet of planets) {
    currentMemory += '' +
      planet.x + planet.y + planet.z +
      planet.velX + planet.velY + planet.velZ;
  }
  if (memory.has(currentMemory)) return false;
  memory.add(currentMemory);
  return true;
}

function step(planets) {
  const memory = new Set();
  let searching = true;
  let steps = -1;

  while (searching) {
    steps++;
    applyGravity(planets);
    applyVelocity(planets);
    searching = recordPlanets(memory, planets);
  }

  console.log(SystemEnergy(planets));
  console.log('Steps', steps);
}

function addToMemory(memory, axis) {
  let add = '';

  for (const item of axis) {
    add += item.pos + '' + item.vel;
  }
  if (memory.has(add)) {
    console.log(add);
    return true;
  }
  memory.add(add);
}

function findMatchesAxis(axis) {
  let memory = new Set();
  let matches = 0;
  let steps = 0;
  addToMemory(memory, axis);

  while (true) {
    for (const item of axis) {
      for (const otherItem of axis) {
        if (item.pos < otherItem.pos) item.vel++;
        if (item.pos > otherItem.pos) item.vel--;
      }
    }
    for (const item of axis) {
      item.pos += item.vel;
    }
    steps++;
    console.log(steps);
    if (addToMemory(memory, axis)) return steps;
  }
  
}

function findRepeat(planets) {
  let x = [];
  let y = [];
  let z = [];

  for (const planet of planets) {
    x.push({pos: planet.x, vel: 0});
    y.push({pos: planet.y, vel: 0});
    z.push({pos: planet.z, vel: 0});
  }

  const multiples = [
    findMatchesAxis(x),
    findMatchesAxis(y),
    findMatchesAxis(z)];

  console.log(multiples);
}

function lcm(values) {

}

console.log(findRepeat(planets));
// I popped the result into wulfram to get the LCM.
// Not difficult to add, but y'know.