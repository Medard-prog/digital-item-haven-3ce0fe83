
// Utility for scroll animations
const setupScrollAnimations = () => {
  // Select all elements with 'reveal' class
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        // Optionally stop observing after animation
        // observer.unobserve(entry.target);
      } else {
        // Optional: hide elements when they're not in viewport
        // entry.target.classList.remove('reveal-visible');
      }
    });
  };
  
  // Create observer instance
  const observer = new IntersectionObserver(revealOnScroll, {
    root: null, // viewport
    threshold: 0.1, // trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // adjust for earlier/later triggering
  });
  
  // Start observing elements
  revealElements.forEach(element => {
    observer.observe(element);
  });
  
  return observer;
};

export default setupScrollAnimations;
