import { initialBetStats } from "../Bets/Bet.js";
import { JsonBind } from "../commands/MainEntry.js";
import { BetPossibilities } from "../Game/GameRules.js";
import { Player } from "./Player.js";

// BBC strategy (big, black, columns)
// https://www.youtube.com/watch?v=rMcWDRGIyhk&t=621s

const DefaultsBets = [
  {
    value: 0.0,
    isActive: false,
    stats: JsonBind(initialBetStats),
    name: "Big/High 1:1 - Initial bet",
    ...BetPossibilities.evenMoneyBets.high,
    rules: {
      betMin: 4.0,
      betMax: 4.0,
      alwaysReopen: false,
      alwaysClose: false,
    },
  },
  {
    value: 0.0,
    isActive: false,
    stats: JsonBind(initialBetStats),
    name: "Black 1:1 - WinProgression #2",
    ...BetPossibilities.evenMoneyBets.black,
    rules: {
      betMin: 4.0,
      betMax: 4.0,
      alwaysReopen: false,
      alwaysClose: false,
    },
  },
  {
    value: 0.0,
    isActive: false,
    stats: JsonBind(initialBetStats),
    name: "First Columns 2:1 - WinProgression #3",
    ...BetPossibilities.columnBets.firstColumn,
    rules: {
      betMin: 4.0,
      betMax: 4.0,
      alwaysReopen: false,
      alwaysClose: false,
    },
  },
  {
    value: 0.0,
    isActive: false,
    stats: JsonBind(initialBetStats),
    name: "Second Columns 2:1 - WinProgression #3",
    ...BetPossibilities.columnBets.secondColumn,
    rules: {
      betMin: 4.0,
      betMax: 4.0,
      alwaysReopen: false,
      alwaysClose: false,
    },
  },
];

class BBCPlayer extends Player {
  name = "BBCPlayer";
  closeAllOnLoser = false;
  bets = JsonBind(DefaultsBets);
  balance = 1_000.0;

  applyStrategy() {
    let totalGains = 0;
    let totalLost = 0;
    let absoluteGains = 0;
    let totalMaxGains = 16;

    this.bets.forEach((b) => {
      totalGains += b.stats.isWinner ? b.stats.lastGains : 0;
      totalLost += b.stats.isLoser ? b.stats.lastGains : 0;
      absoluteGains = totalGains + totalLost;
    });

    // Is the default bet to be opened 'Big'
    absoluteGains += this.onOpenBet(this.bets[0]);
    absoluteGains = Math.min(totalGains, absoluteGains);

    // We close all gains when all bets are winned
    if (absoluteGains >= totalMaxGains) {
      this.onCloseBet(this.bets[1]);
      this.onCloseBet(this.bets[2]);
      this.onCloseBet(this.bets[3]);
      return;
    }

    if (this.bets[0].stats.isWinner) {
      absoluteGains += this.onOpenBet(this.bets[1]);
      absoluteGains = Math.min(totalGains, absoluteGains);
    }

    // We open c1 & c2
    // If last turn was composed of 'Big - Black' winner
    if (this.bets[0].stats.isWinner && this.bets[1].stats.isWinner) {
      absoluteGains += this.onOpenBet(this.bets[2]);
      absoluteGains = Math.min(totalGains, absoluteGains);

      absoluteGains += this.onOpenBet(this.bets[3]);
      absoluteGains = Math.min(totalGains, absoluteGains);
      return;
    }

    // Only one column can be winner in a single turn.
    // It can provide gains to complete 'full positioning'.
    if (this.bets[2].stats.isWinner || this.bets[3].stats.isWinner) {
      for (let i = 1; i < this.bets.length; i++) {
        if (this.bets[i].stats.isWinner) continue;

        if (absoluteGains > 0) {
          absoluteGains += this.onOpenBet(this.bets[i]);
          absoluteGains = Math.min(totalGains, absoluteGains);
        }
      }
    }

    // Collects unmanaged values
    this.bets.forEach((b) => {
      b.isActive && this.onOpenBet(b);
    });
  }
}

export const BBCPlayer1 = new BBCPlayer();
