import { Menu, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SearchBar, SearchOverlay } from '@/components/search'
import { Button, Container } from '@/components/ui'
import { navLinks } from '@/config/site'
import { cn } from '@/utils'
import { Logo } from './Logo'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-full px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-brand-50 text-brand-800' : 'text-stone-600 hover:text-brand-700',
  )

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
    isActive ? 'bg-brand-50 text-brand-800' : 'text-stone-700 hover:bg-stone-100',
  )

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  // Close on Escape and lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-cream/90 backdrop-blur">
      <Container className="flex h-16 items-center gap-4">
        <Logo onClick={closeMenu} />

        <nav aria-label="Main" className="ml-4 hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className={navLinkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <SearchBar className="ml-auto hidden w-full max-w-xs md:flex xl:max-w-sm" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
            aria-haspopup="dialog"
            onClick={() => {
              closeMenu()
              setSearchOpen(true)
            }}
          >
            <Search className="size-5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </Button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 top-16 z-40 bg-stone-900/30 transition-opacity lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 top-16 z-50 origin-top border-b border-stone-200 bg-cream shadow-lg transition duration-200 lg:hidden',
          menuOpen
            ? 'scale-y-100 opacity-100'
            : 'pointer-events-none invisible scale-y-95 opacity-0',
        )}
      >
        <Container className="py-4">
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={mobileNavLinkClass}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
