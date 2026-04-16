import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing scroll-triggered animations
 * React-exclusive feature using Intersection Observer API
 */
export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return { ref, isVisible };
};

/**
 * Custom hook for managing animations with lifecycle
 * React-exclusive: manages state and effects for animation sequences
 */
export const useAnimationSequence = (sequence = [], options = {}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(options.autoPlay ?? true);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sequence.length);
  }, [sequence.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + sequence.length) % sequence.length);
  }, [sequence.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  return {
    currentIndex,
    isPlaying,
    goToNext,
    goToPrev,
    togglePlayPause,
    current: sequence[currentIndex],
  };
};

/**
 * Custom hook for bounce animations
 * React-exclusive: manages animation state
 */
export const useBounce = () => {
  const [isBouncing, setIsBouncing] = useState(false);

  const trigger = useCallback(() => {
    setIsBouncing(true);
    const timer = setTimeout(() => setIsBouncing(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return { isBouncing, trigger };
};

/**
 * Custom hook for managing hover animations on list items
 * React-exclusive: uses React state and refs
 */
export const useHoverAnimation = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = useCallback((index) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return { hoveredIndex, handleMouseEnter, handleMouseLeave };
};

/**
 * Custom hook for fade-in animations on component mount
 * React-exclusive: manages animation state based on component lifecycle
 */
export const useFadeIn = (delay = 0) => {
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasOpened(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return hasOpened;
};

/**
 * Custom hook for counting animations
 * React-exclusive: manages counter state
 */
export const useCountUp = (target = 100, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= target) return;

    const increment = target / (duration / 50);
    const timer = setInterval(() => {
      setCount((prev) => Math.min(prev + increment, target));
    }, 50);

    return () => clearInterval(timer);
  }, [target, duration]);

  return Math.round(count);
};
