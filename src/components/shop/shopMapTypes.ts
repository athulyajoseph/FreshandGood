import type { Coordinates, ShopResult } from '@/types'

export interface ShopMapProps {
  shops: ShopResult[]
  /** Shows a "You are here" marker and includes it when fitting the view. */
  userCoords?: Coordinates | null
  /** The map pans to this shop and opens its popup whenever it changes. */
  selectedShopId?: string | null
  onSelectShop?: (shopId: string) => void
  /** Accessible name for the map region. */
  label?: string
  /** Size the map with this, e.g. "h-80". */
  className?: string
}
