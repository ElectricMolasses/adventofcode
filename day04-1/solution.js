const range = [168630, 718098];
// Solution
let count = 0;
for (let i = range[0]; i <= range[1]; i++) {
  let current = []
  current.push(Math.floor(i / 100000));
  current.push(Math.floor(
    (i % 100000) / 10000
  ));
  current.push(Math.floor(
    (i % 10000) / 1000
  ));
  current.push(Math.floor(
    (i % 1000) / 100
  ));
  current.push(Math.floor(
    (i % 100) / 10
  ));
  current.push(Math.floor(
    (i % 10)
  ));

  let hasDecreasing = false;
  let doubles = new Set();

  for (let i = 1; i < current.length; i++) {
    if (current[i] < current[i - 1]) {
      hasDecreasing = true;
    }
    if (current[i] === current[i - 1]) {
      doubles.add(current[i]);
      if (current[i] === current[i - 2]) {
        doubles.delete(current[i]);
      }
    }
  }

  if (!hasDecreasing && doubles.size > 0) count++;  
}

return console.log(count);