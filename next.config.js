const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  // Explicitly set Turbopack root to avoid workspace-root detection warnings
  turbopack: {
    root: path.resolve(__dirname),
  },
};
