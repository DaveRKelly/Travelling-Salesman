// Evolve Traveling Salesman

function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

// A DNA object is an order through the cities
function DNA(total, order) {
  this.dist = Infinity;
  this.fitness = 0;
  if (order instanceof Array) {
    this.order = order.slice();
    // Mutation
    // 50% of the time shuffle one spot to see if it improves
    if (random(1) < 0.05) {
      this.shuffle();
    }
  } else {
    this.order = [];
    for (var i = 0; i < total; i++) {
      this.order[i] = i;
    }
    for (var n = 0; n < 100; n++) {
      this.shuffle();
    }
  }
}

DNA.prototype.shuffle = function() {
  var i = floor(random(this.order.length));
  var j = floor(random(this.order.length));
  swap(this.order, i, j);
}

DNA.prototype.calcDistance = function() {
  var sum = 0;
  for (var i = 0; i < this.order.length - 1; i++) {
    var cityAIndex = this.order[i];
    var cityA = cities[cityAIndex];
    var cityBIndex = this.order[i + 1];
    var cityB = cities[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  this.dist = sum;
  return this.dist;
}

DNA.prototype.mapFitness = function(minD, maxD) {
  this.fitness = map(this.dist, minD, maxD, 1, 0);
  return this.fitness;
}

DNA.prototype.normalizeFitness = function(total) {
  this.fitness /= total;
}

DNA.prototype.show = function() {
  stroke(255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < this.order.length; i++) {
    var n = this.order[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();
  fill(255);
  for (var i = 0; i < this.order.length; i++) {
    var n = this.order[i];
    ellipse(cities[n].x, cities[n].y, 8, 8);
  }
}

DNA.prototype.crossover = function(other) {
  var order1 = this.order;
  var order2 = other.order;
  var start = floor(random(order1.length));
  var end = floor(random(start + 1, order1.length + 1));
  var neworder = order1.slice(start, end);
  var leftover = order1.length - neworder.length;
  var count = 0;
  var i = 0;
  while (count < leftover) {
    var city = order2[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
      count++;
    }
    i++;
  }
  return neworder;
}
