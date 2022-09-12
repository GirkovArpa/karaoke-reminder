import { showTrayIcon } from 'tray.js';

export class App extends Element {
  list = ['your purpose in life, your life mission', '2nd line of text'];
  index = 0;

  render() {
    return <body>
      <div id="container">
        <div id="sub-container">
          <input type="text" value={this.list[this.index]} />
        </div>
      </div>
    </body>;
  }

  ['on click at li[name^="edit"]'](evt, li) {
    this.$('input').execCommand(`${li.getAttribute('name')}`);
    if (this.$('input').value === '') {
      const list = [...this.list];
      if (list.length === 1) return;
      list.splice(this.index, 1);
      this.componentUpdate({ list });
      this.nextText();
    }
    this.post(() => this.$('input').edit.selectAll());
  }

  async ['on click at li[name="changebackground"]']() {
    const filename = Window.this
      .selectFile({
        mode: 'open',
        filter: 'GIF files (*.gif)|*.gif',
        caption: 'Select background image...',
        extension: 'gif',
      })
      ?.replace('file://', '')
      ?.replace(/.+/, (filename) => decodeURIComponent(filename));

    this.$('#container').style.backgroundImage = filename ? `url(${filename})` : 'none';
  }

  ['on change at input'](evt, input) {
    const list = [...this.list];
    list[this.index] = input.value;
    this.componentUpdate({ list });
  }

  ['on keyup at input'](evt, input) {
    if (evt.code === 'Enter') {
      const list = [...this.list];
      const index = this.index + 1;
      list.splice(index, 0, 'text #' + this.list.length);
      this.componentUpdate({ list, index });
      this.post(() => input.edit.selectAll());
    } else if (evt.code === 'Backspace') {
      if (input.value === '') {
        const list = [...this.list];
        if (list.length === 1) return;
        list.splice(this.index, 1);
        this.componentUpdate({ list });
        this.nextText();
        this.post(() => input.edit.selectAll());
      }
    }
  }

  ['on mousewheel'](evt) {
    evt.deltaY > 0 ? this.nextText() : this.priorText();
  }

  priorText() {
    const index = this.mod(this.index - 1, this.list.length);
    this.componentUpdate({ index });
  }

  nextText() {
    const index = this.mod(this.index + 1, this.list.length);
    this.componentUpdate({ index });
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  constructor() {
    super();
    this.adjustWindow();
  }

  adjustWindow() {
    Window.this.state = Window.WINDOW_MAXIMIZED;
    setInterval(() => Window.this.isTopmost = true);
    showTrayIcon();
  }

}