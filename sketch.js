// Evolve Traveling Salesperson

// Cities
var cities = [];
var totalCities = 15;

// Best path overall
var recordDistance = Infinity;
var bestEver;

// Population of possible orders
var population = [];
var popTotal = 200;

function setup() {
  createCanvas(600, 600);

  // Make random cities
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(10, width - 10), random(10, height / 2 - 10));
    cities[i] = v;
  }

  // Create population
  for (var i = 0; i < popTotal; i++) {
    population[i] = new DNA(totalCities);
  }

}

function draw() {
  background(0);

  // Each round let's find the shortest and longest paths
  var minDist = Infinity;
  var maxDist = 0;

  // Search for the shortest distance this round and overall
  var bestNow;
  for (var i = 0; i < population.length; i++) {
    var d = population[i].calcDistance();

    // Is this the shortest distance of all time?
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i];
    }

    // Is this the shortest distance this time around?
    if (d < minDist) {
      minDist = d;
      bestNow = population[i];
    }

    // Is this the worst distance?
    if (d > maxDist) {
      maxDist = d;
    }
  }

  // Show the shortest distance this round
  bestNow.show();
  translate(0, height / 2);
  line(0, 0, width, 0);
  // Show the shortest distance ever
  bestEver.show();

  // Map all the fitness values between 0 and 1
  var sum = 0;
  for (var i = 0; i < population.length; i++) {
    sum += population[i].mapFitness(minDist, maxDist);
  }

  // Normalize them to a probability between 0 and 1
  for (var i = 0; i < population.length; i++) {
    population[i].normalizeFitness(sum);
  }

  // Selection

  // The new population
  var newPop = [];

  // Same population size
  for (var i = 0; i < population.length; i++) {

    // Pick two
    var a = pickOne(population);
    var b = pickOne(population);

    // Crossover
    var order = a.crossover(b);
    newPop[i] = new DNA(totalCities, order);
  }

  // New population
  population = newPop;
}

// This is a new algorithm to select based on fitness probability
// It only works if all the fitness values are normalized and add up to 1
function pickOne() {
  var index = 0;

  // Pick a random number between 0 and 1
  var r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= population[index].fitness;
    index += 1;
  }

  index -= 1;

  return population[index];
}
