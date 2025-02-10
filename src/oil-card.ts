class OilPriceCard extends HTMLElement {
  private shadowRoot!: ShadowRoot;
  private entities: {
    adjustmentPeriod?: string;
    prices?: string[];
    adjustmentInfo?: string;
  };
 
  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
    this.entities = {};
  }
 
  connectedCallback() {
    this.loadTemplate();
    this.loadData();
    this.addStyles();
    this.subscribeEntities();
  }
 
 private  loadTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
      ${require('./card.html')}
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
 
  private addStyles() {
    const style = document.createElement('style');
    style.textContent = require('./styles.css');
    this.shadowRoot.appendChild(style);
  }
 
  private loadData() {
    // 模拟数据（实际项目中应从 Home Assistant API 获取）
    const data = {
      adjustmentPeriod: '2025-02-15 至 2025-02-20',
      prices: [
        { name: '92 号汽油', price: '3.85 元/升' },
        { name: '95 号汽油', price: '4.10 元/升' },
        { name: '柴油', price: '3.70 元/升' },
        { name: '车用 LPG', price: '3.50 元/升' },
      ],
      adjustmentInfo: '上调 0.15 元/升',
    };
 
    // 更新调价窗口时间 
    const adjustmentPeriod = this.shadowRoot.getElementById('adjustment-period');
    if (adjustmentPeriod) {
      adjustmentPeriod.textContent = data.adjustmentPeriod;
    }
 
    // 更新油品价格 
    const priceRows = this.shadowRoot.querySelectorAll('.price-row');
    data.prices.forEach((price, index) => {
      const nameCell = priceRows[index].querySelector('.name');
      const priceCell = priceRows[index].querySelector('.price');
      if (nameCell && priceCell) {
        nameCell.textContent = price.name;
        priceCell.textContent = price.price;
      }
    });
 
    // 更新调价信息 
    const adjustmentInfo = this.shadowRoot.getElementById('adjustment-info');
    if (adjustmentInfo) {
      adjustmentInfo.textContent = data.adjustmentInfo;
    }
  }
 
  private subscribeEntities() {
    // 订阅实体状态变化（实际项目中应使用 Home Assistant API）
    // 这里仅为示例，实际需要根据实体 ID 获取数据 
    const entityIds = [
      this.entities.adjustmentPeriod,
      ...this.entities.prices,
      this.entities.adjustmentInfo,
    ].filter(Boolean   );
 
 entityIds.forEach(entityId => {
      // 使用 Home Assistant 的 WebSocket API 订阅实体状态变化 
      // 示例代码：
      // homeAssistant.connection.subscribeEntity(entityId, state => {
      //   this.updateDisplay(entityId, state);
      // });
    });
  }
 
  private updateDisplay(entityId: string, state: any) {
    // 根据 entityId 更新相应的显示内容 
    switch (entityId) {
      case this.entities.adjustmentPeriod:
        const adjustmentPeriod = this.shadowRoot.getElementById('adjustment-period');
        if (adjustmentPeriod) {
          adjustmentPeriod.textContent = state.state;
        }
        break;
      // 类似地处理其他实体 
      default:
        break;
    }
  }
}
 
// 注册自定义元素 
customElements.define('oil-price-card', OilPriceCard);
