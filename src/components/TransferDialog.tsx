import { useFetchAllFiles } from "@/hooks/fetchAllFiles";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";

function TransferDialog({
  item,
  mode,
  onClose,
  onConfirm,
}: {
  item: FileListProps;
  mode: "move" | "copy";
  onClose: () => void;
  onConfirm: (destinationId: string) => Promise<void>;
}) {
  const { data: session } = useSession();
  const [destinationId, setDestinationId] = useState(item.folderId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allFiles = useFetchAllFiles(
    session?.user.id ?? "",
    session?.user.email ?? undefined,
  );

  const folderOptions = useMemo(() => {
    const folderMap = new Map(
      allFiles
        .filter((entry) => entry.isFolder)
        .map((entry) => [entry.id, entry]),
    );
    const blockedIds = new Set<string>();

    if (item.isFolder) {
      blockedIds.add(item.id);
      const stack = [item.id];

      while (stack.length > 0) {
        const currentId = stack.pop();
        const children = allFiles.filter(
          (entry) => entry.folderId === currentId,
        );

        for (const child of children) {
          if (child.isFolder && !blockedIds.has(child.id)) {
            blockedIds.add(child.id);
            stack.push(child.id);
          }
        }
      }
    }

    const buildPath = (folderId: string) => {
      const labels: string[] = [];
      let pointer = folderMap.get(folderId);

      while (pointer) {
        labels.unshift(pointer.folderName || "Folder");
        if (!pointer.folderId) break;
        pointer = folderMap.get(pointer.folderId);
      }

      return `My Drive${labels.length > 0 ? ` / ${labels.join(" / ")}` : ""}`;
    };

    const options = allFiles
      .filter((entry) => entry.isFolder && !blockedIds.has(entry.id))
      .map((entry) => ({
        id: entry.id,
        label: buildPath(entry.id),
      }));

    return [{ id: "", label: "My Drive" }, ...options];
  }, [allFiles, item.folderId, item.id, item.isFolder]);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(destinationId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="space-y-1">
          <h2 className="text-xl font-bold capitalize tracking-tight text-[#111827] sm:text-2xl">
            {mode} item
          </h2>
          <p className="truncate text-sm text-[#6B7280]">
            Select where to {mode} "{item.isFolder ? item.folderName : item.fileName}".
          </p>
        </div>
        <select
          value={destinationId}
          onChange={(event) => setDestinationId(event.target.value)}
          className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#EA580C]"
        >
          {folderOptions.map((option) => (
            <option key={`${mode}-${option.id}`} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2 text-sm font-medium">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-[#374151] transition hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={isSubmitting}
            className="rounded-full bg-[#EA580C] px-5 py-2 text-white shadow-sm transition hover:bg-[#C2410C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Working..." : mode === "move" ? "Move" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransferDialog;
