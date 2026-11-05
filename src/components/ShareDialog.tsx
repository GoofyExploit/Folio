import { updateShareSettings } from "@/API/Files";
import React from "react";

function ShareDialog({
  file,
  onClose,
}: {
  file: FileListProps;
  onClose: () => void;
}) {
  const [isShared, setIsShared] = React.useState(!!file.isShared);
  const [shareToken, setShareToken] = React.useState(file.shareToken ?? "");
  const [isSaving, setIsSaving] = React.useState(false);
  const accessMode = isShared ? "public" : "private";
  const shareUrl =
    typeof window !== "undefined" && shareToken
      ? `${window.location.origin}/share/${shareToken}`
      : "";

  const enableSharing = async () => {
    setIsSaving(true);
    const nextToken = shareToken || crypto.randomUUID();

    try {
      await updateShareSettings(file.id, true, nextToken);
      setIsShared(true);
      setShareToken(nextToken);
    } finally {
      setIsSaving(false);
    }
  };

  const disableSharing = async () => {
    setIsSaving(true);

    try {
      await updateShareSettings(file.id, false, "");
      setIsShared(false);
      setShareToken("");
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      window.alert("Share link copied.");
    } catch {
      window.prompt("Copy this link", shareUrl);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">
            Copy link
          </h2>
          <p className="truncate text-sm text-[#6B7280]">
            Choose who can open "{file.fileName}" from its link.
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] p-3.5 sm:p-4">
          <div className="mb-4 space-y-2.5 sm:space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              General access
            </p>
            <button
              type="button"
              onClick={() => void disableSharing()}
              disabled={isSaving || accessMode === "private"}
              className={`flex w-full items-start justify-between rounded-xl border p-3 text-left transition sm:p-4 ${
                accessMode === "private"
                  ? "border-[#EA580C] bg-[#FFF7ED]"
                  : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="pr-2">
                <p className="font-medium text-[#111827]">Only you</p>
                <p className="text-xs text-[#6B7280] sm:text-sm">
                  Only your account can open this file.
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-[#EA580C] sm:text-sm">
                {accessMode === "private" ? "Selected" : ""}
              </span>
            </button>
            <button
              type="button"
              onClick={() => void enableSharing()}
              disabled={isSaving}
              className={`flex w-full items-start justify-between rounded-xl border p-3 text-left transition sm:p-4 ${
                accessMode === "public"
                  ? "border-[#EA580C] bg-[#FFF7ED]"
                  : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="pr-2">
                <p className="font-medium text-[#111827]">Anyone with the link</p>
                <p className="text-xs text-[#6B7280] sm:text-sm">
                  Anyone who has the link can view this file.
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-[#EA580C] sm:text-sm">
                {accessMode === "public" ? "Selected" : ""}
              </span>
            </button>
          </div>

          {isShared && shareUrl ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-[#F9FAFB] px-3 py-2 text-xs text-[#374151] sm:text-sm">
                <span className="block truncate">{shareUrl}</span>
              </div>
              <button
                type="button"
                onClick={() => void copyLink()}
                className="w-full rounded-full bg-[#EA580C] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C2410C] sm:w-auto"
              >
                Copy link
              </button>
            </div>
          ) : (
            <div className="rounded-lg bg-[#F9FAFB] px-3 py-2 text-xs text-[#6B7280] sm:text-sm">
              Link copying is available after you switch access to "Anyone with
              the link".
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#F3F4F6]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareDialog;
