"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import fileUpload from "@/API/FileUpload";
import {
  addFolder,
  replaceConflictingEntry,
  deleteFile,
  USER_STORAGE_LIMIT_BYTES,
} from "@/API/Files";
import { useFetchAllFiles } from "@/hooks/fetchAllFiles";
import { formatBytes } from "@/utils/formatBytes";
import AddFolder from "./addBtnComponents/AddFolder";
import ProgressIndicator from "./ProgressIndicator";

type DriveContextValue = {
  usageBytes: number;
  limitBytes: number;
  openFilePicker: () => void;
  openFolderPicker: () => void;
  openNewFolder: () => void;
  uploadDroppedFiles: (files: FileList | File[]) => Promise<void>;
};

const DriveContext = createContext<DriveContextValue | null>(null);

export function useDrive() {
  const value = useContext(DriveContext);
  if (!value) {
    throw new Error("useDrive must be used inside DriveProvider");
  }
  return value;
}

export function DriveProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [folderName, setFolderName] = useState("");
  const [folderToggle, setFolderToggle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { Folder } = router.query;
  const { data: session } = useSession();
  const userId = session?.user.id;
  const userEmail = session?.user.email;
  const allFiles = useFetchAllFiles(userId ?? "", userEmail ?? undefined);
  const usageBytes = allFiles.reduce((total, entry) => {
    if (entry.isFolder) return total;
    return total + Number(entry.fileSize ?? 0);
  }, 0);

  const ensureWithinStorageLimit = useCallback(
    (bytesToAdd: number) => {
      if (usageBytes + bytesToAdd > USER_STORAGE_LIMIT_BYTES) {
        window.alert(
          `You have reached your ${formatBytes(USER_STORAGE_LIMIT_BYTES)} storage limit.`,
        );
        return false;
      }
      return true;
    },
    [usageBytes],
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!userId) return;

      const fileList = Array.from(files);
      const totalUploadSize = fileList.reduce(
        (total, file) => total + Number(file?.size ?? 0),
        0,
      );

      if (!ensureWithinStorageLimit(totalUploadSize)) return;

      for (const file of fileList) {
        if (!file) continue;

        const conflict = allFiles.find(
          (entry) =>
            !entry.isFolder &&
            entry.folderId === (Folder?.[1] || "") &&
            entry.fileName === file.name,
        );

        if (conflict) {
          const confirmed = window.confirm(
            `"${file.name}" already exists here. Replace it?`,
          );
          if (!confirmed) continue;

          await deleteFile(
            conflict.id,
            false,
            conflict.publicId,
            conflict.resourceType,
          );
        }

        const uploadId = crypto.randomUUID();
        setUploads((prev) => [
          ...prev,
          { id: uploadId, name: file.name, progress: 0 },
        ]);
        await fileUpload(
          file,
          uploadId,
          setUploads,
          Folder?.[1] || "",
          userId,
          userEmail ?? "",
        );
      }
    },
    [Folder, allFiles, ensureWithinStorageLimit, userEmail, userId],
  );

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    await uploadFiles(e.target.files || []);
    e.target.value = "";
  };

  const uploadFolder = async () => {
    if (!userId) return false;

    const nextFolderName = folderName === "" ? "Untitled folder" : folderName;
    const conflict = allFiles.find(
      (entry) =>
        entry.isFolder &&
        entry.folderId === (Folder?.[1] || "") &&
        entry.folderName === nextFolderName,
    );

    if (conflict) {
      const confirmed = window.confirm(
        `"${nextFolderName}" already exists here. Replace it?`,
      );
      if (!confirmed) return false;
      await replaceConflictingEntry(conflict);
    }

    await addFolder({
      folderName: nextFolderName,
      isFolder: true,
      isStarred: false,
      isTrashed: false,
      FileList: [],
      folderId: Folder?.[1] || "",
      userId,
      userEmail: userEmail ?? "",
    });
    setFolderName("");
    return true;
  };

  const uploadFolderFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!userId) return;

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalUploadSize = files.reduce(
      (total, file) => total + Number(file?.size ?? 0),
      0,
    );

    if (!ensureWithinStorageLimit(totalUploadSize)) {
      e.target.value = "";
      return;
    }

    const currentFolderId = Folder?.[1] || "";
    const folderDocsById = new Map(
      allFiles
        .filter((entry) => entry.isFolder)
        .map((entry) => [entry.id, entry]),
    );
    const folderPathMap = new Map<string, string>();

    const buildFolderPath = (folderId: string) => {
      if (!folderId) return "";

      const labels: string[] = [];
      let pointer = folderDocsById.get(folderId);

      while (pointer) {
        labels.unshift(pointer.folderName);
        if (!pointer.folderId) break;
        pointer = folderDocsById.get(pointer.folderId);
      }

      return labels.join("/");
    };

    folderDocsById.forEach((_entry, id) => {
      folderPathMap.set(buildFolderPath(id), id);
    });

    const ensureFolderPath = async (relativeFolderPath: string) => {
      if (!relativeFolderPath) return currentFolderId;

      const basePath = currentFolderId ? buildFolderPath(currentFolderId) : "";
      const segments = relativeFolderPath.split("/").filter(Boolean);
      let parentId = currentFolderId;
      let pathKey = basePath;

      for (const segment of segments) {
        pathKey = pathKey ? `${pathKey}/${segment}` : segment;

        if (folderPathMap.has(pathKey)) {
          parentId = folderPathMap.get(pathKey)!;
          continue;
        }

        const existing = allFiles.find(
          (entry) =>
            entry.isFolder &&
            entry.folderId === parentId &&
            entry.folderName === segment,
        );

        if (existing) {
          folderPathMap.set(pathKey, existing.id);
          folderDocsById.set(existing.id, existing);
          parentId = existing.id;
          continue;
        }

        const createdFolder = await addFolder({
          folderName: segment,
          isFolder: true,
          FileList: [],
          isStarred: false,
          isTrashed: false,
          folderId: parentId,
          userId,
          userEmail: userEmail ?? "",
        });

        if (!createdFolder) {
          throw new Error("Unable to create folder structure.");
        }

        const createdEntry = {
          id: createdFolder.id,
          folderName: segment,
          isFolder: true,
          fileLink: "",
          fileName: "",
          isStarred: false,
          isTrashed: false,
          fileExtension: "",
          folderId: parentId,
          userId,
          userEmail,
        } as FileListProps;

        folderPathMap.set(pathKey, createdFolder.id);
        folderDocsById.set(createdFolder.id, createdEntry);
        parentId = createdFolder.id;
      }

      return parentId;
    };

    for (const file of files) {
      const relativePath = file.webkitRelativePath || file.name;
      const parts = relativePath.split("/");
      const uploadName = parts.pop() || file.name;
      const relativeFolderPath = parts.join("/");
      const parentId = await ensureFolderPath(relativeFolderPath);

      const conflict = allFiles.find(
        (entry) =>
          !entry.isFolder &&
          entry.folderId === parentId &&
          entry.fileName === uploadName,
      );

      if (conflict) {
        const confirmed = window.confirm(
          `"${uploadName}" already exists here. Replace it?`,
        );
        if (!confirmed) continue;

        await deleteFile(
          conflict.id,
          false,
          conflict.publicId,
          conflict.resourceType,
        );
      }

      const uploadId = crypto.randomUUID();
      setUploads((prev) => [
        ...prev,
        { id: uploadId, name: uploadName, progress: 0 },
      ]);
      await fileUpload(
        file,
        uploadId,
        setUploads,
        parentId,
        userId,
        userEmail ?? "",
        uploadName,
      );
    }

    e.target.value = "";
  };

  const value = useMemo<DriveContextValue>(
    () => ({
      usageBytes,
      limitBytes: USER_STORAGE_LIMIT_BYTES,
      openFilePicker: () => fileInputRef.current?.click(),
      openFolderPicker: () => folderInputRef.current?.click(),
      openNewFolder: () => setFolderToggle(true),
      uploadDroppedFiles: uploadFiles,
    }),
    [uploadFiles, usageBytes],
  );

  const folderUploadProps = {
    webkitdirectory: "",
    directory: "",
  } as unknown as React.InputHTMLAttributes<HTMLInputElement>;

  return (
    <DriveContext.Provider value={value}>
      {children}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => void uploadFile(e)}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => void uploadFolderFiles(e)}
        {...folderUploadProps}
      />
      <ProgressIndicator uploads={uploads} setUploads={setUploads} />
      {folderToggle && (
        <AddFolder
          setFolderToggle={setFolderToggle}
          setFolderName={setFolderName}
          uploadFolder={uploadFolder}
        />
      )}
    </DriveContext.Provider>
  );
}
