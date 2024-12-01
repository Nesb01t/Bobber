import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { useCore } from './core'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 360,
    height: 290,
    show: false,
    frame: false,
    resizable: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const core = useCore()

  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
  ipcMain.on('close', () => BrowserWindow.getFocusedWindow()?.close())

  ipcMain.handle('launch-core', () => {
    if (core.getCoreLaunched()) {
      return true
    } else {
      const state = core.StartCore()
      core.setCoreLaunched(state)
    }

    core.InitDeviceInfo()

    return core.getCoreLaunched()
  })

  ipcMain.handle('get-device-info', () => {
    return core.deviceInfo
  })

  ipcMain.handle('select-device', (_, message) => {
    const int = parseInt(message)
    core.SelectDevice(int)
    core.deviceInfo.selectedIdx = int
  })

  ipcMain.handle('get-peak-value', () => {
    return core.GetPeakValue()
  })

  ipcMain.handle('press-key', (_, message) => {
    core.PressKey(message)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
