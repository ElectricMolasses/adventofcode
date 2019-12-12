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

for (const planet of planets) {
  planet.velX = 0;
  planet.velY = 0;
  planet.velZ = 0;
}

step(planets);

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

function step(planets) {
  for (let i = 0; i < 1000; i++) {
    applyGravity(planets);
    applyVelocity(planets);
  }

  console.log(SystemEnergy(planets));
}