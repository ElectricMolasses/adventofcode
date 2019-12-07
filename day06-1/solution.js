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

  [dOrb, iOrb] = countOrbits(orbitMap['COM'], orbitMap);
  console.log([dOrb, iOrb], dOrb + iOrb);
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