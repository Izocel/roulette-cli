import { BaseBetStruct } from "../Bets/Bet.js";
import { JsonBind } from "../commands/MainEntry.js";
import { BetPossibilities } from "../Game/GameRules.js";
import { Player } from "./Player.js";

// BBC strategy (big, black, columns)
// https://www.youtube.com/watch?v=rMcWDRGIyhk&t=621s
const DefaultsBets = [
  {
    ...BaseBetStruct,
    ...BetPossibilities.evenMoneyBets.high,
    name: "Big/High 1:1 - Initial bet",
    alwaysOpen: true,
  },
  {
    ...BaseBetStruct,
    name: "Black 1:1 - WinProgression #2",
    ...BetPossibilities.evenMoneyBets.black,
    rules: {
      betMin: 4.0,
      betMax: 4.0,
    },
  },
  {
    ...BaseBetStruct,
    name: "First Columns 2:1 - WinProgression #3",
    ...BetPossibilities.columnBets.firstColumn,
    rules: {
      betMin: 4.0,
      betMax: 4.0,
    },
  },
  {
    ...BaseBetStruct,
    name: "Second Columns 2:1 - WinProgression #3",
    ...BetPossibilities.columnBets.secondColumn,
    rules: {
      betMin: 4.0,
      betMax: 4.0,
    },
  },
];

export class BBCPlayer extends Player {
  constructor() {
    super("BBC-Player", 1_000, JsonBind(DefaultsBets));
  }

  applyStrategy() {
    // // Is the default bet to be opened 'Big'
    // absoluteGains += this.onOpenBet(this.bets[0]);
    // absoluteGains = Math.min(totalGains, absoluteGains);
    // // We close all gains when all bets are winned
    // if (absoluteGains >= totalMaxGains) {
    //   this.onCloseBet(this.bets[1]);
    //   this.onCloseBet(this.bets[2]);
    //   this.onCloseBet(this.bets[3]);
    //   return;
    // }
    // if (this.bets[0].stats.wasWin) {
    //   absoluteGains += this.onOpenBet(this.bets[1]);
    //   absoluteGains = Math.min(totalGains, absoluteGains);
    // }
    // // We open c1 & c2
    // // If last turn was composed of 'Big - Black' winner
    // if (this.bets[0].stats.wasWin && this.bets[1].stats.wasWin) {
    //   absoluteGains += this.onOpenBet(this.bets[2]);
    //   absoluteGains = Math.min(totalGains, absoluteGains);
    //   absoluteGains += this.onOpenBet(this.bets[3]);
    //   absoluteGains = Math.min(totalGains, absoluteGains);
    //   return;
    // }
    // // Only one column can be winner in a single turn.
    // // It can provide gains to complete 'full positioning'.
    // if (this.bets[2].stats.wasWin || this.bets[3].stats.wasWin) {
    //   for (let i = 1; i < this.bets.length; i++) {
    //     if (this.bets[i].stats.wasWin) continue;
    //     if (absoluteGains > 0) {
    //       absoluteGains += this.onOpenBet(this.bets[i]);
    //       absoluteGains = Math.min(totalGains, absoluteGains);
    //     }
    //   }
    // }
    // // Collects unmanaged values
    // this.bets.forEach((bet) => {
    //   bet.isActive && this.onOpenBet(bet);
    // });
  }
}
