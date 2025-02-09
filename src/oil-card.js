import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

class OilPriceCard extends LitElement {
  static get styles() {
    return css`
      ha-card {
        padding: 16px;
        background: var(--card-background-color);
        border-radius: var(--ha-card-border-radius);
        box-shadow: var(--ha-card-box-shadow);
      }
      .header {
        font-size: 1.2em;
        color: var(--primary-text-color);
        margin-bottom: 12px;
        text-align: center;
      }
      .prices {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-bottom: 12px;
      }
      .price-item {
        text-align: center;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 4px;
      }
      .adjustment-info {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        text-align: center;
      }
    `;
  }

  @property({ type: Object }) hass;
  @property({ type: String }) adjustmentEntity;
  @property({ type: Object }) priceEntities;
  @property({ type: String }) infoEntity;

  static getConfigElement() {
    return document.createElement('oil-price-card-editor');
  }

  setConfig(config) {
    this.adjustmentEntity = config.adjustment_entity;
    this.priceEntities = config.price_entities || {};
    this.infoEntity = config.info_entity;
  }

  render() {
    if (!this.hass) return html``;

    // 获取调价窗口时间
    const adjustmentTime = this._getEntityState(this.adjustmentEntity);
    // 获取调价信息
    const adjustmentInfo = this._getEntityState(this.infoEntity);
    // 获取油品价格
    const prices = {};
    for (const [type, entity] of Object.entries(this.priceEntities)) {
      prices[type] = this._getEntityState(entity);
    }

    return html`
      <ha-card>
        <div class="header">下次调价窗口：${adjustmentTime || 'N/A'}</div>
        <div class="prices">
          ${Object.entries(prices).map(([type, price]) => html`
            <div class="price-item">
              <div>${type}</div>
              <div>${price ? `${price}元` : 'N/A'}</div>
            </div>
          `)}
        </div>
        <div class="adjustment-info">${adjustmentInfo || '暂无调价信息'}</div>
      </ha-card>
    `;
  }

  _getEntityState(entityId) {
    if (!entityId) return null;
    const stateObj = this.hass.states[entityId];
    return stateObj ? stateObj.state : null;
  }
}

// 配置编辑器（用于可视化界面）
class OilPriceCardEditor extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  setConfig(config) {
    this.config = config || {};
  }

  _valueChanged(ev) {
    const target = ev.target;
    const value = target.configValue === 'object' ? 
      { ...this.config[target.configKey], [target.key]: ev.detail.value } :
      ev.detail.value;
    
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: { ...this.config, [target.configKey]: value } }
    }));
  }

  render() {
    if (!this.hass) return html``;

    return html`
      <div class="card-config">
        <ha-entity-picker
          .label="选择调价时间实体"
          .hass=${this.hass}
          .value=${this.config.adjustment_entity}
          .configValue=${'adjustment_entity'}
          @value-changed=${this._valueChanged}
        ></ha-entity-picker>

        <ha-formfield label="油品单价实体">
          ${Object.entries(this.config.price_entities || {}).map(([type, entity]) => html`
            <ha-entity-picker
              .label=${`${type}实体`}
              .hass=${this.hass}
              .value=${entity}
              .configKey=${type}
              .configValue=${'price_entities'}
              @value-changed=${this._valueChanged}
            ></ha-entity-picker>
          `)}
        </ha-formfield>

        <ha-entity-picker
          .label="选择调价信息实体"
          .hass=${this.hass}
          .value=${this.config.info_entity}
          .configValue=${'info_entity'}
          @value-changed=${this._valueChanged}
        ></ha-entity-picker>
      </div>
    `;
  }
}

customElements.define('oil-price-card', OilPriceCard);
customElements.define('oil-price-card-editor', OilPriceCardEditor);
