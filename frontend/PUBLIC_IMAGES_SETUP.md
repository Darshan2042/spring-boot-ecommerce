# Local Images Setup Guide

## 📁 Image Storage Location

All product images should be stored in:
```
frontend/public/images/products/
```

**Full Path Example:**
```
C:\Users\Admin\Downloads\looo\spring-boot-ecommerce\frontend\public\images\products\
```

## 📋 Folder Structure

```
frontend/
├── public/
│   └── images/
│       └── products/
│           ├── book.jpg
│           ├── chair.jpg
│           ├── desk.jpg
│           ├── monitor.jpg
│           ├── keyboard.jpg
│           ├── default-product.jpg
│           └── ... (more images)
├── src/
│   ├── config/
│   │   └── imageMapping.js           ← Configuration file
│   ├── pages/
│   │   ├── ProductsPage.js           ← Customer view
│   │   └── AdminDashboard.js         ← Admin view
│   └── ...
```

## 🖼️ Adding Images - 3 Methods

### Method 1: Category-Based Mapping (Automatic)

**File:** `src/config/imageMapping.js`

The system automatically maps product names to images. If a product name contains certain keywords, it uses the corresponding image:

```javascript
const categoryMap = {
  'book': 'book.jpg',
  'chair': 'chair.jpg',
  'desk': 'desk.jpg',
  'monitor': 'monitor.jpg',
  'keyboard': 'keyboard.jpg',
  'mouse': 'mouse.jpg',
  'laptop': 'laptop.jpg',
  // ... more mappings
};
```

**How to use:**
1. Save your image to: `frontend/public/images/products/book.jpg`
2. Create a product with name containing "book"
3. Image automatically displays!

**Example:**
- Product name: "Atomic Habits" (contains "book") → Shows `book.jpg`
- Product name: "Office Chair" (contains "chair") → Shows `chair.jpg`

### Method 2: Direct Product ID Mapping

Edit `src/config/imageMapping.js` and map specific products:

```javascript
export const directImageMapping = {
  1: '/images/products/atomic-habits.jpg',
  2: '/images/products/design-patterns.jpg',
  3: '/images/products/clean-code.jpg',
  4: '/images/products/ergonomic-chair.jpg',
};
```

### Method 3: Custom Image URL in Admin Panel

When adding/editing products in **Admin Dashboard**:
1. Enter the full image URL in "Image URL" field
2. Examples:
   - `/images/products/my-product.jpg` (local)
   - `https://example.com/image.jpg` (external)

## 📸 Recommended Image Formats

- **Format:** JPG or PNG
- **Dimensions:** 400x300px or larger (will be scaled)
- **File Size:** Keep under 500KB per image
- **Aspect Ratio:** Any (images scaled with object-fit: cover)

## 🚀 Quick Setup Example

### Step 1: Prepare Your Images
```
1. Find product images (Google Images, Unsplash, your own photos)
2. Resize to ~400x300px
3. Save as: book.jpg, chair.jpg, monitor.jpg, etc.
```

### Step 2: Add to Project
```
Copy images to: frontend/public/images/products/
```

### Step 3: Create Products
```
In Admin Dashboard:
- Product Name: "Atomic Habits" (contains "book")
- Leave Image URL blank
- Save → Image automatically shows!

OR

- Product Name: "Gaming Monitor"
- Image URL: /images/products/monitor.jpg
- Save → Custom image shows!
```

## 🔄 How Images Are Loaded

**Priority Order:**

1. **Custom URL in Admin Panel** (highest priority)
   - If product has custom image URL → Use it
   
2. **Direct ID Mapping** 
   - Check directImageMapping in imageMapping.js
   
3. **Category-Based Mapping**
   - Check if product name contains keywords
   - Use corresponding category image
   
4. **Fallback Gradient Placeholder** (lowest priority)
   - Shows purple gradient with 📦 emoji if no image found

## 📝 Image Mapping Configuration

**File:** `src/config/imageMapping.js`

**Add new category mapping:**
```javascript
const categoryMap = {
  // ... existing mappings
  'headphone': 'headphones.jpg',    // Remove 's' for search
  'watch': 'watch.jpg',
  'shoes': 'shoes.jpg',
};
```

## ⚠️ Troubleshooting

### Images not showing?
1. Check file exists in: `frontend/public/images/products/`
2. Use forward slashes: `/images/products/file.jpg`
3. Check file permissions (readable for web)
4. Verify filename matches exactly (case-sensitive on Linux)

### Fallback gradient showing?
- Image load failed → Check path/filename
- Use browser DevTools (F12) → Network tab → Check image URL

### Images loading slowly?
- Reduce file size (compress JPG)
- Use smaller dimensions (300-500px wide)
- Use PNG for graphics, JPG for photos

## 🎯 Best Practices

1. **Naming:** Use descriptive names: `atomic-habits.jpg`, not `img1.jpg`
2. **Organization:** One folder for all product images
3. **Backup:** Keep original images in Documents
4. **Size:** Compress to ~100-300KB per image
5. **Testing:** Add test image first to verify setup works

## 🔗 Image URLs Format

**Local images:**
```
/images/products/book.jpg
/images/products/monitor.jpg
/images/products/default-product.jpg
```

**External images (optional):**
```
https://example.com/image.jpg
https://images.unsplash.com/...
```

## 📞 Example: Complete Setup

1. Download 5 product images from Unsplash
2. Rename: `book.jpg`, `chair.jpg`, `monitor.jpg`, `keyboard.jpg`, `mouse.jpg`
3. Save to: `frontend/public/images/products/`
4. Create products in Admin:
   - "Atomic Habits Book" (auto-shows book.jpg)
   - "Office Chair Ergonomic" (auto-shows chair.jpg)
   - "4K Monitor Gaming" (auto-shows monitor.jpg)

Done! 🎉
