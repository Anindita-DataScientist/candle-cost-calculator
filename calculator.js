const keys = [
  'wax',
  'glass',
  'wick',
  'fragrance',
  'color',
  'electricity',
  'labour',
  'packaging'
];

const barColors = {
  wax: '#d97706',
  glass: '#0891b2',
  wick: '#f97316',
  fragrance: '#0f766e',
  color: '#7c3aed',
  electricity: '#2563eb',
  labour: '#be123c',
  packaging: '#db2777'
};

// FORMAT INR
function formatINR(value, decimals = 2) {
  return `₹${Number(value).toFixed(decimals)}`;
}

// GET INPUT VALUE
function getVal(key) {
  const input = document.querySelector(
    `.cost-card[data-key="${key}"] input`
  );

  return parseFloat(input.value) || 0;
}

// SET TEXT
function setText(id, text) {
  document.getElementById(id).textContent = text;
}

// UPDATE PERCENTAGE BARS
function updateCardBars(total) {

  document.querySelectorAll('.cost-card').forEach((card) => {

    const key = card.dataset.key;

    const value = getVal(key);

    const percent =
      total > 0
        ? Math.round((value / total) * 100)
        : 0;

    let existing =
      card.querySelector('.pct-wrap');

    // UPDATE EXISTING
    if (existing) {

      existing.querySelector('.pct-fill')
        .style.width = `${percent}%`;

      existing.querySelector('.pct-label')
        .textContent = `${percent}% of total`;

      return;
    }

    // CREATE BAR
    const wrap = document.createElement('div');
    wrap.className = 'pct-wrap';

    const bar = document.createElement('div');
    bar.className = 'pct-track';

    const fill = document.createElement('div');
    fill.className = 'pct-fill';

    fill.style.width = `${percent}%`;

    fill.style.background =
      barColors[key] || '#64748b';

    const label = document.createElement('span');
    label.className = 'pct-label';

    label.textContent =
      `${percent}% of total`;

    bar.appendChild(fill);

    wrap.appendChild(bar);

    wrap.appendChild(label);

    card.appendChild(wrap);

  });

}

// MAIN CALCULATOR
function calc() {

  // TOTAL MAKING COST
  const total = keys.reduce((sum, key) => {
    return sum + getVal(key);
  }, 0);

  // QUANTITY
  const qty =
    parseInt(
      document.getElementById('qty').value
    ) || 0;

  // SELLING PRICE
  const price =
    parseFloat(
      document.getElementById('price').value
    ) || 0;

  // RECOMMENDED PRICE (2.5x RULE)
  const recommended = total * 2.5;

  // PROFIT PER CANDLE
  const profitPer = price - total;

  // BATCH PROFIT
  const batchProfit = profitPer * qty;

  // PROFIT MARGIN %
  let margin = 0;

  if (price > 0) {
    margin = (profitPer / price) * 100;
  }

  // =========================
  // DISPLAY VALUES
  // =========================

  // TOTAL COST
  setText(
    'total-cost',
    total > 0
      ? formatINR(total)
      : '--'
  );

  // RECOMMENDED PRICE
  setText(
    'rec-price',
    total > 0
      ? formatINR(recommended)
      : '--'
  );

  // PROFIT PER CANDLE
  setText(
    'profit-per',
    price > 0
      ? formatINR(profitPer)
      : '--'
  );

  // BATCH PROFIT
  setText(
    'batch-profit',
    qty > 0 && price > 0
      ? formatINR(batchProfit)
      : '--'
  );

  // PROFIT MARGIN
  setText(
    'margin-pct',
    price > 0
      ? `${margin.toFixed(1)}%`
      : '--'
  );

  // SMALL LABEL
  setText(
    'candle-total-label',
    total > 0
      ? formatINR(total)
      : '--'
  );

  // =========================
  // MARGIN BAR
  // =========================

  const marginBar =
    document.getElementById('margin-bar');

  const clampedMargin =
    Math.max(0, Math.min(100, margin));

  marginBar.style.width =
    `${clampedMargin}%`;

  // BAR COLOR
  if (profitPer < 0) {

    marginBar.style.background =
      '#dc2626';

  }
  else if (margin < 20) {

    marginBar.style.background =
      '#f59e0b';

  }
  else {

    marginBar.style.background =
      '#10b981';

  }

  // =========================
  // TIPS AREA
  // =========================

  const tipArea =
    document.getElementById('tip-area');

  // EMPTY STATE
  if (total === 0 && price === 0) {

    tipArea.innerHTML = `
      <div class="tip-box warning">
        <strong>Start adding values</strong>
        <span>
          Add your candle making costs to calculate profit.
        </span>
      </div>
    `;

  }

  // SELLING PRICE NOT ENTERED
  else if (price === 0) {

    tipArea.innerHTML = `
      <div class="tip-box warning">
        <strong>Enter selling price</strong>
        <span>
          Recommended selling price:
          ${formatINR(recommended)}
        </span>
      </div>
    `;

  }

  // LOSS
  else if (profitPer < 0) {

    tipArea.innerHTML = `
      <div class="tip-box danger">
        <strong>Loss Detected</strong>
        <span>
          Your making cost is higher than your selling price.
        </span>
      </div>
    `;

  }

  // LOW MARGIN
  else if (margin < 20) {

    tipArea.innerHTML = `
      <div class="tip-box warning">
        <strong>Low Profit Margin</strong>
        <span>
          Try increasing your selling price.
        </span>
      </div>
    `;

  }

  // GOOD PROFIT
  else {

    tipArea.innerHTML = `
      <div class="tip-box success">
        <strong>Healthy Profit Margin</strong>
        <span>
          Batch profit:
          ${formatINR(batchProfit)}
        </span>
      </div>
    `;

  }

  // UPDATE COST BARS
  updateCardBars(total);

}

// =========================
// LIVE INPUT LISTENER
// =========================

document
  .querySelectorAll(
    '.cost-card input, #qty, #price'
  )
  .forEach((input) => {

    input.addEventListener(
      'input',
      calc
    );

  });

// =========================
// NO DEFAULT calc();
// =========================