import { useState } from "react";

import LocalSftp from "renderer/components/Sftp/Local";
import RemoteSftp from "renderer/components/Sftp/Remote";

import style from "./index.module.scss";

export default function SftpPage() {

  const [update, setUpdate] = useState<number>(Math.random());

  const [localPath, setLocalPath] = useState<string>();
  const [remotePath, setRemotePath] = useState<string>("/");

  return (
    <div className={style.sftp}>
      <LocalSftp
        update={update}
        remotePath={remotePath}
        onMove={() => setUpdate(Math.random())}
        onPathChange={(path) => setLocalPath(path)}
      />
      <RemoteSftp
        update={update}
        localPath={localPath}
        onMove={() => setUpdate(Math.random())}
        onPathChange={(path) => setRemotePath(path)}
      />
    </div>
  );
}
