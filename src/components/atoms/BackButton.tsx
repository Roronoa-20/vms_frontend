"use client"

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
    /** If set, shows text next to the icon */
    label?: string
    className?: string
    'aria-label'?: string
}

/**
 * Primary navigation back — icon-only by default for a compact header.
 */
export function BackButton({ label, className, 'aria-label': ariaLabel }: BackButtonProps) {
    const router = useRouter()
    const isIconOnly = !label

    return (
        <button
            type="button"
            onClick={() => router.back()}
            aria-label={ariaLabel ?? (isIconOnly ? 'Go back' : undefined)}
            className={
                className ??
                (isIconOnly
                    ? 'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#475569] shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300'
                    : 'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300')
            }
        >
            <ArrowLeft className={isIconOnly ? 'w-4 h-4' : 'w-3.5 h-3.5'} aria-hidden />
            {label ? <span>{label}</span> : null}
        </button>
    )
}
