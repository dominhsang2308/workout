import React, { useState } from "react";
import { Download, Upload, User, Check, X, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { localStore } from "../services/localStore";
import { Modal } from "./Modal";

interface ProfileBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileBackupModal: React.FC<ProfileBackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const { language } = useLanguage();
  const [name, setName] = useState(user?.full_name || user?.username || "Gabriel");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ full_name: name.trim(), username: name.trim().toLowerCase() });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExport = () => {
    const jsonStr = localStore.exportBackup();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitbabe_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = localStore.importBackup(content);
      if (success) {
        setImportStatus(
          language === "vi"
            ? "✅ Khôi phục dữ liệu thành công! Đang tải lại..."
            : "✅ Data restored successfully! Reloading..."
        );
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus(
          language === "vi"
            ? "❌ File không hợp lệ, vui lòng kiểm tra lại."
            : "❌ Invalid backup file."
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "vi" ? "Hồ Sơ & Sao Lưu Dữ Liệu" : "Profile & Data Backup"}
    >
      <div className="space-y-6 text-sm">
        {/* User Name Form */}
        <form onSubmit={handleSaveName} className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {language === "vi" ? "Tên Của Bạn" : "Your Name"}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500"
                placeholder="Gabriel"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? (language === "vi" ? "Đã lưu!" : "Saved!") : (language === "vi" ? "Lưu" : "Save")}</span>
            </button>
          </div>
        </form>

        {/* Data Persistence Info */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold text-white">
              {language === "vi" ? "Dữ liệu được lưu trực tiếp trên máy" : "100% Offline & Stored on Device"}
            </p>
            <p className="text-slate-300 mt-0.5">
              {language === "vi"
                ? "Tốc độ tức thì, không phụ thuộc mạng hay máy chủ. Bạn có thể xuất file sao lưu bên dưới để cất giữ an toàn."
                : "Instant speed, works offline. You can export a backup file anytime to keep your data safe."}
            </p>
          </div>
        </div>

        {/* Backup / Export */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {language === "vi" ? "Sao Lưu & Khôi Phục" : "Backup & Restore"}
          </h4>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors"
            >
              <Download className="w-4 h-4 text-brand-400" />
              <span>{language === "vi" ? "Xuất file sao lưu" : "Export Backup"}</span>
            </button>

            <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>{language === "vi" ? "Nhập file khôi phục" : "Import Backup"}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <p className="text-xs text-center font-medium text-amber-300 animate-in fade-in">
              {importStatus}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
