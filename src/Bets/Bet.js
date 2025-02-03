// Updated by house.parseBets
export const initialBetStats = {
  winNb: 0,
  loseNb: 0,
  winStreak: 0,
  loseStreak: 0,
  lastGains: 0.0,
  lastValue: 0.0,
  isWinner: false,
  isLoser: false,
};

export const InitialBetRules = {
  betMin: null,
  betMax: null,
  alwaysClose: true,
  alwaysReopen: false,
  closeAllOnLose: false,
};

export const BetStruct = {
  value: 0.0, // only closeBet,openBet and house.parseBet should update this value
  targets: [],
  isActive: false,
  name: "Initial bet",
  stats: { ...initialBetStats },
  rules: { ...InitialBetRules },
};
