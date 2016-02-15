import {Page, NavController,NavParams} from 'ionic/ionic';
import {ConfigService} from '../services/configService';
import {GameService} from '../services/gameService';
import {Options} from '../options/options';
import {Stats} from '../stats/stats';
import {Placebet} from '../placebet/placebet';
import {Http} from 'angular2/http';

// var ngAudio = require('angular-audio');
var jQuery = require("jquery");
var TweenLite = require('gsap');

@Page({
  templateUrl: 'app/game/game.html',
  providers: [ConfigService, GameService]
})
export class Game {

  constructor(nav:NavController, configService:ConfigService, gameService:GameService, params: NavParams) {
    this.nav = nav;
    this.configService = configService;
    this.gameService = gameService;
    this.config = configService.loadConfig();
    this.bet = params.get('bet');
    this.initGame();
  }
  
  initGame() {
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, { backgroundColor : 0x2290cd });
    this.domContainer = document.getElementById('mainContainer');
    this.domContainer.innerHTML = '';
    this.domContainer.appendChild(this.renderer.view);
    
    this.stage = new PIXI.Container();
    this.container = new PIXI.Container();
    this.stage.addChild(this.container);
    
    this.loader = PIXI.loader;
    this.audio = document.getElementById('audio');
    
    this.sunTween = null;
    this.backgroundPosition = 0;
    this.animationFrame = null;
    
    try {
      var scope = this;
			this.loader.add('dragon', 'dragon/dragon.json');
			this.loader.once('complete', function(loader, res) {
        for (var i = scope.stage.children.length - 1; i >= 0; i--) {
          scope.stage.removeChild(scope.stage.children[i]);
        }
				window.dragonRes = res.dragon.spineData;
				scope.finishInit();
			});
			this.loader.load();
		} catch(ex) {
      for (var i = this.stage.children.length - 1; i >= 0; i--) {
        this.stage.removeChild(this.stage.children[i]);
      }
			this.finishInit();
		}
  }
  
  finishInit(spineData) {
    this.config = this.configService.loadConfig();
    this.animateBackground = this.config.animateBackground;
    this.maxDistance = this.width / this.config.maxStepsToTake;
    this.params = [];
    for(var i = 0; i < this.config.amountOfDragons; i++) {
      this.params.push(this.config.dragons[i]);
    }
    this.dragons = [];
    this.dragonCages = [];
    this.winningDragons = [];
    this.setupBackground();
    this.setupDragons(window.dragonRes);
    // start audio
    this.audio.volume = this.config.volume;
    if(this.config.playMusic) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
    this.startGame();
  }
  
  setupBackground() {
		// add background to stage
		var texture = PIXI.Texture.fromImage('img/Full.png');
		this.background = new PIXI.extras.TilingSprite(texture, this.width, 512); // stretch to full width
		this.background.position.y = this.height - 540; // place at bottom of stage
		this.stage.addChild(this.background);
		// add sun to stage
		var texture2 = PIXI.Texture.fromImage('img/sun.png');	
		this.sunSprite = new PIXI.Sprite(texture2);
		// anchor center to we can rotate
		this.sunSprite.anchor.x = 0.5;
		this.sunSprite.anchor.y = 0.5;
		this.sunSprite.position.x = this.width;
		this.stage.addChild(this.sunSprite);
	}

	setupDragons(spineData) {
		var dragon, dragonCage, localRect, scale;
		for(var i = 0; i < this.config.amountOfDragons; i++) {
			dragon = new PIXI.spine.Spine(spineData);
			localRect = dragon.getLocalBounds();
			var myFilter = new PIXI.filters.ColorMatrixFilter();
			myFilter.hue(i * 35);
			dragon.filters = [myFilter];
			dragon.skeleton.setToSetupPose();
			dragon.update(0);
			dragon.autoUpdate = true;
			// create a container for the spine animation and add the animation to it
			dragonCage = new PIXI.Container();
			dragonCage.addChild(dragon);
			// measure the spine animation and position it inside its container to align it to the origin
			dragon.position.set(-localRect.x, -localRect.y);
			// now we can scale, position and rotate the container as any other display object
			scale = Math.min((this.renderer.width * 0.2) / dragonCage.width, (this.renderer.height * 0.2) / dragonCage.height);
			dragonCage.scale.set(scale, scale);
			dragonCage.position.set(-(dragonCage.width), 10 + (this.height - 50) / this.config.amountOfDragons * i);
			// add the container to the stage
			this.stage.addChild(dragonCage);
			this.dragons.push(dragon);
			this.dragonCages.push(dragonCage);
		}
	}
  
	startGame() {
		this.gameWon = false;
		this.winningDragons = [];
		// move dragons to starting position
		this.moveDragonsToStartingPosition();
		// animate dragons up and down
		if(this.config.animateDragons) {
			this.startAnimatingDragons();
		}
		// start spinning sun
		if(this.config.animateSun) {
			this.startAnimatingSun();
		}
		// start animating background
		this.animateBackground = true;
		// start the actual animation frame
		this.animate();
		// run the game
		this.runGame();
	}
  
  moveDragonsToStartingPosition() {
		// move dragons to starting position
		for(var i = 0; i < this.dragonCages.length; i++) {
			this.dragonCages[i].position.x = -(this.dragonCages[i].width);
		}
	}
 
	startAnimatingDragons() {
		for(var i = 0; i < this.config.amountOfDragons; i++ ) {
			this.dragons[i].state.setAnimationByName(0, 'flying', true);
		}
	}

	stopAnimatingDragons() {
		for(var i = 0; i < this.config.amountOfDragons; i++ ) {
			this.dragons[i].state.setAnimationByName(0, 'flying', false);
		}
	}

	startAnimatingSun() {
		if(!this.sunTween) {
			this.sunTween = TweenLite.to(this.sunSprite, 60, { rotation: this.config.animateSunSpeed });
		} else {
			this.sunTween.restart();
		}
	}
  
	stopAnimatingSun() {
		if(this.sunTween) {
			this.sunTween.pause();
		}
	}
  
  animate() {
    var scope = this;
		this.animationFrame = requestAnimationFrame(function() {
      scope.animate();
    });
		this.renderer.render(this.stage);
		if(this.config.animateBackground && this.animateBackground) {
			this.backgroundPosition += this.config.animateBackgroundSpeed;
			this.background.tilePosition.x = -(this.backgroundPosition);
		}
	}
  
  runGame() {
    var scope = this;
		// duplicate params for safety
		var updateParams = JSON.parse(JSON.stringify({ items: this.params }));
		if(this.config.useOnlineService && !this.runLocally) {
			Http.post(this.config.simulatorUrl, updateParams).success(function(data) {
        scope.processGameResults(data)
      }).error(function() {
				scope.runLocally = true;
				scope.runGame();
			});
		} else {
			this.gameService.runDecisionSimulation(updateParams, function(data) {
        scope.processGameResults(data);
      });
		}
	}
  
  processGameResults(json) {
    var scope = this;
    var results = json.results || json;
		for(var i = 0; i < results.length; i++) {
			// get the dragon
			var dragonName = results[i].name;
			var dragonRanking = results[i].position;
			// get the original dragons index
			var dragonIdx = this.configService.getDragonIndexByName(dragonName);
			// get the dragon cage based on the above indx
			var dragonCage = this.dragonCages[dragonIdx];
			// the higher the ranking, the more distance it will move
			var distance = (this.maxDistance / dragonRanking) * 1.2;
			var nextPosX =  dragonCage.position.x + distance;
			var t1 = new TweenLite.to(dragonCage.position, this.config.dragonTweenTime, { x: nextPosX })
			// var dragonBox = nextPosX + dragonCage.width;
			if(nextPosX >= this.width) {
				// $ionicLoading.show({ template: 'We have a winner!<br/>Waiting for the game to end...' });
				if(this.winningDragons.indexOf(dragonName) === -1) {
					this.winningDragons.push(dragonName);
				}
				if(this.winningDragons.length.toString() === this.config.amountOfDragons.toString()) {
					this.gameWon = true;
				}
			}
		}
		if(!this.gameWon) {
			// rerun game, half the time it takes the dragon to move to keep things smooth
			this.runGameTimeout = setTimeout(function() {
				scope.runGame();
			}, this.config.dragonTweenTime * 500);
		} else {
			this.endGameTimeout = setTimeout(function() {
				// update scores
				scope.config = scope.configService.updateDragonsScores(scope.winningDragons);
				// calculate new score
				if(scope.bet.dragonName === scope.winningDragons[0]) {
					scope.bet.pointsMade = scope.bet.winAmount;
					scope.config.playerScore += scope.bet.winAmount;
				} else {
					scope.bet.pointsMade = -scope.bet.betAmount;
					scope.config.playerScore -= scope.bet.betAmount;
				}
				// used for game winner overlay
				scope.gameService.winningDragons = scope.winningDragons;
				scope.configService.saveConfig(scope.config);
        // dirty jquery for lazy coding
        jQuery('body').addClass('md-show');
				// end game
				scope.endGame();
			}, this.config.dragonTweenTime * 1000);
		}
  }
  
  endGame() {
    // md-show
    clearTimeout(this.runGameTimeout);
		clearTimeout(this.endGameTimeout);
		this.stopAnimatingDragons();
		this.stopAnimatingSun();
		this.animateBackground = false;
		cancelAnimationFrame(this.animationFrame);
  }
  
  hideWinners() {
		this.winningDragons = '';
		this.showWinners = false;
    // dirty jquery for lazy coding
    jQuery('body').removeClass('md-show');
	}

	resetGame() {
		this.hideWinners();
		this.endGame();
    this.nav.setRoot(Placebet);
	}

	viewStats() {
		this.hideWinners();
		this.endGame();
    this.nav.setRoot(Stats);
	}
}
