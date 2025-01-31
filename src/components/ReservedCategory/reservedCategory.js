import { html, LitElement } from 'lit';
import { categoryStyles } from './reservedCategoryCss.js';
import commonStyles from '@/styles/common.js';
import pb from '@/api/pocketbase';

class TabCategory extends LitElement {
  static properties = {
    category: { type: String, state: true },
    data: { type: Array },
  };

  static styles = [commonStyles, categoryStyles];

  constructor() {
    super();
    this.category = 'all'; // all dataset category 상태 유지
    this.data = {
      // pocketbase 데이터 배열로 기본값 설정
      all: [],
      beauty: [],
      hospital: [],
      performance: [],
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this._fetchData();
  }

  // pocketbase에 transactions 데이터 가져오는 함수
  async _fetchData() {
    try {
      const response = await pb.collection('transactions').getFullList();
      this._getFetchData(response);
    } catch (error) {
      console.error('포켓호스트 데이터를 가져올 수 없습니다', error);
    }
  }

  // 설정한 field 필터링 함수
  _getFetchData(items) {
    const filterData = {
      all: items,
      beauty: items.filter((item) => item.field === 'beauty'),
      hospital: items.filter((item) => item.field === 'hospital'),
      performance: items.filter((item) => item.field === 'performance'),
    };

    this.data = filterData;
  }

  // 클릭 이벤트 함수
  _handleClickTab(e) {
    const target = e.target;
    this.category = target.dataset.category;
  }

  _renderData() {
    const data = this.data[this.category];
    const totalReservations = data.reduce((acc, cur) => acc + cur.count, 0); // 총 예약횟수
    const totalCancle = data.reduce((acc, cur) => acc + cur.cancle, 0); // 총 취소횟수
    const totalAmount = data.reduce((acc, cur) => acc + cur.total_price, 0); // 총 가격
    const maxCount = Math.max(...data.map((item) => item.count)); // 최대값 설정
    const userId = [...new Set(data.map((item) => item.user_id))][0] || '알 수 없음'; // Set 중복 제거 후 배열로 전환 후 map

    return html`
      <div class="summary">
        <p>
          <strong>${userId}</strong>님은 <span>${totalReservations}회</span> 예약하셨고,
          <span>${totalAmount.toLocaleString()}원</span> 결제하셨어요.
        </p>
      </div>

      <ul class="data-container">
        ${data.map(
          (item, index) => html`
            <li class="data-item">
              <div class="data-item__wrap">
                <div class="data-item__inner">
                  <span class="rank">${index + 1}</span>
                  <span class="name">${item.store_id}</span>
                </div>
                <span class="count">${item.count}회</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${(item.count / maxCount) * 100}%"></div>
              </div>
            </li>
          `
        )}
      </ul>

      <div class="link-container">
        <a href="/src/pages/notice-booking/" class="more-link" role="button">
          <span>더보기</span>
          <img src="/images/ico_right.svg" alt="우측방향 화살표" aria-hidden="true" />
        </a>
      </div>

      <div class="category-badge">
        <ul>
          <li>
            <span>방문 <strong>${totalReservations}</strong></span>
          </li>
          <li>
            <span>예약취소 <strong>${totalCancle}</strong></span>
          </li>
        </ul>
      </div>
    `;
  }

  render() {
    return html`
      <nav class="category-tab">
        <ul role="tablist">
          <li role="presentation">
            <button
              @click="${this._handleClickTab}"
              type="button"
              role="tab"
              class="entire tab-btn ${this.category === 'all' ? 'is--active' : ''}"
              data-category="all"
              aria-selected="${this.category === 'all'}"
            >
              전체
            </button>
          </li>
          <li role="presentation">
            <button
              @click="${this._handleClickTab}"
              type="button"
              role="tab"
              class="beauty tab-btn ${this.category === 'beauty' ? 'is--active' : ''}"
              data-category="beauty"
              aria-selected="${this.category === 'beauty'}"
            >
              뷰티
            </button>
          </li>
          <li role="presentation">
            <button
              @click="${this._handleClickTab}"
              type="button"
              role="tab"
              class="hospital tab-btn ${this.category === 'hospital' ? 'is--active' : ''}"
              data-category="hospital"
              aria-selected="${this.category === 'hospital'}"
            >
              병의원
            </button>
          </li>
          <li role="presentation">
            <button
              @click="${this._handleClickTab}"
              type="button"
              role="tab"
              class="performance tab-btn ${this.category === 'performance' ? 'is--active' : ''}"
              data-category="performance"
              aria-selected="${this.category === 'performance'}"
            >
              공연
            </button>
          </li>
        </ul>
      </nav>

      ${this._renderData()}
    `;
  }
}

customElements.define('category-tab', TabCategory);
