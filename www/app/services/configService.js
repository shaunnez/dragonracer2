
export class ConfigService {
  
  constructor() {
    this.localStorageName = 'dragonrace';
    this.config = this.getBaseConfig();
  }
  
  getBaseConfig() {
    var output = {
      playerName: 'New Player',
      playerScore: 100,
      animateBackgroundSpeed: 1,
      animateSunSpeed: 4,
      animateBackground: true,
      animateDragons: true,
      animateSun: true,
      playMusic: true,
      useOnlineService: false,
      amountOfDragons: 5,
      maxStepsToTake: 5,
      dragonTweenTime: 2,
      volume: 1,
      simulatorUrl: 'http://localhost:9000/api/decision/runDecisionSimulation',
      dragons: [{
        name: 'Raswarum',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Worturim',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Bhakris',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Sulgrax',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Vyrarinn',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Nerroth',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Lennalth',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Meseth',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Valstrath',
        weight: 1,
        score: 0,
        positions: []
      }, {
        name: 'Rylarth',
        weight: 1,
        score: 0,
        positions: []
      }]
    }
    return output;
  }

  resetConfig() {
    this.config = this.getBaseConfig();
    window.localStorage.setItem(this.localStorageName, JSON.stringify(this.config));
    return this.config;
  }
  
  resetScores() {
		for(var i = 0; i < this.config.dragons.length; i++) {
			var dragon = this.config.dragons[i];
			dragon.score = 0;
		}
		return this.saveConfig(this.config);
	}
  
  loadConfig() {
    try {
      var storedData = JSON.parse(window.localStorage.getItem(this.localStorageName));
      // update local config with stored data config by matching key names
      for(var k in storedData) {
        if(this.config[k] !== undefined && storedData[k] !== undefined) {
          this.config[k] = storedData[k];
        }
      } 
    } catch(ex) {
      // oh well
    }
		return this.config;
	}
  
  saveConfig(obj) {
    // update local config with json object passed in - match key names 
    for(var k in obj) {
      if(this.config[k] !== undefined && obj[k] !== undefined) {
        this.config[k] = obj[k];
      }
    }
    window.localStorage.setItem(this.localStorageName, JSON.stringify(this.config));
    return this.config;
  }
  
	getDragonIndexByName(name) {
		var idx = -1;
		for(var i = 0; i < this.config.dragons.length; i++) {
			if(this.config.dragons[i].name === name) {
				idx = i;
				break;
			}
		}
		return idx;
	}

	getDragonByName(name) {
		var dragon;
		for(var i = 0; i < this.config.dragons.length; i++) {
			if( this.config.dragons[i].name === name) {
				dragon =  this.config.dragons[i];
				break;
			}
		}
		return dragon;
	}
  
	// first = 100, second = 50, third = 33, fourth = 25, fifth = 20
	updateDragonsScores(dragonNames) {
	  var score;
		for(var i = 0; i < dragonNames.length; i++) {
			score = Math.round(100 / (i + 1));
			if(score < 20) {
				score = 0;
			}
			var dragon = this.getDragonByName(dragonNames[i]);
			if(dragon) {
				dragon.score += score;
				dragon.positions.push(i + 1);
			}
		}
		return this.saveConfig(this.config);
	}

}