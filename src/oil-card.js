import { LitElement, html, css } from 'lit';
import { HomeAssistant, hasConfigOrEntityChanged } from 'custom-card-helpers';
import Luxon from 'luxon';

let HaOilCard = class extends LitElement {
    // 响应式属性
    hass = {};
    _config = {};
    _nextAdjustDate = null;
    _oilPrices = {};
    _adjustmentInfo = '';

    static async getConfigElement() {
        return import('./oil-card-editor').then((module) => module.OilCardConfigElement);
    }

    static getStubConfig() {
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

    setConfig(config) {
        if (!config) {
            throw new Error('Invalid configuration');
        }
        this._config = config;

        // 初始化数据
        this._nextAdjustDate = this._getDateFromState(config.next_adjust_date);
        this._updateOilPrices(config.oil_prices);
        this._adjustmentInfo = this._getStringFromState(config.adjustment_info);
    }

    shouldUpdate(changedProps) {
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
                    ${this._config.oil_prices.map((item) => html`
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

    _getDateFromState(entity) {
        const state = this.hass.states[entity];
        if (state && state.state !== 'unknown') {
            return Luxon.DateTime.fromISO(state.state);
        }
        return null;
    }

    _getStringFromState(entity) {
        const state = this.hass.states[entity];
        return state ? state.state : '';
    }

    _updateOilPrices(oilPrices) {
        this._oilPrices = {};
        oilPrices.forEach((item) => {
            const state = this.hass.states[item.entity];
            if (state && !isNaN(parseFloat(state.state))) {
                this._oilPrices[item.entity] = parseFloat(state.state);
            }
        });
    }
};

customElements.define('ha-oil-card', HaOilCard);
export { HaOilCard };
