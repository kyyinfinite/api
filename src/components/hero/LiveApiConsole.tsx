import { useEffect, useRef, useState } from 'react'
import { request } from '@/services/api/client'
import type { ApiResponse } from '@/services/api/api.types'
import { JsonView } from '@/components/api/ResponseViewer'
import { ApiError } from '@/services/api/api.errors'
import { cn } from '@/utils/cn'

type ConsoleState = 'idle' | 'loading' | 'success' | 'error'

export interface LiveApiConsoleProps {
  method?: string
  path?: string
  autoPlay?: boolean
  loop?: boolean
  loopIntervalMs?: number
  className?: string
}

interface ConsoleFrame {
  method: string
  path: string
}

const liveFrames: ConsoleFrame[] = [
  { method: 'GET', path: '/api/v1/tools/info' },
  { method: 'GET', path: '/api/v1/info/time' },
]

const bodyScroll =
  '[&_pre]:h-full [&_pre]:overflow-auto [&_pre]:!text-[12px] [&_pre]:!leading-[20px] [&_pre]:[scrollbar-width:none] [&_pre::-webkit-scrollbar]:hidden'

export function LiveApiConsole({
  method = 'GET',
  path = '/api/v1/tools/info',
  autoPlay = true,
  loop = true,
  loopIntervalMs = 4200,
  className,
}: LiveApiConsoleProps) {
  const [state, setState] = useState<ConsoleState>(autoPlay ? 'loading' : 'idle')
  const [response, setResponse] = useState<ApiResponse<Record<string, unknown>> | null>(null)
  const [frame, setFrame] = useState<ConsoleFrame>({ method, path })
  const timersRef = useRef<number[]>([])
  const indexRef = useRef(0)
  const aliveRef = useRef(true)
  const frames = liveFrames

  const scheduleNext = () => {
    if (!loop) return
    const t = window.setTimeout(() => {
      if (!aliveRef.current) return
      indexRef.current = (indexRef.current + 1) % frames.length
      runFrame(frames[indexRef.current])
    }, loopIntervalMs)
    timersRef.current.push(t)
  }

  const runFrame = (target: ConsoleFrame) => {
    setFrame(target)
    setState('loading')
    setResponse(null)

    request<Record<string, unknown>>({ method: 'GET', path: target.path })
      .then((res) => {
        if (!aliveRef.current) return
        setResponse(res)
        setState('success')
        scheduleNext()
      })
      .catch((error: unknown) => {
        if (!aliveRef.current) return
        const failed = error instanceof ApiError
        setResponse({
          status: failed ? error.code : 0,
          statusText: failed ? 'ERROR' : 'OFFLINE',
          durationMs: failed ? (error.durationMs ?? 0) : 0,
          sizeBytes: failed ? (error.sizeBytes ?? 0) : 0,
          data:
            failed && error.body && typeof error.body === 'object'
              ? (error.body as Record<string, unknown>)
              : { status: 'error', message: error instanceof Error ? error.message : 'Request failed' },
        })
        setState('error')
        scheduleNext()
      })
  }

  useEffect(() => {
    aliveRef.current = true
    if (autoPlay) runFrame(frames[0])
    return () => {
      aliveRef.current = false
      timersRef.current.forEach((t) => window.clearTimeout(t))
      timersRef.current = []
    }
  }, [])

  const isError = state === 'error'
  const statusLabel =
    state === 'loading' ? '···' : isError ? `${response?.status || 'ERR'} ERR` : response ? `${response.status} ${response.statusText}` : '···'

  return (
    <div
      className={cn(
        'grid h-[256px] w-full grid-rows-[40px_40px_minmax(0,1fr)_40px_auto] overflow-hidden rounded-2xl border border-navy-border bg-navy text-left shadow-console',
        className,
      )}
      aria-label="Live API request console"
    >
      <div className="flex items-center justify-between gap-3 border-b border-navy-border px-4">
        <span className="flex min-w-0 items-center gap-2 whitespace-nowrap font-body text-[11px] font-bold tracking-[0.06em] text-white">
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
                isError ? 'bg-signal' : 'bg-success',
              )}
            />
            <span
              className={cn('relative inline-flex h-2 w-2 rounded-full', isError ? 'bg-signal' : 'bg-success')}
            />
          </span>
          LIVE API REQUEST
        </span>
        <span
          className={cn(
            'inline-flex h-[22px] min-w-[64px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2.5 font-body text-[10.5px] font-bold text-white',
            isError ? 'bg-signal' : 'bg-success',
          )}
        >
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-2.5 border-b border-navy-border px-4">
        <span className="inline-flex h-5 shrink-0 items-center rounded-md bg-cobalt px-2.5 font-mono text-[10px] font-bold text-white">
          {frame.method}
        </span>
        <span className="min-w-0 truncate font-mono text-[12px] text-[#c8cfe4]">{frame.path}</span>
      </div>

      <div className={cn('min-h-0 overflow-hidden px-4 py-2.5', bodyScroll)}>
        {state === 'loading' || !response ? (
          <div className="flex h-full flex-col justify-center overflow-hidden whitespace-pre font-mono text-[12px] leading-[20px] text-[#6c7390]">
            <span>{'{'}</span>
            <span className="pl-4">
              "status": <span className="jv-string">"…"</span>,
            </span>
            <span className="pl-4">
              "message": <span className="jv-string">"…"</span>,
            </span>
            <span className="pl-4">
              "free": <span className="jv-boolean">…</span>
            </span>
            <span>{'}'}</span>
          </div>
        ) : (
          <JsonView data={response.data} />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-navy-border px-4">
        <span className="whitespace-nowrap font-body text-[10.5px] font-bold tracking-wideCaps text-[#6c7390]">
          RESPONSE TIME
        </span>
        <span
          className={cn(
            'min-w-[64px] whitespace-nowrap text-right font-mono text-[12.5px] font-semibold tabular-nums',
            isError ? 'text-signal' : 'text-success',
          )}
        >
          {state === 'loading' || !response ? '··· ms' : `${response.durationMs} ms`}
        </span>
      </div>

    </div>
  )
}
