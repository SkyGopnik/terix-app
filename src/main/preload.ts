// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels } from "common/ipc";

const electronHandler = {

  app: {

    openLink: (url: string) => {
      ipcRenderer.send(IpcChannels.app.openLink, url);
    },

    connectSSH(host: string, port: number, login: string, password: string) {
      return ipcRenderer.invoke(IpcChannels.app.connectSSH, { host, port, login, password });
    },

    connectSFTP(host: string, port: number, login: string, password: string) {
      return ipcRenderer.invoke(IpcChannels.app.connectSFTP, { host, port, login, password });
    },

    sshExecute(command: string): Promise<string> {
      return ipcRenderer.invoke(IpcChannels.app.sshExecute, command);
    },

    getDirectoriesAndFiles(source: string): Promise<Array<string>> {
      return ipcRenderer.invoke(IpcChannels.app.getDirectoriesAndFiles, source);
    },

    getDisks(): Promise<Array<string>> {
      return ipcRenderer.invoke(IpcChannels.app.getDisks);
    },

    isDirectory(path: string): Promise<boolean> {
      return ipcRenderer.invoke(IpcChannels.app.isDirectory, path);
    },

    sftpList(path: string): Promise<Array<{
      type: "-" | "d" | "l",
      name: string
    }>> {
      return ipcRenderer.invoke(IpcChannels.app.sftpList, path);
    }

  }

};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
