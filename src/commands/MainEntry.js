import { existsSync, mkdirSync } from "fs";
import ora from "ora";
import { join } from "path";
import { fileURLToPath } from "url";
import { AppConfigs } from "../configs/AppConfigs.js";
import { HouseTurnAction } from "./HouseTurnAction.js";
import { InitPlayersAction } from "./InitPlayersAction.js";

export const __rootPath = join(fileURLToPath(import.meta.url), "../../");
export const __exportsPath = join(__rootPath, "exports/");
export const __hotfoldersPath = join(__rootPath, "hot-folders/");

export let configs = JsonBind(AppConfigs);
export let game = configs.game;
export const now = new Date().toISOString();

export const spinner = ora().start();

export async function MainEntry(args) {
  configs.args = { ...configs.args, ...args };

  if (!existsSync(__exportsPath)) {
    mkdirSync(__exportsPath);
  }
  if (!existsSync(__hotfoldersPath)) {
    mkdirSync(__hotfoldersPath);
  }

  try {
    await InitPlayersAction();

    while (game.lastResults.spin < game.totalSpins) {
      for (let i = 0; i < game.players.length; i++) {
        await game.players[i].beforeHouse();
        await HouseTurnAction();
        await game.players[i].afterHouse();
      }
    }

    for (let i = 0; i < game.players.length; i++) {
      await game.players[i].onLeave();
    }
  } catch (error) {
    throw error;
  }
}

export function JsonBind(object) {
  return JSON.parse(JSON.stringify(object));
}
