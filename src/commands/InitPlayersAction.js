import { BBCPlayer } from "../Players/BBCPlayer.js";
import { game } from "./MainEntry.js";

export async function InitPlayersAction() {
  game.players = [new BBCPlayer()];
}
