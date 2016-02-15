import {Page, NavController} from 'ionic/ionic';
import {ConfigService} from '../services/configService';
import {Placebet} from '../placebet/placebet';

@Page({
  templateUrl: 'app/options/options.html',
  providers: [ConfigService]
})
export class Options {

  constructor(nav:NavController, configService:ConfigService) {
    this.nav = nav;
    this.configService = configService;
    this.config = configService.loadConfig();
    this.totalWeight = 0;
  }
  
  goToBetPage() {
    this.nav.setRoot(Placebet);
  }
  
  save() {
    this.configService.saveConfig(this.config);
    this.goToBetPage();
  }
  
  reset() {
    this.configService.resetConfig();
    this.goToBetPage();
  }
  
  resetScores() {
    this.configService.resetScores();
    this.goToBetPage();
  }
  
  calculateTotalWeight() {
    var totalWeight = 0;
		for(var i = 0; i < this.config.amountOfDragons; i++) {
			totalWeight += this.config.dragons[i].weight;
		}
		this.totalWeight = totalWeight;
  }
  
}
