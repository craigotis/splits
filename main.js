'use strict';

var BrowserWindow = require('browser-window');
var Menu = require('menu');
var app = require('app');
var dialog = require('dialog');
var mainWindow = null;

var template = [{
    label: 'File',
    submenu: [{
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() {
            app.quit();
        }
    }]
}];

app.on('window-all-closed', function onWindowAllClosed() {
    app.quit();
});

app.on('ready', function onReady() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        titleBarStyle: 'hidden'
    });

    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    delete mainWindow.module;

    if (process.env.ELECTRON_ENV === 'development') {
        mainWindow.openDevTools();
        mainWindow.loadURL('http://localhost:5000');
    } else {
        mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
    }

    mainWindow.on('closed', function onClosed() {
        mainWindow = null;
    });
});

function onFileOpen(files) {
    if (files && files.length) {
        mainWindow.webContents.send('filesOpened', JSON.stringify(files));
    }
}
