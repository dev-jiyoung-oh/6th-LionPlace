import { LitElement, html, css } from 'lit';
import { followerStyles } from './followerCss.js';
import commonStyles from '@/styles/common.js';

class FollowerList extends LitElement {
  static properties = {
    followerList: { type: Array },
  };

  constructor() {
    super();
    this.followerList = [];
  }

  static styles = [followerStyles, commonStyles];

  render() {
    return html`
      <ul class="list">
        ${this.followerList.length === 0
          ? html`
              <div class="empty-state">
                <img src="/images/ico_users.svg" alt="유저아이콘" />
                <p>아직 팔로워가 없습니다</p>
              </div>
            `
          : this.followerList.map(
              (user) => html`
                <li class="list-item">
                  <div class="profile">
                    <img src="${user.img}" alt="${user.name}" />
                    <span class="username">${user.name}</span>
                  </div>
                </li>
              `
            )}
      </ul>
    `;
  }
}

customElements.define('follower-list', FollowerList);
