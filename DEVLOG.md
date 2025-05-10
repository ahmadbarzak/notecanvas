# 🧭 Devlog: Tailwind + Next.js Setup Battle

## 🧠 Context

While setting up my Next.js + TypeScript project `notecanvas`, I hit a series of compatibility and CLI issues trying to install and initialise Tailwind CSS. This devlog documents the full solution — in case I or anyone else ever needs to do this again without pulling their hair out 😅

---

## ⚙️ Goal

- Use **Tailwind CSS** for styling
- Host on **AWS (S3/CloudFront)** with static export
- Lock in a stable environment to prevent future breakage

---

## 🔥 Problem

Initial install attempts using:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

...led to repeated errors like:

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]
```

This was caused by:

- Installing **Tailwind v4+**, which isn't yet stable with Node.js v20+
- `npx` and Node module resolution issues on macOS/Apple Silicon
- Conflicts between global vs local installs
- Lack of a CLI binary in the installed version

---

## ✅ Solution (Step-by-Step)

### 1. Use Node LTS via `nvm`

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 20
nvm use 20
```

---

### 2. Pin the Node version to the project

```bash
node -v > .nvmrc
```

---

### 3. Clean up bad installs

```bash
rm -rf node_modules package-lock.json
```

---

### 4. Install Tailwind CLI (working version)

```bash
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

---

### 5. Initialize Tailwind config

```bash
npx tailwindcss init -p
```

✔️ This created:

- `tailwind.config.js`
- `postcss.config.js`


### 6. Setup CSS and import

**In `src/styles/globals.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**In `src/pages/_app.tsx`:**

```tsx
import '@/styles/globals.css';
```

---

### 7. Test that it's working

**In `src/pages/index.tsx`:**

```tsx
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind is working!
      </h1>
    </div>
  );
}
```

Then run the dev server:

```bash
npm run dev
```

There were some issues with the styling however, as the Tailwind classes were not being applied correctly. I was getting a blank screen with no styles.

### 🧠 What Actually Fixed It

After verifying install steps and CSS imports were correct, the real issue came down to one key detail:

```js
// tailwind.config.js
module.exports = {
  content: [],
  ...
}
```

Tailwind was configured with an **empty `content` array**, so it didn’t scan any files for utility classes — and generated zero styles.

---

✅ The fix:

```js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  ...
}
```

This told Tailwind where to look for class names in my project, and **everything started working instantly**.

---

> 💡 Lesson: If Tailwind builds with no errors but no styles are applied, **check your `content` config first** — it’s often the missing link.



---

## 📌 Takeaways

- ✅ Always pin versions: `"tailwindcss": "3.4.1"` saved this project
- 🧱 Use `.nvmrc`: keeps dev environments consistent
- 🚨 Node v20 is the current sweet spot — newer versions may break tools until packages catch up
- 🧾 Document everything — future you will thank you 🙏

---

## 🚀 Next Up

Start building the editor UI and laying out collaborative journaling modules.




