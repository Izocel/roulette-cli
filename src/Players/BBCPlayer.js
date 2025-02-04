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
    super("BBC-Player", 100_000, JsonBind(DefaultsBets));
  }

  openMediumBid() {
    this.onCloseBet(this.bets[2]);
    this.onCloseBet(this.bets[3]);

    this.onOpenBet(this.bets[0]);
    this.onOpenBet(this.bets[1]);
  }

  openFullBid() {
    // This also collect the gains from 'winners' beforehand
    this.onOpenBet(this.bets[0]);
    this.onOpenBet(this.bets[1]);
    this.onOpenBet(this.bets[2]);
    this.onOpenBet(this.bets[3]);
  }

  applyStrategy() {
    const winnersCount = this.lastTurnStats.winners.length;

    // We play default bid
    if (!winnersCount) {
      return;
    }

    const c1 = this.bets[2];
    const c2 = this.bets[3];
    const columnsPlayed = c1.stats.wasInPlay && c2.stats.wasInPlay;
    const columnsWinned = columnsPlayed && (c1.stats.wasWin || c2.stats.wasWin);

    // 1:1 hits or 2:1 hits
    if (winnersCount === 1) {
      if (columnsWinned) {
        this.openMediumBid(); // PUSH
      }

      return;
    }

    // Both 1:1 hits OR 2:1 and 1:1 hits
    if (winnersCount === 2) {
      if (!columnsPlayed) {
        this.openFullBid();
        return;
      }

      if (columnsWinned) {
        this.openMediumBid();
      }

      return;
    }

    // They all hits !!!
    if (winnersCount === 3) {
      this.onCloseBet(this.bets[1]);
      this.onCloseBet(this.bets[2]);
      this.onCloseBet(this.bets[3]);
      return;
    }
  }
}
