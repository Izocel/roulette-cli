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
    rules: {
      alwaysOpen: true,
      betMin: 4.0,
      betMax: 4.0,
    },
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

  openFullBid() {
    // This also collect the gains from 'winners' beforehand
    this.onOpenBet(this.bets[0]);
    this.onOpenBet(this.bets[1]);
    this.onOpenBet(this.bets[2]);
    this.onOpenBet(this.bets[3]);
  }

  closeJackpot() {
    // This also collect the gains from 'winners' beforehand
    this.onCloseBet(this.bets[1]);
    this.onCloseBet(this.bets[2]);
    this.onCloseBet(this.bets[3]);
  }

  applyStrategy() {
    const winnersCount = this.lastTurnStats.winners.length;

    // We close all gains when highest gain is achieved
    if (winnersCount > 2) {
      this.closeJackpot();
      return;
    }

    const c1 = this.bets[2];
    const c2 = this.bets[3];

    const playedColumnWinned =
      (c1.stats.wasInPlay && c1.stats.wasWin) ||
      (c2.stats.wasInPlay && c2.stats.wasWin);

    const goFullBid =
      (winnersCount === 2 && c1.stats.wasInPlay === false) ||
      playedColumnWinned;

    if (goFullBid) {
      // We open the columns when 2x 1:1 bets are winned
      // Or if a 2:1 and 1:1 wins
      this.openFullBid();
      return;
    }

    if (winnersCount) {
      // We push (stay open) when 2x-1:1 hits and a column was in play
      if (c1.stats.wasInPlay == false && c2.stats.wasInPlay == false) {
        this.onOpenBet(this.bets[1]);
      }
    }

    // 'high is always reopen by default
  }
}
