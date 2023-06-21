import LocalSftp from "renderer/components/Sftp/Local";
import RemoteSftp from "renderer/components/Sftp/Remote";

import style from "./index.module.scss";

export default function SftpPage() {
  return (
    <div className={style.sftp}>
      <LocalSftp />
      <RemoteSftp />
    </div>
  );
}
