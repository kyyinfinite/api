import { Check, Copy, Download, Image, Video, Music2, File } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { BinaryApiPayload } from '@/services/api/api.types'
import { cn } from '@/utils/cn'

function syntaxHighlight(value: unknown, indent = 0): React.ReactNode {
  const pad = '\u00a0'.repeat((indent + 1) * 2)

  if (value === null) return <span className="jv-null">null</span>
  if (typeof value === 'boolean')
    return <span className="jv-boolean">{String(value)}</span>
  if (typeof value === 'number') return <span className="jv-number">{value}</span>
  if (typeof value === 'string')
    return <span className="jv-string">"{value.replace(/"/g, '\\"')}"</span>

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="jv-punct">[]</span>
    return (
      <>
        {'\n'}
        {value.map((item, i) => (
          <span key={i}>
            {pad}
            {syntaxHighlight(item, indent + 1)}
            {i < value.length - 1 && <span className="jv-punct">,</span>}
            {'\n'}
          </span>
        ))}
        {'\u00a0'.repeat(indent * 2)}
        <span className="jv-punct">]</span>
      </>
    )
  }

  const entries = Object.entries(value as Record<string, unknown>)
  if (entries.length === 0) return <span className="jv-punct">{'{}'}</span>
  return (
    <>
      {'\n'}
      {entries.map(([key, val], i) => (
        <span key={key}>
          {pad}
          <span className="jv-key">"{key}"</span>
          <span className="jv-punct">: </span>
          {syntaxHighlight(val, indent + 1)}
          {i < entries.length - 1 && <span className="jv-punct">,</span>}
          {'\n'}
        </span>
      ))}
      {'\u00a0'.repeat(indent * 2)}
      <span className="jv-punct">{'}'}</span>
    </>
  )
}

export function JsonView({ data, className }: { data: unknown; className?: string }) {
  return (
    <pre className={cn('json-view overflow-x-auto font-mono text-[12.5px] leading-[1.8] text-[#8b93ab]', className)}>
      <span className="jv-punct">{'{'}</span>
      {syntaxHighlight(data)}
    </pre>
  )
}

export function CopyButton({
  value,
  label = 'Copy',
  className,
  onDark = false,
}: {
  value: string
  label?: string
  className?: string
  onDark?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      onClick={copy}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-body text-xs font-semibold transition-colors',
        onDark
          ? 'border-navy-border bg-navy text-[#a6acbf] hover:border-[#3a4660] hover:text-white'
          : 'border-line bg-paper-raised text-ink-soft hover:border-cobalt hover:text-cobalt',
        className,
      )}
      aria-live="polite"
    >
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      {copied ? 'Copied' : label}
    </button>
  )
}


export function BinaryResponseViewer({ file }: { file: BinaryApiPayload }) {
  const [objectUrl, setObjectUrl] = useState('')

  useEffect(() => {
    const url = URL.createObjectURL(file.blob)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file.blob])

  const type = file.contentType.toLowerCase()
  const isImage = type.startsWith('image/')
  const isVideo = type.startsWith('video/')
  const isAudio = type.startsWith('audio/')
  const Icon = isImage ? Image : isVideo ? Video : isAudio ? Music2 : File

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-navy-border bg-[#10182b] p-4">
      <div className="flex flex-wrap items-center gap-3 text-[#c8cfe4]">
        <Icon size={20} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs font-semibold">{file.filename}</p>
          <p className="mt-1 font-mono text-[11px] text-[#8b93ab]">{file.contentType} · {(file.blob.size / 1024).toFixed(2)} KB</p>
        </div>
        {objectUrl && (
          <a href={objectUrl} download={file.filename} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#34405a] px-3 font-body text-xs font-semibold text-white hover:border-[#65718c]">
            <Download size={14} /> Download
          </a>
        )}
      </div>
      {objectUrl && isImage && <img src={objectUrl} alt={file.filename} className="max-h-[420px] max-w-full self-start rounded-lg object-contain" />}
      {objectUrl && isAudio && <audio controls src={objectUrl} className="w-full" />}
      {objectUrl && isVideo && <video controls src={objectUrl} className="max-h-[420px] w-full rounded-lg" />}
      {!isImage && !isAudio && !isVideo && <p className="font-mono text-xs text-[#8b93ab]">Binary response received successfully. Download the file to inspect it.</p>}
    </div>
  )
}
