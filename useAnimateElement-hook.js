/* Idea from <https://dev.to/producthackers/intersection-observer-using-react-49ko> */

import { useRef, useEffect, useState, useCallback } from "react";

export default function useAnimateElement(options) {
  const containerRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  if (!options) {
    options = {
      root: null,
      rootMargin: "100px 0px 0px 0px",
      threshold: 0.25
    };
  }

  /**
   *  Set animation-* properties for containerRef children with [data-animation] attributes.
   */
  function addAnimationClasses() {
    const targets = containerRef.current.querySelectorAll("[data-animation]");
    targets.forEach(target => {
      const { animation, animationDelay, animationDuration } = target.dataset;
      if (animationDelay) {
        target.style.animationDelay = animationDelay;
        target.style.WebkitAnimationDelay = animationDelay;
      }
      if (animationDuration) {
        target.style.animationDuration = animationDuration;
        target.style.WebkitAnimationDuration = animationDuration;
      }
      if (animation) target.classList.add(animation);
    });
  }

  /**
   * Callback executed by the Intersection Observer while user scrolls down the page.
   */
  const handleIntersection = useCallback( (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        addAnimationClasses();
      }
    });
  }, []);

  useEffect(() => {
    const target = containerRef.current;
    const observer = new IntersectionObserver(handleIntersection, options);
    if (target) observer.observe(target);
    //cleanup
    return () => {
      // if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [handleIntersection, options]); // [containerRef, options]);

  return [containerRef, isVisible];
}
