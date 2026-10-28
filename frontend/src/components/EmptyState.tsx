import React from "react";
import { LucideIcon, Plus, Sparkles } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-card rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-brand-accent/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 shadow-inner animate-float">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white font-heading">{title}</h3>
      <p className="mt-1 text-sm text-slate-400 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-accent hover:from-brand-400 hover:to-purple-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-500/20 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
