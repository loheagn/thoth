// Simple script to create placeholder icon files
// For development only - replace with proper icons for production

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, 'public', 'icons');

// Create icons directory if it doesn't exist
mkdirSync(iconsDir, { recursive: true });

// Create simple SVG icons
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2383E2" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.6}" fill="white" text-anchor="middle" dominant-baseline="central" font-weight="bold">T</text>
</svg>
`;

// For PNG, we'll create a very basic data
// In a real scenario, you'd use a library like sharp or canvas
// For now, we'll create a minimal 1x1 transparent PNG that Chrome can accept
const createMinimalPNG = () => {
  // Minimal valid PNG file (1x1 transparent pixel)
  return Buffer.from(
    '89504e470d0a1a0a0000000d4948445200000001000000010801000000003a7e9b550000000a49444154789c62000000050001fc5ec0270000000049454e44ae426082',
    'hex'
  );
};

// For development, create minimal PNGs
// Replace these with proper icons later
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  const pngData = createMinimalPNG();
  const filePath = join(iconsDir, `icon${size}.png`);
  writeFileSync(filePath, pngData);
  console.log(`Created ${filePath}`);
});

console.log('\n⚠️  Placeholder icons created!');
console.log('These are minimal 1x1 transparent PNGs for development only.');
console.log('Please replace with proper icons for production.');
console.log('See public/icons/README.md for more information.\n');
