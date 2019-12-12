const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

const array = [];
lineReader.on('line', (line) => {
  array.push(line);
});

lineReader.on('close', () => {
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].split("");
  }

  // Uhm..

  let best = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === '#') {
        let current = countVisible(i, j, array);
        if (current > best) best = current;
      }
    }
  }
  console.log(best);
  return best;
});

function countVisible(x, y, map) {
  let count = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] === '#' && i * 1000 + j !== x * 1000 + y) {
        if (isVisible(x, y, i, j, map)) count++;
      }
    }
  }
  
  return count;
}

function isVisible(x1, y1, x2, y2, map) {
  if (x1 === x2 && y1 === y2) return false;
  let stepX = x2 - x1;
  let stepY = y2 - y1;

  let divide = gcd(stepX, stepY) || 1;

  stepX /= divide;
  stepY /= divide;
  
  if (stepX === 0) y1 > y2 ? stepY = -1 : stepY = 1;
  if (stepY === 0) x1 > x2 ? stepX = -1 : stepX = 1;
  console.log(stepX, stepY);

  x1 += stepX;
  y1 += stepY;

  while (x1 !== x2 || y1 !== y2) {
    console.log(x1, x2, y1, y2);
    if (map[x1][y1] === '#') {
      return false;
    }

    x1 += stepX;
    y1 += stepY;
  }
  if (map[x1][y1] === '#') return true;
}

function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  let result = x;

  while (true) {
    if (x % result === 0 && y % result === 0) {
      return result;
    }
    result --;
  }
}