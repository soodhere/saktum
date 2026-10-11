# Saktum site

Saktum = Sanskrit sakshi (witness) + Latin factum (a deed or fact): a witnessed deed, which is what every receipt is.

- index.html: landing page (four seats, how it works, roadmap aligned with the product document, trust, early-access form)
- demo.html (served at /demo): sign in as a provider, invoker, tester or the platform, and follow the ten-chapter story, with Catalogue, Policies, Ledger, Receipts, Change trail, Identity registry and Trust centre tabs. Open a seat directly with /demo#provider, /demo#invoker, /demo#tester or /demo#platform.
- demo-v1.html (served at /demo-v1): earlier feature-by-feature views (policy studio, network signals, routing profiles, selective disclosure, KPIs)
- saktum.server.example.json: example manifest, a profile of the MCP Registry server.json with Saktum settings under _meta (providers publish it; invokers and testers use it with Trust Check)
- vercel.json: clean URLs and basic security headers

Tokens (TKN) and payouts are simulated; signatures, hashes and proofs are real and run in the browser.
Settings near the bottom of index.html: CONTACT_EMAIL (set) and FORM_ENDPOINT (paste a Formspree endpoint).
