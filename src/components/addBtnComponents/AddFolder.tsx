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
      onClick={() => setFolderToggle(false)} // Close the pop-up when clicking outside
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
    >
      {/* Pop-up form for creating a new folder */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevent clicks inside the form from closing the pop-up
        }}
        className="w-96 space-y-6 rounded-3xl bg-white p-6 shadow-xl shadow-black/10"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
          New folder
        </h2>
        <input
          className="w-full rounded-xl border border-[#E5E7EB] py-2.5 indent-4 outline-none focus:border-[#EA580C]"
          type="text"
          placeholder="Untitled folder"
          onChange={(e) => setFolderName(e.target.value)}
        />
        <div className="flex w-full justify-end gap-2 font-medium">
          <button
            type="button"
            onClick={() => setFolderToggle(false)}
            className="rounded-full px-4 py-2 text-[#374151] hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            onClick={() => void addFolder()}
            className="rounded-full bg-[#EA580C] px-4 py-2 text-white hover:bg-[#C2410C]"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFolder;
