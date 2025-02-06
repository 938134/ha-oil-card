import { LitElement, css, html } from 'lit';

class HaOilCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 85.6mm; /* 高仿身份证宽度 */
        height: 54mm;  /* 高仿身份证高度 */
        border: 1px solid #ccc;
        padding: 10px;
        background-image: url(${this.config.background || 'default-background-url'});
        background-size: cover;
      }
      .next-adjustment {
        margin-bottom: 10px;
      }
      .oil-prices {
        display: flex;
        justify-content: space-around;
      }
    `;
  }

  render() {
    const nextAdjustmentEntity = this.hass.states[this.config.next_adjustment_entity];
    const oilPriceEntities = this.config.oil_price_entities.map(entity => this.hass.states[entity]);

    return html`
      <div class="next-adjustment">
        Next Oil Price Adjustment: ${nextAdjustmentEntity ? nextAdjustmentEntity.state : 'N/A'}
      </div>
      <div class="oil-prices">
        ${oilPriceEntities.map(price => html`
          <div>${price ? price.state : 'N/A'}</div>
        `)}
      </div>
    `;
  }

  setConfig(config) {
    if (!config.next_adjustment_entity || !config.oil_price_entities || config.oil_price_entities.length !== 4) {
      throw new Error('Please provide next_adjustment_entity and exactly four oil_price_entities');
    }
    this.config = config;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('ha-oil-card', HaOilCard);
