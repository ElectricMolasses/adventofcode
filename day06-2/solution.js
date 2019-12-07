const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

// Read Separate Lines
let array = [];
lineReader.on('line', (line) => {
  array.push((line));
});

lineReader.on('close', () => {
  array = array.map(item => item.split([')']));
  let orbitMap = {};
  
  for (let i = 0; i < array.length; i++) {
    if (!orbitMap.hasOwnProperty(array[i][0])) {
      orbitMap[array[i][0]] = [];
    }
    orbitMap[array[i][0]].push(array[i][1]);
  }

  console.log(findRoute('YOU', 'SAN', orbitMap));
});

function countOrbits(current, orbitMap) {
  if (!orbitMap[current]) {
    return [1, 0];
  }
  let directOrbits = 1;
  let indirectOrbits = 0;

  for (let i = 0; i < orbitMap[current].length; i++) {
    [dOrbs, iOrbs] = countOrbits(orbitMap[current][i], orbitMap);
    directOrbits += dOrbs;
    indirectOrbits += iOrbs + dOrbs;
  }

  return [directOrbits, indirectOrbits];
};

function findRoute(current, target, orbitMap) {
  let pathCurrent = buildDrillPath('COM', current, orbitMap);
  let pathTarget = buildDrillPath('COM', target, orbitMap);
  let path = [];

  while (pathCurrent.length !== pathTarget.length) {
    if (pathCurrent.length > pathTarget.length) {
      path.push(pathCurrent.shift());
    } else {
      path.push(pathTarget.shift());
    }
  }
  
  while (pathCurrent[0] !== pathTarget[0]) {
    path.push(pathCurrent.shift());
    path.push(pathTarget.shift());
  }
  return path.length - 2;
}

function buildDrillPath(current, target, orbitMap, path = []) {
  if (current === target) {
    path.push(current);
    return path;
  }
  if (!orbitMap[current]) {
    return null
  }

  for (const child of orbitMap[current]) {
    let temp = buildDrillPath(child, target, orbitMap, path);
    if (temp) {
      path.push(current);
      return path;
    }
  }
}

// function findDepth(current, target, depth, orbitMap) {
//   if (current === target) return depth;
//   if (orbitMap[current] === undefined) return null;

//   depth++;
//   for (const child of orbitMap[current]) {
//     let temp = findDepth(child, target, depth, orbitMap);
//     if (temp) return temp;
//   }
// }