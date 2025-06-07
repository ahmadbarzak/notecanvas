# 📘 Engineering Diary — Closure Trap Discovery (React)

**Date:** 2025-06-06  
**Author:** Ahmad Barzak  
**Topic:** React, useRef, Event Listeners, and Closure Pitfalls

---

## ✨ The Moment

Today I had a breakthrough in understanding a tricky bug that was affecting the behavior of my custom resizable blocks in a React project.

I noticed that when I resized a block (via `mousemove`) and then stopped (via `mouseup`), the final size reset to the **original starting values**, not the updated dimensions that were visibly shown during the resize.

---

## 🔍 Root Cause

It turns out this was due to a **closure trap**. Both the `resize` and `stopResize` functions were created inside my `handleResizeStart` — which means they closed over the **same variables defined at the start of the interaction**.

What tripped me up was that `resize()` appeared to be working fine — because I was updating dimensions with `setState`, and seeing live updates. But when `stopResize()` ran, it was **still using the values that were captured at 0% of the journey**, even though visually the block looked correct at 99%.

That’s because `stopResize()` was only called once, **at the end**, but it was still holding onto the closure from the very beginning. So any state updates that happened during movement were not reflected in its internal variables — unless I passed them through a `ref`.

---

## 🧠 What I Learned

- **React functions are redefined on every render**, but any function defined inside them (like in an event handler) **closes over the state at the time it was created.**
- **useRef is the escape hatch.** It provides a stable, mutable object that is not tied to re-renders and allows event listeners to always access the latest data.
- **Closures can be subtle.** Just because a function "seems" up to date doesn't mean it is. Always ask: *"When was this function created, and what did it capture?"*

---

## ✅ The Fix

I added `dimensionsRef.current = { width, height }` inside the `resize` function to always keep a live snapshot of the latest size, and then used that inside `stopResize()`:

```tsx
resizeBlock(block.id, {
  x: livePositionRef.current.x,
  y: livePositionRef.current.y,
  width: dimensionsRef.current.width,
  height: dimensionsRef.current.height,
});
