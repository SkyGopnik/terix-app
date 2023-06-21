import { useMemo, useState } from "react";

import { useAsyncEffect } from "renderer/hooks/useAsyncEffect";
import { classNames } from "renderer/utils/classNames";

import RenderFolder from "renderer/components/Sftp/Render/Folder";
import RenderFile from "renderer/components/Sftp/Render/File";

import style from "./index.module.scss";

interface ElementItem {
  name: string,
  isDirectory: boolean
}

export default function LocalSftp() {
  const divider = useMemo(() => window.electron.app.getDivider(), []);

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
    const splitPath = path?.split(divider);

    if (!splitPath) {
      return;
    }

    splitPath.length -= 2;

    const prevPath = splitPath.join(divider) + divider;

    if (prevPath === divider) {
      setPath(undefined);

      return;
    }

    const data = await window.electron.app.getDirectoriesAndFiles(prevPath);
    const elements = await getElements(data, prevPath);

    setElements(elements);
    setPath(prevPath);
  };

  const goPath = async (folder: string) => {
    const directory = (path ? (path + folder) : folder) + divider;

    const data = await window.electron.app.getDirectoriesAndFiles(directory);
    const elements = await getElements(data, directory);

    setElements(elements);
    setPath(directory);
  };

  return (
    <div className={classNames(style.elements, style.elementsLocal)}>
      {path && (
        <RenderFolder
          name=".."
          onDoubleClick={goBack}
        />
      )}
      {path ? (
        elements?.map(({ name, isDirectory }) => isDirectory ? (
          <RenderFolder
            key={name}
            name={name}
            onDoubleClick={() => goPath(name)}
          />
        ) : (
          <RenderFile
            key={name}
            name={name}
          />
        ))
      ) : (
        disks?.map((disk) => (
          <RenderFolder
            key={disk}
            name={disk}
            onDoubleClick={() => goPath(disk)}
          />
        ))
      )}
    </div>
  );
}
