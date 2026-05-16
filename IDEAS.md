# Rock City Lighting — Ideas & Roadmap

---

## Website Features to Build

### Before / After Slider ⭐
Drag-to-reveal slider showing a property before and after lighting installation. Most persuasive thing we can put on the site — exterior lighting is pure visual impact.
- **IRL first:** Go to a completed job (ideally 2–3 properties) and shoot the same angle twice — once before dusk with lights off, once after dark with lights on. Tripod, same framing. Phone is fine.
- Build: goes in the Portfolio section, or its own "Transformations" section

### Animated Hero ⭐
Dark landscape photo that slowly comes alive — outdoor lights flickering on one by one as the page loads. CSS/JS, no video needed. Totally on-brand and would be unlike anything else in this market.
- No IRL dependency — can build anytime with existing hero photo

### Seasonal / Holiday Landing Page (`/holiday`)
Standalone page for Christmas and holiday lighting. Tim can point social posts and Google ads here in October. Separate from main brand, more festive tone.
- **IRL first:** Decide on holiday lighting service offering + pricing range before building the page
- Easy to flip on/off each year

### Google Review Widget
Pull in 4–5 star Google reviews and display them on the homepage. Social proof at the exact moment someone is deciding to reach out.
- **IRL first:** Ask first few happy clients to leave a Google review
- Need a Google Business Profile set up and verified

### Project Gallery — Admin Upload
Simple password-protected tool to add new portfolio photos without editing code. Upload image, add a title and location tag, it appears on the site.
- No IRL dependency — can build anytime

### Neighborhood Jobs Map
A Little Rock map with pins showing every completed project. "We've lit up 14 homes in Chenal Valley" is more persuasive than any testimonial. Builds local credibility fast.
- Can start with 3–4 pins and grow it over time

### Quote → Invoice Converter
One button inside the quote builder that converts the document to an invoice — reframes "Total Investment" as "Amount Due," adds a due date, removes the scope approval language.
- **Waiting on:** Bank account + Stripe setup

### Client Quote Approval Link
Generate a shareable link from the quote builder that the client can open on their phone, review the quote, and tap "I Approve This Quote" — logs their name and timestamp.
- Eliminates back-and-forth email, feels more professional
- No IRL dependency

---

## Recurring Revenue Services

### Holiday Lighting Install + Takedown ⭐
Install Christmas/holiday lights in November, take them down in January, store them for the client. Fully recurring year after year with zero new sales effort. High margin, same customer base, naturally seasonal.
- **IRL first:** Decide on pricing model (flat rate? per linear foot? per zone?) and whether you store the lights or client does
- **IRL first:** Source lights — buy inventory to rent out, or client purchases their own?
- Build: `/holiday` landing page when ready

### Seasonal Timer Adjustment
Twice a year (spring + fall) come out to re-aim fixtures that have shifted, replace any burnt bulbs, and adjust timer schedules for the new sunrise/sunset times. Quick visit, easy to sell at the time of install as an add-on.
- Low effort, high value to the client — their system always looks its best
- Price: flat rate per visit, already built into the service plan tool

### Bulb & Fixture Replacement Plan
"Anything burns out, we replace it within the week — no service call fee." Flat monthly rate. LEDs rarely fail so it's mostly passive income, and clients love the peace of mind.
- **IRL first:** Decide on a flat rate that makes sense given average failure rates

### Landscape Change Assessment
As trees grow, shrubs fill in, and new plants go in, the whole lighting picture shifts. Annual visit to re-aim fixtures, recommend additions, and keep the system current. Usually leads to natural upsell.
- Can be bundled into the annual service plan or sold separately
- **IRL first:** After first year of installs, reach back out to early clients and pitch this

---

## Admin / Operations Tools

### Stripe + Google Calendar Integration ⭐ (build once bank account + Stripe are live)
The big one. Replaces the manual .ics download and makes billing fully automatic.

**How it works:**
- Quote builder sends quote → client approves
- Tim clicks "Send Invoice" in the quote builder
- Vercel serverless backend creates a Stripe Customer, sends a payment link for the deposit
- Client pays, Stripe saves their card
- Each active service add-on automatically becomes a Stripe Subscription — charges the client on schedule, sends them a receipt, Tim never thinks about it
- At the same moment, Google Calendar API creates recurring events in Tim's calendar for every scheduled visit — no import, they just appear

**Architecture:**
- Vercel serverless functions (`/api/send-invoice`, `/api/create-subscriptions`)
- Stripe API: Customers, Invoices, Subscriptions, Payment Links
- Google Calendar API: OAuth with Tim's `@rockcitylighting.com` account, creates events directly
- Quote builder gets a "Send Invoice" button that triggers the whole chain

**What this replaces:**
- Manual .ics download (still useful as a stopgap until this is built)
- Any manual recurring invoicing

**Waiting on:** Bank account → Stripe account → Google Workspace email/calendar setup

---

### Service Add-Ons ✅ (built into quote builder)
Five add-ons (Maintenance, Seasonal Timer, Holiday Lighting, Bulb Replacement, Landscape Assessment) with independent frequency + price per visit. Shows on quote doc. Downloads combined .ics as stopgap until Stripe integration is live.

### Text Notification for New Leads
When a contact form is submitted, Tim gets a text immediately. Home services live and die by speed-to-lead — calling back in 5 minutes vs. 2 hours is the difference between booking the job and losing it.
- Can wire up via Zapier (Google Sheet → SMS) with no code changes to the site

---

## Marketing / Business Ideas

### Neighborhood Referral Program
After a completed job, leave behind a small card: "Your neighbors can get $X off their consultation if they mention your name." Exterior lighting spreads block by block — people see the house and ask.

### Instagram / Facebook Before & After Posts
Same photos from the slider repurposed as social content. Before/after format performs extremely well. Geo-tag Little Rock neighborhoods.
- **IRL first:** Same photo pairs needed for the slider

### Google Business Profile
Verified GBP means showing up on Maps and in local search results. Crucial for "outdoor lighting Little Rock" searches.
- **IRL first:** Claim and verify the listing (needs a postcard sent to a physical address)

### "What Does Outdoor Lighting Cost?" Blog Post / Page
One of the top Google searches for this service. An honest breakdown builds trust and drives organic traffic — without committing to specific prices.

---

## Real-Life To-Do List

- [ ] **Shoot before/after photos** at 2–3 completed properties (tripod, same angle, dusk + dark)
- [ ] **Ask happy clients for Google reviews** — even 5 reviews makes a big difference early on
- [ ] **Claim Google Business Profile** and get it verified
- [ ] **Decide on holiday lighting offering** — install only? install + takedown? client owns lights or we do?
- [ ] **Price out holiday lighting** — per linear foot, per zone, or flat rate?
- [ ] **Decide on bulb replacement plan pricing** — flat monthly rate, what's the right number?
- [ ] **Set up business bank account + Stripe** (unlocks invoice tool, subscriptions, and auto-calendar)
- [ ] **Set up Google Workspace** (`tim@rockcitylighting.com`) — needed for Google Calendar API integration
- [ ] **Collect a physical business address** if needed for GBP verification
- [ ] **After first year of installs** — reach back out to early clients about landscape assessment visits
