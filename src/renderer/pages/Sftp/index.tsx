import { useState } from "react";

import { useAsyncEffect } from "renderer/hooks/useAsyncEffect";

import FileIcon from "@icons/file.svg";
import FolderIcon from "@icons/folder.svg";

import style from "./index.module.scss";
import { classNames } from "renderer/utils/classNames";

interface ElementItem {
  name: string,
  isDirectory: boolean
}

export default function SftpPage() {

  const [path, setPath] = useState<string>();

  const [disks, setDisks] = useState<Array<string>>();
  const [elements, setElements] = useState<Array<ElementItem>>();

  useAsyncEffect(async () => {
    const data = await window.electron.app.getDisks();
    setDisks(data);
  }, []);

  const getElements = async (data: Array<string>, path: string) => {
    let elements: Array<ElementItem> = [];

    await Promise.all(
      data.map(async (folder) => {
        try {
          const isDirectory = await window.electron.app.isDirectory(path + folder);

          elements.push({
            name: folder,
            isDirectory
          });
        } catch (e) {
          console.log(e);
        }
      })
    );

    return elements.sort((a, b) => +b.isDirectory - +a.isDirectory);
  };

  const goBack = async () => {
    const splitPath = path?.split("\\");

    if (!splitPath) {
      return;
    }

    splitPath.length -= 2;

    const prevPath = splitPath.join("\\") + "\\";

    console.log("prevPath", prevPath);

    if (prevPath === "\\") {
      setPath(undefined);

      return;
    }

    const data = await window.electron.app.getDirectoriesAndFiles(prevPath);
    const elements = await getElements(data, prevPath);

    setElements(elements);
    setPath(prevPath);
  };

  const goPath = async (folder: string) => {
    const directory = (path ? (path + folder) : folder) + "\\";

    const data = await window.electron.app.getDirectoriesAndFiles(directory);
    const elements = await getElements(data, directory);

    setElements(elements);
    setPath(directory);
  };

  const renderFolder = (name: string) => (
    <div
      className={style.elements__item}
      key={name}
      onDoubleClick={() => goPath(name)}
    >
      <img className={style.item__icon} src={FolderIcon} alt="" />
      <span className={style.item__text}>{name}</span>
    </div>
  );

  const renderIcon = (name: string) => (
    <div
      className={style.elements__item}
      key={name}
    >
      <img className={style.item__icon} src={FileIcon} alt="" />
      <span className={style.item__text}>{name}</span>
    </div>
  );

  return (
    <div className={style.sftp}>
      <div className={classNames(style.elements, style.elementsLocal)}>
        {path && (
          <div className={style.elements__item} onDoubleClick={goBack}>
            <img className={style.item__icon} src={FolderIcon} alt="" />
            <span>..</span>
          </div>
        )}
        {path ? (
          elements?.map(({ name, isDirectory }) => isDirectory ? renderFolder(name) : renderIcon(name))
        ) : (
          disks?.map((disk) => renderFolder(disk))
        )}
      </div>
    </div>
  );
}
