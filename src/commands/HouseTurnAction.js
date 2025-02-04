import { appendFileSync } from "fs";
import { join } from "path";
import { isBlack } from "../Game/GameRules.js";
import { __exportsPath, game, ymd } from "./MainEntry.js";

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
  console.log(
    "-----------------------------------------------------------------------------------------------------"
  );
  console.log("HouseData");
  console.log(
    "-----------------------------------------------------------------------------------------------------"
  );
  console.table(game.lastResults);

  const filePath = join(__exportsPath, `houseResults-${ymd}.json`);
  appendFileSync(filePath, JSON.stringify(game.lastResults, null, 2) + ",\n");
}

function nothingGoes(isAmerican = true) {
  const max = 36;
  const min = isAmerican ? -1 : 0;
  const range = max - min + 1;
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  const randomNumber = randomBuffer[0] / (0xffffffff + 1);

  return Math.floor(randomNumber * range) + min;
}

function parsePlayersBets() {
  for (let i = 0; i < game.players.length; i++) {
    const player = game.players[i];

    if (!player.bets?.length) {
      console.error(player);
      throw "No bets in play for this player...";
    }

    player.resetStats();
    for (let j = 0; j < player.bets.length; j++) {
      const bet = player.bets[j];

      bet.stats.lastValue = bet.value;
      bet.stats.wasInPlay = true;

      if (!bet.isActive || bet.value <= 0) {
        bet.stats.wasInPlay = false;
        bet.stats.loseStreak = 0;
        bet.stats.winStreak = 0;
        bet.isActive = false;
        continue;
      }

      player.lastTurnStats.betCount++;
      player.lastTurnStats.potentialGains += bet.value * bet.payoutRatio;
      player.lastTurnStats.totalValue += bet.value;

      // Winner case
      if (bet.targets.includes(game.lastResults.number)) {
        bet.stats.wasWin = true;
        bet.stats.loseStreak = 0;
        bet.stats.winStreak++;
        bet.stats.winNb++;

        bet.gains = bet.value * bet.payoutRatio;
        bet.value += bet.gains;

        player.gameStats.betWinCount++;
        player.gameStats.pnl += bet.gains;
        player.lastTurnStats.totalGains += bet.gains;
        player.lastTurnStats.absoluteGains += bet.gains;
        player.lastTurnStats.winners.push(bet);
        continue;
      }

      bet.stats.wasLoser = true;
      bet.stats.winStreak = 0;
      bet.stats.loseStreak++;
      bet.stats.loseNb++;

      bet.gains = -bet.value;
      bet.value = 0.0;

      player.gameStats.betLoseCount++;
      player.gameStats.pnl += bet.gains;
      player.lastTurnStats.totalLost += bet.gains;
      player.lastTurnStats.absoluteGains += bet.gains;
      player.lastTurnStats.losers.push(bet);
      player.onCloseBet(bet);
    }
  }
}
