import { useEffect, useMemo, useState } from "react";

import { useAsyncEffect } from "renderer/hooks/useAsyncEffect";
import { classNames } from "renderer/utils/classNames";

import RenderFolder from "renderer/components/Sftp/Render/Folder";
import RenderFile from "renderer/components/Sftp/Render/File";

import style from "./index.module.scss";
import { useAppDispatch } from "renderer/hooks/redux";
import { appSlice } from "renderer/store/reducers/app/slice";

interface IProps {
  update: number,
  remotePath: string,
  onMove(): void
  onPathChange(path: string | undefined): void
}

interface ElementItem {
  name: string,
  isDirectory: boolean
}

export default function LocalSftp({ update, remotePath, onMove, onPathChange }: IProps) {
  const divider = useMemo(() => window.electron.app.getDivider(), []);

  const dispatch = useAppDispatch();

  const [path, setPath] = useState<string>();

  const [disks, setDisks] = useState<Array<string>>();
  const [elements, setElements] = useState<Array<ElementItem>>();

  useAsyncEffect(async () => {
    const data = await window.electron.app.getDisks();
    setDisks(data);
  }, []);

  useEffect(() => {
    onPathChange(path);
  }, [path]);

  useAsyncEffect(async () => {
    if (!path) {
      return;
    }

    const data = await window.electron.app.getDirectoriesAndFiles(path);
    const elements = await getElements(data, path);

    setElements(elements);
  }, [update]);

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

  const move = async (name: string) => {
    dispatch(appSlice.actions.setLoading(true));

    try {
      await window.electron.app.sftpTransferPut(path + name, remotePath + name);

      onMove();
    } catch (e) {
      console.log(e);
    }
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
            onMoveClick={() => move(name)}
          />
        ) : (
          <RenderFile
            key={name}
            name={name}
            onMoveClick={() => move(name)}
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
