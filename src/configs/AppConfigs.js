const configs = {
  version: "1.0.0",
  isProduction: true,
  displayName: "Roulette CLI",

  game: {
    players: [],
    type: "American",
    totalSpins: (1 * 8 * 60) / (32 / 60), // 1 days x 8h working shift (32 sec. / spins)

    lastResults: {
      spin: 0,
      isEven: null,
      color: null,
      number: null,
    },
  },

  // Can be used to pass arguments to the CLI, but it's not recommended to use it for sensitive data,
  // they will also be overwritten by any arguments pushed to the CLI.
  args: {
    totalSpins: 10,
  },
};

export const AppConfigs = configs;
