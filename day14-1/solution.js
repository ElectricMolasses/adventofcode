const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

let input = [];
let ingredients = [];
let results = [];
lineReader.on('line', (line) => {
  let ingredient;
  let result;

  [ingredient, result] = (String(line).split('=>'));
  ingredients.push(ingredient.trim().split(','));
  results.push(result.trim());
});

lineReader.on('close', () => {
  let array = [];

  let numOut;
  let recipes;

  [recipes, numOut] = organizeRecipes(ingredients, results);
  recipes = {
    regents: recipes, numOut
  };

  console.log(calcOre(recipes));
});

/*
regents:
   { A: [ ['REGENT', NUMREQ] ],
     B: [ [Array] ],
     C: [ [Array] ],
     AB: [ [Array], [Array] ],
     BC: [ [Array], [Array] ],
     CA: [ [Array], [Array] ],
     FUEL: [ [Array], [Array], [Array] ] },
  numOut: { A: 2, B: 3, C: 5, AB: 1, BC: 1, CA: 1, FUEL: 1 }
*/

function calcOre(recipes, pool = {}, current = 'FUEL', required = 1) {
  let ore = 0;

  for (const regents of recipes.regents[current]) {

    if (regents[0] === 'ORE') {
      ore += regents[1] * required;
      continue;
    }

    let nextRequired = required;

    while (nextRequired % recipes.numOut[regents[0]] !== 0) nextRequired++; 
    
    if (pool.hasOwnProperty(regents[0])) {
      pool[regents[0]] += 
    }

    ore += calcOre(recipes, pool, regents[0], nextRequired / recipes.numOut[current]);
  }
  return ore;
}

function organizeRecipes(ingredients, results) {
  const recipes = {};
  const numOut = {};
  for (let i = 0; i < ingredients.length; i++) {
    output = results[i].split(' ');
    recipes[output[1]] = [];
    numOut[output[1]] = Number(output[0]);

    for (let input of ingredients[i]) {
      input = input.trim().split(' ');
      recipes[output[1]].push(
        [input[1], Number(input[0])]
      );
    }
  }

  return [recipes, numOut];
}