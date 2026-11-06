# Pleniora AI — SaaS Starter

## Start locally

Requires Node.js 18 or newer. No package install is required.

1. Open this project directory in PowerShell.
2. Run `node server.js`. The server listens on the laptop's network interfaces at port 3000.
3. On the laptop, open `http://127.0.0.1:3000/`. On phones connected to the same shop Wi-Fi, open `http://LAPTOP-IP:3000/` (find the laptop IPv4 address with `ipconfig`).
4. Choose **Start free trial**, create an account once, then sign in on each device with that account. All connected devices use the same server data file at `data/accounts.json`.

Keep the laptop and Wi-Fi router powered during an outage (a laptop battery and router UPS can help). When the local server is reachable, writes are saved directly to the laptop; no internet connection is needed for devices on the same live LAN. If the laptop/server or router is off, phones can only use their previously installed offline copy, and each phone saves independently until reconnecting. Avoid making offline changes on several phones at once: account sync currently uploads the whole saved dataset and concurrent offline changes can overwrite one another. This local server does not upload its `data/accounts.json` to a separate cloud host automatically.

The server creates `data/accounts.json` on first signup. Keep this directory private and back it up securely. Do not commit the data folder.

## Included

- Public product landing page with semantic sections, title/description metadata, Open Graph metadata, SoftwareApplication structured data, `robots.txt`, sitemap and a searchable starter guide
- 30-day trial signup and login; account-level tenant isolation
- Password hashing with Node scrypt; HttpOnly/SameSite session cookie
- Forgot-password token generation and one-use, 30-minute password reset
- Monthly/yearly plan choice workflow
- Industry-aware business setup for retail, clothing/fabrics, restaurants/cafes, pharmacies, grocery, electronics, salons/services, bakeries, wholesale, hardware and automotive parts
- Restaurant floor, table tickets, kitchen order states, takeaway and POS billing
- Clothing-only Shopkeeper Sales ledger with unique order numbers, reserved/confirmed/returned states, quantity reservation/restore, shopkeeper search, and Excel-compatible CSV export
- Product CSV template/import/export for Excel; import adds valid new products and opening quantities, skips duplicate SKUs, and does not overwrite existing items
- Daily business report CSV export (sales, gross profit, expenses, net profit and invoice count) for Excel
- Guided first-login tour, contextual quick-guide panel for every module, pharmacy batch/expiry details and electronics warranty/serial fields
- Platform Super Admin can permanently delete a customer business account after a confirmation prompt and exact business-name check
- On-device voice/text assistant for sales and stock questions, product search, module navigation, common forms and task creation
- Existing Pleniora AI business app served at `app.html`, now loaded after account authentication
- Business data synchronization to the authenticated account backend

## Clothing POS and shopkeeper register

For the clothing workflow, opening the authenticated manager goes directly to the POS Sale Register. Choose Customer sale for walk-in sales or Shopkeeper reserve to record the shop name, receiving person, phone, product, color/design, unit, quantity, order number and payments. Reservations reduce available stock. An in-app Tasks & Alerts reminder is added after 30 minutes while the app is running; mark Okay / sold to record the remaining payment or Returned to restore stock. Shopkeeper Sales includes date filters and two Excel-compatible CSV exports: detailed orders and shop/person payment totals with outstanding due.

Urdu product names use the device's available Urdu Nastaliq/Naskh fonts with automatic right-to-left text direction; the app interface stays in English.

## Katan fabric pricing and POS

For a clothing business, add katan as a product with its stock unit set to Gaz and enter purchase cost and selling rate per Gaz. The POS then offers Gaz, Salwar and Suit for that product. Default usage is 1.75 Gaz per Salwar and 3.5 Gaz per Suit; change these in Customization → Fabric selling units. Selling prices and stock consumption are calculated from the per-Gaz rate and conversion. The product's color/design is selectable from saved suggestions or can be typed freely. The POS barcode field requires choosing a selling unit when the match has multiple units, so a scan cannot silently choose Suit or Salwar.

The POS presents Customer sale and Shopkeeper sale as two internal tabs. The Shopkeeper tab includes the order register, reserve/Okay/return actions, follow-up status and Excel-compatible exports. Delete in Products & Stock archives the item from new sales and product lists; restore it from Archived products. Archiving keeps old invoices and inventory history intact.

The same POS register contains Customer sale, Shopkeeper sale and Shopkeeper orders. Shopkeeper orders receive unique daily order numbers, preserve the shop/person/color/unit details, reduce available Gaz while reserved, and can be marked Okay/Confirmed or Returned. The app schedules a 30-minute follow-up reminder for reservations while it is running.

Product boxes remain configurable under Customization → Product form fields: show/hide standard boxes, rename them, or add/remove saved custom fields. Urdu names are right-to-left and bold, using a Jameel Noori Nastaliq-first device font stack. A Jameel Noori Nastaliq font file is not bundled with this project; if the device does not have that font installed, its available Urdu font is used instead. Add a properly licensed font file under `fonts/` before distributing it as an embedded font.
## Mobile install and offline use

The manager is an installable PWA (Progressive Web App). For a separate local-only workspace with no admin/superadmin sign-in, open `/app.html?offline=1`; it uses a separate browser storage key on that device and opens directly to the POS register. Its manifest is `offline.webmanifest`. This is a browser-installed offline app, not a native APK. It caches the app shell and lets an authenticated account use its saved business data offline on that same device. Offline edits are held on the device and uploaded when the connection returns.

1. Serve the app from an HTTPS domain (or localhost on the device). A plain `http://192.168...` LAN address is not a secure origin, so browsers will not enable service-worker installation there.
2. On Android, open the HTTPS site in Chrome, sign in, open the manager, then use **Install app** / **Add to Home screen** from the browser menu.
3. On iPhone/iPad, open the HTTPS site in Safari, sign in once, tap **Share → Add to Home Screen**. This installs the web app; it is not a signed native iOS app.
4. Open the home-screen app at least once while online so its app files and account data are cached. Later, it can open offline and changes remain on this device until it reconnects.

This project does not yet include a native Android APK or an iOS App Store package. The assistant is a local command helper, not a generative AI model; voice recognition depends on browser/device support. Separate devices have separate offline copies. When multiple devices edit the same account, their current whole-account sync can overwrite newer changes; keep one device as the editor until conflict-safe database synchronization is implemented. Do not use this as the only copy of important business records—export regular backups. Online card processing also requires a configured payment provider; do not store card numbers in this app.

### Three-phone offline sales transfer

Each mobile has its own offline database. Before disconnecting, install/open the offline workspace from an HTTPS address and restore the same complete JSON backup from the main software on each phone. That copies the product list and opening stock to the devices; keep that backup private. During the day, each phone records sales independently. In Settings & Backup, select the sale date and choose **Export daily sales**. Copy each phone's JSON file to the main laptop, then import each file once from the same section. Customer sales, shopkeeper orders/payment records, customer ledger entries and sales returns are merged; repeated imports skip duplicates, later shopkeeper order updates are merged, and matching products' stock is adjusted. Product matching uses product ID, then SKU/barcode, then name and unit. If a product is missing, its sale history is still imported but its stock is not adjusted; add/match the product first and import again. This file is for transaction transfer, not a full backup. It does not synchronize the phones automatically or combine general edits to products, settings or customer details.

## FBR / PRA tax integration

No live FBR or PRA API connector is included. The selected route is PRAL. The taxpayer must begin FBR Digital Invoicing onboarding, select “Proceed with PRAL as Licensed Integrator,” and receive PRAL-approved sandbox/production access and current field mappings. FBR v1.12 specifies an Authorization Bearer security token and environment routing; never put this token in browser code or commit it to source control. Build and sandbox-validate the connector only after PRAL provides the tenant-specific access and confirms the workflow. PRA has a separate process; confirm its applicability and integration route directly with PRA or its authorized e-intermediary.

## Important before public launch

This is a runnable self-hosted starter, not a finished commercial billing/hosting deployment.

- Plan selection is not payment: integrate a payment provider, verify signed webhooks, and only then mark subscriptions active. The included API deliberately does not unlock paid accounts just because they selected a plan.
- Password reset tokens are printed to the server console in development only. Connect a real email delivery provider and remove development token logging before public use.
- The included account store is a simple JSON file for local prototyping. Move to a managed SQL database with migrations, backups and transaction-safe updates before serving multiple concurrent shops.
- Put the app behind HTTPS; set a production session secret/store, rate limiting, origin/CSRF controls, account deletion/export policies and monitoring. Set `NODE_ENV=production` so cookies are Secure.
- Set the production canonical domain in the public page metadata and sitemap before asking search engines to index it. Add verified business contact details, privacy policy, terms, support details and localized pricing.
- The app’s staff accounts/roles are still part of its business UI. For production multi-user access, authorization must also be enforced by the backend API, not only by frontend permissions.
- Existing v3 data is not uploaded automatically. Export its JSON backup and import it only into the intended account after signup.

## Trial and plans

New accounts get a 30-day trial. `account.html` shows the trial status and offers monthly/yearly plan selection. Current prices are PKR 2,000/month and PKR 20,000/year (save PKR 4,000 versus monthly billing). A real billing gateway is still required for paid subscription activation.

## Files

- `index.html` — marketplace landing page
- `starter-guide.html` — customer onboarding guide
- `login.html`, `signup.html`, `forgot-password.html`, `reset-password.html` — account flows
- `app.html` — existing shop management frontend
- `server.js` — built-in Node HTTP API and static server
- `css/market.css` — landing/auth/help pages
- `css/style.css`, `js/app.js` — original shop interface and business logic
- `js/cloud-launcher.js` — authenticated bootstrap and backend sync
- `manifest.webmanifest`, `service-worker.js`, `icons/` — installable PWA shell and offline asset cache
- `js/industry.js`, `js/onboarding.js` — restaurant workflows and the guided first-login tour
- `restaurant-pos.html`, `pharmacy-pos.html`, `retail-pos.html` — industry-specific SEO pages

## Platform Super Admin

1. Open `platform-setup.html` while the local server is running. This first-run page is disabled once the first platform admin is created.
2. Create your own platform admin name, email and 12+ character password. No shared/default admin credentials are included.
3. Log in at `platform-login.html` and open the platform account panel.
4. Create customer shop accounts for retail, clothing, restaurant/cafe, pharmacy, grocery, electronics or salon/service businesses. Assign allowed modules, choose trial-only, lifetime-free, or free-until date access, and suspend/reactivate accounts. Reset a shop owner's password from the same account editor.
5. For a one-month free period choose **Free until a date** and select the date one month ahead. Access expires automatically after that date; the shop is then directed to the plan page.

The panel supports account/module/access administration. The monthly/yearly selection is a placeholder until a payment provider, merchant account, currency, prices and webhook secret are configured. Do not grant or record paid status manually based on an unverified payment.


Platform admin password reset: open platform-forgot-password.html, enter the platform admin email, and use the one-time reset URL printed to the local Node console. In production, configure a private email delivery provider; development console links should never be used on a public server.

## Shopkeeper directory and fast color selection (v11)

Open POS → Shopkeeper sale → Manage shopkeepers to save each reseller shop, phone and multiple people under that shop. During a new order, select the shop and then one of its linked people; use the inline Add choices to save a new shop/person without leaving the order. Existing shopkeeper orders seed the saved directory on first load and remain unchanged. Shop profiles can be removed without deleting order history.

Product and shopkeeper forms show labeled color swatches (Red, Blue, Green, Bottle Green, Light Green, Plum, Gray and more). Add a custom shade name and choose its color; the saved name is used on records and can be searched. POS color detail is optional for a fast checkout.


## Shopkeeper garment size variants (v12)

The shopkeeper order records the saved shop and its linked person, selected fabric/product (for example Katan or Jamawar), color, item type and quantity. For Gaz-stock items, choose Raw Gaz, Salwar or Suit. Salwar offers 1.75 Gaz and 2.5 Gaz cuts; Suit offers 3.5 Gaz and 5 Gaz cuts. Settings under Customization → Shopkeeper fabric size / rate let you adjust these four sizes. The sale rate is taken from the product's rate per Gaz; total price and stock consumption are calculated from the selected size.

Shopkeeper order CSV now includes item category, item type, garment Gaz and total stock Gaz used.
