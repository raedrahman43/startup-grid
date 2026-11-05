# Startup Grid

A startup trivia game with a 3×3 grid, one answer box, source-backed funding facts, and sponsorship concepts. Built with plain HTML, CSS, and JavaScript.

Open `dist/index.html` in a browser. No dependencies or build step.

Nine real companies demonstrate a startup trivia game, directory, sponsorship inventory, and a DM request composer. Funding facts come from dated official announcements linked on each directory card. This is a curated historical set, not a ranking or current funding database. Investor clues refer to the cited round. Amounts are USD per round, not lifetime totals; Stripe announced agreements and Mercury includes secondary funding. No messages are sent. Set `CONTACT_URL` in `dist/app.js` to your actual social profile before launch. Progress stays in this browser. The puzzle does not rotate daily.

Run `node check.cjs` for game-rule checks and `node --check dist/app.js` for JavaScript syntax checks. Browser appearance has not been tested. Evidence and editorial notes are in SOURCES.md; the playable dataset is `dist/data.js`.

See PLAN.md for the product roadmap.

Interaction: type a startup in the single name box below the grid and press Enter. Matching squares fill automatically. When multiple squares fit, placement prefers a full solvable completion. No square selection or answer dialog is needed.
