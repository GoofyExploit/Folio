import React from "react";

// The AddFolder component displays a pop-up for creating a new folder.
function AddFolder({
  setFolderToggle,
  setFolderName,
  uploadFolder,
}: folderToggleProps) {
  const addFolder = async () => {
    const created = await uploadFolder();
    if (created) {
      setFolderToggle(false);
    }
  };

  return (
    // Background overlay for the pop-up
    <div
      onClick={() => setFolderToggle(false)}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <h2 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">
          New folder
        </h2>
        <input
          autoFocus
          className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#EA580C]"
          type="text"
          placeholder="Untitled folder"
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void addFolder();
            }
          }}
        />
        <div className="flex w-full justify-end gap-2 text-sm font-medium">
          <button
            type="button"
            onClick={() => setFolderToggle(false)}
            className="rounded-full px-4 py-2 text-[#374151] transition hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void addFolder()}
            className="rounded-full bg-[#EA580C] px-5 py-2 text-white shadow-sm transition hover:bg-[#C2410C]"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFolder;
