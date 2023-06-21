import { useState } from "react";
import { enqueueSnackbar } from "notistack";

import RenderFolder from "renderer/components/Sftp/Render/Folder";
import RenderFile from "renderer/components/Sftp/Render/File";

import { useAsyncEffect } from "renderer/hooks/useAsyncEffect";
import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";

import style from "./index.module.scss";

interface ElementItem {
  name: string,
  isDirectory: boolean
}

export default function RemoteSftp() {

  const { activeConnection, history } = useAppSelector((state) => state.connectionReducer);

  const dispatch = useAppDispatch();

  const [path, setPath] = useState<string>("/");

  const [elements, setElements] = useState<Array<ElementItem>>();

  useAsyncEffect(async () => {
    console.log(activeConnection);

    if (activeConnection === undefined) {
      return;
    }

    const { host, port, login, password } = history[activeConnection];

    try {
      await window.electron.app.connectSFTP(host, port, login, password);
      await getElements("/");
    } catch (e) {
      console.log(e);

      enqueueSnackbar({
        message: "Произошла ошибка при подключении",
        variant: "error"
      });
    }
  }, []);

  const getElements = async (path: string) => {
    let elements: Array<ElementItem> = (await window.electron.app.sftpList(path)).map((item) => ({
      name: item.name,
      isDirectory: item.type === "d"
    }));

    elements.sort((a, b) => +b.isDirectory - +a.isDirectory);

    setElements(elements);
  };

  const goBack = async () => {
    const splitPath = path?.split("/");

    if (!splitPath) {
      return;
    }

    splitPath.length -= 2;

    const prevPath = splitPath.join("/") + "/";

    await getElements(prevPath);

    setPath(prevPath);
  };

  const goPath = async (folder: string) => {
    const directory = (path ? (path + folder) : folder) + "/";

    await getElements(directory);

    setPath(directory);
  };

  return (
    <div className={style.elements}>
      {path !== "/" && (
        <RenderFolder
          name=".."
          onDoubleClick={goBack}
        />
      )}
      {elements?.map(({ name, isDirectory }) => isDirectory ? (
        <RenderFolder
          key={name}
          name={name}
          onDoubleClick={() => goPath(name)}
        />
      ) : (
        <RenderFile key={name} name={name} />
      ))}
    </div>
  );
}
