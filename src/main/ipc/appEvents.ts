import { ipcMain, shell } from "electron";
import { NodeSSH } from "node-ssh";
import SFTP from "ssh2-sftp-client";
import { readdir, lstat } from 'fs/promises';

const nodeDiskInfo = require('node-disk-info');

const ssh = new NodeSSH();
const sftp = new SFTP();

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

ipcMain.handle("sftp:connect", async (_, { host, port, login, password }) => {
  await sftp.end();

  await sftp.connect({
    host,
    port,
    username: login,
    password
  });
});

ipcMain.handle("sftp:list", async (_, path) => {
  return sftp.list(path);
});

ipcMain.handle("pc:get_directories_and_files", async (_, source) => {
  return (await readdir(source, { withFileTypes: true }))
    .map(dirent => dirent.name);
});

ipcMain.handle("pc:get_disks", async (_) => {
  return (await nodeDiskInfo.getDiskInfo())
    .map((disk: any) => disk.mounted);
});


ipcMain.handle("pc:is_directory", async (_, path) => {
  return (await lstat(path)).isDirectory();
});

