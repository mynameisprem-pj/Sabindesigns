# Sabin Designs — CMS Setup Guide

## Files to add to your repo

```
your-repo/
├── index.html          ← replace with the new version (adds cms-loader.js)
├── style.css           ← unchanged
├── script.js           ← unchanged
├── cms-loader.js       ← NEW — hydrates page from JSON
├── content/
│   └── data.json       ← NEW — all editable content lives here
└── admin/
    └── index.html      ← NEW — the admin panel
```

---

## Step 1 — Cloudinary (free image hosting)

1. Go to https://cloudinary.com and create a free account
2. In your Cloudinary dashboard → Settings → Upload
3. Scroll to **Upload presets** → click **Add upload preset**
4. Set **Signing mode** to **Unsigned**, give it a name like `sabin_unsigned`
5. Save it

---

## Step 2 — GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Give it a name, set expiry (no expiry = most convenient)
4. Check the **`repo`** scope (full control of private repos)
5. Copy the token — you'll paste it in the admin panel when first saving

> The token is stored in your browser's sessionStorage only (cleared when you close the tab). Never share it.

---

## Step 3 — Edit CONFIG in admin/index.html

Open `admin/index.html` and find the CONFIG block near the top of the `<script>` tag:

```js
const CONFIG = {
  GITHUB_REPO:   'YOUR_GITHUB_USERNAME/YOUR_REPO_NAME',  // e.g. 'sabindesigns/portfolio'
  GITHUB_BRANCH: 'main',
  CLD_CLOUD:     'YOUR_CLOUDINARY_CLOUD_NAME',           // e.g. 'ddxabc123'
  CLD_PRESET:    'YOUR_CLOUDINARY_PRESET',               // e.g. 'sabin_unsigned'
  DATA_PATH:     'content/data.json',
  ...
};
```

Replace the placeholder values with your real values.

---

## Step 4 — Push to GitHub

```bash
git add .
git commit -m "add CMS: admin panel, cms-loader, data.json"
git push origin main
```

Vercel will auto-deploy. After ~30 seconds visit your site — it should look identical (cms-loader reads data.json which has the same content as before).

---

## Step 5 — First login

Visit `https://yoursite.vercel.app/admin`

Default password: **`admin123`**

**Change it immediately** using the 🔑 Change Password button in the sidebar.

---

## How saving works

1. Admin edits something and clicks **Save Changes**
2. Panel asks for your GitHub token (first time per session)
3. Content is committed directly to `content/data.json` in the repo
4. Vercel detects the commit and redeploys (~30 seconds)
5. Live site updates automatically

---

## What Sabin can edit

| Section | What's editable |
|---|---|
| Hero | Headline, sub-text, button labels & links, clients strip label |
| Client Logos | Add / remove logos (Cloudinary upload) |
| My Work | Add / remove thumbnails — auto-synced to hero marquee |
| About | Portrait photo, bio text, all 3 stats |
| Testimonials | Add / remove cards, logos, quotes, star ratings |
| Contact | Eyebrow, headline, sub-text, WhatsApp number & prefill, all social links |
