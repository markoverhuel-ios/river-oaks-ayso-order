# River Oaks AYSO 212 uniform order

Order page for River Oaks AYSO Region 212 families. Each family picks items, sizes and quantities and presses
**Send order**. Orders land in a Google Sheet that the team manager owns, which adds everything up into one full
order to place in the [Challenger team store](https://gearup.challengerteamwear.com/store/GC82496).

Items, sizes and prices were read from the store on October 3, 2026. Tax is 6% Michigan sales tax. Colour names
come from the store's product photos.

## Files

| File | What it is |
|---|---|
| `index.html` | The order page |
| `catalog.js` | Items, colours, sizes, prices and store item codes |
| `config.js` | The address of the order sheet (`SUBMIT_URL`) |
| `apps-script/Code.gs` | The script that receives orders in Google Sheets |

## Set up the order sheet (once, about 5 minutes)

1. Create a new Google Sheet in your own Google Drive. Name it something like "River Oaks AYSO 212 orders".
2. In the sheet, open **Extensions > Apps Script**. Delete what is there and paste in all of `apps-script/Code.gs`. Save.
3. In the Apps Script editor, pick `setup` in the function list and press **Run**. Google asks you to allow the script
   to edit your spreadsheets; allow it. The sheet now has Orders, Families and Full order tabs.
4. Press **Deploy > New deployment**. Type: **Web app**. Execute as: **Me**. Who has access: **Anyone**. Press Deploy and
   copy the Web app URL (it ends in `/exec`).
5. Put that URL in `config.js` as `window.SUBMIT_URL = "https://script.google.com/macros/s/.../exec";`, commit and push.

"Anyone" means anyone with the page can send an order without signing in. Only you can open the sheet.

## Using it

- Share the page link with families.
- **Full order** tab: every item added up by store item, colour and size, with the subtotal, tax, total and number of families.
- **Families** tab: one row per order with its total. Mark **Paid?** as money comes in.
- **Orders** tab: every line from every family.
- To remove a mistaken order, delete its rows in Orders and Families.

If you change prices or items, change both `catalog.js` and the `ITEMS` list in `Code.gs`, then in Apps Script use
**Deploy > Manage deployments > Edit > Version: New version** so the change takes effect at the same URL.
