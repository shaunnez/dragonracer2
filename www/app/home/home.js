import {Page,NavController} from 'ionic/ionic';
import {Placebet} from '../placebet/placebet';
import {Options} from '../options/options';

var $ = require('jquery');

@Page({
  templateUrl: 'app/home/home.html',
})
export class Home {

  constructor(nav:NavController) {
    this.nav = nav;
    this.placeBetPage = Placebet;
    this.optionPage = Options;

    $('.progress-container').addClass('opacity-on');

    setTimeout(function() {
      $(".sk-folding-cube").fadeOut(function() {
        $('.home-button-container').fadeIn();
      });
    }, 3000);
  }

  goToPage(item) {
    this.nav.setRoot(item);
  }
}
