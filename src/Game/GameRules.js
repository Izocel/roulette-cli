export const BetPossibilities = {
  evenMoneyBets: {
    red: {
      description: "Bet on red",
      payoutRatio: 1,
      targets: [
        1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
      ],
    },
    black: {
      description: "Bet on black",
      payoutRatio: 1,
      targets: [
        2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
      ],
    },
    odd: {
      description: "Bet on odd numbers",
      payoutRatio: 1,
      targets: [
        1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35,
      ],
    },
    even: {
      description: "Bet on even numbers",
      payoutRatio: 1,
      targets: [
        2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36,
      ],
    },
    low: {
      description: "Bet on numbers 1-18",
      payoutRatio: 1,
      targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
    high: {
      description: "Bet on numbers 19-36",
      payoutRatio: 1,
      targets: [
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
      ],
    },
  },
  columnBets: {
    firstColumn: {
      description: "Bet on the first column",
      payoutRatio: 2,
      targets: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    },
    secondColumn: {
      description: "Bet on the second column",
      payoutRatio: 2,
      targets: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    },
    thirdColumn: {
      description: "Bet on the third column",
      payoutRatio: 2,
      targets: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    },
  },
  dozenBets: {
    firstDozen: {
      description: "Bet on numbers 1-12",
      payoutRatio: 2,
      targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    secondDozen: {
      description: "Bet on numbers 13-24",
      payoutRatio: 2,
      targets: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    },
    thirdDozen: {
      description: "Bet on numbers 25-36",
      payoutRatio: 2,
      targets: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    },
  },
  straightUpBet: {
    anyNumber: {
      description: "Bet on any single number",
      payoutRatio: 35,
      targets: [-1, 0, ...Array.from({ length: 36 }, (_, i) => i + 1)],
    },
  },
  splitBets: {
    twoNumbers: {
      description: "Bet on two adjacent numbers",
      payoutRatio: 17,
      targets: [
        [-1, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 2],
        [2, 3],
        [4, 5],
        [5, 6],
        [7, 8],
        [8, 9],
        [10, 11],
        [11, 12],
        [13, 14],
        [14, 15],
        [16, 17],
        [17, 18],
        [19, 20],
        [20, 21],
        [22, 23],
        [23, 24],
        [25, 26],
        [26, 27],
        [28, 29],
        [29, 30],
        [31, 32],
        [32, 33],
        [34, 35],
        [35, 36],
      ],
    },
  },
  streetBets: {
    threeNumbers: {
      description: "Bet on three numbers in a row",
      payoutRatio: 11,
      targets: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
        [13, 14, 15],
        [16, 17, 18],
        [19, 20, 21],
        [22, 23, 24],
        [25, 26, 27],
        [28, 29, 30],
        [31, 32, 33],
        [34, 35, 36],
      ],
    },
  },
  cornerBets: {
    fourNumbers: {
      description: "Bet on four numbers forming a square",
      payoutRatio: 8,
      targets: [
        [1, 2, 4, 5],
        [2, 3, 5, 6],
        [4, 5, 7, 8],
        [5, 6, 8, 9],
        [7, 8, 10, 11],
        [8, 9, 11, 12],
        [10, 11, 13, 14],
        [11, 12, 14, 15],
        [13, 14, 16, 17],
        [14, 15, 17, 18],
        [16, 17, 19, 20],
        [17, 18, 20, 21],
        [19, 20, 22, 23],
        [20, 21, 23, 24],
        [22, 23, 25, 26],
        [23, 24, 26, 27],
        [25, 26, 28, 29],
        [26, 27, 29, 30],
        [28, 29, 31, 32],
        [29, 30, 32, 33],
        [31, 32, 34, 35],
        [32, 33, 35, 36],
      ],
    },
  },
  sixLineBets: {
    twoRows: {
      description: "Bet on two adjacent rows of three numbers",
      payoutRatio: 5,
      targets: [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 7, 8, 9],
        [7, 8, 9, 10, 11, 12],
        [10, 11, 12, 13, 14, 15],
        [13, 14, 15, 16, 17, 18],
        [16, 17, 18, 19, 20, 21],
        [19, 20, 21, 22, 23, 24],
        [22, 23, 24, 25, 26, 27],
        [25, 26, 27, 28, 29, 30],
        [28, 29, 30, 31, 32, 33],
        [31, 32, 33, 34, 35, 36],
      ],
    },
  },
};

export function getPayoutRatio(targets) {
  switch (targets.length) {
    case 1:
      return 35; // Straight-up bet
    case 2:
      return 17; // Split bet
    case 3:
      return 11; // Street bet
    case 4:
      return 8; // Corner bet
    case 6:
      return 5; // Six line bet
    case 18:
      return 1; // Even-money bet
    default:
      return 2; // Column and dozen bets
  }
}

export function isBlack(number) {
  if (number === 0) {
    return false; // Zero is neither red nor black
  }

  if ((number >= 1 && number <= 10) || (number >= 19 && number <= 28)) {
    // For numbers 1-10 and 19-28: even numbers are black
    return number % 2 === 0;
  } else if ((number >= 11 && number <= 18) || (number >= 29 && number <= 36)) {
    // For numbers 11-18 and 29-36: odd numbers are black
    return number % 2 !== 0;
  }

  return false;
}
