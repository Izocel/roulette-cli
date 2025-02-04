import { appendFileSync } from "fs";
import { join } from "path";
import { __exportsPath, JsonBind, ymd } from "../commands/MainEntry.js";

export class Player {
  bets = [];
  name = "DefaultPlayer";
  reopenAllOnWinner = false;
  reopenAllOnLoser = false;
  closeAllOnWinner = false;
  closeAllOnLoser = false;

  constructor(name, balance, bets) {
    this.name = name;
    this.bets = bets;
    this.gameStats.balance = balance;
    this.onReport("INIT");
  }

  lastTurnStats = {
    betCount: 0,
    totalValue: 0,
    totalGains: 0,
    totalLost: 0,
    absoluteGains: 0,
    potentialGains: 0,
    losers: [],
    winners: [],
  };

  gameStats = {
    balance: 0,
    pnl: 0,
    maxBalance: 0,
    minBalance: 0,
    betWinCount: 0,
    betLoseCount: 0,
  };

  async beforeHouse() {
    await this.applyBaseStrategy();
    await this.applyStrategy();
    await this.validateStrategy();
    await this.onReport("BeforeHouse");
  }

  async applyStrategy() {}

  async applyBaseStrategy() {
    const requiresCloseAll =
      (this.closeAllOnLoser && this.lastTurnStats.totalLost > 0) ||
      (this.closeAllOnWinner && this.lastTurnStats.totalGains > 0);

    const requiresReopenAll =
      (this.reopenAllOnLoser && this.lastTurnStats.totalLost > 0) ||
      (this.reopenAllOnWinner && this.lastTurnStats.totalGains > 0);

    // If the player strategy want to closeAll
    if (requiresCloseAll) {
      this.onCloseBets();
    }

    // Look for a bet that can trigger 'closeAll'
    const hasBetsWithCloseAll = this.bets.some((bet) => {
      return (
        (bet.rules.closeAllOnLose && bet.stats.wasLoser) ||
        (bet.rules.closeAllOnWin && bet.stats.wasWin)
      );
    });

    if (hasBetsWithCloseAll) {
      this.onCloseBets();
    }

    // Closes 'alwaysClose' or winners that has closeOnWin
    this.bets.forEach((bet) => {
      if (bet.rules.alwaysClose || (bet.rules.closeOnWin && bet.stats.wasWin)) {
        this.onCloseBet(bet);
      }
    });

    // If the player strategy want to reopenAll
    if (requiresReopenAll) {
      this.onOpenBets();
    }

    // Reopens 'alwaysOpen' or losers that has reopenOnLose
    this.bets.forEach((bet) => {
      if (
        bet.rules.alwaysOpen ||
        (bet.rules.reopenOnLose && bet.stats.wasLoser)
      ) {
        this.onOpenBet(bet);
      }
    });
  }

  async validateStrategy() {
    if (this.gameStats.balance < 0) {
      console.error(this);
      throw "Negative balance player";
    }

    this.bets.forEach((bet) => {
      if (!bet.isActive) {
        bet.stats.loseStreak = 0;
        bet.stats.winStreak = 0;
        bet.isActive = false;
        return;
      }

      if (bet.value < bet.rules.betMin || bet.value > bet.rules.betMax) {
        console.error(bet);
        throw "Invalid bet in play...";
      }
    });
  }

  async afterHouse() {
    await this.onReport("AfterHouse");
  }

  onOpenBet(bet, value, min, max, targets) {
    bet.isActive = true;
    bet.targets = targets ?? bet.targets ?? [];
    bet.rules.betMin = Math.abs(min ?? bet.rules.betMin);
    bet.rules.betMax = Math.abs(max ?? bet.rules.betMax);

    value = Math.abs(value ?? bet.value ?? 0.0);
    if (bet.rules.betMin) {
      value = Math.max(value, bet.rules.betMin);
    }

    if (bet.rules.betMax) {
      value = Math.min(value, bet.rules.betMax);
    }

    const cost = bet.value - value;
    if (this.gameStats.balance + cost < 0) {
      console.error(
        "Not enough balance to open bet:",
        bet.name,
        "\nValue:",
        value,
        "\nBalance:",
        this.gameStats.balance
      );

      throw "....";
    }

    this.gameStats.balance += cost;
    bet.isActive = true;
    bet.value -= cost;

    return cost;
  }

  onCloseBet(bet) {
    const gains = bet.value;
    this.gameStats.balance += gains;

    bet.value = 0.0;
    bet.isActive = false;

    return gains;
  }

  onOpenBets() {
    for (let i = 0; i < this.bets.length; i++) {
      this.onOpenBet(this.bets[i]);
    }
  }

  onCloseBets() {
    for (let i = 0; i < this.bets.length; i++) {
      this.onCloseBet(this.bets[i]);
    }
  }

  async onReport(reportName) {
    const obj = JsonBind({ ...this });
    obj.name = `${this.name}-${reportName}`;

    const filePath = join(__exportsPath, `${this.name}-${ymd}.json`);
    appendFileSync(filePath, JSON.stringify(obj, null, 2) + ",\n");

    console.log();
    console.log(
      "-----------------------------------------------------------------------------------------------------"
    );
    console.log(obj.name);
    console.log(
      "-----------------------------------------------------------------------------------------------------"
    );
    console.table({ gameStats: obj.gameStats });

    if (reportName === "AfterHouse") {
      delete obj.lastTurnStats.losers;
      delete obj.lastTurnStats.winners;

      console.table({ lastTurnStats: obj.lastTurnStats });
      console.debug({ winners: JsonBind(this.lastTurnStats.winners) });
      console.debug({ losers: JsonBind(this.lastTurnStats.losers) });
    } else {
      console.debug({ bets: JsonBind(obj.bets.filter((b) => b.isActive)) });
    }
    this.updateStats();
  }

  onLeave() {
    this.onCloseBets();
    this.onReport("onLeave");
  }

  updateStats() {
    if (!this.gameStats.minBalance)
      this.gameStats.minBalance = this.gameStats.balance;

    this.gameStats.minBalance = Math.min(
      this.gameStats.balance,
      this.gameStats.minBalance
    );

    this.gameStats.maxBalance = Math.max(
      this.gameStats.balance,
      this.gameStats.maxBalance
    );
  }

  resetStats() {
    this.updateStats();
    this.lastTurnStats = {
      betCount: 0,
      totalValue: 0,
      totalGains: 0,
      totalLost: 0,
      absoluteGains: 0,
      potentialGains: 0,
      losers: [],
      winners: [],
    };
  }
}
