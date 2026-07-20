/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'starters' | 'salads' | 'grill' | 'vegetarian' | 'desserts' | 'drinks';
  price: number;
  isPopular?: boolean;
  dietaries?: ('v' | 'vg' | 'gf' | 'df')[]; // Vegetarian, Vegan, Gluten-Free, Dairy-Free
}

export interface RestaurantInfo {
  id: string;
  name: string;
  slogan: string;
  description: string;
  image: string;
  badge: string;
  website: string;
  address: string;
}

export interface ServiceInfo {
  id: string;
  name: string;
  iconName: string; // Lucide icon wrapper mapping
  description: string;
  longDescription: string;
  image: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'food' | 'wedding' | 'corporate' | 'venue';
  description: string;
}

export interface TimelineStep {
  year: string;
  title: string;
  description: string;
}

export interface InquiryFormData {
  fullName: string;
  phone: string;
  email: string;
  eventDate: string;
  eventTime: string;
  eventAddress: string;
  guestsCount: number;
  eventDuration: string;
  eventType: string;
  serviceRequirements: string;
  menuPreferences: string;
  additionalInfo: string;
  message: string;
  website?: string; // Honeypot field
}

// Global Static Data to keep App.tsx clean and maintainable
export const RESTAURANTS: RestaurantInfo[] = [
  {
    id: 'paros',
    name: 'Paros',
    slogan: 'GREEK RESTAURANT & BAR',
    description: '',
    image: '/paros.jpg',
    badge: 'WARSAW SISTER RESTAURANT',
    website: 'https://paros-restauracja.pl/',
    address: 'Al. Jerozolimskie 65/79, 00-698 Warszawa'
  },
  {
    id: 'el-greco',
    name: 'El Greco',
    slogan: 'GREEK RESTAURANT & BAR',
    description: '',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=70&w=800',
    badge: 'CULINARY EXCELLENCE',
    website: 'https://elgreco-restauracja.pl/en/home/',
    address: 'al. Jana Pawła II 29, 00-867 Warszawa'
  },
  {
    id: 'mykonos',
    name: 'Mykonos',
    slogan: 'GREEK RESTAURANT & BAR',
    description: '',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=70&w=800',
    badge: 'ISLAND LUXURY CLASS',
    website: 'https://mykonos-restauracja.pl/',
    address: 'Grzybowska 62, 00-844 Warszawa'
  }
];

export const TIMELINE: TimelineStep[] = [
  {
    year: '2009',
    title: 'Establishment of Paros Warsaw',
    description: 'We opened our first authentic Greek tavern in the heart of Warsaw, starting a lifelong journey of Greek hospitality, plate smashing, and Mediterranean culture.'
  },
  {
    year: '2012',
    title: 'El Greco Culinary Launch',
    description: 'With a target of presenting premium, fine-dining Greek cuisines, El Greco Warsaw opened to acclaim, bringing refined olive gardens and modern techniques.'
  },
  {
    year: '2015',
    title: 'Mykonos Lounge Concept',
    description: 'Capturing the vibrant beach clubs and luxury spirits of Mykonos island, our third location opened, cementing us as Warsaw’s ultimate Greek culinary family.'
  },
  {
    year: 'Today & Beyond',
    title: 'Amaltea Greek Catering',
    description: 'Unifying the recipes, professional chefs, and majestic atmospheres of all three restaurants to create an exceptional, dedicated premium events catering division.'
  }
];


export const MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: 'tzatziki',
    name: 'Classic Tzatziki Dip',
    description: 'Creamy Greek yogurt with fresh grated cucumber, chopped garlic, organic dill, and premium extra virgin olive oil.',
    category: 'starters',
    price: 18,
    isPopular: true,
    dietaries: ['v', 'gf']
  },
  {
    id: 'hummus',
    name: 'Smoked Chickpea Hummus',
    description: 'Smooth puree of blended chickpeas with organic sesame tahini, cumin, cold-pressed lemon juice, and roasted pine nuts.',
    category: 'starters',
    price: 19,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'melitzana',
    name: 'Agioritiki Melitzanosalata',
    description: 'Traditional wood-fired smoky aubergine dip with garlic, fresh red peppers, vinegar, lemon, chopped parsley, and walnut crumbs.',
    category: 'starters',
    price: 21,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'dolmades',
    name: 'Handmade Dolmadakia',
    description: 'Tender grape leaves stuffed with rice, fresh mint, dill, green onions, slow-braised with lemon oil dressing.',
    category: 'starters',
    price: 24,
    isPopular: true,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'tiropita',
    name: 'Tiropita Bites',
    description: 'Crispy golden phyllo pastry triangles loaded with a rich mixture of imported Greek barrel-aged Feta, ricotta, and wild mint.',
    category: 'starters',
    price: 26,
    dietaries: ['v']
  },

  // Salads
  {
    id: 'horiatiki',
    name: 'Traditional Greek Horiatiki',
    description: 'Vine-ripened tomatoes, crisp Persian cucumbers, red onion rings, Kalamata olives, sliced green bell peppers, capped with a thick slab of imported Feta and wild oregano.',
    category: 'salads',
    price: 29,
    isPopular: true,
    dietaries: ['v', 'gf']
  },
  {
    id: 'dakops',
    name: 'Cretan Dakos Salad',
    description: 'Double-baked barley rusks soaked in extra virgin olive oil, topped with juicy grated tomatoes, crumbled Myzithra cheese, capers, and wild sea fennel.',
    category: 'salads',
    price: 27,
    dietaries: ['v']
  },
  {
    id: 'aegean-green',
    name: 'Aegean Coastal Greens',
    description: 'Locally grown organic green lettuce blend, fresh dill, green onions, radishes, dressed with a citrus-dill absolute vinaigrette.',
    category: 'salads',
    price: 24,
    dietaries: ['v', 'vg', 'gf', 'df']
  },

  // Grill
  {
    id: 'souvlaki-chicken',
    name: 'Corn-fed Chicken Souvlaki',
    description: 'Skewers of marinated chicken breast grilled over natural charcoal, infused with lemon, Greek oregano, and finished with olive dressing.',
    category: 'grill',
    price: 42,
    isPopular: true,
    dietaries: ['gf', 'df']
  },
  {
    id: 'souvlaki-lamb',
    name: 'Premium Grass-fed Lamb Skewers',
    description: 'Tender chunks of wild mountain lamb neck skewers marinated in wild garlic, rosemary oil, grilled with sweet onions.',
    category: 'grill',
    price: 49,
    isPopular: true,
    dietaries: ['gf', 'df']
  },
  {
    id: 'octopus',
    name: 'Charcoal-Grilled Aegean Octopus',
    description: 'Sashimi-grade tenderized octopus tentacles grilled on hot grates, drizzled with olive oil-lemon latholemono, capers, and fresh oregano leaves.',
    category: 'grill',
    price: 58,
    isPopular: true,
    dietaries: ['gf', 'df']
  },
  {
    id: 'calamari',
    name: 'Golden Crispy Kalamarakia',
    description: 'Lightly dusted baby calamari squid fried to crispy perfection, served with lemon wheels and wild caper aioli.',
    category: 'grill',
    price: 39,
    dietaries: ['df']
  },

  // Vegetarian
  {
    id: 'spanakopita',
    name: 'Chef’s Spanakopita Slab',
    description: 'Baked layers of crisp phyllo filled with fresh spinach, wild mountain greens, dill, feta cheese, baked to deep golden brown.',
    category: 'vegetarian',
    price: 32,
    dietaries: ['v']
  },
  {
    id: 'halloumi',
    name: 'Pan-Seared Cypriot Halloumi',
    description: 'Thick cut pure sheep halloumi cheese pan-seared with Greek honey, dark sesame seeds, and splash of lemon juice.',
    category: 'vegetarian',
    price: 34,
    isPopular: true,
    dietaries: ['v', 'gf']
  },
  {
    id: 'gemista',
    name: 'Baked Stuffed Gemista',
    description: 'Vine-tomatoes and sweet bell-peppers stuffed with herbed rice, pine nuts, currents, baked slow until caramelized.',
    category: 'vegetarian',
    price: 36,
    dietaries: ['v', 'vg', 'gf', 'df']
  },

  // Desserts
  {
    id: 'baklava',
    name: 'Traditional Walnut Baklava',
    description: 'Forty layers of razor-thin phyllo pastry stuffed with crushed walnuts, almonds, and sweet cloves, drenched in orange-blossom honey gather.',
    category: 'desserts',
    price: 24,
    isPopular: true,
    dietaries: ['v']
  },
  {
    id: 'galaktoboureko',
    name: 'Epirus Galaktoboureko',
    description: 'Creamy semolina custard baked in crispy golden phyllo pastry sheets, scented with fresh lemon zest and warm cinnamon syrup infusion.',
    category: 'desserts',
    price: 26,
    dietaries: ['v']
  },
  {
    id: 'loukoumades',
    name: 'Hot Crispy Loukoumades',
    description: 'Greek honey puffs fried until golden crunchy shell, warm cinnamon syrup, finished with thyme honey glaze and ground walnuts.',
    category: 'desserts',
    price: 21,
    dietaries: ['v']
  },

  // Drinks
  {
    id: 'assyrtiko',
    name: 'Santorini Assyrtiko Dry Dry White',
    description: 'An outstanding white grape bottle with mineral notes, high crisp acidity, citrus skin scent, perfectly suited for seafood pairings.',
    category: 'drinks',
    price: 18, // per glass estimate
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'xinomavro',
    name: 'Naoussa Xinomavro Red Reserve',
    description: 'Robust red wine with dark cherry, sweet tomato, and earthy tobacco notes. Excellent with grilled lamb skewers.',
    category: 'drinks',
    price: 20,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'ouzo',
    name: 'Plomari Ouzo Classic',
    description: 'Traditional anise-flavored spirit from Lesvos, served chilled with crystal river ice and spring water block.',
    category: 'drinks',
    price: 14,
    dietaries: ['v', 'vg', 'gf', 'df']
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=70&w=800',
    title: 'Grilled Pork and Chicken Skewers',
    category: 'food',
    description: 'Authentic souvlaki charred beautifully over local Greek charcoal pits, seasoned with oregano and sea-salt.'
  },
  {
    id: 'g2',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=70&w=800',
    title: 'Garden Wedding Feast',
    category: 'wedding',
    description: 'Magical string-light setup with premium styling and custom blue plate arrangements in private estates.'
  },
  {
    id: 'g3',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=70&w=800',
    title: 'Corporate Conference Buffet',
    category: 'corporate',
    description: 'Professional high-capacity catering featuring diverse hot and cold meze stations in Warsaw business tower.'
  },
  {
    id: 'g4',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=70&w=800',
    title: 'Santorini Sunset Overlook',
    category: 'venue',
    description: 'Inspiring architecture with classical chalked blue-and-white domes, hosting traditional romantic dinners.'
  },
  {
    id: 'g5',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=70&w=800',
    title: 'Vibrant Horiatiki Salad',
    category: 'food',
    description: 'Beautiful red tomatoes, pure Greek olives, and blocks of organic barrel-aged feta cheese with cold oregano oil pouring.'
  },
  {
    id: 'g6',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=70&w=800',
    title: 'Plated Fine Cuisines',
    category: 'food',
    description: 'Carefully curated fine lamb chops with Greek mountain herbs, honey, and reduction glaze.'
  },
  {
    id: 'g7',
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=70&w=800',
    title: 'Grand Wedding Table Setting',
    category: 'wedding',
    description: 'An elegant long bridal banquet framed with crystal glasses, romantic floral arches, and delicate ocean linen.'
  },
  {
    id: 'g8',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=70&w=800',
    title: 'Meze Cold Spread Arrangement',
    category: 'food',
    description: 'Selection of classic dips, baked pasties, cured cheese, stuffed grape leaves, flatbreads for interactive cocktail lounge.'
  },
  {
    id: 'g9',
    url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=70&w=800',
    title: 'Sunkissed Aegean Coastline',
    category: 'venue',
    description: 'White-plastered coastal steps overlooking deep azure waters, setting the architectural inspiration for our styling elements.'
  },
  {
    id: 'g10',
    url: 'https://images.unsplash.com/photo-1534080391025-a134628926f4?auto=format&fit=crop&q=70&w=800',
    title: 'Seaside Dining Vibe',
    category: 'venue',
    description: 'A cozy traditional blue table overlooking an ocean bay, perfect for local weddings and private parties.'
  },
  {
    id: 'g11',
    url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=70&w=800',
    title: 'Live Skewers Hot Off the Coal',
    category: 'food',
    description: 'Our professional grill pit master barbecuing direct-heat skewers in front of guest eyes, bringing Greek food culture.'
  },
  {
    id: 'g12',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=70&w=800',
    title: 'VIP Gala Table Setup',
    category: 'corporate',
    description: 'Luxurious ambient dinner table setup with beautiful glassware, warm candles for high-profile business celebrations.'
  }
];

export interface PageHeroData {
  id: string;
  badge_en: string;
  badge_pl: string;
  title_en: string;
  title_pl: string;
  subtitle_en: string;
  subtitle_pl: string;
  image_url: string;
}

export interface CateringCategory {
  id: string;
  page: 'business' | 'private';
  title_en: string;
  title_pl: string;
  description_en: string;
  description_pl: string;
  icon_name: string;
  sort_order: number;
  menu_pdf_url?: string;
}

export function getOptimizedImageUrl(url: string, _width = 1200): string {
  // Disabled image transformations for Free Plan compatibility
  return url;
}


