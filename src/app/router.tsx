import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import type { RoutePreloader } from '@/components/motion/PageTransition'
import { HomePage } from '@/pages/HomePage'

const ApiExplorerPage = lazy(() => import('@/pages/ApiExplorerPage'))
const ApiDetailPage = lazy(() => import('@/pages/ApiDetailPage'))
const PlaygroundPage = lazy(() => import('@/pages/PlaygroundPage'))
const DocumentationPage = lazy(() => import('@/pages/DocumentationPage'))
const StatusPage = lazy(() => import('@/pages/StatusPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const AdminPage = lazy(() => import('@/pages/AdminPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const routePreloaders: RoutePreloader[] = [
  { test: /^\/$/, load: () => import('@/pages/HomePage') },
  { test: /^\/apis$/, load: () => import('@/pages/ApiExplorerPage') },
  { test: /^\/apis\/[^/]+\/[^/]+$/, load: () => import('@/pages/ApiDetailPage') },
  { test: /^\/playground$/, load: () => import('@/pages/PlaygroundPage') },
  { test: /^\/docs$/, load: () => import('@/pages/DocumentationPage') },
  { test: /^\/status$/, load: () => import('@/pages/StatusPage') },
  { test: /^\/about$/, load: () => import('@/pages/AboutPage') },
  { test: /^\/admin$/, load: () => import('@/pages/AdminPage') },
  { test: /^\/.+/, load: () => import('@/pages/NotFoundPage') },
]

function LazyFallback() {
  return (
    <PageContainer className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-3 text-ink-soft">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cobalt" />
        <span className="font-mono text-sm">Loading…</span>
      </div>
    </PageContainer>
  )
}

export function RouterProvider() {
  return (
    <PageTransition preload={routePreloaders}>
      <Layout>
        <Suspense fallback={<LazyFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apis" element={<ApiExplorerPage />} />
            <Route path="/apis/:category/:endpoint" element={<ApiDetailPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </PageTransition>
  )
}
