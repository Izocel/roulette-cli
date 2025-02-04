// Updated by house.parseBets
export const InitialBetStats = {
  winNb: 0,
  loseNb: 0,
  winStreak: 0,
  loseStreak: 0,
  lastValue: 0.0,
  wasWin: null,
  wasLoser: null,
  wasInPlay: null,
};

export const InitialBetRules = {
  betMin: null,
  betMax: null,
  closeAllOnWin: null,
  closeAllOnLose: null,
  alwaysClose: null,
  closeOnWin: null,
  alwaysOpen: null,
  reopenOnLose: null,
};

export const BaseBetStruct = {
  value: 0.0,
  gains: 0.0,
  isActive: null,
  name: "Initial bet",
  stats: { ...InitialBetStats },
  rules: { ...InitialBetRules },
};
