import { appendFileSync } from "fs";
import { join } from "path";
import { __exportsPath, spinner, ymd } from "../commands/MainEntry.js";

export class Player {
  bets = [];
  balance = 0.0;
  pnlTracker = 0.0;
  name = "DefaultPlayer";
  isTurnContainsLosers = false;
  isTurnContainsWinners = false;
  closeAllOnLoser = true;

  maxBalance = 0;
  minBalance = 0;
  betWinCount = 0;
  betLoseCount = 0;

  async beforeHouse() {
    await this.applyStrategy();
    await this.validateStrategy();
    await this.onReport("BeforeHouse");
  }

  async validateStrategy() {
    if (this.balance < 0) {
      console.error("Negative balance");
      throw "...";
    }

    this.bets.forEach((b) => {
      if (!b.isActive) {
        b.value > 0 && spinner.warn("Inactive bet with value: " + b.name);
        return;
      }

      if (b.value < b.rules.betMin || b.value > b.rules.betMax || b.value < 0) {
        spinner.fail("Bet is invalid");
        console.error(b);
        throw "...";
      }
    });
  }

  async afterHouse() {
    await this.onReport("AfterHouse");

    if (this.isTurnContainsLosers) {
      if (this.closeAllOnLoser) {
        this.onCloseBets();
      }
    }

    if (this.isTurnContainsWinners === true) {
    }

    // Eval losing bets
    for (let i = 0; i < this.bets.length; i++) {
      const b = this.bets[i];
      if (b.stats.isWinner) continue;

      if (b.rules.closeAllOnLose) {
        this.onCloseBets();
        break;
      }

      this.onCloseBet(b);
    }

    this.bets.forEach((b) => {
      if (b.rules.alwaysClose) {
        this.onCloseBet(b);
      }

      if (b.rules.alwaysReopen) {
        this.onOpenBet(b);
      }
    });
  }

  onOpenBet(b, value, min, max, targets) {
    b.isActive = true;
    b.targets = targets ?? b.targets ?? [];
    b.rules.betMin = Math.abs(min ?? b.rules.betMin);
    b.rules.betMax = Math.abs(max ?? b.rules.betMax);

    value = Math.abs(value ?? b.value ?? 0.0);
    let cost = 0;

    // Balance overflowing gains
    if (b.rules.betMax && b.value && b.value > b.rules.betMax) {
      cost = b.value - b.rules.betMax;
      this.balance += cost;
      b.value = b.rules.betMax;
      return cost;
    }

    if (b.rules.betMin) {
      value = Math.max(value, b.rules.betMin);
    }

    if (b.rules.betMax) {
      value = Math.min(value, b.rules.betMax);
    }

    cost = b.value - value;
    if (this.balance + cost < 0) {
      console.error(
        "Not enough balance to open bet:",
        b.name,
        "\nValue:",
        value,
        "\nBalance:",
        this.balance
      );

      this.onLeave();
      throw "....";
    }

    this.balance += cost;
    b.isActive = true;
    b.value -= cost;

    return cost;
  }

  onCloseBet(b) {
    this.balance += b.value;
    b.stats.winStreak = 0;
    b.stats.loseStreak = 0;
    b.stats.lastValue = 0;
    b.stats.isWinner = false;
    b.stats.isLoser = false;
    b.isActive = false;
    b.value = 0.0;
  }

  onCloseBets() {
    for (let i = 0; i < this.bets.length; i++) {
      this.onCloseBet(this.bets[i]);
    }
  }

  async onReport(reportName) {
    this.updateStats();
    console.log();
    const obj = {
      name: this.name + " - " + reportName,
      balance: this.balance,
      pnlTracker: this.pnlTracker,
      maxBalance: this.maxBalance,
      minBalance: this.minBalance,
      betWinCount: this.betWinCount,
      betLoseCount: this.betLoseCount,
      bets: this.bets.map((b) => {
        if (!b.isActive) return;
        return {
          value: b.value,
          lastGains: b.stats.lastGains,
          active: b.isActive,
          name: b.name,
        };
      }),
    };
    console.log();
    console.log(obj);
    const filePath = join(__exportsPath, `${this.name}-Results-${ymd}.json`);
    appendFileSync(filePath, JSON.stringify(obj, null, 2) + ",\n");
  }

  onLeave() {
    this.onCloseBets();
    this.onReport("onLeave");
  }

  updateStats() {
    if (!this.minBalance) this.minBalance = this.balance;
    this.minBalance = Math.min(this.balance, this.minBalance);
    this.maxBalance = Math.max(this.balance, this.maxBalance);
  }
}
