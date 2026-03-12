/* ============================================================
   PrintForge — Product Catalog
   Replace image paths with real photos when available.
   Each product can have 1–4 images; the first is the card thumbnail.
   ============================================================ */

const PRODUCTS = [
  {
    id: 'dragon-figurine',
    name: 'Dragon Figurine',
    price: 24.99,
    category: 'Figurines',
    featured: true,
    isBestseller: true,
    description:
      'A stunning detailed dragon figurine perfect for collectors and fantasy enthusiasts. Printed with high-resolution 0.1 mm layer height to capture every scale and claw. Display-ready straight from the printer.',
    specs: {
      Material:   'PLA+',
      Dimensions: '10 × 8 × 12 cm',
      Weight:     '~85 g',
      'Layer Height': '0.1 mm',
      'Print Time': '~6 hours',
      Finish:     'Sanded & primed',
    },
    images: [
      'images/dragon.svg',
      'images/dragon-b.svg',
      'images/dragon-c.svg',
    ],
    inStock: true,
  },
  {
    id: 'articulated-snake',
    name: 'Articulated Snake',
    price: 18.99,
    category: 'Toys',
    featured: true,
    isBestseller: true,
    description:
      'A fully articulated snake printed in a single piece — no assembly required. Every segment flexes smoothly, making it a mesmerizing desk toy or a fidget tool. A crowd favourite with both kids and adults.',
    specs: {
      Material:   'PLA',
      Dimensions: '40 × 4 × 4 cm (when straight)',
      Weight:     '~60 g',
      'Layer Height': '0.2 mm',
      'Print Time': '~4 hours',
      Finish:     'Raw / natural',
    },
    images: [
      'images/snake.svg',
      'images/snake-b.svg',
      'images/snake-c.svg',
    ],
    inStock: true,
  },
  {
    id: 'geometric-vase',
    name: 'Geometric Vase',
    price: 29.99,
    category: 'Decorative',
    featured: true,
    isNew: true,
    description:
      'A modern geometric vase with a vase-mode surface that gives it a smooth, seamless finish. Great as a standalone decorative piece or with dried flowers. Available in multiple filament colours.',
    specs: {
      Material:   'PETG',
      Dimensions: '12 × 12 × 22 cm',
      Weight:     '~110 g',
      'Layer Height': '0.15 mm',
      'Print Time': '~5 hours',
      Finish:     'Vase mode — seamless',
    },
    images: [
      'images/vase.svg',
      'images/vase-b.svg',
      'images/vase-c.svg',
    ],
    inStock: true,
  },
  {
    id: 'cable-organizer',
    name: 'Cable Organizer',
    price: 12.99,
    category: 'Functional',
    featured: false,
    description:
      'Keep your desk tidy with this stackable cable organizer. The modular design lets you clip multiple units together to manage any number of cables. Heat-resistant PETG construction means it won\'t deform near electronics.',
    specs: {
      Material:   'PETG',
      Dimensions: '8 × 3 × 3 cm (per unit)',
      Weight:     '~20 g',
      'Layer Height': '0.2 mm',
      'Print Time': '~1.5 hours',
      Finish:     'Raw / functional',
    },
    images: [
      'images/cable.svg',
      'images/cable-b.svg',
      'images/cable-c.svg',
    ],
    inStock: true,
  },
  {
    id: 'dice-tower',
    name: 'Dice Tower',
    price: 34.99,
    category: 'Games',
    featured: false,
    isBestseller: true,
    description:
      'A premium dice tower for tabletop RPG and board game enthusiasts. Internal baffles ensure truly random rolls every time. Comes with a detachable tray to catch dice safely. Perfect gift for any gamer.',
    specs: {
      Material:   'PLA+',
      Dimensions: '14 × 10 × 22 cm',
      Weight:     '~200 g',
      'Layer Height': '0.2 mm',
      'Print Time': '~12 hours',
      Finish:     'Sanded',
    },
    images: [
      'images/dice.svg',
      'images/dice-b.svg',
      'images/dice-c.svg',
    ],
    inStock: true,
  },
  {
    id: 'hexagon-planter',
    name: 'Hexagon Planter',
    price: 22.99,
    category: 'Functional',
    featured: false,
    isNew: true,
    description:
      'A stylish hexagonal planter for succulents and small plants. The geometric honeycomb pattern provides natural drainage channels. Printed in plant-safe PETG, UV-resistant for outdoor use.',
    specs: {
      Material:   'PETG (UV-resistant)',
      Dimensions: '10 × 10 × 9 cm',
      Weight:     '~90 g',
      'Layer Height': '0.2 mm',
      'Print Time': '~3 hours',
      Finish:     'Raw / matte',
    },
    images: [
      'images/planter.svg',
      'images/planter-b.svg',
      'images/planter-c.svg',
    ],
    inStock: true,
  },
  {
    id: 'phone-stand',
    name: 'Phone Stand',
    price: 15.99,
    category: 'Functional',
    featured: false,
    description:
      'A sleek, adjustable phone stand that works with both portrait and landscape orientations. Wide rubber-padded base prevents sliding. Compatible with all phone sizes including cases.',
    specs: {
      Material:   'PLA',
      Dimensions: '12 × 8 × 10 cm',
      Weight:     '~70 g',
      'Layer Height': '0.2 mm',
      'Print Time': '~2.5 hours',
      Finish:     'Sanded',
    },
    images: [
      'images/phone.svg',
      'images/phone-b.svg',
      'images/phone-c.svg',
    ],
    inStock: true,
  },
  {
    id: 'gothic-candle-holder',
    name: 'Gothic Candle Holder',
    price: 27.99,
    category: 'Decorative',
    featured: false,
    description:
      'A dramatic gothic-style candle holder that casts haunting shadow patterns on the wall. Printed in temperature-resistant PETG. Fits standard tealight candles. A statement piece for any room.',
    specs: {
      Material:   'PETG',
      Dimensions: '9 × 9 × 15 cm',
      Weight:     '~95 g',
      'Layer Height': '0.15 mm',
      'Print Time': '~5 hours',
      Finish:     'Sanded & painted',
    },
    images: [
      'images/candle.svg',
      'images/candle-b.svg',
      'images/candle-c.svg',
    ],
    inStock: false,
  },
];

// Helper: look up a product by id
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

// Helper: get featured products
function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.featured);
}

// Helper: get all unique categories
function getCategories() {
  return ['All', ...new Set(PRODUCTS.map(p => p.category))];
}
