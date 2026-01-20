# Extension Icons

Placeholder icon files are needed for the extension to work:
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

## Temporary Solution

For development, you can:

1. Use any 128x128 PNG image as a placeholder
2. Copy it 4 times and rename to the sizes above
3. Place all in this `public/icons/` directory

## Production Icons

For production, create proper icons with:
- Thoth branding (book/reading theme)
- Clear, simple design
- Works at all sizes
- Follows Chrome Web Store guidelines

Recommended tools:
- Figma
- Adobe Illustrator
- Inkscape (free)
- Online icon generators

## Quick Fix for Development

Run this in the terminal from the browser-extension directory:

```bash
# Create a simple placeholder (requires ImageMagick)
convert -size 128x128 xc:#2383E2 -gravity center -pointsize 48 -fill white -annotate +0+0 "T" public/icons/icon128.png
convert public/icons/icon128.png -resize 48x48 public/icons/icon48.png
convert public/icons/icon128.png -resize 32x32 public/icons/icon32.png
convert public/icons/icon128.png -resize 16x16 public/icons/icon16.png
```

Or manually download any square PNG image and resize it to the required dimensions.
