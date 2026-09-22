// Parche para evitar error de webidl/undici en JSDOM con Node 20 en CI
const g = globalThis as any;

if (typeof g.webidl === 'undefined') {
  g.webidl = { util: { markAsUncloneable: () => {} } };
} else if (!g.webidl.util) {
  g.webidl.util = { markAsUncloneable: () => {} };
} else if (!g.webidl.util.markAsUncloneable) {
  g.webidl.util.markAsUncloneable = () => {};
}

import '@testing-library/jest-dom';