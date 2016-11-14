'use strict'

const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const dialog = require('electron').dialog
const UserStore = require('./UserStore.js')

let mainWindow
let viewerWindow
let articleWindow = null
let config = {}
let authUrl = "http://www.google.com";

const viewerPath = path.join('file://', __dirname, 'viewer.html')

if (process.env.NODE_ENV === 'development') {
    config = require('../config')
    config.url = `http://localhost:${config.port}`
} else {
    config.devtron = false
    config.url = `file://${__dirname}/dist/index.html`
}



// const store = new Store({
//   // We'll call our data file 'user-preferences'
//   configName: 'user-settings',
//   defaults: {
//     // 800x600 is the default size of our window
//     requestToken: null,
//     accessToken: null,
//     loggedIn: false
//   }
// });


function createWindow() {
    /**
     * Initial window options
     */
     viewerWindow = new BrowserWindow({
         webPreferences: {
             webSecurity: false
         },
         height: 850,
         width: 600,
         titleBarStyle: 'hidden-inset',
         backgroundColor: '#ccc'
     })

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
    viewerWindow.loadURL(viewerPath)
    viewerWindow.show()

    if (process.env.NODE_ENV === 'development') {
        BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

        let installExtension = require('electron-devtools-installer')

        installExtension.default(installExtension.VUEJS_DEVTOOLS)
            .then((name) => mainWindow.webContents.openDevTools())
            .catch((err) => console.log('An error occurred: ', err))
    }
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', (e) => {
        mainWindow = null
    })

    mainWindow.on('resize', () => {});

    const windowID = mainWindow.id
    viewerWindow.webContents.on('did-finish-load', function () {
      const input = 100
      viewerWindow.webContents.send('compute-factorial', input, windowID)
    })


}

app.on('ready', createWindow)

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
    console.log('before quit fired');
    console.log(articleWindow);
})

ipcMain.on('openArticleWindow', (event, url) => {
  var electronScreen = electron.screen;
  var size = electronScreen.getPrimaryDisplay().workAreaSize;


  if (articleWindow !== null) {
      if (articleWindow.isMinimized()) {
          articleWindow.loadURL(url)
          articleWindow.restore()
      } else {
          articleWindow.loadURL(url)
          articleWindow.show()
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
              nodeIntegration: false,
              webSecurity: false,
              allowDisplayingInsecureContent: true,
              allowRunningInsecureContent: true,
              plugins: true
          },
          backgroundColor: '#ccc'
      }
      articleWindow = new BrowserWindow(winOptions);
      let webContents = articleWindow.webContents

      articleWindow.loadURL(url);
      articleWindow.show();

  }

  articleWindow.webContents.on('dom-ready', function(event) {
      let cssSelector = 'body:after'
      let cssStyles = 'content: ""; height: 40px; position: fixed; top: 0; z-index: 99999999; background: #eee; width: 100%; box-shadow: 0 1px 5px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12); -webkit-app-region: drag; cursor: -webkit-grab; left: 0; bottom: 0;'
      let cssString = cssSelector + '{' + cssStyles + '}'

      articleWindow.webContents.insertCSS(cssString)
  });

  articleWindow.on('closed', function(e) {
      articleWindow = null
  });
  // Reply on async message from renderer process
  event.sender.send('async-reply', 2);
});
