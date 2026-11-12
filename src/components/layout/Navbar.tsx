import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, ArrowUpRight, Search } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Dropdown } from '@/components/ui/Dropdown'
import { useSearchDialog, SearchDialogOverlay } from '@/components/ui/SearchDialog'
import { TLink, TNavLink } from '@/components/motion/PageTransition'
import { useCatalogCategories } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative font-body text-[15px] font-medium transition-colors hover:text-cobalt',
    isActive ? 'text-cobalt' : 'text-ink',
  )

function ApisMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { data: categories } = useCatalogCategories()
  return (
    <div className="grid gap-0.5">
      {(categories ?? []).map((category) => (
        <TLink
          key={category.id}
          to={`/apis?category=${category.id}`}
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-paper"
        >
          <span className="font-mono text-[11px] font-semibold text-ink-soft">
            {category.index}
          </span>
          <span className="flex-1">
            <span className="block font-body text-sm font-semibold text-ink group-hover:text-cobalt">
              {category.name}
            </span>
            <span className="block font-body text-xs text-ink-soft">{category.description}</span>
          </span>
          <ArrowUpRight
            size={14}
            className="text-ink-soft opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-cobalt group-hover:opacity-100"
          />
        </TLink>
      ))}
      <TLink
        to="/apis"
        onClick={onNavigate}
        className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-line-muted bg-paper px-3 py-2.5 font-body text-[13px] font-semibold text-ink transition-colors hover:border-cobalt hover:text-cobalt"
      >
        View all endpoints <ArrowUpRight size={14} />
      </TLink>
    </div>
  )
}

export function Navbar() {
  const { openDialog } = useSearchDialog()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)

  const closeMobile = () => setMobileOpen(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm"
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6 lg:h-[82px]">
          <TLink to="/" aria-label="Kyyinfinite home" className="shrink-0">
            <Logo />
          </TLink>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            <Dropdown
              trigger={({ open, toggle, ref }) => (
                <button
                  ref={ref}
                  onClick={toggle}
                  aria-haspopup="menu"
                  aria-expanded={open}
                  className={cn(
                    'flex items-center gap-1.5 font-body text-[15px] font-medium transition-colors',
                    open || location.pathname.startsWith('/apis') ? 'text-cobalt' : 'text-ink hover:text-cobalt',
                  )}
                >
                  APIs
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform duration-200', open && 'rotate-180')}
                  />
                </button>
              )}
            >
              {({ close }) => <ApisMenu onNavigate={close} />}
            </Dropdown>

            <TNavLink to="/docs" className={navLinkClass}>
              Docs
            </TNavLink>
            <TNavLink to="/status" className={navLinkClass}>
              Status
            </TNavLink>
            <TNavLink to="/about" className={navLinkClass}>
              About
            </TNavLink>
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <button
              onClick={openDialog}
              className="flex h-11 w-[230px] items-center gap-2.5 rounded-[10px] border border-line bg-paper-raised px-3.5 text-left transition-colors hover:border-[#c9c4b7]"
              aria-label="Search APIs"
            >
              <Search size={16} className="shrink-0 text-ink-soft" />
              <span className="flex-1 truncate font-body text-sm text-ink-soft">
                Search APIs…
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <kbd className="kbd">Ctrl</kbd>
                <kbd className="kbd">K</kbd>
              </span>
            </button>

            <TLink
              to="/apis"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-navy px-5 font-body text-sm font-semibold text-white transition-colors hover:bg-[#1a2334]"
            >
              Explore APIs <ArrowUpRight size={15} />
            </TLink>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <button
              onClick={openDialog}
              aria-label="Search APIs"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-paper-raised text-ink transition-colors hover:border-cobalt hover:text-cobalt"
            >
              <Search size={17} />
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-paper-raised text-ink transition-colors hover:border-cobalt hover:text-cobalt"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 top-[72px] z-40 overflow-y-auto border-t border-line bg-paper lg:hidden">
          <div className="shell flex flex-col gap-8 py-8">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              <p className="eyebrow mb-2 px-3">Menu</p>
              <MobileNavLink to="/apis" label="APIs" onNavigate={closeMobile} />
              <MobileNavLink to="/docs" label="Docs" onNavigate={closeMobile} />
              <MobileNavLink to="/status" label="Status" onNavigate={closeMobile} />
              <MobileNavLink to="/about" label="About" onNavigate={closeMobile} />
            </nav>

            <nav className="flex flex-col gap-1" aria-label="API categories">
              <p className="eyebrow mb-2 px-3">API Categories</p>
              <ApisMenu onNavigate={closeMobile} />
            </nav>

            <TLink
              to="/apis"
              onClick={closeMobile}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy px-5 font-body text-sm font-semibold text-white"
            >
              Explore APIs <ArrowUpRight size={15} />
            </TLink>
          </div>
        </div>
      )}

      <SearchDialogOverlay />
    </>
  )
}

function MobileNavLink({
  to,
  label,
  onNavigate,
}: {
  to: string
  label: string
  onNavigate?: () => void
}) {
  return (
    <TNavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'rounded-xl px-3 py-3 font-body text-[15px] font-medium',
          isActive ? 'bg-paper-soft text-cobalt' : 'text-ink hover:bg-paper-soft',
        )
      }
    >
      {label}
    </TNavLink>
  )
}
