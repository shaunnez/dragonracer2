import {IonicApp, Page, NavController, NavParams, Modal} from 'ionic/ionic';
import {ConfigService} from '../services/configService';
import {BetService} from '../services/betService';
import {Home} from '../home/home';
import {Game} from '../game/game';

@Page({
  templateUrl: 'app/placebet/placebet-modal.html',
  providers:[BetService]
})
class MyModal {
  constructor(nav: NavController, modal:Modal, params:NavParams, betService:BetService) {
    this.nav = nav;
    this.modal = modal;
    this.config = params.get('config');
    this.bet = params.get('bet');
    this.totalWeight = params.get('totalWeight');
    
    this.betService = betService;
    this.calculateWinAmount();
  }

  calculateWinAmount() {
		var probabilityOfWinning = this.bet.dragonWeight / this.totalWeight;
		var probabilityOfLosing = 1 - probabilityOfWinning;
		this.bet.winAmount = Math.round(probabilityOfLosing * this.bet.betAmount);
	}
  
  placeBet() {
    if(this.bet.betAmount > 0 && this.bet.betAmount <= this.config.playerScore) {
      this.betService.setBet(this.bet);
      this.nav.setRoot(Game, { bet: this.bet });
    } else {
      this.warning = true;
    }
  }
  
  closeModal() {
    let modal = this.modal.get();
    if(modal && modal.close) {
      modal.close();
    }
  }
}

@Page({
  templateUrl: 'app/placebet/placebet.html',
  providers:[ConfigService, BetService]
})
export class Placebet {
  constructor(app:IonicApp, nav:NavController, modal:Modal, configService:ConfigService, betService:BetService) {
    this.nav = nav;
    this.modal = modal;
    this.configService = configService;
    this.config = configService.loadConfig();
    
    this.betService = betService;
    this.bet = this.betService.getBet();
    this.bet.betAmount = Math.round(this.config.playerScore / 4);
    this.setTotalWeight();
  }
  
  setTotalWeight() {
		this.config = this.configService.loadConfig();
		var totalWeight = 0;
		for(var i = 0; i < this.config.amountOfDragons; i++) {
			totalWeight += this.config.dragons[i].weight;
		}
		this.totalWeight = totalWeight;
	}
  
  getOrdinal(n) {
		var s = ["th","st","nd","rd"];
		var v = n%100;
		return n+(s[(v-20)%10]||s[v]||s[0]);
	}
  
  openBetModal(dragonName, dragonWeight) {
		this.bet.dragonName = dragonName;
		this.bet.dragonWeight = dragonWeight;
    
    this.modal.open(MyModal, {
      bet: this.bet,
      config: this.config,
      totalWeight: this.totalWeight
    });
		
  }
}
