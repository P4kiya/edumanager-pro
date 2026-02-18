import { useEffect, useState } from "react";
import { Loader2, Download, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  useEffect(() => {
    // Check if running in Electron
    if (window.require) {
      const { ipcRenderer } = window.require("electron");

      // Listen for update available
      ipcRenderer.on("update-available", () => {
        setShowBanner(true);
      });

      // Listen for download progress
      ipcRenderer.on("download-progress", (event, progressObj) => {
        console.log("Download progress received:", progressObj);
        setIsDownloading(true);
        // progressObj contains: percent, transferred, total (in bytes)
        setProgress(progressObj);
      });

      // Listen for update downloaded (ready to install)
      ipcRenderer.on("update-downloaded", () => {
        setIsDownloading(false);
        // Ask to restart
        const userChoice = confirm("Mise à jour prête. Redémarrer maintenant ?");
        if (userChoice) {
          ipcRenderer.send("restart-app");
        }
      });

      // Handle errors
      ipcRenderer.on("update-error", (event, err) => {
        setIsDownloading(false);
        alert("Erreur de mise à jour: " + err);
        setShowBanner(false);
      });

      // Trigger update check immediately
      ipcRenderer.send("check-updates");
    }
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    if (window.require) {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send("download-update");
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className={cn(
        "flex items-center gap-4 bg-background/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-2xl ring-1 ring-black/5 transaction-all duration-300",
        isDownloading ? "w-[350px]" : "w-auto"
      )}>
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          {isDownloading ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Package className="h-5 w-5 text-primary" />
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 justify-center">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-foreground">
              {isDownloading ? "Téléchargement..." : "Mise à jour disponible"}
            </span>
            {isDownloading && (
              <span className="text-xs font-mono text-muted-foreground">
                {progress ? (
                  `${formatBytes(progress.transferred)} / ${formatBytes(progress.total)} (${Math.round(progress.percent)}%)`
                ) : (
                  "Préparation..."
                )}
              </span>
            )}
          </div>

          {isDownloading ? (
            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress?.percent || 0}%` }}
              />
            </div>
          ) : (
            <span className="text-xs text-muted-foreground truncate">
              Version 1.0.3 est prête.
            </span>
          )}
        </div>

        {!isDownloading && (
          <div className="flex items-center gap-2 pl-2 border-l border-border/50 ml-2">
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-8 rounded-lg px-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              Installer
            </Button>
            <button 
              onClick={() => setShowBanner(false)}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
