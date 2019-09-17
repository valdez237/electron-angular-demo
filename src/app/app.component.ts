import { Component, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'electron-angular-demo';

  private ipc: IpcRenderer
  notification = document.getElementById('notification');
  message = document.getElementById('message');
  restartButton  = document.getElementById('restart-button');

  constructor() {
    if((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer
      } catch(e) {
        throw e;
      }
    }
  }
  ngOnInit(): void {
    this.ipc.on('update_available', () => {
      this.ipc.removeAllListeners('update_available');
      this.message.innerText = 'A new update is available. Downloading now...';
      this.notification.classList.remove('hidden');
    });

    this.ipc.on('update_downloaded', () => {
      this.ipc.removeAllListeners('update_downloaded');
      this.message.innerText = 'Update Downloaded. it will be installled on restart. restart now?';
      this.restartButton.classList.remove('hidden');
      this.notification.classList.remove('hidden');
    })
  }

  closeNotification() {
    this.notification.classList.add('hidden');
  }

  restartApp() {
    this.ipc.send('restart_app');
  }
}
