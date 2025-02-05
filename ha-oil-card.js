// src/ha-oil-card.js
class HaOilCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("Invalid config: 'entity' is required.");
    }
    this.config = config;
  }

  connectedCallback() {
    this.innerHTML = `
      <ha-card>
        <div class="oil-grid">
          <div class="header-row">
            <img class="sinopec-logo" src="https://www.jkrunning.site/images/sinopec-logo.png" alt="中国石化">
            <div class="price-tips">{{ states('sensor.oilprice_zhejiang_tips') }}</div>
          </div>
          <div class="price-row">
            ${this.config.oil_prices.map(price => `
              <div class="price-item">
                <span class="oil-icon">⛽</span>
                <div class="oil-type">${price.type}</div>
                <div class="oil-price">{{ states('${price.entity}') }}</div>
              </div>
            `).join('')}
          </div>
          <div class="triple-row">
            <div class="gas-item">
              <div class="gas-icon-wrapper">
                <span class="gas-icon">🔥</span>
              </div>
              <div class="gas-content">
                <div class="gas-label">${this.config.gas_balance.label}</div>
                <div class="gas-value">
                  {{ states('${this.config.gas_balance.entity}') }}
                </div>
              </div>
            </div>
            <div class="empty-column"></div>
          </div>
        </div>
      </ha-card>
    `;
  }
}

customElements.define("ha-oil-card", HaOilCard);
