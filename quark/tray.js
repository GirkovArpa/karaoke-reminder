export async function showTrayIcon() {
  Window.this.trayIcon({
    image: await Graphics.Image.load(__DIR__ + '16.png'),
    text: 'Karaoke Reminder',
  });
}

Window.this.on('trayiconclick', ({ data }) => {
  const [sx, sy] = Window.this.box('position', 'client', 'screen');
  const menu = document.$('menu#tray');
  const { screenX, screenY } = data;
  menu.popupAt(screenX - sx, screenY - sy, 2);
});

document.$('(about)').on('click', () =>
  Window.this.modal({ url: 'about.htm' })
);

document.$('(quit)').on('click', () => {
  Window.this.close();
  Window.this.parameters.parent.close();
});
