// src/lib/actions/fadeUp.ts

/**
 * Svelte action — fades the element up 12px into view when it enters the
 * viewport. Triggers once, then disconnects the observer.
 *
 * Usage: <section use:fadeUp>...</section>
 */
export function fadeUp(node: HTMLElement): { destroy(): void } {
  node.style.opacity = '0';
  node.style.transform = 'translateY(12px)';
  node.style.transition = 'opacity 500ms cubic-bezier(.2,.7,.25,1), transform 500ms cubic-bezier(.2,.7,.25,1)';

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.unobserve(node);
        }
      });
    },
    { threshold: 0.08 },
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
