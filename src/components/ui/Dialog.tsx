import * as React from "react"
import { cn } from "@/utils/cn"
import { X } from "lucide-react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export function Dialog({ isOpen, onClose, children, title, className }: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div className={cn(
        "relative z-50 w-full max-w-lg glass-card border border-white/20 bg-white/70 dark:bg-black/70 p-6 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
        className
      )}>
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
