/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RestaurantInfo, TimelineStep, MenuItem, GalleryItem } from './types';

export const UI_TRANSLATIONS = {
  en: {
    // Nav & General
    navHome: "Home",
    navAbout: "About Us",
    navBusiness: "Business",
    navPrivate: "Private",
    navGallery: "Gallery",
    navContact: "Contact",
    badgeAthens: "Connecting Athens to Warsaw",
    subtitleMain: "AMALTEA GREEK CATERING Unifies Warsaw’s Top Three Greek Taverns.",
    sloganMain: "Unifying Paros, El Greco, and Mykonos to ship custom authentic gastronomy and majestic Mediterranean atmospheres directly to your venue.",
    btnPlan: "Plan Your Event",

    // Stats & Counter section
    statsTaverns: "Warsaw Taverns",
    statsChefs: "Expert Gastronomy Chefs",
    statsEvents: "Majestic Banquets Delivered",
    statsOlives: "Imported Greek Olive Oil (L/yr)",

    // About/Vision Section
    aboutTitle: "Our Culinary Odyssey",
    aboutSubtitle: "Three Restaurants, One Legacy of Authentic Philoxenia",
    aboutP1: "For over 15 years, our culinary family has elevated Warsaw’s premium dining scene, establishing the beloved restaurants Paros, El Greco, and Mykonos. Each represents a distinct facet of Greek culinary culture—from wild Aegean tavernas to elegant modern Athenian bistros.",
    aboutP2: "Aegean Catering & Events harmonizes this collective expertise. Under the direction of culinary designer Chef Nikolas, we transport our signature wood-fire grills, fresh ingredients, historic recipes, and unparalleled plate-smashing joy straight to your wedding, villa gathering, or high-level corporate banquet.",
    timelineTitle: "Our Warsaw Journey",
    timelineSubtitle: "Trace the steps that established our family of Greek establishments.",
    sisterTavernsTitle: "Our Warsaw Restaurants",
    sisterTavernsSubtitle: "Our reference taverns are open daily for fine culinary tasting inspiration.",
    btnVisitWebsite: "Visit Taverna",

    categoryCelebrations: "Celebrations",
    categoryCorporate: "Corporate",
    categoryInteractive: "Interactive",
    categoryStaff: "Staff Only",
    btnLearnMore: "Explore Setup & Service",
    btnBookService: "Inquire About This Service",

    // Gallery section
    galleryTitle: "Our Visual Catalog",
    gallerySubtitle: "Breathtaking atmospheres, premium plated courses, and pristine table setups created by our styling teams in Poland.",
    galleryFood: "Plated Cuisines",
    galleryWedding: "Wedding Galas",
    galleryCorporate: "Corporate Buffets",
    galleryVenue: "Inspirational Venues",
    galleryLoadMore: "Load More Photos",
    galleryNoMore: "All Photos Loaded",

    // Contact/Inquiry Form Section
    contactTitle: "Submit Booking Inquiry",
    contactSubtitle: "Secure your event date and start planning an unforgettable feast with our coordinators.",
    formPhone: "Mobile Phone Number",
    formEmail: "Email Address",
    formLocation: "Event Location / City Hub",
    placeholderPhone: "+48 ...",
    placeholderEmail: "host@example.com",
    placeholderLoc: "e.g., Wilanów, Warsaw or Sopot Villa",
    formSubmitBtn: "Transmit Secure Inquiry",
    formSubmitting: "Transmitting Inquiry to Coordinators...",
    formSuccessTitle: "Inquiry Transmitted Successfully!",
    formSuccessPara: "Thank you! Your event inquiry is safe in our planning register. Chef Nikolas and our lead event coordinator will review your requested parameters and get back to you with contracts and available dates within 24 hours.",
    formSuccessBtn: "Create Another Proposal",
    
    // Budget tiers
    budgetBronze: "Standard Meze Platter Program (Eco)",
    budgetSilver: "Classic Taverna Buffet Package (Silver)",
    budgetGold: "Bespoke Gastronomy Experience (Gold)",
    budgetPlatinum: "Royal Amaltea Imperial Banquet (Platinum)",

    // Event Types
    eventWedding: "Wedding Gala Dinner",
    eventCorporate: "Corporate Banquet",
    eventPrivate: "Private Family Party",
    eventSpecial: "Dynamic Custom Occasion",

    // Validation
    errName: "Please state your full name.",
    errEmail: "Please provide a valid email address.",
    errPhone: "Please provide a valid contact number.",
    errLocation: "Please state the event location.",
    errDate: "Please select an event date.",
    
    // Footer
    footerDesc: "AMALTEA GREEK CATERING was born from the many years of experience behind El Greco, Paros and Mykonos restaurants. For years, we have been sharing the authentic flavours of Greece with our guests through traditional recipes, ingredients sourced directly from Greece and the Greek philosophy of gathering around the table.",
    footerAddress: "Warsaw Reference Taverna Hubs: Paros (Jasna 14/16a) | El Greco (Grzybowska 22) | Mykonos (Grzybowska 3)",
    footerTerms: "© 2026 AMALTEA GREEK CATERING. All Rights Reserved. Crafted with love under Warsaw skies.",
    
    // Business Page
    businessTitle: "Business Catering",
    businessSubtitle: "Exceptional Greek & Mediterranean culinary experiences tailored for corporate excellence.",
    businessBadge: "CORPORATE SERVICES",
    businessCat1Title: "Business Catering",
    businessCat1Desc: "We create exceptional menus inspired by Greek and Mediterranean cuisine, perfect for business meetings, corporate lunches, and everyday office needs. We focus on the highest quality ingredients and elegant presentation.",
    businessCat2Title: "Conference Catering",
    businessCat2Desc: "We provide comprehensive catering services for conferences, training sessions, and corporate events. Fresh and light Mediterranean flavors, combined with carefully crafted menus, help create a unique atmosphere for every occasion.",
    businessCat3Title: "Corporate Events",
    businessCat3Desc: "From intimate gatherings to larger team-building events, we prepare menus inspired by Greek hospitality and Mediterranean traditions. It is the perfect combination of exceptional flavors and elegant presentation.",
    businessCat4Title: "Corporate Banquets",
    businessCat4Desc: "We provide culinary services for banquets, gala dinners, and prestigious business events. Our buffets and plated dishes are inspired by the cuisine of Greece and the Mediterranean region, combining authentic flavors with a modern style of presentation.",

    // Private Page
    privateTitle: "Special Occasions",
    privateSubtitle: "Celebrate life's milestones with authentic Mediterranean hospitality and custom menu design.",
    privateBadge: "PRIVATE CELEBRATIONS",
    privateCat1Title: "Family Gatherings",
    privateCat1Desc: "We create exceptional menus inspired by Greek and Mediterranean cuisine, perfect for celebrating special moments with family and friends. We focus on the highest quality ingredients and elegant presentation.",
    privateCat2Title: "Birthdays and Anniversaries",
    privateCat2Desc: "Whatever the occasion, we prepare menus that help you celebrate life's important moments in a unique atmosphere. Greek flavors and Mediterranean hospitality make every event truly memorable.",
    privateCat3Title: "Christenings and First Communions",
    privateCat3Desc: "We provide complete culinary services for family celebrations, combining tradition with the freshness and lightness of Mediterranean cuisine. Each menu is carefully tailored to the character of the occasion.",
    privateCat4Title: "Holidays and Special Celebrations",
    privateCat4Desc: "We prepare catering for holiday gatherings, anniversaries, and other important occasions, creating menus inspired by the flavors of Greece and the Mediterranean region.",
    privateFooterText: "We believe that no two events are the same. That is why every proposal is prepared individually, with menus tailored to the nature of the occasion, the number of guests, and your expectations.",
    privateFooterCTA: "Planning an event? Write to us, and we will gladly help you create a unique meeting in Greek and Mediterranean style.",
    btnPlanNow: "Request a Proposal",
    homeServicesBadge: "OUR CATERING SERVICES",
    homeServicesTitle: "Tailored Greek Catering for Business and Private Occasions",
    homeServicesSubtitle: "Amaltea Greek Catering brings the finest of Greek and Mediterranean cuisine to your table — crafted with passion, premium ingredients, and genuine hospitality for corporate events and life's most meaningful celebrations.",
    exploreBusinessBtn: "EXPLORE BUSINESS CATERING",
    explorePrivateBtn: "EXPLORE PRIVATE CATERING"
  },
  pl: {
    // Nav & General
    navHome: "Główna",
    navAbout: "O nas",
    navBusiness: "Dla Biznesu",
    navPrivate: "Okazje Prywatne",
    navGallery: "Galeria",
    navContact: "Kontakt",
    badgeAthens: "Łączymy Ateny z Warszawą",
    subtitleMain: "AMALTEA GREEK CATERING jednoczy 3 najlepsze restauracje greckie w Warszawie.",
    sloganMain: "Zjednoczenie restauracji Paros, El Greco oraz Mykonos. Dostarczamy autentyczną kuchnię i cudowny, śródziemnomorski klimat wprost do wybranego przez Ciebie miejsca.",
    btnPlan: "Zaplanuj Wydarzenie",

    // Stats & Counter section
    statsTaverns: "Warszawskie Tawerny",
    statsChefs: "Wybitni Szefowie Kuchni",
    statsEvents: "Zrealizowane Bankiety",
    statsOlives: "Importowana Oliwa Klasy Premium (L/rok)",

    // About/Vision Section
    aboutTitle: "Nasza Kulinarna Odyseja",
    aboutSubtitle: "Trzy Restauracje, Jedno Dziedzictwo Autentycznej Philoxenii",
    aboutP1: "Od ponad 15 lat nasza rodzina restauracyjna współtworzy warszawską scenę gastronomiczną premium, oferując gościom niezapomniane chwile w uwielbianych konceptach: Paros, El Greco oraz Mykonos. Każdy z nich reprezentuje inny aspekt greckiej sztuki kulinarnej - od radosnej wyspiarskiej tawerny po eleganckie ateńskie bistro.",
    aboutP2: "Aegean Catering & Events łączy tę wieloletnią wiedzę. Pod kierownictwem mistrza i designera kulinarnego, Szefa Nikolasa, przenosimy nasze kultowe grille węglowe, najświeższe składniki i niespotykaną gościnność wprost na Twoje wesele, przyjęcie w willi czy prestiżowy bankiet firmowy.",
    timelineTitle: "Nasza Warszawska Droga",
    timelineSubtitle: "Poznaj etapy, które ukształtowały naszą rodzinę greckich restauracji.",
    sisterTavernsTitle: "Nasze Warszawskie Restauracje",
    sisterTavernsSubtitle: "Nasze flagowe restauracje zapraszają codziennie na kulinarną inspirację.",
    btnVisitWebsite: "Odwiedź Tawernę",

    categoryCelebrations: "Celebracje",
    categoryCorporate: "Biznesowe",
    categoryInteractive: "Interaktywne",
    categoryStaff: "Personel",
    btnLearnMore: "Szczegóły Serwisu i Oferty",
    btnBookService: "Zapytaj o tę Usługę",

    // Gallery section
    galleryTitle: "Nasz Katalog Wizualny",
    gallerySubtitle: "Cudowna atmosfera, kunsztownie podane talerze i luksusowe dekoracje stołów wykonane przez nasze zespoły aranżacyjne w całej Polsce.",
    galleryFood: "Kulinaria",
    galleryWedding: "Wesela i Śluby",
    galleryCorporate: "Bankiety Firmowe",
    galleryVenue: "Inspirujące Miejsca",
    galleryLoadMore: "Załaduj Więcej Zdjęć",
    galleryNoMore: "Wszystkie Zdjęcia Załadowane",

    // Contact/Inquiry Form Section
    contactTitle: "Prześlij Zapytanie o Rezerwację",
    contactSubtitle: "Zabezpiecz termin swojego wydarzenia i rozpocznij planowanie niezapomnianej uczty z naszymi koordynatorami.",
    formPhone: "Numer Telefonu",
    formEmail: "Adres Email",
    formLocation: "Lokalizacja Wydarzenia / Miasto",
    placeholderPhone: "+48 ...",
    placeholderEmail: "organizator@odyssey.pl",
    placeholderLoc: "np. Wilanów, Warszawa lub Willa Sopot",
    formSubmitBtn: "Wyślij Bezpieczne Zapytanie",
    formSubmitting: "Przesyłanie Zapytania do Koordynatorów...",
    formSuccessTitle: "Zapytanie Przesłane Pomyślnie!",
    formSuccessPara: "Dziękujemy! Zapytanie zostało zapisane w naszym rejestrze planowania. Szef Nikolas oraz nasz główny koordynator przeanalizują parametry Twojego wydarzenia i skontaktują się z Tobą z ofertą terminów i umową w ciągu 24 godzin.",
    formSuccessBtn: "Stwórz kolejną Ofertę",

    // Budget tiers
    budgetBronze: "Standardowy Program Talerzy Meze (Eko)",
    budgetSilver: "Klasyczny Pakiet Bufetowy Tawerny (Srebrny)",
    budgetGold: "Dedykowane Doświadczenie Gastronomiczne (Złote)",
    budgetPlatinum: "Królewski Bankiet Cesarski Amaltea (Platynowy)",

    // Event Types
    eventWedding: "Bankiet Weselny",
    eventCorporate: "Konferencja / Kolacja Firmowa",
    eventPrivate: "Prywatne Przyjęcie w Willi / Urodziny",
    eventSpecial: "Tematyczna Gala Indywidualna",

    // Validation
    errName: "Proszę podać swoje imię i nazwisko.",
    errEmail: "Proszę wprowadzić poprawny adres e-mail.",
    errPhone: "Proszę podać ważny numer telefonu.",
    errLocation: "Proszę określić lokalizację wydarzenia.",
    errDate: "Proszę wybrać datę wydarzenia.",

    // Footer
    footerDesc: "AMALTEA GREEK CATERING powstało z wieloletniego doświadczenia restauracji El Greco, Paros i Mykonos. Od lat dzielimy się z naszymi Gośćmi autentycznymi smakami Grecji, wykorzystując tradycyjne receptury, oryginalne produkty sprowadzane bezpośrednio z Grecji oraz grecką filozofię wspólnego biesiadowania.",
    footerAddress: "Warszawskie Tawerny Flagowe: Paros (Jasna 14/16a) | El Greco (Grzybowska 22) | Mykonos (Grzybowska 3)",
    footerTerms: "© 2026 AMALTEA GREEK CATERING. Wszelkie Prawa Zastrzeżone. Tworzone z miłością pod polskim niebem.",
    
    // Business Page
    businessTitle: "Catering Biznesowy",
    businessSubtitle: "Wyjątkowa oprawa kulinarna spotkań biznesowych i wydarzeń korporacyjnych.",
    businessBadge: "USŁUGI DLA BIZNESU",
    businessCat1Title: "Catering biznesowy",
    businessCat1Desc: "Tworzymy wyjątkowe menu inspirowane kuchnią grecką i śródziemnomorską, idealne na spotkania biznesowe, lunche firmowe i codzienne potrzeby biura. Dbamy o najwyższą jakość składników oraz elegancką formę podania.",
    businessCat2Title: "Catering konferencyjny",
    businessCat2Desc: "Zapewniamy kompleksową obsługę gastronomiczną konferencji, szkoleń i wydarzeń biznesowych. Lekkie, świeże smaki kuchni śródziemnomorskiej oraz starannie przygotowane menu pozwalają stworzyć wyjątkową atmosferę każdego spotkania.",
    businessCat3Title: "Przyjęcia firmowe",
    businessCat3Desc: "Od kameralnych spotkań po większe wydarzenia integracyjne – przygotowujemy menu inspirowane grecką gościnnością i śródziemnomorską tradycją. To doskonałe połączenie wyjątkowych smaków i eleganckiej oprawy.",
    businessCat4Title: "Bankiety firmowe",
    businessCat4Desc: "Organizujemy oprawę kulinarną bankietów, gal i prestiżowych wydarzeń biznesowych. Nasze bufety i dania serwowane czerpią inspirację z kuchni Grecji i regionu Morza Śródziemnego, łącząc autentyczne smaki z nowoczesną formą podania.",

    // Private Page
    privateTitle: "Wyjątkowe Okazje",
    privateSubtitle: "Celebruj najważniejsze momenty życia z autentyczną grecką gościnnością.",
    privateBadge: "PRZYJĘCIA PRYWATNE",
    privateCat1Title: "Przyjęcia rodzinne",
    privateCat1Desc: "Tworzymy wyjątkowe menu inspirowane kuchnią grecką i śródziemnomorską, idealne na rodzinne spotkania w gronie najbliższych. Dbamy o najwyższą jakość składników oraz elegancką formę podania.",
    privateCat2Title: "Urodziny i jubileusze",
    privateCat2Desc: "Niezależnie od okazji, przygotowujemy menu, które pozwala celebrować ważne chwile w wyjątkowej atmosferze. Greckie smaki i śródziemnomorska gościnność sprawiają, że każde przyjęcie staje się niezapomniane.",
    privateCat3Title: "Chrzciny i komunie",
    privateCat3Desc: "Oferujemy kompleksową oprawę kulinarną rodzinnych uroczystości, łącząc tradycję z lekkością i świeżością kuchni śródziemnomorskiej. Starannie dobrane menu dopasowujemy do charakteru wydarzenia.",
    privateCat4Title: "Święta i wyjątkowe okazje",
    privateCat4Desc: "Przygotowujemy catering na świąteczne spotkania, rocznice i inne ważne chwile, tworząc menu inspirowane smakami Grecji i regionu Morza Śródziemnego.",
    privateFooterText: "Wierzymy, że nie ma dwóch takich samych przyjęć. Dlatego każdą ofertę przygotowujemy indywidualnie, tworząc menu dopasowane do charakteru wydarzenia, liczby Gości i Państwa oczekiwań.",
    privateFooterCTA: "Planujesz przyjęcie? Napisz do nas, a z przyjemnością pomożemy Ci stworzyć wyjątkowe spotkanie w greckim i śródziemnomorskim stylu.",
    btnPlanNow: "Uzyskaj Ofertę",
    homeServicesBadge: "NASZE USŁUGI CATERINGOWE",
    homeServicesTitle: "Grecki Catering Dopasowany do Biznesu i Okazji Prywatnych",
    homeServicesSubtitle: "Amaltea Greek Catering dostarcza wyśmienitą kuchnię grecką i śródziemnomorską na Twój stół – przygotowaną z pasją, z najwyższej jakości składników i z prawdziwą gościnnością na wydarzenia firmowe oraz najważniejsze święta w życiu.",
    exploreBusinessBtn: "ODKRYJ CATERING BIZNESOWY",
    explorePrivateBtn: "ODKRYJ CATERING PRYWATNY"
  }
};

export const RESTAURANTS_PL: RestaurantInfo[] = [
  {
    id: 'paros',
    name: 'Paros',
    slogan: 'GREEK RESTAURANT & BAR',
    description: '',
    image: '/paros.jpg',
    badge: 'WARSZAWSKA RESTAURACJA SIOSTRZANA',
    website: 'https://paros-restauracja.pl/',
    address: 'Al. Jerozolimskie 65/79, 00-698 Warszawa'
  },
  {
    id: 'el-greco',
    name: 'El Greco',
    slogan: 'GREEK RESTAURANT & BAR',
    description: '',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=70&w=800',
    badge: 'DOSKONAŁOŚĆ KULINARNA',
    website: 'https://elgreco-restauracja.pl/en/home/',
    address: 'al. Jana Pawła II 29, 00-867 Warszawa'
  },
  {
    id: 'mykonos',
    name: 'Mykonos',
    slogan: 'GREEK RESTAURANT & BAR',
    description: '',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=70&w=800',
    badge: 'LUKSUSOWA KLASA ISLAND',
    website: 'https://mykonos-restauracja.pl/',
    address: 'Grzybowska 62, 00-844 Warszawa'
  }
];

export const TIMELINE_PL: TimelineStep[] = [
  {
    year: '2009',
    title: 'Założenie Paros Warszawa',
    description: 'Otworzyliśmy naszą pierwszą autentyczną grecką tawernę w samym sercu Warszawy, rozpoczynając wieloletnią podróż pełną greckiej gościnności, rozbijania talerzy i śródziemnomorskiej radości.'
  },
  {
    year: '2012',
    title: 'Kulinarny Debiut El Greco',
    description: 'Z myślą o prezentacji wykwintnych greckich dań, otworzyliśmy El Greco w Warszawie, przynosząc wyrafinowane smaki i nowoczesne greckie techniki.'
  },
  {
    year: '2015',
    title: 'Koncepcja Mykonos Lounge',
    description: 'Uchwyciliśmy tętniące życiem kluby plażowe i luksusowego ducha wyspy Mykonos, otwierając naszą trzecią lokalizację w Warszawie i stając się greckim liderem.'
  },
  {
    year: 'Dzisiaj',
    title: 'Amaltea Greek Catering',
    description: 'Zjednoczenie unikalnych przepisów, profesjonalnych szefów kuchni i zmysłowej atmosfery wszystkich trzech restauracji w wyjątkowy, dedykowany dział cateringu.'
  }
];


export const MENU_ITEMS_PL: MenuItem[] = [
  // Starters
  {
    id: 'tzatziki',
    name: 'Klasyczny Dip Tzatziki',
    description: 'Kremowy gęsty jogurt grecki ze świeżym tartym ogórkiem, posiekanym czosnkiem, aromatycznym koperkiem i oliwą z oliwek premium extra virgin.',
    category: 'starters',
    price: 18,
    isPopular: true,
    dietaries: ['v', 'gf']
  },
  {
    id: 'hummus',
    name: 'Hummus z Wędzonej Cieciorki',
    description: 'Aksamitne purée ze zblendowanej ciecierzycy z organiczną pastą tahini, kuminem, sokiem z limonki i prażonymi orzeszkami pinii.',
    category: 'starters',
    price: 19,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'melitzana',
    name: 'Agioritiki Melitzanosalata',
    description: 'Tradycyjny dip z pieczonego w dymie bakłażana z czosnkiem, świeżą czerwoną papryką, octem, cytryną i chrupiącym orzechem włoskim.',
    category: 'starters',
    price: 21,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'dolmades',
    name: 'Ręcznie Robione Dolmadakia',
    description: 'Delikatne liście winogron faszerowane ryżem, świeżą miętą i koperkiem, wolno duszone w sosie cytrynowo-oliwnym.',
    category: 'starters',
    price: 24,
    isPopular: true,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'tiropita',
    name: 'Kąski Tiropita',
    description: 'Chrupiące złociste trójkąty z ciasta phyllo z bogatym farszem z greckiej fety dojrzewającej w beczkach, sera ricotta i dzikiej mięt.',
    category: 'starters',
    price: 26,
    dietaries: ['v']
  },

  // Salads
  {
    id: 'horiatiki',
    name: 'Tradycyjna Sałatka Grecka Horiatiki',
    description: 'Dojrzewające w słońcu pomidory kręte, chrupiące ogórki, czerwona cebula, oliwki Kalamata, zielona papryka, zwieńczone grubym plastrem oryginalnej fety i oregano.',
    category: 'salads',
    price: 29,
    isPopular: true,
    dietaries: ['v', 'gf']
  },
  {
    id: 'dakops',
    name: 'Kreteńska Sałatka Dakos',
    description: 'Dwukrotnie pieczone sucharki jęczmienne nasączone oliwą z oliwek, podawane ze startymi pomidorami, serem Myzithra i kaparami.',
    category: 'salads',
    price: 27,
    dietaries: ['v']
  },
  {
    id: 'aegean-green',
    name: 'Sałaty z Wybrzeża Egejskiego',
    description: 'Mieszanka organicznych zielonych sałat, świeżego koperku, zielonej cebulki i rzodkiewki, skropiona winegretem cytrusowo-koperkowym.',
    category: 'salads',
    price: 24,
    dietaries: ['v', 'vg', 'gf', 'df']
  },

  // Grill
  {
    id: 'souvlaki-chicken',
    name: 'Souvlaki z Kurczaka Zagrodowego',
    description: 'Szaszłyki z marynowanej piersi kurczaka grillowane na węglu drzewnym, z cytryną, greckim oregano i sosem oliwnym.',
    category: 'grill',
    price: 42,
    isPopular: true,
    dietaries: ['gf', 'df']
  },
  {
    id: 'souvlaki-lamb',
    name: 'Szaszłyki Jagnięce Premium',
    description: 'Kawałki delikatnego mięsa jagnięcego marynowane w dzikim czosnku i rozmarynie, grillowane z soczystą cebulą.',
    category: 'grill',
    price: 49,
    isPopular: true,
    dietaries: ['gf', 'df']
  },
  {
    id: 'octopus',
    name: 'Ośmiornica Grillowana na Węglu',
    description: 'Wyjątkowo delikatne macki ośmiornicy grillowane na gorącym ruszcie, skropione oliwą cytrynową latholemono z oregano i kaparami.',
    category: 'grill',
    price: 58,
    isPopular: true,
    dietaries: ['gf', 'df']
  },
  {
    id: 'calamari',
    name: 'Chrupiące Kalmary Kalamarakia',
    description: 'Lekko oprószone mąką młode kalmary smażone na złoty kolor, podawane z cząstkami cytryny i sosem aioli z dzikich kaparów.',
    category: 'grill',
    price: 39,
    dietaries: ['df']
  },

  // Vegetarian
  {
    id: 'spanakopita',
    name: 'Spanakopita Szefa Kuchni',
    description: 'Pieczone warstwy chrupkiego ciasta phyllo wypełnione świeżym szpinakiem, dzikimi ziołami górskimi, koperkiem i serem feta.',
    category: 'vegetarian',
    price: 32,
    dietaries: ['v']
  },
  {
    id: 'halloumi',
    name: 'Smażony Cypryjski Ser Halloumi',
    description: 'Gruby plaster czystego sera owczego halloumi smażony z greckim miodem, czarnym sezamem i świeżym sokiem z cytryny.',
    category: 'vegetarian',
    price: 34,
    isPopular: true,
    dietaries: ['v', 'gf']
  },
  {
    id: 'gemista',
    name: 'Tradycyjne Pieczone Gemista',
    description: 'Pomidory i słodka papryka nadziewane sypkim ryżem ziołowym z dodatkiem pinioli i rodzynek koronkowych, wolno karmelizowane.',
    category: 'vegetarian',
    price: 36,
    dietaries: ['v', 'vg', 'gf', 'df']
  },

  // Desserts
  {
    id: 'baklava',
    name: 'Tradycyjna Baklawa z Orzechami',
    description: 'Czterdzieści warstw cieniutkiego ciasta phyllo przełożonych posiekanymi orzechami włoskimi, migdałami i goździkami w miodzie.',
    category: 'desserts',
    price: 24,
    isPopular: true,
    dietaries: ['v']
  },
  {
    id: 'galaktoboureko',
    name: 'Galaktoboureko z Epiru',
    description: 'Aksamitny budyń z kaszy manny zapiekany w chrupiących arkuszach ciasta phyllo, pachnący skórką cytrynową i cynamonem.',
    category: 'desserts',
    price: 26,
    dietaries: ['v']
  },
  {
    id: 'loukoumades',
    name: 'Gorące Pączki Loukoumades',
    description: 'Tradycyjne greckie minipączki smażone na chrupiąco, polane miodem tymiankowym, posypane cynamonem i orzechami.',
    category: 'desserts',
    price: 21,
    dietaries: ['v']
  },

  // Drinks
  {
    id: 'assyrtiko',
    name: 'Santorini Assyrtiko Wytrawne Białe',
    description: 'Wybitne, mineralne wino o wysokiej kwasowości z nutami cytrusów. Doskonałe do owoców morza i ryb.',
    category: 'drinks',
    price: 18,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'xinomavro',
    name: 'Naoussa Xinomavro Czerwone Rezerwa',
    description: 'Wytrawne, mocno zbudowane wino czerwone z nutami ciemnej wiśni, suszonych pomidorów i ziemistego tytoniu.',
    category: 'drinks',
    price: 20,
    dietaries: ['v', 'vg', 'gf', 'df']
  },
  {
    id: 'ouzo',
    name: 'Klasyczne Plomari Ouzo',
    description: 'Tradycyjny grecki alkohol anyżowy z wyspy Lesbos, podawany na lodzie z krystaliczną wodą źródlaną.',
    category: 'drinks',
    price: 14,
    dietaries: ['v', 'vg', 'gf', 'df']
  }
];

export const GALLERY_ITEMS_PL: GalleryItem[] = [
  {
    id: 'g1',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=70&w=800',
    title: 'Szaszłyki z Grilla Na Żywo',
    category: 'food',
    description: 'Autentyczne szaszłyki souvlaki pieczone z kunsztem nad węglowym paleniskiem z oregano i solą morską.'
  },
  {
    id: 'g2',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=70&w=800',
    title: 'Przyjęcie Weselne w Ogrodzie',
    category: 'wedding',
    description: 'Magiczne stoły ze nastrojowym oświetleniem girland, dekoracjami oraz biało-błękitną zastawą w luksusowej rezydencji.'
  },
  {
    id: 'g3',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=70&w=800',
    title: 'Bufet na Konferencję Biznesową',
    category: 'corporate',
    description: 'Profesjonalny bufet meze oraz gorących dań przygotowany dla międzynarodowych gości w warszawskim biurowcu.'
  },
  {
    id: 'g4',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=70&w=800',
    title: 'Panorama Santorini o Zachodzie',
    category: 'venue',
    description: 'Inspiracja architektury z klasycznymi, białymi domami i błękitnymi kopułami goszczącymi wyjątkowe wieczory.'
  },
  {
    id: 'g5',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=70&w=800',
    title: 'Świeża Sałatka Horiatiki',
    category: 'food',
    description: 'Soczyste pomidory, greckie puszyste oliwki i solidny blok oryginalnej fety z pierwszego tłoczenia z oregano.'
  },
  {
    id: 'g6',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=70&w=800',
    title: 'Finezyjne Dania Serwowane',
    category: 'food',
    description: 'Wykwintne kotleciki jagnięce podawane z dzikimi ziołami, miodem i redukcją demi-glace.'
  },
  {
    id: 'g7',
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=70&w=800',
    title: 'Elegancka Aranżacja Weselna',
    category: 'wedding',
    description: 'Długi stół weselny udekorowany kryształami, świeżymi kwiatami i delikatnymi materiałami egejskimi.'
  },
  {
    id: 'g8',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=70&w=800',
    title: 'Aranżacja Zimnych Płytek Meze',
    category: 'food',
    description: 'Półmiski z greckimi pasami dipowymi, liśćmi winorośli, oliwkami i pieczywem do koktajli powitalnych.'
  },
  {
    id: 'g9',
    url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=70&w=800',
    title: 'Słoneczne Wybrzeże Morza Egejskiego',
    category: 'venue',
    description: 'Wapienne schody opadające ku błękitnej wodzie, stanowiące inspirację dla projektów dekoratorskich.'
  },
  {
    id: 'g10',
    url: 'https://images.unsplash.com/photo-1534080391025-a134628926f4?auto=format&fit=crop&q=70&w=800',
    title: 'Tradycyjny Klimat Restauracji',
    category: 'venue',
    description: 'Błękitny stolik tawerny z widokiem na zatokę, idealny motyw śródziemnomorski na prywatne przyjęcia.'
  },
  {
    id: 'g11',
    url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=70&w=800',
    title: 'Szaszłyki Souvlaki prosto z Rusztu',
    category: 'food',
    description: 'Nasi mistrzowie grilla barbecue przygotowują aromatyczne szaszłyki przed oczami zgromadzonych gości.'
  },
  {
    id: 'g12',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=70&w=800',
    title: 'Aranżacja Stołu Prasowego VIP',
    category: 'corporate',
    description: 'Luksusowe i ciepłe oświetlenie stołu konferencyjnego na podsumowania i wykwintne kolacje biznesowe.'
  }
];
