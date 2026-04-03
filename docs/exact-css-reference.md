# EXACT CSS Reference — Extracted from aioseo.com via Chrome DevTools

All values are computed CSS values, not approximations. Use these EXACTLY.

## Global

- Font family: `"Proxima Nova", system-ui, sans-serif`
- Base font size: 18px
- Base line height: 27px (1.5)
- Base color: `#141B38` (rgb 20, 27, 56)
- Content max-width: `1110px`

## Header

```css
header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E6EEFC; /* rgb(230, 238, 252) */
  font-family: "Proxima Nova", system-ui, sans-serif;
  font-size: 18px;
  color: #141B38;
}

.site-header__content {
  display: flex;
  align-items: center;
  max-width: 1110px;
  width: 100%;
  height: 76px;
}

/* Logo */
.custom-logo-link {
  width: 127px;
  height: 25px;
}

/* Nav container */
#primary-menu {
  display: flex;
  justify-content: flex-end;
  font-size: 15px;
  line-height: 22.5px;
}

/* Nav links */
#primary-menu a {
  display: block;
  padding: 6px 0 6px 8px;
  color: #141B38;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  text-decoration: none;
}

/* My Account link (active) */
.current-menu-item a {
  color: #005AE0; /* rgb(0, 90, 224) */
  /* Has a left divider from its parent li */
}

/* Divider before My Account */
.has-divider-left {
  border-left: 1px solid #D0D1D7;
  padding-left: 15px;
  margin-left: 15px;
}
```

## Welcome Banner (Page Header)

```css
.page-header--my-account {
  padding: 48px 0;
  text-align: center;
  /* Background is transparent on live site */
  /* Figma design shows blue gradient - use gradient from Figma */
}

.page-header h1 {
  font-family: "Proxima Nova", system-ui, sans-serif;
  font-size: 36px;
  font-weight: 600;
  color: #141B38;
  text-align: center;
  line-height: normal;
}

.page-header .archive-description {
  color: #8C8F9A; /* rgb(140, 143, 154) */
  font-size: 18px;
}
```

## Tab Navigation

```css
#account-menu {
  display: flex;
  font-size: 18px;
  line-height: 28.8px;
  list-style: none;
  padding: 0;
  margin: 0;
  /* Container width: 1110px */
}

/* Tab items */
#account-menu li {
  display: flex;
  padding: 0;
  margin: 0;
}

/* Tab links */
#account-menu a {
  display: block;
  padding: 14.85px 22.5px;
  font-size: 18px;
  font-weight: 400;
  line-height: 21.6px;
  color: #141B38;
  text-decoration: none;
}

/* Active tab */
#account-menu .current-menu-item a {
  color: #005AE0;
  font-weight: 600;
  /* The blue underline appears to be a border on the li or a pseudo-element */
  /* Visually: 3px blue bottom border */
}
```

## Cards (o-card class)

```css
.o-card {
  border: 1px solid #E6EEFC; /* rgb(230, 238, 252) */
  border-radius: 5px;
  box-shadow: rgba(0, 90, 224, 0.06) 0px 5px 10px 0px;
  padding: 40px;
  margin-bottom: 40px;
  max-width: calc(50% - 15px);
}
```

## Active Badge

```css
.license-status.active {
  background-color: rgba(0, 170, 99, 0.05);
  color: #00AA63; /* rgb(0, 170, 99) */
  border: 1px solid #00AA63;
  border-radius: 5px;
  padding: 0 7px;
  font-size: 16px;
}
```

## Green Button (Primary CTA)

```css
.wp-block-button__link.has-theme-secondary-background-color {
  background-color: #00AA63; /* rgb(0, 170, 99) */
  color: #FFFFFF;
  border-radius: 4px;
  padding: 13.2px 20px;
  font-size: 16px;
  font-weight: 600;
}

/* Large variant (download button) */
.wp-block-button__link.large {
  border-radius: 4.5px;
  padding: 14.85px 22.5px;
  font-size: 18px;
}
```

## Blue Button (Primary action)

```css
/* Based on Download AIOSEO button */
.blue-button {
  background-color: #005AE0;
  color: #FFFFFF;
  border-radius: 4.5px;
  padding: 14.85px 22.5px;
  font-size: 18px;
  font-weight: 600;
}
```

## CTA Banner (above footer)

```css
.cta-section {
  /* Parent has gradient background: linear-gradient(white 50%, #F2F7FD 50%) */
  padding: 40px 0 24px;
  margin-bottom: 80px;
}

.cta-heading {
  font-size: 23px;
  font-weight: 600;
  line-height: 28.75px;
  color: #141B38;
  max-width: 563px;
}

.cta-button {
  /* Same as green button styles above */
  background-color: #00AA63;
  color: #FFFFFF;
  border-radius: 4.5px;
  padding: 14.85px 22.5px;
  font-size: 18px;
  font-weight: 600;
}
```

## Footer

```css
#colophon {
  display: flex;
  background-color: #F2F7FD; /* rgb(242, 247, 253) */
  color: #434960; /* rgb(67, 73, 96) */
  font-size: 18px;
  line-height: 27px;
}

.footer-links {
  display: flex;
  gap: 24px;
  max-width: 1110px;
  margin: 40px auto;
  font-size: 15px;
  line-height: 22.5px;
  /* 4 columns on the live site, Figma adds "Our Brands" for 5 */
}

/* Column headings */
.footer-links h2 {
  font-size: 16px;
  font-weight: 600;
  line-height: 19.2px;
  color: #434960;
}

/* Footer links */
.footer-links a {
  color: #434960;
  font-size: 15px;
  font-weight: 400;
  line-height: 32.25px; /* list items have line-height: 2.14 */
  text-decoration: none;
}

/* Footer badges */
/* Norton: 85x46px, PayPal: 54x54px, WPBeginner: 256x46px */
/* Badge image URLs: */
/* https://aioseo.com/wp-content/uploads/2020/11/norton-secure-1.svg */
/* https://aioseo.com/wp-content/uploads/2020/10/PPbadgetp.png */
/* https://aioseo.com/wp-content/uploads/2020/11/wpbeginner-badge-dark.svg */
```

## Overview Page Layout

```css
.account-overview-columns {
  display: flex;
  width: 1110px;
}

/* Left column (user info card) */
.account-info.o-card {
  padding: 40px;
  margin-bottom: 40px;
  border: 1px solid #E6EEFC;
  border-radius: 5px;
  box-shadow: rgba(0, 90, 224, 0.06) 0px 5px 10px 0px;
  width: 540px;
  max-width: calc(50% - 15px);
}

/* Right column (CTA card) */
.cta-card.o-card {
  padding: 40px;
  margin-bottom: 40px;
  border: 3px solid #E27730; /* orange border on current promo */
  border-radius: 5px;
  box-shadow: rgba(0, 90, 224, 0.06) 0px 5px 10px 0px;
  width: 540px;
  max-width: calc(50% - 15px);
}

/* Gap between columns: 30px (calc(50% - 15px) × 2 + 30px gap = 1110px) */
```

## Color Reference

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Primary Blue | #005AE0 | rgb(0, 90, 224) | Links, active tabs, blue buttons |
| Navy/Dark | #141B38 | rgb(20, 27, 56) | Body text, headings, logo "AIO" |
| Navy 60 | #434960 | rgb(67, 73, 96) | Footer text, secondary text |
| Navy 40 | #8C8F9A | rgb(140, 143, 154) | Muted text, subtitles |
| Green | #00AA63 | rgb(0, 170, 99) | Active badges, green buttons |
| Green 5% | rgba(0,170,99,0.05) | — | Active badge background |
| Info/Light BG | #F2F7FD | rgb(242, 247, 253) | Footer bg, light sections |
| Border | #E6EEFC | rgb(230, 238, 252) | Card borders, header border |
| Input Border | #D0D1D7 | rgb(208, 209, 215) | Dividers, input borders |
| Card Shadow | rgba(0,90,224,0.06) 0 5px 10px | — | Card box-shadow |
| White | #FFFFFF | — | Backgrounds, button text |
| Red | #DF2A4A | — | Error/cancel states |
| Amber | #F18200 | — | Warning badges, orange borders |
