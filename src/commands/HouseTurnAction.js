import { isBlack } from "../Game/GameRules.js";
import { game } from "./MainEntry.js";

export async function HouseTurnAction() {
  const number = nothingGoes();
  const isPositive = number > 0;
  const isEven = isPositive ? number % 2 === 0 : false;
  const color = isBlack(number) ? "black" : isPositive ? "red" : "green";

  game.lastResults.spin++;
  game.lastResults.color = color;
  game.lastResults.isEven = isEven;
  game.lastResults.number = number;
  game.lastResults.isPositive = isPositive;

  parsePlayersBets();
  await onHouseReport();
}

async function onHouseReport() {
  console.log();
  console.log("SpinResults:");
  console.beautify(game.lastResults);
}

function nothingGoes(isAmerican = true) {
  const min = isAmerican ? -1 : 0;
  const max = 36;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parsePlayersBets() {
  game.players?.forEach((p) => {
    p.isTurnContainsLosers = false;
    p.isTurnContainsWinners = false;
    p.updateStats();

    p.bets?.forEach((bet) => {
      bet.stats.lastValue = bet.value;
      if (!bet.isActive || !bet.value) {
        return;
      }

      // Winner case
      if (bet.targets.includes(game.lastResults.number)) {
        p.betLoseCount++;
        bet.stats.isWinner = true;
        p.isTurnContainsWinners = true;

        bet.stats.lastGains = bet.value * bet.payoutRatio;
        p.pnlTracker += bet.stats.lastGains;
        bet.value += bet.stats.lastGains;

        bet.stats.loseStreak = 0;
        bet.stats.winStreak++;
        bet.stats.winNb++;
        return;
      }

      p.betWinCount++;
      bet.stats.isLoser = true;
      p.isTurnContainsLosers = true;
      bet.stats.lastGains = -bet.value;
      p.pnlTracker += bet.stats.lastGains;
      bet.value = 0.0;

      bet.stats.winStreak = 0;
      bet.stats.loseStreak++;
      bet.stats.loseNb++;
      p.onCloseBet(bet);
    });
  });
}
