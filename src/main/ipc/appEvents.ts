import { ipcMain, shell } from "electron";
import { NodeSSH } from "node-ssh";

const ssh = new NodeSSH();

ipcMain.on("app:open_link", (_, link) => {
  shell.openExternal(link)
    .catch((e) => {
      console.log("Unable to open link", e);
    });
});

ipcMain.handle("ssh:connect", async (_, { host, port, login, password }) => {
  await ssh.connect({
    host,
    port,
    username: login,
    password
  });
});

ipcMain.handle("ssh:execute", async (_, command) => {
  const result = await ssh.execCommand(command);

  return result.stdout || result.stderr;
});

