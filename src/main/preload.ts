// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels } from "common/ipc";

const electronHandler = {

  app: {

    openLink: (url: string) => {
      ipcRenderer.send(IpcChannels.app.openLink, url);
    },

    connectSSH() {
      return ipcRenderer.invoke(IpcChannels.app.connectSSH);
    },


    sshExecute(command: string): Promise<string> {
      return ipcRenderer.invoke(IpcChannels.app.sshExecute, command);
    }

  }

};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
