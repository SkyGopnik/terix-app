// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels } from "common/ipc";

const electronHandler = {

  app: {

    openLink: (url: string) => {
      ipcRenderer.send(IpcChannels.app.openLink, url);
    }

  }

};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
