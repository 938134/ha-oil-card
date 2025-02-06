import { LitElement, html, css } from 'lit';

class HaOilCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object }
    };
  }

  render() {
    return html`
      <div>
        <paper-input
          label="Next Oil Price Adjustment Entity"
          .value="${this.config.next_adjustment_entity}"
          @value-changed="${this._valueChanged('next_adjustment_entity')}"
        ></paper-input>
        <h3>Oil Price Entities</h3>
        ${[1, 2, 3, 4].map(index => html`
          <paper-input
            label="Oil Price Entity ${index}"
            .value="${this.config.oil_price_entities && this.config.oil_price_entities[index - 1]}"
            @value-changed="${this._valueChanged(`oil_price_entities.${index - 1}`)}"
          ></paper-input>
        `)}
        <paper-input
          label="Background Image URL"
          .value="${this.config.background}"
          @value-changed="${this._valueChanged('background')}"
        ></paper-input>
      </div>
    `;
  }

  _valueChanged(path) {
    return (ev) => {
      const value = ev.target.value;
      const config = { ...this.config };
      if (path.includes('.')) {
        const [parent, index] = path.split('.');
        if (!config[parent]) {
          config[parent] = [];
        }
        config[parent][index] = value;
      } else {
        config[path] = value;
      }
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config } }));
    };
  }
}

customElements.define('ha-oil-card-editor', HaOilCardEditor);
