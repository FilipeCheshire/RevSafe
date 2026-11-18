'use client';

import { useEffect, useRef } from 'react';

export function GridBackground({ surface = false }: { surface?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const size = 80;
    const cells = new Map<string, { x: number; y: number; touched: number }>();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let color = '';
    let intensity = 0.7;
    let surfaceOffset = 0;
    const container = surface ? canvas.parentElement : null;
    const contentRoot = container || canvas.parentElement || document.documentElement;
    const protectedSelector = 'h1, h2, h3, h4, h5, h6, p, label, legend, button, input, select, textarea, dt, dd, [data-grid-protect], .section-heading, .experience-copy, .experience-topline, .experience-search, .experience-bottomline';
    let protectedNodes: Element[] = [];
    let protectedAreas: { x: number; y: number; width: number; height: number; soft: boolean }[] = [];
    let nodesDirty = true;
    let areasDirty = true;

    function refreshProtectedAreas() {
      if (!areasDirty) return;
      if (nodesDirty) {
        const groups = '.section-heading, .experience-copy, .experience-topline, .experience-search, .experience-bottomline, [data-grid-protect]';
        protectedNodes = [...contentRoot.querySelectorAll(protectedSelector)].filter(node => !node.parentElement?.closest(groups));
        nodesDirty = false;
      }
      const origin = canvas!.getBoundingClientRect();
      const padding = 12;
      protectedAreas = protectedNodes.flatMap(node => {
        const bounds = node.getBoundingClientRect();
        if (!bounds.width || !bounds.height || bounds.bottom < origin.top || bounds.top > origin.top + height || bounds.right < origin.left || bounds.left > origin.left + width) return [];
        return [{ x: bounds.left - origin.left - padding, y: bounds.top - origin.top - padding, width: bounds.width + padding * 2, height: bounds.height + padding * 2, soft: !node.matches('button, input, select, textarea') }];
      });
      areasDirty = false;
    }

    function readTheme() {
      const theme = getComputedStyle(document.documentElement);
      color = theme.getPropertyValue('--grid-color').trim();
      intensity = Number(theme.getPropertyValue('--grid-opacity')) || 0.7;
      areasDirty = true;
    }

    function draw(now: number) {
      frame = 0;
      context!.clearRect(0, 0, width, height);
      for (const [key, cell] of cells) {
        const alpha = Math.max(0, 1 - Math.max(0, now - cell.touched - 500) / 850);
        if (alpha === 0) {
          cells.delete(key);
          continue;
        }
        const y = cell.y - surfaceOffset;
        const gradient = context!.createRadialGradient(cell.x + size / 2, y + size / 2, 5, cell.x + size / 2, y + size / 2, size);
        gradient.addColorStop(0, `rgba(${color}, ${alpha * intensity})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        context!.strokeStyle = gradient;
        context!.lineWidth = 1.4;
        context!.strokeRect(cell.x + 0.5, y + 0.5, size - 1, size - 1);
      }
      // Text remains readable even where its foreground surface is transparent.
      // Geometry is cached; only mutations, scrolling and resizing invalidate it.
      refreshProtectedAreas();
      context!.save();
      context!.globalCompositeOperation = 'destination-out';
      for (const area of protectedAreas) {
        if (!area.soft) {
          context!.clearRect(area.x, area.y, area.width, area.height);
          continue;
        }
        // Fade only the grid, revealing the actual section color without a painted panel.
        context!.save();
        context!.translate(area.x + area.width / 2, area.y + area.height / 2);
        context!.scale(area.width / 2 + 40, area.height / 2 + 32);
        const fade = context!.createRadialGradient(0, 0, 0, 0, 0, 1);
        fade.addColorStop(0, 'rgba(0, 0, 0, .94)');
        fade.addColorStop(.55, 'rgba(0, 0, 0, .9)');
        fade.addColorStop(.8, 'rgba(0, 0, 0, .45)');
        fade.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context!.fillStyle = fade;
        context!.beginPath();
        context!.arc(0, 0, 1, 0, Math.PI * 2);
        context!.fill();
        context!.restore();
      }
      context!.restore();
      if (cells.size) frame = requestAnimationFrame(draw);
    }

    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      cells.clear();
      context!.clearRect(0, 0, width, height);
    }

    function resize() {
      clear();
      areasDirty = true;
      width = container?.clientWidth || window.innerWidth;
      // A long section still needs only one viewport of backing pixels.
      height = container ? Math.min(container.clientHeight, window.innerHeight) : window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      if (container) canvas!.style.height = `${height}px`;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      updateSurfacePosition();
    }

    function updateSurfacePosition() {
      if (!container) return;
      const bounds = container.getBoundingClientRect();
      const nextOffset = Math.max(0, Math.min(-bounds.top, container.clientHeight - height));
      if (nextOffset !== surfaceOffset) clear();
      if (nextOffset !== surfaceOffset) areasDirty = true;
      surfaceOffset = nextOffset;
      canvas!.style.top = `${surfaceOffset}px`;
    }

    function onScroll() {
      areasDirty = true;
      updateSurfacePosition();
    }

    function onPointerMove(event: PointerEvent) {
      if (reducedMotion.matches || event.pointerType === 'touch' || document.hidden) return;
      const bounds = container?.getBoundingClientRect();
      if (bounds && (event.clientX < bounds.left || event.clientX >= bounds.right || event.clientY < bounds.top || event.clientY >= bounds.bottom)) return;
      updateSurfacePosition();
      const x = Math.floor((event.clientX - (bounds?.left || 0)) / size) * size;
      const y = Math.floor((event.clientY - (bounds?.top || 0)) / size) * size;
      cells.set(`${x}:${y}`, { x, y, touched: performance.now() });
      if (!frame) frame = requestAnimationFrame(draw);
    }

    readTheme();
    resize();
    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const contentObserver = new MutationObserver(() => { nodesDirty = true; areasDirty = true; });
    contentObserver.observe(contentRoot, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'open'] });
    const resizeObserver = new ResizeObserver(() => { areasDirty = true; if (container) resize(); });
    resizeObserver.observe(contentRoot);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', clear);
    reducedMotion.addEventListener('change', clear);
    return () => {
      clear();
      observer.disconnect();
      contentObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', clear);
      reducedMotion.removeEventListener('change', clear);
    };
  }, [surface]);

  return <canvas ref={canvasRef} className={`grid-background${surface ? ' grid-background--surface' : ''}`} aria-hidden="true" />;
}
