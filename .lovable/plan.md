

## Problem

In the expanded (full view) mode, the gradient hover overlay spans the full container width, but the image uses `object-contain` so it doesn't fill the entire width. This causes the gradient and title/category text to appear outside the actual image area — visible in the screenshot as overlay bleeding onto the background.

## Solution

When expanded, calculate and constrain the overlay to match the actual rendered image dimensions rather than the full container. The cleanest approach:

1. **Wrap the image in a container that shrinks to the image's natural size** — In expanded mode, instead of using `object-contain` on a full-width image, use a flex container with `justify-center` and let the image size itself naturally with `max-height` and `max-width` constraints. The overlay is positioned absolute within this wrapper, so it stays within the image bounds.

2. **Specifically**: In expanded mode, set the image wrapper to `inline-block` or `w-fit` so it hugs the image, and position the gradient overlay inside that tight wrapper.

### Changes

**File: `src/components/landing/Portfolio.tsx`**

- In the expanded state, change the image's parent `div` to use `w-fit mx-auto` instead of full width, so the overlay container matches the image width exactly.
- Keep the gradient overlay (`h-1/3`, bottom-anchored) inside this tight-fitting wrapper.
- No changes to animation, tilt, or button logic.

