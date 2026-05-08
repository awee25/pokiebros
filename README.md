# 🃏 PokéStore — Pokémon Business Platform

A full-stack pre-order & online sales platform built with **Next.js** + **Supabase** + **Vercel**.

---

## ✅ Features

**Customer Side:**
- Browse & search products by name, category, type
- Pre-order specific items with release dates
- Shopping cart (persists in browser)
- Checkout with contact details
- Order tracking page with live status

**Admin Panel** (`/admin`):
- Dashboard with order stats & revenue
- Full product management (add/edit/archive)
- Stock level management
- Order management with status updates & notes
- Pre-order management with per-product demand overview

---

## 🚀 Setup Guide (Step-by-Step)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign Up (free)
2. Click **"New Project"** → fill in name, password, region (choose Singapore)
3. Wait ~2 minutes for setup to complete
4. Go to **SQL Editor** (left sidebar)
5. Copy everything from `supabase/schema.sql` and **Run** it
6. Go to **Project Settings → API**
7. Copy these values — you'll need them shortly:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key
   - **service_role** key ⚠️ Keep this secret!

---

### Step 2: Upload to GitHub

1. Go to [github.com](https://github.com) → Sign Up / Log In
2. Click **"New Repository"** → name it `pokemon-store` → Create
3. Upload all files from this folder to the repo
   - Easiest: drag and drop all files in the GitHub web interface
   - Or use GitHub Desktop app

---

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign Up with GitHub
2. Click **"Add New Project"** → Import your `pokemon-store` repo
3. Before deploying, add **Environment Variables** (click "Environment Variables"):

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
   | `ADMIN_PASSWORD` | Choose a strong password for your admin panel |

4. Click **Deploy** → wait ~2 minutes
5. Your site will be live at `your-project.vercel.app` 🎉

---

### Step 4: Access Your Admin Panel

1. Go to `your-site.vercel.app/admin/login`
2. Enter the `ADMIN_PASSWORD` you set in Step 3
3. Start adding products!

---

## 📱 Pages Overview

| Page | URL | Who |
|------|-----|-----|
| Homepage | `/` | Customers |
| Shop | `/shop` | Customers |
| Product | `/product/[id]` | Customers |
| Cart | `/cart` | Customers |
| Checkout | `/checkout` | Customers |
| Order Tracking | `/order/[id]` | Customers |
| Admin Login | `/admin/login` | You |
| Admin Dashboard | `/admin` | You |
| Admin Products | `/admin/products` | You |
| Admin Orders | `/admin/orders` | You |
| Admin Pre-Orders | `/admin/preorders` | You |

---

## 💡 How Orders Work

1. Customer places order on website
2. Order appears in your Admin → Orders page with status **"pending"**
3. You review it → change status to **"confirmed"**
4. Contact customer via WhatsApp/email with payment details → set to **"payment_requested"**
5. Once paid → set to **"paid"**
6. Ship the order → set to **"shipped"**
7. Done → set to **"completed"**

The customer can track their order status at `/order/[id]` — they'll see a progress bar update as you change the status.

---

## 🔧 Tech Stack (All Free Tier)

- **Next.js 14** — React framework (frontend + API)
- **Supabase** — PostgreSQL database + Row Level Security
- **Vercel** — Hosting with auto-deploy from GitHub
- **Tailwind CSS** — Styling
- **Lucide React** — Icons

---

## 💰 Cost

| Service | Cost |
|---------|------|
| Supabase | Free (up to 500MB DB, 2GB bandwidth) |
| Vercel | Free (up to 100GB bandwidth) |
| GitHub | Free |
| Domain (optional) | ~$10-20/year if you want a custom domain |

**Total: $0/month to get started.**
