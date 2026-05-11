export const household = {
  name: "The Maple Street House",
  members: ["Sara", "Jordan", "Alex", "Priya"],
  period: "Last 30 Days",
  stabilityScore: 74,
  stabilityLabel: "Moderate",
  participation: [
    { name: "Sara", score: 78 },
    { name: "Jordan", score: 95 },
    { name: "Alex", score: 42 },
    { name: "Priya", score: 70 },
  ],
  expenses: {
    total: 340,
    imbalance: 48,
    imbalanceMember: "Alex",
  },
  alerts: [
    {
      member: "Alex",
      drop: 34,
      period: 14,
      choresCompleted: 2,
      choresAssigned: 8,
      expensesLogged: 0,
    },
  ],
}
