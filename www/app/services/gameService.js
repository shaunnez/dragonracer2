var _ = require('lodash');

export class GameService {
  
  
  constructor() {
  }
  
	runDecisionSimulation(json, callback) {
	  this.startDecisionSimulation(json.items, function(result) {
	    callback(result);  
	  });
	};
	
	startDecisionSimulation(items, callback) {
	  var result = { results: [] };
	  this.simulate(items, [], function(resultList) {
	    result.results = resultList;
	    return callback(result);
	  });
	};
	
	simulate(items, resultList, callback) {
	  if (items.length == 1) {
	    resultList.push({
	      'name': items[0].name,
	      'position': resultList.length + 1
	    });
	    return callback(resultList);
	  }

	  var totalWeight = this.calculateTotalWeight(items);
	  var portions = {};

	  for (var i = 0; i < items.length; i++) {
	    if (i === 0) {
	      portions[items[i].name] = items[i].weight
	    } else {
	      portions[items[i].name] = items[i].weight + portions[items[i - 1].name];
	    }
	  }

	  var randomNumber = this.getRandomNumber(1, totalWeight);
	  var result = {
      random: randomNumber + ' from range:  1-' + totalWeight,
      portions: portions,
      winner: this.determineWinner(portions, randomNumber)
    };
    
	  resultList.push({
	    'name': result.winner,
	    'position': resultList.length + 1
	  });
	  this.removeWinner(result.winner, items);
    
    var scope = this;
	  setTimeout(function() {
	    scope.simulate(items, resultList, callback);
	  }, 0);
	}
  
	removeWinner(winner, items) {
	  for (var i = 0; i < items.length; i++) {
	    if (items[i].name === winner) {
	      items.splice(i, 1);
	    }
	  };
	}
	
	calculateTotalWeight(items) {
	  var totalWeight = 0;
	  for (var i = 0; i < items.length; i++) {
	    totalWeight += items[i].weight;
	  };
	  return totalWeight;
	}
	
	determineWinner(portions, random) {
	  for (var i in portions) {
	    if (random <= portions[i]) {
	      return i;
	    };
	  }
	}
	
	getRandomNumber(minRange, maxRange) {
	  return _.random(minRange, maxRange);
	}
	
}