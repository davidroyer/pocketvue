'use strict'
const electron = require('electron')
const { app, BrowserWindow, ipcMain, dialog, Menu} = require('electron')
const path = require('path')
const UserStore = require('./UserStore.js')
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        accelerator: 'CmdOrCtrl+O',
        click () { openFile() }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click () { saveFile() }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  },
  {
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin'
          ? 'Alt+Command+I'
          : 'Ctrl+Shift+I',
        click () { mainWindow.webContents.toggleDevTools() }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click () { app.quit() }
      }
    ]
  })
}

let mainWindow
let viewerWindow = null
let config = {}
let authUrl = "http://www.google.com";
let viewerPath

if (process.env.NODE_ENV === 'development') {
    config = require('../config')
    config.url = `http://localhost:${config.port}`
    viewerPath = path.join('file://', __dirname, './viewer.html')
} else {
    config.devtron = false
    config.url = `file://${__dirname}/dist/index.html`
    viewerPath = path.join('file://', __dirname, '/dist/viewer.html')
}

function createWindow() {
    /**
     * Initial window options
     */

    mainWindow = new BrowserWindow({
        webPreferences: {
            webSecurity: false
        },
        height: 850,
        width: 600,
        titleBarStyle: 'hidden-inset',
        backgroundColor: '#ccc'
    })

    mainWindow.loadURL(config.url)

    if (process.env.NODE_ENV === 'development') {
        BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

        let installExtension = require('electron-devtools-installer')

        installExtension.default(installExtension.VUEJS_DEVTOOLS)
            .then((name) => mainWindow.webContents.openDevTools())
            .catch((err) => console.log('An error occurred: ', err))
    }

    mainWindow.on('closed', (e) => {
        mainWindow = null
    })

    mainWindow.on('resize', () => {});

    const windowID = mainWindow.id
}

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('before-quit', () => {
})

ipcMain.on('openArticleWindow', (event, url) => {
  var electronScreen = electron.screen;
  var size = electronScreen.getPrimaryDisplay().workAreaSize;
  let windowID = mainWindow.id

  if (viewerWindow !== null) {
      if (viewerWindow.isMinimized()) {
          viewerWindow.webContents.send('openArticleTrigged', url, windowID)
          viewerWindow.restore()
      } else {
          // viewerWindow.loadURL(viewerPath)
          viewerWindow.webContents.send('openArticleTrigged', url, windowID)
          viewerWindow.show()
      }

  } else {
      var winOptions = {
          width: 600,
          height: size.height,
          show: false,
          x: 1440 - 600,
          y: 0,
          titleBarStyle: 'hidden-inset',
          //  nodeIntegration: false,
          webPreferences: {
              // nodeIntegration: false,
              webSecurity: false
              // allowDisplayingInsecureContent: true,
              // allowRunningInsecureContent: true,
              // plugins: true
          },
          backgroundColor: '#ccc'
      }
      viewerWindow = new BrowserWindow(winOptions);
      let webContents = viewerWindow.webContents

      viewerWindow.loadURL(viewerPath);
      viewerWindow.show();

      viewerWindow.webContents.on('did-finish-load', function() {
        viewerWindow.webContents.send('openArticleTrigged', url, windowID)
      });

  }

  viewerWindow.on('closed', function(e) {
      viewerWindow = null
  });
});
