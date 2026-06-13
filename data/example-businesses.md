# Example SF Businesses

Ten beloved, real San Francisco local businesses across different categories —
seed data for demos, manual QA of the URL-paste flow, and screenshots.

## Notes on the URLs

These use Google's official **Maps URL scheme** (`maps/search/?api=1&query=…`),
which resolves to the exact business by name + address without hardcoding a
`place_id`. They are stable, shareable, and safe to paste into the app's
"paste a Google Maps URL" entry point. The resolver should follow each to a
single confident `place_id`; if you want to test the QR/deep-link path instead,
resolve one of these to its `place_id` first.

Addresses verified via Yelp / Wikipedia / each business's own site (June 2026).

## Businesses

| # | Business | Category | Neighborhood | Address | Google Maps URL |
|---|----------|----------|--------------|---------|-----------------|
| 1 | Tartine Bakery | Bakery & café | Mission | 600 Guerrero St, San Francisco, CA 94110 | https://www.google.com/maps/search/?api=1&query=Tartine+Bakery+600+Guerrero+St+San+Francisco+CA+94110 |
| 2 | Philz Coffee (original) | Coffee shop | Mission | 3101 24th St, San Francisco, CA 94110 | https://www.google.com/maps/search/?api=1&query=Philz+Coffee+3101+24th+St+San+Francisco+CA+94110 |
| 3 | Zuni Café | Restaurant (Californian) | Hayes Valley | 1658 Market St, San Francisco, CA 94102 | https://www.google.com/maps/search/?api=1&query=Zuni+Cafe+1658+Market+St+San+Francisco+CA+94102 |
| 4 | Swan Oyster Depot | Seafood counter | Polk Gulch | 1517 Polk St, San Francisco, CA 94109 | https://www.google.com/maps/search/?api=1&query=Swan+Oyster+Depot+1517+Polk+St+San+Francisco+CA+94109 |
| 5 | Tony's Pizza Napoletana | Pizzeria | North Beach | 1570 Stockton St, San Francisco, CA 94133 | https://www.google.com/maps/search/?api=1&query=Tony%27s+Pizza+Napoletana+1570+Stockton+St+San+Francisco+CA+94133 |
| 6 | Bi-Rite Creamery | Ice cream parlor | Mission | 3692 18th St, San Francisco, CA 94110 | https://www.google.com/maps/search/?api=1&query=Bi-Rite+Creamery+3692+18th+St+San+Francisco+CA+94110 |
| 7 | Dandelion Chocolate | Chocolate factory & café | Mission | 740 Valencia St, San Francisco, CA 94110 | https://www.google.com/maps/search/?api=1&query=Dandelion+Chocolate+740+Valencia+St+San+Francisco+CA+94110 |
| 8 | Green Apple Books | Independent bookstore | Inner Richmond | 506 Clement St, San Francisco, CA 94118 | https://www.google.com/maps/search/?api=1&query=Green+Apple+Books+506+Clement+St+San+Francisco+CA+94118 |
| 9 | Mighty Pilates | Pilates studio | Presidio Heights | 3654 Sacramento St, San Francisco, CA 94118 | https://www.google.com/maps/search/?api=1&query=Mighty+Pilates+3654+Sacramento+St+San+Francisco+CA+94118 |
| 10 | Amoeba Music | Record store | Haight-Ashbury | 1855 Haight St, San Francisco, CA 94117 | https://www.google.com/maps/search/?api=1&query=Amoeba+Music+1855+Haight+St+San+Francisco+CA+94117 |
