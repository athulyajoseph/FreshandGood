import type { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'cat-produce',
    slug: 'fruits-and-vegetables',
    name: 'Fruits & Vegetables',
    malayalamName: 'പഴങ്ങളും പച്ചക്കറികളും',
    description:
      'Farm-fresh Kerala produce — nendran bananas, tender jackfruit, drumsticks and more, delivered to local shops every morning.',
    emoji: '🍌',
    image: '/images/categories/fruits-and-vegetables.svg',
  },
  {
    id: 'cat-spices',
    slug: 'spices-and-masalas',
    name: 'Spices & Masalas',
    malayalamName: 'സുഗന്ധവ്യഞ്ജനങ്ങൾ',
    description:
      'Single-origin spices from Idukki and Wayanad, plus stone-ground masala blends for sambar, fish curry and more.',
    emoji: '🌶️',
    image: '/images/categories/spices-and-masalas.svg',
  },
  {
    id: 'cat-snacks',
    slug: 'snacks-and-sweets',
    name: 'Snacks & Sweets',
    malayalamName: 'പലഹാരങ്ങളും മധുരങ്ങളും',
    description:
      'Coconut-oil banana chips, Kozhikodan halwa, achappam and the teatime bites Kerala grew up on.',
    emoji: '🍪',
    image: '/images/categories/snacks-and-sweets.svg',
  },
  {
    id: 'cat-seafood',
    slug: 'seafood-and-meat',
    name: 'Seafood & Meat',
    malayalamName: 'മത്സ്യവും മാംസവും',
    description:
      'Same-day catch from Kochi harbour and fresh-cut meats, cleaned and ready for your favourite Kerala recipes.',
    emoji: '🐟',
    image: '/images/categories/seafood-and-meat.svg',
  },
  {
    id: 'cat-breakfast',
    slug: 'rice-and-breakfast',
    name: 'Rice & Breakfast',
    malayalamName: 'അരിയും പ്രഭാതഭക്ഷണവും',
    description:
      'Kerala matta rice, puttu podi, appam batter and coconut staples for a proper Malayali breakfast.',
    emoji: '🍚',
    image: '/images/categories/rice-and-breakfast.svg',
  },
]
