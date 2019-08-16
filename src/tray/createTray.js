const path = require('path');
const { Menu, Tray } = require('electron');

exports.run = (win) => {
    TRAY = new Tray(path.join(__dirname, '../img/256x256.png'));
    const trayMenu = Menu.buildFromTemplate([{
            label: 'MakeYourRPC',
            enabled: false
        },
        {
            label: 'Abrir',
            click: () => win.show()
        },
        {
            label: 'Fechar',
            click: () => win.close()
        },
        { type: 'separator' }
    ]);

    TRAY.on('double-click', () => win.show());

    TRAY.setToolTip('MakeYourRPC');
    TRAY.setContextMenu(trayMenu);
}