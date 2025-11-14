# Team Photos Directory

This directory contains professional photos of the Aliff Services leadership team.

## Required Images

Place the following images in this directory:

1. **haroon-haider.jpg** - Haroon Haider (CEO & Co-Founder)
2. **sumera-khan.jpg** - Sumera Khan (VP Client Relationships & Co-Founder)
3. **sana-rehman.jpg** - Sana Rehman (VP Resources & Co-Founder)

## Image Specifications

### Recommended Dimensions
- **Size**: 512x512px (square format)
- **Format**: JPG or PNG
- **File Size**: Under 500KB (optimized for web)
- **Aspect Ratio**: 1:1 (square)

### Quality Guidelines
- Professional headshot or professional photo
- Clean, simple background (preferably solid color or subtle gradient)
- Good lighting with even exposure
- Subject centered in frame
- High resolution but web-optimized

### Technical Requirements
- **Min Resolution**: 400x400px
- **Max Resolution**: 1000x1000px (will be automatically optimized)
- **Color Profile**: sRGB
- **Orientation**: Portrait or square

## Design Integration

The images will be displayed with:
- Rounded corners (border-radius: 1rem)
- Gradient border overlay on hover
- Zoom and rotate animation on hover
- Fallback to gradient background with initials if image is missing

## Fallback Behavior

If an image is not found or fails to load:
- The component will automatically display a gradient background
- The founder's initials will be shown (HH, SK, SR)
- The gradient colors match each founder's brand color

## How to Add Images

1. Save your optimized image files in this directory
2. Use the exact filenames listed above
3. The Next.js app will automatically detect and display them
4. No code changes needed - the component handles this automatically

## Example File Structure

```
public/images/team/
├── README.md (this file)
├── haroon-haider.jpg
├── sumera-khan.jpg
└── sana-rehman.jpg
```

## Image Optimization

Next.js will automatically:
- Generate multiple sizes for different devices
- Convert to modern formats (WebP) when supported
- Lazy load images for better performance
- Apply responsive sizing
