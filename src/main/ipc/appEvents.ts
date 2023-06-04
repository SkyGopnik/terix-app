import { ipcMain, shell } from "electron";
import { NodeSSH } from "node-ssh";

const ssh = new NodeSSH();

ipcMain.on("app:open_link", (_, link) => {
  shell.openExternal(link)
    .catch((e) => {
      console.log("Unable to open link", e);
    });
});

ipcMain.handle("ssh:connect", async () => {
  await ssh.connect({
    host: '188.120.225.57',
    port: 22,
    username: 'admin',
    password: 'g7oUNAK6Xn'
  });
});

ipcMain.handle("ssh:execute", async (_, command) => {
  const result = await ssh.execCommand(command);

  console.log(result);

  return result.stdout;
});

