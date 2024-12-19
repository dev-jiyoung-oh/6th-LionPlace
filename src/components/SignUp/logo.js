import { LitElement, html, css } from 'lit';

class Logo extends LitElement {
  static styles = css`
    .logo {
      text-align: center;
      margin-bottom: 3rem;
    }

    .logo img {
      width: auto;
      height: 12rem;
    }
  `;

  render() {
    return html`
      <div class="logo">
        <img src="/images/img_logo.svg" alt="Lion Place 로고" />
      </div>
    `;
  }
}

customElements.define('app-logo', Logo);
