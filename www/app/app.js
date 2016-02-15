import {App, IonicApp, Platform} from 'ionic/ionic';
import {Home} from './home/home';
import {Placebet} from './placebet/placebet';
import {Options} from './options/options';
import {Game} from './game/game';
import {Stats} from './stats/stats';
import {ConfigService} from './services/configService';
import {BetService} from './services/betService';

@App({
  templateUrl: 'app/app.html',
  providers: [ConfigService, BetService]
})
export class MyApp {
  constructor(app: IonicApp, platform: Platform) {
    this.app = app;
    this.platform = platform;
    
    this.initializeApp();
    
    // set our app's pages
    this.pages = [
      { title: 'Home', component: Home },
      { title: 'Play game', component: Placebet },
      { title: 'Game options', component: Options },
      { title: 'View stats', component: Stats },
    ];
    
    this.rootPage = Home;
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Platform ready');
      if (typeof StatusBar !== 'undefined') {
        StatusBar.styleDefault();
      }
      
    });
  }
  
  openPage(page) {
    this.app.getComponent('leftMenu').close();
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
