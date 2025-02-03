import { BBCPlayer1 } from "../Players/BBCPlayer.js";
import { game } from "./MainEntry.js";

export async function InitPlayersAction() {
  await BBCPlayer1.onReport("INIT");
  game.players = [BBCPlayer1];
}
