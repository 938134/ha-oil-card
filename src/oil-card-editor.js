import { LitElement, html, css } from 'lit';
import {
  Config,
  EntitiesConfig,
  getHass,
  HomeAssistant,
  LocalizeConfig,
  LovelaceCardEditor,
  validateConfigElement,
} from 'custom-card-helpers';

class OilCardConfigElement extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public config!: Config;

  private editorInitialized = false;

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    if (!this.editorInitialized) {
      this.editorInitialized = true;
      this._initEditor();
    }

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

  private async _initEditor() {
    setTimeout(() => {
      if (this.config) {
        validateConfigElement(this.config, HaOilCardConfig);
      }
    }, 1000);
  }

  private _valueChanged(event: CustomEvent): void {
    const { property, value } = event.detail;
    if (this._config[property] === value) {
      return;
    }
    this._config = { ...this._config, [property]: value };
    fireEvent(this, 'config-changed', { config: this._config });
  }
}

customElements.define('oil-card-editor', OilCardConfigElement);
