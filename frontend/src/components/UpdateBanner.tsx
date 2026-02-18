import { useEffect, useState } from "react";

export function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    if (window.require) {
      const { ipcRenderer } = window.require("electron");

      // Listen for update available
      ipcRenderer.on("update-available", () => {
        setShowBanner(true);
      });

      // Listen for update downloaded (ready to install)
      ipcRenderer.on("update-downloaded", () => {
        setIsDownloading(false);
        // Ask to restart
        const userChoice = confirm("Mise à jour téléchargée. Redémarrer maintenant ?");
        if (userChoice) {
          ipcRenderer.send("restart-app");
        }
      });
    }
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    if (window.require) {
      const { ipcRenderer } = window.require("electron");
      // In a real scenario, autoUpdater downloads automatically if autoDownload is true.
      // But we can trigger a manual download or just acknowledge the update.
      // If autoDownload is true (default), this button effectively just acknowledges "Yes, I see it, do it".
      // However, for better UX, we might want to trigger `restart-app` if it's already downloaded,
      // or just wait for `update-downloaded` if it's still downloading.
      
      // For this simplified version, let's assume we just want to trigger the restart flow 
      // when the user clicks, OR we act as a "Download & Install" trigger.
      // But commonly, `autoUpdater` starts downloading immediately on "update-available" if autoDownload=true.
      // So we just show "Downloading..." until `update-downloaded` fires.
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-indigo-600 z-50 flex items-center justify-center px-4 shadow-md">
      <div className="flex items-center gap-4 text-white text-sm font-medium">
        <span>Une nouvelle mise à jour est disponible pour EduManager.</span>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-white text-indigo-600 px-3 py-1 rounded shadow-sm hover:bg-indigo-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isDownloading ? "Téléchargement en cours..." : "Télécharger et Redémarrer"}
        </button>
      </div>
    </div>
  );
}
