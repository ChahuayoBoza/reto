class CardCountry extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.name = '';
    this.capital = '';
    this.flag = '';
    this.continent = '';
  }

  static get observedAttributes() {
    return ['name', 'capital', 'flag', 'continent'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  handleEvent(event) {
    if (event.type === 'click') {
      const modal = document.getElementById('country-modal');
      console.log(modal, this.continent);
      modal.visible = 'true';
      modal.continent = 'true';
      modal.setAttribute('visible', 'true');
      modal.setAttribute('continent', this.continent || 'No Continent');
      console.log(modal);
    }
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/`
    <style>
      .card {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.4);
        border-radius: 8px;
        dispaly: flex;
        flex-direction: column;
        justify-content: center;
        padding: 12px;
        cursor: pointer;
      }
      .card:hover {
        box-shadow: 0 0 8px 2px rgba(0, 0, 200, 0.4);
      }
      .card-title {
        text-transform: uppercase;
        font-weight: 600;
      }
      .card-text {
        font-weight: 300;
        font-size: 14px;
      }

      .flag {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.4);
        height: 160px;
        object-fit: cover;
      }

      .image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
    </style>
  <div class="card">
      <h4 class="card-title">${this.name}</h4>
      <p class="card-text">capital: <strong>${this.capital}</strong></p>
      <div class="image-container">
        <img src="${this.flag}" alt="${this.name}" class="flag" loading="lazy" >
      </div>
    </div>`;
    this.shadowRoot.addEventListener('cardclick', this.handleEvent);
    this.shadowRoot.querySelector('.card').addEventListener('click', this.handleEvent);
  }

}

class CustomModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.visible = 'false';
    this.continent = '';
  }

  static get observedAttributes() {
    return ['visible', 'continent'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/`
    <style>
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: ${ this.visible === 'true' ? 'flex' : 'none'};
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background: #fff;
        border-radius: 8px;
        padding: 12px;
        width: 80%;
        max-width: 500px;
      }
    </style>
    <div class="modal">
      <div class="modal-content">
        <p>This country belongs to:</p>
        <h3>${this.continent}</h3>
      </div>
    </div>`;
  }
}

class CustomNavBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/`
    <style>
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
      }
      .item-list {
        display: flex;
        align-items: center;
        list-style: none;
      }
      .item {
        text-decoration: none;
        color: #000;
        padding: 16px 32px;
      }
      .item:hover {
        background: #f0f0f0;
      } 
    </style>
    <div class="navbar">
      <div>
        <h3>Countries</h3>
      </div>
      <div class="menu">
        <ul class="item-list">
          <li class="menu-item">
            <a href="#" class="item">Home</a>
          </li>
          <li class="menu-item">
            <a href="#" class="item">About</a>
          </li>
          <li class="menu-item">
            <a href="#" class="item">Contact</a>
          </li>
        </ul>
      </div>
    </div>
    `;
  }
}

class CustomFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/`
    <style>
      .footer {
        background: #fafafa;
        padding: 12px;
        text-align: center;
        box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.4);
      }
    </style>
    <div class="footer">
      <p>&copy; 2022 - <a href="#">Country API</a></p>
    </div>
    `;
  }
}

window.customElements.define('card-country', CardCountry);
window.customElements.define('custom-modal', CustomModal);
window.customElements.define('custom-navbar', CustomNavBar);
window.customElements.define('custom-footer', CustomFooter);



async function getCountries() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  return response.json();
}

const container = document.querySelector('#container');

getCountries()
  .then(res => {
    // console.log(res);
    res.forEach(country => {
      const card = document.createElement('card-country');
      card.name = country.name.common;
      card.capital = country?.capital ? country?.capital[0] : 'No capital';
      card.flag = country.flags.png;
      card.continent = country.region || 'No continent';
      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
  });