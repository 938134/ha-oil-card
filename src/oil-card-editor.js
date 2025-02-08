import { LitElement, html } from 'lit';
import { getHass } from 'custom-card-helpers';

let OilCardConfigElement = class extends LitElement {
    hass = {};
    config = {};

    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        return html`
            <div class="editor">
                <div class="group">
                    <ha-entity-picker
                        .label="${this.hass.localize('next_oil_adjust_date')}"
                        .configValue="next_adjust_date"
                        .hass="${this.hass}"
                        .includeDomain="[sensor]"
                        @value-changed="${this._valueChanged}"
                        .allowCustomEntity="false"
                    ></ha-entity-picker>
                </div>
                <div class="group">
                    <h3>油品实体</h3>
                    <ha-entity-picker
                        .label="${'92号汽油'}"
                        .configValue="${config => config.oil_prices[0]}"
                        .hass="${this.hass}"
                        .includeDomain="[sensor]"
                        @value-changed="${this._valueChanged}"
                        .allowCustomEntity="false"
                    ></ha-entity-picker>
                    <ha-entity-picker
                        .label="${'95号汽油'}"
                        .configValue="${config => config.oil_prices[1]}"
                        .hass="${this.hass}"
                        .includeDomain="[sensor]"
                        @value-changed="${this._valueChanged}"
                        .allowCustomEntity="false"
                    ></ha-entity-picker>
                    <ha-entity-picker
                        .label="${'柴油'}"
                        .configValue="${config => config.oil_prices[2]}"
                        .hass="${this.hass}"
                        .includeDomain="[sensor]"
                        @value-changed="${this._valueChanged}"
                        .allowCustomEntity="false"
                    ></ha-entity-picker>
                    <ha-entity-picker
                        .label="${'液化石油气'}"
                        .configValue="${config => config.oil_prices[3]}"
                        .hass="${this.hass}"
                        .includeDomain="[sensor]"
                        @value-changed="${this._valueChanged}"
                        .allowCustomEntity="false"
                    ></ha-entity-picker>
                </div>
                <div class="group">
                    <ha-entity-picker
                        .label="${this.hass.localize('adjustment_info')}"
                        .configValue="adjustment_info"
                        .hass="${this.hass}"
                        .includeDomain="[sensor]"
                        @value-changed="${this._valueChanged}"
                        .allowCustomEntity="false"
                    ></ha-entity-picker>
                </div>
            </div>
        `;
    }

    _valueChanged(event) {
        const { property, value } = event.detail;
        if (this.config[property] === value) {
            return;
        }
        this.config = { ...this.config, [property]: value };
        this.dispatchEvent(
            new CustomEvent('config-changed', {
                detail: { config: this.config },
            })
        );
    }
};

customElements.define('oil-card-editor', OilCardConfigElement);
export { OilCardConfigElement };
