"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function MotionEffects() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let scrollFrame = 0;
    let pointerFrame = 0;
    let observer: IntersectionObserver | null = null;
    let mutations: MutationObserver | null = null;
    const tiltCleanups: Array<() => void> = [];

    const updateScroll = () => {
      scrollFrame = 0;
      const hero = document.querySelector<HTMLElement>(".hero");
      const range = hero
        ? hero.offsetHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      const progress = range > 0 ? clamp01(window.scrollY / range) : 0;
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
    };

    const revealAll = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        element.classList.add("is-revealed");
      });
    };

    const stopReveal = () => {
      observer?.disconnect();
      mutations?.disconnect();
      observer = null;
      mutations = null;
      root.classList.remove("has-reveal");
    };

    const startReveal = () => {
      stopReveal();
      if (reduced.matches || !("IntersectionObserver" in window)) {
        revealAll();
        return;
      }

      root.classList.add("has-reveal");

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -24px 0px" },
      );

      const scan = () => {
        document
          .querySelectorAll<HTMLElement>(
            "[data-reveal]:not(.is-observed):not(.is-revealed)",
          )
          .forEach((element) => {
            element.classList.add("is-observed");
            observer?.observe(element);
          });
      };

      scan();
      mutations = new MutationObserver(scan);
      mutations.observe(document.body, { childList: true, subtree: true });
    };

    const onMotionChange = () => {
      if (reduced.matches) {
        stopReveal();
        revealAll();
      } else {
        startReveal();
      }
    };

    const clearPointerTilt = () => {
      tiltCleanups.forEach((cleanup) => cleanup());
      tiltCleanups.length = 0;
    };

    const bindPointerTilt = () => {
      clearPointerTilt();
      if (!finePointer.matches || reduced.matches) return;

      const hero = document.querySelector<HTMLElement>(".hero");
      if (hero) {
        const onHeroMove = (event: PointerEvent) => {
          const bounds = hero.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
          if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
          pointerFrame = window.requestAnimationFrame(() => {
            hero.style.setProperty("--pointer-x", x.toFixed(3));
            hero.style.setProperty("--pointer-y", y.toFixed(3));
            pointerFrame = 0;
          });
        };
        const onHeroLeave = () => {
          hero.style.removeProperty("--pointer-x");
          hero.style.removeProperty("--pointer-y");
        };
        hero.addEventListener("pointermove", onHeroMove);
        hero.addEventListener("pointerleave", onHeroLeave);
        tiltCleanups.push(() => {
          hero.removeEventListener("pointermove", onHeroMove);
          hero.removeEventListener("pointerleave", onHeroLeave);
        });
      }

      const cards = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".category-rail .category-tile, .tyre-rail .tyre-card",
        ),
      );
      cards.forEach((card) => {
        const onCardMove = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          card.style.setProperty("--card-x", x.toFixed(3));
        };
        const onCardLeave = () => card.style.removeProperty("--card-x");
        card.addEventListener("pointermove", onCardMove);
        card.addEventListener("pointerleave", onCardLeave);
        tiltCleanups.push(() => {
          card.removeEventListener("pointermove", onCardMove);
          card.removeEventListener("pointerleave", onCardLeave);
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    reduced.addEventListener("change", onMotionChange);
    finePointer.addEventListener("change", bindPointerTilt);
    updateScroll();
    startReveal();
    bindPointerTilt();

    return () => {
      window.removeEventListener("scroll", onScroll);
      reduced.removeEventListener("change", onMotionChange);
      finePointer.removeEventListener("change", bindPointerTilt);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      clearPointerTilt();
      stopReveal();
    };
  }, [pathname]);

  return null;
}
