#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import figlet from "figlet";
import ora from "ora";
import { MainEntry, now } from "./commands/MainEntry.js";
import { AppConfigs } from "./configs/AppConfigs.js";

// Adding beautify method to the native console object
console.beautify = function (object) {
  console.log(JSON.stringify(object, null, 2));
};

const AppHello = `
--------------------------------------------------------------------
${chalk.green(figlet.textSync(AppConfigs.displayName))}
--------------------------------------------------------------------
Version: ${AppConfigs.version} - ${now}\n`;

program
  .version(AppConfigs.version)
  .description(AppConfigs.displayName)
  .action(async (options) => {
    console.log(AppHello);
    console.log("args:", options, "\n\n");
    const spinner = ora().start();
    try {
      await MainEntry(options);
    } catch (error) {
      spinner.fail(`An Error occurred:\n`).stop();
      console.error(error);
      process.exit(1);
    }

    spinner.succeed(`All Done!`).stop();
    process.exit(0);
  });

program.parse(process.argv);
