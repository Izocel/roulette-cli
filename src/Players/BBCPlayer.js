import { initialBetStats } from "../Bets/Bet.js";
import { game, JsonBind } from "../commands/MainEntry.js";
import { BetPossibilities } from "../Game/GameRules.js";
import { Player } from "./Player.js";

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
      alwaysClose: false,
    },
  },
];

// BBC strategy (big, black, columns)
// https://www.youtube.com/watch?v=rMcWDRGIyhk&t=621s
class BBCPlayer extends Player {
  name = "BBCPlayer";
  closeAllOnLoser = false;
  bets = JsonBind(DefaultsBets);
  balance = 1_000.0;

  applyStrategy() {
    if (!game.lastResults.spin) {
      this.onOpenBet(this.bets[0]);
      return;
    }

    let totalGains = 0;
    let totalLost = 0;
    let absoluteGains = 0;
    let totalMaxGains = 0;

    this.bets.forEach((b) => {
      totalGains += b.stats.isWinner ? b.stats.lastGains : 0;
      totalLost += b.stats.isLoser ? b.stats.lastGains : 0;

      totalMaxGains += b.rules.betMax * b.payoutRatio;
      absoluteGains = totalGains + totalLost;
    });

    // We close all gains and 'reset' when all bets are winned
    if (absoluteGains >= totalMaxGains) {
      this.onCloseBet(this.bets[1]);
      this.onCloseBet(this.bets[2]);
      this.onCloseBet(this.bets[3]);

      this.onOpenBet(this.bets[0]);
      return;
    }

    // We reopen potential bets with gains
    if (absoluteGains > 0) {
      this.bets.forEach((b) => {
        if (b.isActive && b.value) {
          return;
        }

        absoluteGains -= b.rules.betMin;
        if (absoluteGains >= 0) {
          this.onOpenBet(b);
        }
      });
    }
  }
}

export const BBCPlayer1 = new BBCPlayer();
