import type { AboutContent } from '@/types'

/**
 * Everything on the About page. Edit the text here; the page layout picks it up automatically.
 * Value icons are lucide-react icon names: https://lucide.dev/icons
 */
export const aboutContent: AboutContent = {
  hero: {
    eyebrow: 'Our story',
    title: 'Food that tastes like home, from shops just down the road',
    intro:
      'Fresh & Good began in a small Ernakulam kitchen with one simple wish: that anyone in Kochi could buy banana chips, masalas and pickles that taste the way Ammachi used to make them, without crossing the city to find them.',
  },
  story: {
    title: 'How it all started',
    paragraphs: [
      'In 2019, a handful of home cooks from Ernakulam started frying banana chips in pure coconut oil on Sunday mornings and selling them to neighbours. Word travelled fast — as it does in Kerala — and soon the corner shop down the lane asked if they could stock a few packets.',
      'Today we work with more than forty home kitchens, farmers from Wayanad and Idukki, and fishermen at Fort Kochi harbour. Every masala is still stone-ground, every batch of chips still fried in small kadais, and every jar of pickle still sealed by hand.',
      'We don’t run a big supermarket or a delivery app. Instead, our products are stocked by trusted neighbourhood shops across Kochi — the same shops you already walk to for milk and the morning paper. That keeps our food fresh, our prices fair, and our community close.',
    ],
  },
  mission: {
    title: 'Our mission',
    text: 'To keep traditional Kerala food alive and within easy reach — made honestly by local hands, sold by local shops, and enjoyed at local tables.',
  },
  values: [
    {
      icon: 'HandHeart',
      title: 'Made with care',
      description:
        'Small batches, real ingredients and recipes handed down through generations. No shortcuts, no artificial colours.',
    },
    {
      icon: 'Sprout',
      title: 'Fresh every morning',
      description:
        'Vegetables are picked at dawn and fish comes straight off the boats, so what reaches the shop shelf is truly fresh.',
    },
    {
      icon: 'Users',
      title: 'Fair to everyone',
      description:
        'Home cooks, farmers and shopkeepers are paid fairly and on time. When they do well, the whole neighbourhood does.',
    },
    {
      icon: 'Store',
      title: 'Proudly local',
      description:
        'We grow with the neighbourhood shops that stock us, rather than competing with them.',
    },
  ],
  howItWorks: {
    title: 'How it works',
    steps: [
      {
        title: 'We make it',
        description:
          'Home cooks and farmers prepare everything fresh in small batches, using traditional Kerala recipes.',
      },
      {
        title: 'Local shops stock it',
        description:
          'Each morning, fresh stock goes out to partner shops in neighbourhoods across Kochi.',
      },
      {
        title: 'You find it nearby',
        description:
          'Use Find a Shop to see which shops near you have what you want, then just drop in.',
      },
    ],
  },
  team: {
    title: 'The people behind Fresh & Good',
    intro: 'A small team from Kochi who love good food and good neighbours.',
    members: [
      // Roles and bios are placeholders: replace them with each person's real role and story.
      {
        name: 'Athulya Joseph',
        role: 'Founder & head cook',
        bio: 'Started it all with a kadai, a sack of nendran bananas and a family book of recipes.',
      },
      {
        name: 'Adrian Tobbin',
        role: 'Sourcing & farmer partnerships',
        bio: 'Spends the week in Wayanad and Idukki finding the best spices and produce.',
      },
      {
        name: 'Aiden Tobbin',
        role: 'Shop partnerships',
        bio: 'Looks after our partner shops and makes sure shelves are stocked every morning.',
      },
    ],
  },
  cta: {
    title: 'Come and taste it for yourself',
    text: 'There’s probably a Fresh & Good shop closer than you think.',
  },
}
