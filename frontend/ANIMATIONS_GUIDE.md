# React Animation Features Guide

This guide documents all the live animation features added to your ShopHub e-commerce frontend using **React-exclusive features** and Framer Motion.

## 🎬 Features Overview

All animations leverage **React-exclusive capabilities** including:
- **React Hooks** for state management (`useState`, `useEffect`, `useRef`, `useMemo`)
- **React Suspense & lazy()** for code-splitting with smooth transitions
- **Intersection Observer API** (via React refs) for scroll-triggered animations
- **AnimatePresence** from Framer Motion for mount/unmount animations
- **Custom React Hooks** for reusable animation logic

---

## 📚 Custom Animation Hooks

### 1. **useScrollAnimation**
Triggers animations when elements scroll into view using Intersection Observer API.

```javascript
import { useScrollAnimation } from '../hooks/useAnimation';

const MyComponent = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
    >
      Content appears when scrolled into view
    </motion.div>
  );
};
```

### 2. **useAnimationSequence**
Manages sequential animations with play/pause controls.

```javascript
const { currentIndex, isPlaying, goToNext, current } = useAnimationSequence(
  [slide1, slide2, slide3],
  { autoPlay: true }
);
```

### 3. **useBounce**
Creates bounce animations on user interactions.

```javascript
const { isBouncing, trigger } = useBounce();

<motion.button
  animate={isBouncing ? 'bounce' : 'initial'}
  onClick={() => trigger()}
>
  Click me!
</motion.button>
```

### 4. **useHoverAnimation**
Manages hover state for list items with individual animations.

```javascript
const { hoveredIndex, handleMouseEnter, handleMouseLeave } = useHoverAnimation();

{items.map((item, idx) => (
  <motion.div
    onMouseEnter={() => handleMouseEnter(idx)}
    onMouseLeave={() => handleMouseLeave()}
    animate={hoveredIndex === idx ? 'hover' : 'initial'}
  />
))}
```

### 5. **useFadeIn**
Fades in component on mount with optional delay.

```javascript
const hasOpened = useFadeIn(500); // 500ms delay

<motion.div animate={{ opacity: hasOpened ? 1 : 0 }}>
  Content
</motion.div>
```

### 6. **useCountUp**
Animates counter from 0 to target value.

```javascript
const count = useCountUp(100, 2000); // Count to 100 in 2 seconds
<div>{count}</div>
```

---

## 🎨 Pre-built Animated Components

### 1. **AnimatedCard**
Self-hosted card with entrance, scroll, and hover animations.

**Features:**
- ✨ Smooth entrance animation on scroll
- 🎯 Staggered animation for multiple cards
- 🖱️ Elevation effect on hover
- 📱 Fully responsive

**Usage:**
```javascript
import AnimatedCard from '../components/AnimatedCard';

<AnimatedCard index={0} delay={0.1} className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</AnimatedCard>
```

### 2. **StaggeredList**
Renders children with staggered entrance animations.

**Features:**
- 📊 Perfect for product lists, tables, menu items
- ⏰ Configurable stagger timing
- 🔄 Supports vertical & horizontal layouts

**Usage:**
```javascript
import StaggeredList from '../components/StaggeredList';

<StaggeredList staggerDelay={0.1} direction="vertical">
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</StaggeredList>
```

### 3. **PageTransition**
Wraps pages with Suspense & smooth transitions.

**Features:**
- 🔄 Smooth page-to-page transitions
- ⏳ Built-in loading state with Suspense
- 🎭 Enter/exit animations

**Usage:**
```javascript
import PageTransition from '../components/PageTransition';

<PageTransition pageKey={currentPage}>
  <YourPage />
</PageTransition>
```

### 4. **AnimatedButton**
Button with intelligent animations based on state.

**Features:**
- 🎯 Hover & tap feedback animations
- 💫 Bounce effect on click via custom hook
- ⏳ Loading state with rotating spinner
- 🎨 Multiple variants (primary, secondary, success, danger)

**Usage:**
```javascript
import AnimatedButton from '../components/AnimatedButton';

<AnimatedButton 
  onClick={handleClick}
  variant="primary"
  loading={isLoading}
  disabled={isDisabled}
>
  Click Me
</AnimatedButton>
```

### 5. **PulseNotification**
Auto-dismissing notifications with smooth animations.

**Features:**
- 🎭 Spring-based entrance/exit animation
- 🎯 Supports info, success, error, warning types
- ⏰ Auto-dismiss with configurable duration
- 👆 Manual dismiss button

**Usage:**
```javascript
import PulseNotification from '../components/PulseNotification';

<PulseNotification 
  message="Item added to cart!"
  type="success"
  duration={3000}
  onDismiss={() => {}}
/>
```

### 6. **ShoppingCartBadge**
Animated cart counter that bounces on updates.

**Features:**
- 💫 Bounce animation when cart updates
- 🎯 Click to navigate to cart page
- 🔢 Displays count with 99+ overflow handling

**Usage:**
```javascript
import ShoppingCartBadge from '../components/ShoppingCartBadge';

<ShoppingCartBadge 
  count={cartItems.length} 
  onClick={() => setCurrentPage('cart')}
/>
```

### 7. **AnimatedCounter**
Smoothly counts from 0 to target number with formatting.

**Features:**
- 🔢 Custom prefix/suffix (%, $, etc.)
- ⏰ Configurable animation duration
- 🎨 Great for statistics, achievements

**Usage:**
```javascript
import AnimatedCounter from '../components/AnimatedCounter';

<AnimatedCounter 
  target={10000}
  duration={2000}
  prefix="$"
  suffix="K"
  label="Total Sales"
/>
```

### 8. **FloatingLabel**
Input with animated floating label pattern.

**Features:**
- ⬆️ Label floats up when focused or has value
- 🎯 Smooth transitions on focus/blur
- 📱 Responsive and accessible

**Usage:**
```javascript
import FloatingLabel from '../components/FloatingLabel';

<FloatingLabel 
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## 🎬 Animated Pages

### HomePage (`src/pages/HomePage.js`)
**Animations added:**
- ✨ Hero section with cascading text animations
- 🎯 Staggered feature cards with icon rotation on hover
- 📊 Scroll-triggered stats section with count-up animations
- 🎯 CTA sections with smooth entry/exit
- 🖱️ All buttons use AnimatedButton component

### ProductsPage (`src/pages/ProductsPage.js`)
**Animations added:**
- 🔍 Filter bar with staggered entrance
- 📦 Product cards with:
  - Staggered entrance animation (each card delays 100ms)
  - Image zoom on hover
  - Price scale animation on entrance
  - AnimatedButton for "Add to Cart"
- ⟳ Rotating loader on data fetch
- 🎯 Empty state message with smooth animation

### ModernNavbar (`src/components/ModernNavbar.js`)
**Animations added:**
- 🎬 Navbar slides down from top on mount
- 🎁 Logo with continuous rotate animation
- 🔘 Menu buttons with hover scale & shadow effects
- 🛒 ShoppingCartBadge with bounce on cart updates
- 👤 Profile dropdown with spring animation (AnimatePresence)
- 🔗 All interactive elements respond to user interaction

---

## 🚀 Usage Examples

### Example 1: Adding Animation to Custom Components
```javascript
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useAnimation';
import AnimatedCard from '../components/AnimatedCard';

const MyFeature = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h2>Feature Title</h2>
      <div className="grid">
        {features.map((feature, idx) => (
          <AnimatedCard key={idx} index={idx}>
            {feature.content}
          </AnimatedCard>
        ))}
      </div>
    </motion.section>
  );
};
```

### Example 2: Creating a List Animation
```javascript
import StaggeredList from '../components/StaggeredList';

const ItemList = ({ items }) => (
  <StaggeredList staggerDelay={0.05}>
    {items.map(item => (
      <motion.div 
        key={item.id}
        whileHover={{ x: 10 }}
      >
        {item.name}
      </motion.div>
    ))}
  </StaggeredList>
);
```

### Example 3: Form with Animations
```javascript
import FloatingLabel from '../components/FloatingLabel';
import AnimatedButton from '../components/AnimatedButton';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
    >
      <FloatingLabel
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AnimatedButton
        loading={loading}
        onClick={handleSubmit}
      >
        Login
      </AnimatedButton>
    </motion.form>
  );
};
```

---

## 🎯 Animation Performance Tips

1. **Use AnimatePresence** for mounting/unmounting animations
2. **Lazy load heavy pages** with React.lazy() + Suspense for smooth transitions
3. **Limit animations** on mobile devices - use `prefers-reduced-motion` media query
4. **Use `initial={false}`** on animations that shouldn't run on mount
5. **Prefer transform & opacity** for better performance (GPU accelerated)

---

## 📱 Browser Support

All animations use modern browser APIs:
- **Framer Motion**: Works in all modern browsers
- **Intersection Observer**: Supported in all modern browsers (polyfill available)
- **CSS Transforms**: Fully supported

---

## 🔧 Customization

### Modify Animation Timing
Each component accepts transition props:
```javascript
<motion.div
  transition={{
    duration: 0.5,
    delay: 0.2,
    ease: 'easeInOut' // easeIn, easeOut, easeInOut, linear
  }}
>
  Content
</motion.div>
```

### Custom Variants
Create your own animation patterns:
```javascript
const customVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
};

<motion.div variants={customVariants} initial="hidden" animate="visible">
  Content
</motion.div>
```

---

## 📚 Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **React Hooks Guide**: https://react.dev/reference/react
- **Intersection Observer API**: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

---

## 🎉 Summary

Your ShopHub frontend now features:
- ✨ 8 custom React animation hooks
- 🎨 8 pre-built animated components
- 📄 3 enhanced pages with complex animations
- 🚀 Smooth page transitions with React Suspense
- 💫 Interactive elements with bounce and hover effects
- 🔔 Animated notifications and toasts
- 📊 Count-up animations for statistics

All animations leverage **React-exclusive features** for maximum compatibility and performance! 🎭
