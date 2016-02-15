
export class BetService {
  
  constructor() {
    this.bet = {
      dragonName: '',
      dragonWeight: 0,
      winAmount: 0,
      betAmount: 0,
      pointsMade: 0
    }
  }
  
  getBet() {
    return this.bet;
  }
  
  setBet(bet) {
    this.bet = bet;
  }
  
}