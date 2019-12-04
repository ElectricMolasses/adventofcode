const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

// Read Separate Lines
const array = [];
lineReader.on('line', (line) => {
  array.push((line));
});

lineReader.on('close', () => {
  let arr = [[], []];

  array[0].split(',').forEach(item => arr[0].push(item));
  array[1].split(',').forEach(item => arr[1].push(item));

  arr[0] = arr[0].map(value => [value.charAt(0), Number(value.slice(1))]);
  arr[1] = arr[1].map(value => [value.charAt(0), Number(value.slice(1))]);

  // Assume central port is 0, 0
  // Brute force attempt, starting at index
  // 100000, 100000
  // let leastx = 0;
  // let mostx = 0;
  // let leasty = 0;
  // let mosty = 0;

  const grid = {};

  let x = 2000;
  let y = 2000;

  for (const value of arr[0]) {
    

    for (let i = 0; i < value[1]; i++) {
      if (value[0] === 'U') y++;
      if (value[0] === 'D') y--;
      if (value[0] === 'L') x--;
      if (value[0] === 'R') x++;

      if (!grid.hasOwnProperty(x)) {
        grid[x] = {};
      }
      grid[x][y] = 1;
    }
  }

  let smallestIntercept = 4000;
  let intercepts = [];

  x = 2000;
  y = 2000;
  for (const value of arr[1]) {
    

    

    for (let i = 0; i < value[1]; i++) {
      if (value[0] === 'U') y++;
      if (value[0] === 'D') y--;
      if (value[0] === 'L') x--;
      if (value[0] === 'R') x++;

      

      if (grid.hasOwnProperty(x) && grid[x][y] === 1) {
        intercepts.push([x, y]);
        let currentIntercept = 0;
        currentIntercept += Math.abs(x - 2000);
        currentIntercept += Math.abs(y - 2000);
        if (smallestIntercept > currentIntercept) {
          smallestIntercept = currentIntercept;
        }
      }
    }
  }
  console.log(intercepts);
  console.log(smallestIntercept);
});

// [ 'L', 432 ],
// [ 'D', 887 ],
// [ 'R', 469 ],
// [ 'U', 656 ],
// [ 'L', 428 ],
// [ 'D', 188 ],