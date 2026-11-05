import { renameFile } from "@/API/Files";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

// The Rename component displays a pop-up for rename input.
function Rename({
  setRenameToggle,
  fileId,
  fileName,
  isFolder,
  fileExtension,
}: renameProps) {
  const [newName, setNewName] = useState(fileName);
  const { data: session } = useSession();

  const rename = async () => {
    if (newName === "") return;
    if (!session?.user.id) return;

    let renamed = false;
    if (isFolder) {
      renamed = await renameFile(
        fileId,
        newName,
        isFolder,
        session.user.id,
        session.user.email as string,
      );
    } else {
      const formatName = newName.includes(".")
        ? newName
        : newName + "." + fileExtension;
      renamed = await renameFile(
        fileId,
        formatName,
        isFolder,
        session.user.id,
        session.user.email as string,
      );
    }
    if (renamed) {
      setRenameToggle("");
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-9 z-20 w-64 max-w-[calc(100vw-3rem)] space-y-3 rounded-2xl border border-[#F0EEEB] bg-white p-3.5 shadow-xl shadow-black/10"
    >
      <h2 className="text-base font-semibold text-[#111827]">Rename</h2>
      <input
        autoFocus
        className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#EA580C]"
        type="text"
        placeholder="Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            void rename();
          }
        }}
      />
      <div className="flex w-full justify-end gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setRenameToggle("")}
          className="rounded-full px-3 py-1.5 text-[#6B7280] transition hover:bg-[#F3F4F6]"
        >
          Cancel
        </button>
        <button
          onClick={() => void rename()}
          disabled={!newName.trim()}
          className="rounded-full bg-[#EA580C] px-3.5 py-1.5 text-white transition hover:bg-[#C2410C] disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Rename;
