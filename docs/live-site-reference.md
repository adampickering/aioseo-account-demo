# AIOSEO.com Live Site Design Reference

Extracted from https://aioseo.com/account/ via Chrome DevTools on 2026-04-02.

## Header

- **Background:** WHITE (`rgb(255, 255, 255)`), NOT dark navy
- **Border bottom:** 1px solid `rgb(230, 238, 252)` (light blue, `#E6EEFC`)
- **Height:** 88px
- **Max-width:** 1110px (content container)
- **Font:** "Proxima Nova", system-ui, sans-serif
- **Logo:** AIOSEO SVG with "AIO" in `#141b38` (navy) and "SEO" circle in `#005ae0` (blue) — saved to `public/assets/icons/aioseo-logo.svg`
- **Nav links:** color `rgb(20, 27, 56)` (#141B38), font-size 15px, font-weight 400
- **My Account link:** color `rgb(0, 90, 224)` (#005AE0), separated by a left blue divider
- **Layout:** flexbox, logo left, nav right, vertically centered

## Welcome Banner

- **Background:** transparent/white (NO dark gradient on live site)
- **Figma design shows:** blue gradient with wave decoration — this is the NEW design being applied
- **H1:** "Welcome to Your AIOSEO Account" — font-family Proxima Nova, font-size 36px, font-weight 600, color `#141B38`, text-align center
- **Subtitle:** "Improve Your Website Search Rankings" — color `rgb(140, 143, 154)` (#8C8F9A), font-size 18px
- **Padding:** 48px top/bottom

## Tab Navigation

- **Container:** flex, no wrap, list-style none
- **Tab links:** font-size 18px, padding 14.85px 22.5px
- **Active tab:** color `rgb(0, 90, 224)` (#005AE0), font-weight 600, blue underline (2-3px bottom border)
- **Inactive tab:** color `rgb(20, 27, 56)` (#141B38), font-weight 400
- **Tab count:** 9 items (Overview, Downloads, Services, Billing, Profile, Support, Suggest a Feature, Giveaway, Log Out)

## Content Container

- **Max-width:** 1110px (matches header)
- **Font family:** "Proxima Nova", system-ui, sans-serif

## CTA Banner (above footer)

- **Background:** linear-gradient white 50% → `#F2F7FD` 50%
- **Heading:** "Outrank Your Competition. It's That Simple."
- **Button:** "Get Started With AIOSEO Now" — bg `rgb(0, 170, 99)` (#00AA63), border-radius 4.5px
- **"(Instant Download)" text below button

## Footer

- **Column headings:** Company, Features (2 cols), Helpful Links
- **Social links:** X, Facebook, YouTube
- **Legal links:** Terms of Service, Privacy Policy, FTC Disclosure, Sitemap, AIOSEO Coupon
- **Copyright:** "Copyright © 2007-2025 Semper Plugins, LLC."
- **Badges:** Norton Secured, PayPal Verified, WPBeginner Verified
- **Language selector:** "English" dropdown

## Key Design Differences: Live Site vs Figma

The Figma design (node 2210:694) introduces these changes FROM the live site:
1. Welcome banner gets a blue gradient background with wave SVG decoration
2. Subtitle changes to "Get help, manage your support, and find answers faster." on Support tab
3. Tab navigation removes Services tab, adds sub-tabs to Downloads
4. Overview layout changes: Quick Links + Subscriptions + AI Credits on left, Special Offers on right
5. Footer adds "Our Brands" column
6. The overall page structure and cards get updated styling

## Figma Design Token Values

```
Primary Blue:     #005AE0
Primary Blue 5:   #F2F7FD
Primary Blue 10:  #E6EEFC
Primary Blue 25:  #BFD6F7
Navy Default:     #141B38
Navy 60:          #434960
Navy 40:          #8C8F9A
Accent Green:     #00AA63
Error Red:        #DF2A4A
Warning Amber:    #F18200
Text Primary:     #181d27
Text Muted:       #717680
Background:       #ffffff
Shadow XS:        #0a0d120d
```
