const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const select = selector => document.querySelector(selector);

let container = select('#messages');
let progressBar = select('#progressBar');
let version = select('#version');

ipcRenderer.on('cpu', (event, data) => {
    document.getElementById('cpu').innerHTML = data.toFixed(2);
});

ipcRenderer.on('mem', (event, data) => {
    document.getElementById('mem').innerHTML = data.toFixed(2);
});

ipcRenderer.on('total-mem', (event, data) => {
    document.getElementById('total-mem').innerHTML = data.toFixed(2);
});

ipcRenderer.on('message', (event, text) => {
    let message = document.createElement('div');
    message.innerHTML = text;
    container.appendChild(message);
});

ipcRenderer.on('version', (event, text) => {
    version.innerText = text;
});

ipcRenderer.on('download-progress', (event, text) => {
    progressBar.style.width = `${text}%`;
});
