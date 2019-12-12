const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

let array = [];
lineReader.on('line', (line) => {
  array.push(line);
});

lineReader.on('close', () => {
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].split("");
  }

  let temp = [...array];
  array = [];

  for (let i = 0; i < temp.length; i++) {
    array.push([]);
  }

  for (let i = 0; i < temp.length; i++) {
    for (let j = 0; j < temp[i].length; j++) {
      array[j][i] = temp[i][j];
    }
  }

  // Uhm..

  let best = 0;
  let bestPoint = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === '#') {
        let current = countVisible(i, j, array);
        if (current > best) {
          best = current;
          bestPoint = [i, j]
        }
      }
    }
  }
  // I'm at 23, 17
  // I need to find the angle from 23, 17 to each of the 
  // other points, and sort based on furthest from 90?
  // These are really just right angled triangles.  We CAN do it by four quadrants.
  let currentTargets = findVisible(bestPoint[0], bestPoint[1], array);

  // First we need to break each of the points into one of four quadrants.

  firstSort = sortToQuadrants(currentTargets, bestPoint);

  let orderDestroyed = sortQuadToFinal(firstSort, bestPoint);
  
  console.log(bestPoint);
  // orderDestroyed.forEach(item => console.log(item));
  console.log('ANSWER?', orderDestroyed[0],
                         orderDestroyed[1],
                         orderDestroyed[2],
                         orderDestroyed[9],
                         orderDestroyed[19],
                         orderDestroyed[49],
                         orderDestroyed[99],
                         orderDestroyed[198],
                         orderDestroyed[199],
                         orderDestroyed[200],);
  console.log(bestPoint);
  console.log('Final Answer: ', orderDestroyed[199]);
});

function sortQuadToFinal(targets, origin) {
  const final = [];
  for (let i = 0; i < targets.length; i++) {
    
      final.push(...targets[i].sort(([x1, y1], [x2, y2]) => {
        if (i === 0) {
          let slope1 = (y1 - origin[1]) / (x1 - origin[0]);
          let slope2 = (y2 - origin[1]) / (x2 - origin[0]);

          return slope1 - slope2;
        } else if (i === 1) {
          let slope1 = (y1 - origin[1]) / (x1 - origin[0]);
          let slope2 = (y2 - origin[1]) / (x2 - origin[0]);

          return slope1 - slope2;
        } else if (i === 2) {
          let slope1 = (y1 - origin[1]) / (x1 - origin[0]);
          let slope2 = (y2 - origin[1]) / (x2 - origin[0]);

          return slope1 - slope2;
        } else if (i === 3) {
          let slope1 = (y1 - origin[1]) / (x1 - origin[0]);
          let slope2 = (y2 - origin[1]) / (x2 - origin[0]);

          return slope1 - slope2;
        }
      }));
  }
  return final;
}

function sortToQuadrants(targets, origin) {
  let upperRight = [];
  let lowerRight = [];
  let lowerLeft = [];
  let upperLeft = [];

  for (const item of targets) {
    if (item[0] < origin[0]) {
      if (item[1] > origin[1]) {
        lowerLeft.push(item);
      }
      if (item[1] <= origin[1]) {
        upperLeft.push(item);
      }
    }
    if (item[0] >= origin[0]) {
      if (item[1] >= origin[1]) {
        lowerRight.push(item);
      }
      if (item[1] < origin[1]) {
        upperRight.push(item);
      }
    }
  }

  return [upperRight, lowerRight, lowerLeft, upperLeft];
}

function findVisible(x, y, map) {
  let visible = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] === '#' && i * 1000 + j !== x * 1000 + y) {
        if (isVisible(x, y, i, j, map)) visible.push([i, j]);
      }
    }
  }
  
  return visible;
}

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

  x1 += stepX;
  y1 += stepY;

  while (x1 !== x2 || y1 !== y2) {

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