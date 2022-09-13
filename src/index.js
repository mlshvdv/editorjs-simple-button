/**
 * Build styles
 */
require('./index.css').toString();

/**
 * @class Button
 * @classdesc Button Tool for Editor.js
 * @property {ButtonData} data - Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} ButtonData
 * @description Button Tool`s input and output data
 * @property {string} text - button text
 * @property {string} url - button url
 *
 * @typedef {object} ButtonConfig
 * @description Button Tool`s initial configuration
 * @property {string} textPlaceholder - placeholder to show in text input
 * @property {string} urlPlaceholder - placeholder to show in url input
 */
class Button {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
          '<rect x="2" y="8" width="20" height="8" rx="2" fill="black"/>\n' +
          '</svg>\n',
      title: 'Button',
    };
  }

  /**
   * Empty Button is not empty Block
   *
   * @public
   * @returns {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Disable to press Enter inside the Button
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return false;
  }

  /**
   * Default placeholder for button text input
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TEXT_PLACEHOLDER() {
    return 'Button text';
  }

  /**
   * Default placeholder for button url input
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_URL_PLACEHOLDER() {
    return 'Button url';
  }

  /**
   * Allow Button to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      /**
       * To create Button data from string, simple fill 'text' property
       */
      import: 'text',
      /**
       * To create string from Button data, concatenate text and caption
       *
       * @param {ButtonData} ButtonData
       * @returns {string}
       */
      export: function (ButtonData) {
        return `${ButtonData.text} — ${ButtonData.url}`;
      },
    };
  }

  /**
   * Tool`s styles
   *
   * @returns {{baseClass: string, wrapper: string, text: string, url: string, input: string, caption: string, settingsButton: string, settingsButtonActive: string}}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-simple-button',
      text: 'cdx-simple-button__text',
      input: this.api.styles.input,
      url: 'cdx-simple-button__url',
      settingsWrapper: 'cdx-simple-button-settings',
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Tool`s settings properties
   *
   * @returns {*[]}
   */
  get settings() {
    return [
    ];
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: ButtonData, config: ButtonConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly}) {

    this.api = api;
    this.readOnly = readOnly;

    this.textPlaceholder = config.textPlaceholder || Button.DEFAULT_TEXT_PLACEHOLDER;
    this.urlPlaceholder = config.urlPlaceholder || Button.DEFAULT_URL_PLACEHOLDER;

    this.data = {
      text: data.text || '',
      url: data.url || '',
    };
  }

  /**
   * Create Button Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
    const text = this._make('div', [this.CSS.input, this.CSS.text], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.text,
    });
    const url = this._make('div', [this.CSS.input, this.CSS.url], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.url,
    });

    text.dataset.placeholder = this.textPlaceholder;
    url.dataset.placeholder = this.urlPlaceholder;

    container.appendChild(text);
    container.appendChild(url);

    return container;
  }

  /**
   * Validate data: check if Image exists
   *
   * @param {ButtonData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    return savedData.text && savedData.url;
  }

  /**
   * Extract Button data from Button Tool element
   *
   * @param {HTMLDivElement} buttonElement - element to save
   * @returns {ButtonData}
   */
  save(buttonElement) {
    const text = buttonElement.querySelector(`.${this.CSS.text}`);
    const url = buttonElement.querySelector(`.${this.CSS.url}`);

    return Object.assign(this.data, {
      text: text.innerHTML,
      url: url.innerHTML,
    });
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: false,
      },
      url: {
        br: false,
      }
    };
  }

  /**
   * Create wrapper for Tool`s settings buttons
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {

  };

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}

module.exports = Button;
