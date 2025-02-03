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
      alwaysReopen: true,
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
  closeAllOnLoser = true;
  bets = JsonBind(DefaultsBets);
  balance = 6_000_000.0;

  applyStrategy() {
    // Other open/close rules will be managed automatically via Player.js
    if (!game.lastResults.spin) {
      this.onOpenBet(this.bets[0]);
    }

    if (this.bets[0].stats.isWinner) {
      this.onOpenBet(this.bets[1]);
    }

    if (this.bets[1].stats.isWinner) {
      this.onOpenBet(this.bets[2]);
      this.onOpenBet(this.bets[3]);
      return;
    }
  }
}

export const BBCPlayer1 = new BBCPlayer();
