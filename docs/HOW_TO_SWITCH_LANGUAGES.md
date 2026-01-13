# How to Switch Languages & Currency

## 🎯 Quick Answer

**Location:** Top right corner of the navigation bar
**Look for:** `🇩🇪 DE | EUR ▼` or `🇬🇧 EN | CHF ▼`
**Action:** Click to open dropdown, select your preference

---

## 📍 Where to Find It

```
┌──────────────────────────────────────────────────────────────────┐
│  🏠 formalogix                                                    │
│                                                                    │
│     Lösungen  Erfolgsgeschichten  Preise  Kontakt   🇩🇪 DE | EUR ▼│
│                                                              ↑     │
│                                                         CLICK HERE │
└──────────────────────────────────────────────────────────────────┘
```

The switcher appears in the **top right** of the navigation bar on **every page**.

---

## 🔄 How to Switch

### Step 1: Visit Your Site
```
http://localhost:4322/
```

### Step 2: Find the Switcher
Look in the **top right corner** for:
```
🇩🇪 DE | EUR ▼
```

### Step 3: Click It
A dropdown menu will appear:

```
┌─────────────────────────────┐
│ Language                    │
│ ✓ 🇩🇪 Deutsch              │
│   🇬🇧 English              │
│ ─────────────────           │
│ Currency / Region           │
│ ✓ EUR (€)     EU           │
│   CHF         CH            │
└─────────────────────────────┘
```

### Step 4: Make Your Selection

**To Change Language:**
- Click **"🇬🇧 English"**
- Page will reload with `/en/` URL
- Interface language changes to English

**To Change Currency:**
- Click **"CHF - CH"**
- Prices immediately update to Swiss Francs
- No page reload needed

---

## 🧪 Test It Now

### Test Sequence

1. **Visit Homepage**
   ```
   http://localhost:4322/
   ```

2. **Open Switcher**
   - Click `🇩🇪 DE | EUR ▼` in top right

3. **Switch to Swiss Francs**
   - Click "CHF - CH"
   - Switcher now shows `🇩🇪 DE | CHF ▼`

4. **Visit Pricing Page**
   ```
   http://localhost:4322/pricing
   ```
   - Scroll to calculator
   - Prices show CHF instead of EUR:
     ```
     Analysieren: CHF 0.12 / Seite
     Verifizieren: CHF 0.70 / Seite
     Scannen: CHF 0.35 / Seite
     ```

5. **Reload Page**
   - Press F5 or refresh
   - Currency stays CHF (saved in localStorage!)

6. **Switch Back to EUR**
   - Click `🇩🇪 DE | CHF ▼`
   - Click "EUR (€) - EU"
   - Prices update to EUR

---

## 📱 What You'll See

### German + EUR (Default)
```
Navigation:  🇩🇪 DE | EUR ▼
URL:         http://localhost:4322/
Prices:      €0.10 / €0.60 / €0.30
```

### German + CHF
```
Navigation:  🇩🇪 DE | CHF ▼
URL:         http://localhost:4322/
Prices:      CHF 0.12 / CHF 0.70 / CHF 0.35
```

### English + EUR (After creating English pages)
```
Navigation:  🇬🇧 EN | EUR ▼
URL:         http://localhost:4322/en/
Prices:      €0.10 / €0.60 / €0.30
```

### English + CHF
```
Navigation:  🇬🇧 EN | CHF ▼
URL:         http://localhost:4322/en/
Prices:      CHF 0.12 / CHF 0.70 / CHF 0.35
```

---

## 🎨 Visual Guide

### Before Clicking (Closed)
```
┌─────────────────────────────────────────────┐
│  Lösungen  Erfolgsgeschichten  🇩🇪 DE | EUR ▼│
└─────────────────────────────────────────────┘
```

### After Clicking (Open)
```
┌─────────────────────────────────────────────┐
│  Lösungen  Erfolgsgeschichten  🇩🇪 DE | EUR ▲│
│                               ┌─────────────┐│
│                               │Language     ││
│                               │✓🇩🇪 Deutsch ││
│                               │ 🇬🇧 English ││
│                               │─────────────││
│                               │Currency     ││
│                               │✓EUR (€)  EU ││
│                               │ CHF      CH ││
│                               └─────────────┘│
└─────────────────────────────────────────────┘
```

---

## 🔍 Where Prices Change

### 1. Pricing Calculator (`/pricing`)
**Best place to see the difference!**

Before (EUR):
```
Analysieren: €0,10 / Seite
Durch Menschen verifizieren: ab €0,60 / Seite
Scannen: €0,30 / Seite
```

After switching to CHF:
```
Analysieren: CHF 0.12 / Seite
Durch Menschen verifizieren: ab CHF 0.70 / Seite
Scannen: CHF 0.35 / Seite
```

### 2. Homepage Pricing Section
(Will update once you use the i18n pricing components)

---

## ⚡ Quick Reference

| Action | Result |
|--------|--------|
| Click `🇩🇪 Deutsch` | Stay on German, close menu |
| Click `🇬🇧 English` | Redirect to `/en/` (English) |
| Click `EUR (€) - EU` | Show European prices in EUR |
| Click `CHF - CH` | Show Swiss prices in CHF |
| Refresh page | Settings persist (saved in localStorage) |
| Clear browser data | Reset to defaults (DE + EUR) |

---

## 🐛 Troubleshooting

### "I don't see the switcher"
- **Check:** Are you looking in the top right corner?
- **Check:** Is JavaScript enabled?
- **Check:** Did the page fully load? (Wait 1-2 seconds)
- **Try:** Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### "English gives me 404"
- **Reason:** English pages haven't been created yet
- **Solution:** Create `src/pages/en/` directory and copy pages there
- **For now:** Just test currency switching (works immediately)

### "Prices don't change"
- **Check:** Visit `/pricing` page (has the working calculator)
- **Check:** Did you switch to CHF in the dropdown?
- **Check:** Look for the updated prices in the calculator section

### "Settings don't save"
- **Check:** Are cookies/localStorage enabled?
- **Try:** Different browser
- **Check:** Not in private/incognito mode

---

## 💡 Pro Tips

1. **Test Currency First** - Switch EUR ↔ CHF works immediately
2. **Visit /pricing** - Best page to see price changes
3. **Use Browser DevTools** - Check localStorage:
   ```javascript
   localStorage.getItem('formalogix-region')  // "EU" or "CH"
   localStorage.getItem('formalogix-locale')  // "de" or "en"
   ```

4. **Clear Settings** - Reset to defaults:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

---

## 🎯 What Works Right Now

✅ **Language Switcher UI** - Dropdown visible and working
✅ **Currency Switching** - EUR ↔ CHF works instantly
✅ **Pricing Calculator** - Shows regional prices
✅ **Persistence** - Settings saved on refresh
✅ **German Interface** - Fully functional

⚠️ **English Pages** - Need to be created (404 for now)

---

## 📝 Summary

**To switch currency:** Click `🇩🇪 DE | EUR ▼` → Select "CHF"
**To switch language:** Click `🇩🇪 DE | EUR ▼` → Select "English" (after creating pages)
**To test:** Visit http://localhost:4322/pricing and switch between EUR/CHF

The switcher is **always in the top right** of the navigation bar!
