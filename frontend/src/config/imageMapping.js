// FINAL PRODUCTION-READY IMAGE MAPPING

export const getLocalImagePath = (productName) => {
  const productLower = (productName || '').toLowerCase();

  // ✅ STEP 1: EXACT PRODUCT MATCH (MOST IMPORTANT)
  const exactMatchMap = {
    'wings of fire': '/images/products/wingsoffire.jpg', // make sure file exists
    'clean code': '/images/products/book.jpg',
  };

  if (exactMatchMap[productLower]) {
    return exactMatchMap[productLower];
  }

  // ✅ STEP 2: CATEGORY / KEYWORD MATCH (ORDER MATTERS)
  const categoryMap = {
    // Electronics
    macbook: '/images/products/macbook.jpg',
    phone: '/images/products/Phon.jpg',
    airpods: '/images/products/KeyBoard.jpg',
    ipad: '/images/products/ipadair.jpg',
    watch: '/images/products/applewatch.jpg',
    webcam: '/images/products/4kwebcam.jpg',
    hub: '/images/products/ccable.jpg',
    mouse: '/images/products/Mouse.jpg',
    laptop: '/images/products/Laptop.jpg',

    // Fashion
    'running shoes': '/images/products/runshoe.jpg',
    shoes: '/images/products/runshoe.jpg',
    shirt: '/images/products/cottontshirt.jpg',
    jeans: '/images/products/bluejeans.jpg',
    jacket: '/images/products/WinterJacket.jpg',
    wallet: '/images/products/leatherwallet.jpg',

    // Home
    coffee: '/images/products/CoffeeMaker.jpg',
    bedding: '/images/products/Beddingset.jpg',
    lamp: '/images/products/TableLamp.jpg',
    pillow: '/images/products/ThrowPillow.jpg',
    chair: '/images/products/Chair.jpg',
    desk: '/images/products/Desk.jpg',

    // Generic book fallback
    book: '/images/products/book.jpg',
  };

  // ✅ STEP 3: KEYWORD MATCH
  for (const [key, value] of Object.entries(categoryMap)) {
    if (productLower.includes(key)) {
      return value;
    }
  }

  // ✅ STEP 4: FINAL FALLBACK
  return '/images/products/book.jpg';
};


// Optional (keep for future use)
export const directImageMapping = {};


// Main function used in UI
export const getProductImage = (product) => {
  if (!product || !product.name) {
    return '/images/products/book.jpg';
  }

  return getLocalImagePath(product.name);
};