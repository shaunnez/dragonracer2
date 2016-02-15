import {IonicApp, Page, NavController, Modal} from 'ionic/ionic';
import {ConfigService} from '../services/configService';


@Page({
  templateUrl: 'app/stats/stats.html',
  providers:[ConfigService]
})
export class Stats {
  constructor(app:IonicApp, nav:NavController, configService:ConfigService) {
    this.nav = nav;
    this.configService = configService;
    this.config = configService.loadConfig();
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
  
}
