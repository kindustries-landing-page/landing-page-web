import '@testing-library/jest-dom/vitest';
import '@testing-library/react';
import '@testing-library/dom';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
window.HTMLElement.prototype.scrollIntoView = function () {};
