import { LitElement, html, css } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

class OilCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  static get styles() {
    return css`
      .card {
        width: 300px; /* 身份证大小宽度 */
        height: 190px; /* 身份证大小高度 */
        padding: 16px;
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        background-color: var(--card-background-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .label {
        font-size: 14px;
        color: var(--secondary-text-color);
      }
      .value {
        font-size: 16px;
        color: var(--primary-text-color);
      }
      .prices {
        display: flex;
        justify-content: space-between;
      }
      .price {
        flex: 1;
        text-align: center;
      }
    `;
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const { adjustment_time, prices, price_increase } = this.config;

    // 获取实体状态
    const adjustmentTime = this.hass.states[adjustment_time]?.state || 'N/A';
    const price1 = this.hass.states[prices[0]]?.state || 'N/A';
    const price2 = this.hass.states[prices[1]]?.state || 'N/A';
    const price3 = this.hass.states[prices[2]]?.state || 'N/A';
    const price4 = this.hass.states[prices[3]]?.state || 'N/A';
    const increaseInfo = this.hass.states[price_increase]?.state || 'N/A';

    return html`
      <div class="card">
        <!-- 第一行：油价下次调整时间 -->
        <div class="row">
          <span class="label">下次调整时间</span>
          <span class="value">${adjustmentTime}</span>
        </div>

        <!-- 第二行：四种油品价格 -->
        <div class="prices">
          <div class="price">
            <div class="label">油品1</div>
            <div class="value">${price1}</div>
          </div>
          <div class="price">
            <div class="label">油品2</div>
            <div class="value">${price2}</div>
          </div>
          <div class="price">
            <div class="label">油品3</div>
            <div class="value">${price3}</div>
          </div>
          <div class="price">
            <div class="label">油品4</div>
            <div class="value">${price4}</div>
          </div>
        </div>

        <!-- 第三行：油价涨价信息 -->
        <div class="row">
          <span class="label">涨价信息</span>
          <span class="value">${increaseInfo}</span>
        </div>
      </div>
    `;
  }

  setConfig(config) {
    if (!config.adjustment_time || !config.prices || config.prices.length !== 4 || !config.price_increase) {
      throw new Error('请配置 adjustment_time、prices（4个实体）和 price_increase');
    }
    this.config = config;
  }

  getCardSize() {
    return 3;
  }
}

// 注册卡片
customElements.define('oil-card', OilCard);
