import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, hasConfigOrEntityChanged } from 'custom-card-helpers';
import Luxon from 'luxon';

@customElement('ha-oil-card')
export class HaOilCard extends LitElement {
  @property() public hass!: HomeAssistant;
  @property() private _config!: any;

  @state() private _nextAdjustDate!: Luxon.DateTime;
  @state() private _oilPrices: { [fuelType: string]: number } = {};
  @state() private _adjustmentInfo: string = '';

  public static async getConfigElement() {
    return import('./ha-oil-card-editor').then((module) => module.OilCardConfigElement);
  }

  public static getStubConfig() {
    return {
      next_adjust_date: 'sensor.next_oil_adjust_date',
      oil_prices: [
        { entity: 'sensor.gasoline92', name: '92号汽油' },
        { entity: 'sensor.gasoline95', name: '95号汽油' },
        { entity: 'sensor.diesel', name: '柴油' },
        { entity: 'sensor.lpg', name: '液化石油气' },
      ],
      adjustment_info: 'sensor.adjustment_info',
    };
  }

  public setConfig(config: any) {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this._config = config;

    // 初始化数据
    this._nextAdjustDate = this._getDateFromState(config.next_adjust_date);
    this._updateOilPrices(config.oil_prices);
    this._adjustmentInfo = this._getStringFromState(config.adjustment_info);
  }

  protected shouldUpdate(changedProps: Map<string | number | symbol, unknown>): boolean {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  render() {
    return html`
      <ha-card>
        <div class="next-adjust-date">
          <span>下次油价调整窗口时间：</span>
          <span>${this._nextAdjustDate?.toLocaleString()}</span>
        </div>
        <div class="oil-prices">
          ${this._config.oil_prices.map((item: any) => html`
            <div class="fuel-type">
              <span>${item.name}：</span>
              <span class="price">${this._oilPrices[item.entity]?.toFixed(2)} 元/升</span>
            </div>
          `)}
        </div>
        <div class="adjustment-info">
          <span>${this._adjustmentInfo}</span>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        text-align: center;
        padding: 16px;
      }

      .next-adjust-date {
        margin-bottom: 16px;
        font-weight: bold;
        color: #333;
      }

      .oil-prices {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }

      .fuel-type {
        background-color: #f5f5f5;
        padding: 8px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .price {
        color: #007bff;
        font-weight: bold;
        font-size: 1.2em;
      }

      .adjustment-info {
        color: #666;
        font-size: 0.9em;
      }
    `;
  }

  private _getDateFromState(entity: string): Luxon.DateTime | null {
    const state = this.hass.states[entity];
    if (state && state.state !== 'unknown') {
      return Luxon.DateTime.fromISO(state.state);
    }
    return null;
  }

  private _getStringFromState(entity: string): string {
    const state = this.hass.states[entity];
    return state ? state.state : '';
  }

  private _updateOilPrices(oilPrices: any[]): void {
    this._oilPrices = {};
    oilPrices.forEach((item: any) => {
      const state = this.hass.states[item.entity];
      if (state && !isNaN(parseFloat(state.state))) {
        this._oilPrices[item.entity] = parseFloat(state.state);
      }
    });
  }
}
