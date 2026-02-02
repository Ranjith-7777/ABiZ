function withDelta(value, percentDelta) {
  const delta = value * (percentDelta / 100);
  return value + delta;
}

export function getMarketSnapshot() {
  // Static base values similar to the HTML mock; in real use, plug in a market API.
  const sp500 = 4783.45;
  const nasdaq = 15055.65;
  const djia = 37695.73;
  const ftse = 7694.19;

  return {
    indices: [
      {
        name: 'S&P 500',
        value: sp500.toFixed(2),
        changePercent: '+0.45'
      },
      {
        name: 'NASDAQ',
        value: nasdaq.toFixed(2),
        changePercent: '+0.75'
      },
      {
        name: 'DJIA',
        value: djia.toFixed(2),
        changePercent: '-0.08'
      },
      {
        name: 'FTSE 100',
        value: ftse.toFixed(2),
        changePercent: '+0.12'
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

