import { ipcMain, shell } from "electron";

ipcMain.on("app:open_link", (_, link) => {
  shell.openExternal(link)
    .catch((e) => {
      console.log("Unable to open link", e);
    });
});
