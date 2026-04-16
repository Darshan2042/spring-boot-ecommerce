# Quick Animation Reference

## 🎬 Commonly Used Animation Patterns

### 1. Simple Fade In on Mount
```javascript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### 2. Slide Up on Mount
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content slides up
</motion.div>
```

### 3. Hover Effects
```javascript
<motion.button
  whileHover={{ scale: 1.05, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Hover me
</motion.button>
```

### 4. Scroll Triggered Animation
```javascript
import { useScrollAnimation } from '../hooks/useAnimation';

const { ref, isVisible } = useScrollAnimation();

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={isVisible ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6 }}
>
  Animates when scrolled into view
</motion.div>
```

### 5. Staggered Children Animations
```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div
  initial="hidden"
  animate="visible"
  variants={containerVariants}
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 6. Loading Spinner
```javascript
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity }}
>
  ⟳
</motion.div>
```

### 7. Pulsing Animation
```javascript
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  Content
</motion.div>
```

### 8. Conditional Animation
```javascript
<motion.div
  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### 9. Exit Animation with AnimatePresence
```javascript
import { AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

### 10. Spring Animation
```javascript
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{
    type: 'spring',
    stiffness: 200,
    damping: 15,
  }}
>
  Bouncy animation
</motion.div>
```

---

## 📦 Using Pre-built Components

### AnimatedCard with List
```javascript
import AnimatedCard from '../components/AnimatedCard';

{items.map((item, idx) => (
  <AnimatedCard key={item.id} index={idx} delay={0.05}>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </AnimatedCard>
))}
```

### AnimatedButton
```javascript
import AnimatedButton from '../components/AnimatedButton';

<AnimatedButton 
  onClick={handleClick}
  variant="primary"
  loading={isLoading}
>
  Click Me
</AnimatedButton>
```

### ShoppingCartBadge
```javascript
import ShoppingCartBadge from '../components/ShoppingCartBadge';

<ShoppingCartBadge 
  count={cartItems.length}
  onClick={() => navigate('/cart')}
/>
```

### FloatingLabel Input
```javascript
import FloatingLabel from '../components/FloatingLabel';

<FloatingLabel
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### PulseNotification
```javascript
import PulseNotification from '../components/PulseNotification';

<PulseNotification
  message="Action successful!"
  type="success"
  duration={3000}
/>
```

---

## 🎯 Custom Hooks Usage

### useScrollAnimation
```javascript
const { ref, isVisible } = useScrollAnimation({
  threshold: 0.2, // Trigger at 20% visibility
});
```

### useBounce
```javascript
const { isBouncing, trigger } = useBounce();

const handleClick = () => {
  trigger(); // Triggers bounce
};
```

### useCountUp
```javascript
const count = useCountUp(1000, 2000); // Count to 1000 in 2 seconds
return <div>{count}</div>;
```

### useHoverAnimation
```javascript
const { hoveredIndex, handleMouseEnter, handleMouseLeave } = useHoverAnimation();

{items.map((item, idx) => (
  <motion.div
    key={idx}
    onMouseEnter={() => handleMouseEnter(idx)}
    onMouseLeave={() => handleMouseLeave()}
    animate={hoveredIndex === idx ? 'hover' : 'initial'}
  />
))}
```

---

## 🎨 Transition Configurations

### Fast (0.1-0.3s)
```javascript
transition={{ duration: 0.2, ease: 'easeOut' }}
```

### Medium (0.4-0.6s) - Default
```javascript
transition={{ duration: 0.5, ease: 'easeInOut' }}
```

### Slow (0.7-1.0s)
```javascript
transition={{ duration: 1, ease: 'easeInOut' }}
```

### Spring (Natural, Bouncy)
```javascript
transition={{
  type: 'spring',
  stiffness: 200,    // Higher = faster
  damping: 25,       // Higher = less bouncy
}}
```

---

## 🚀 Performance Tips

### ✅ DO:
- Use `opacity` and `transform` for animations (GPU accelerated)
- Use `AnimatePresence` for proper mount/unmount cleanup
- Memoize expensive computations with `useMemo`
- Use `initial={false}` to prevent animations on mount

### ❌ DON'T:
- Animate `width`, `height`, or `left`, `right` properties
- Create animations in render function (move to component)
- Use `setTimeout` instead of Framer Motion transitions
- Animate on every state change without conditions

---

## 📋 File Locations

| Component | Location |
|-----------|----------|
| AnimatedCard | `src/components/AnimatedCard.js` |
| AnimatedButton | `src/components/AnimatedButton.js` |
| StaggeredList | `src/components/StaggeredList.js` |
| PageTransition | `src/components/PageTransition.js` |
| PulseNotification | `src/components/PulseNotification.js` |
| ShoppingCartBadge | `src/components/ShoppingCartBadge.js` |
| AnimatedCounter | `src/components/AnimatedCounter.js` |
| FloatingLabel | `src/components/FloatingLabel.js` |
| useAnimation hooks | `src/hooks/useAnimation.js` |

---

## 🔗 Integration Checklist

When adding animations to a new component:

- [ ] Import Framer Motion: `import { motion } from 'framer-motion'`
- [ ] Import hooks if needed: `import { useScrollAnimation } from '../hooks/useAnimation'`
- [ ] Wrap component with `motion.div` or `motion.*`
- [ ] Add `initial`, `animate`, `transition` props
- [ ] Test on both desktop and mobile
- [ ] Consider `prefers-reduced-motion` preference

---

## 💡 Pro Tips

1. **Micro-interactions** feel more responsive than macro animations
2. **150-300ms** is the sweet spot for UI animations
3. **Stagger delays** of **50-100ms** feel natural
4. **Spring animations** feel modern but use carefully
5. **Test animations** on real devices, not just browsers

---

**Need more examples?** Check `ANIMATIONS_GUIDE.md` for detailed documentation!
