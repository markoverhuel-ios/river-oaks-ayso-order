/**
 * River Oaks AYSO 212 uniform orders: receives orders from the order page and writes them to this sheet.
 *
 * Sheets it keeps:
 *   Orders      one row per item ordered
 *   Families    one row per order, with subtotal, tax, total and a Paid? column
 *   Full order  every item added up by colour and size: what to place in the Challenger store
 *
 * Setup: see README.md in the repo. Run setup() once, then Deploy > New deployment > Web app.
 */

var TAX_RATE = 0.06; // Michigan sales tax

// Store item code -> [item, colour, style, price, sizes]. Keep in step with catalog.js.
var ADULT = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
var YOUTH = ['YXS', 'YS', 'YM', 'YL', 'YXL'];
var SENECA = ['Y2XS', 'YXS', 'YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
var ITEMS = {
  BH14033: ["Scottsdale Men's SS Crew Neck jersey", 'White', 'LS102M-X', 25.15, ADULT],
  UH12830: ["Scottsdale Men's SS Crew Neck jersey", 'Blue', 'LS102M-X', 25.15, ADULT],
  HH06341: ["Men's Oxford Short", 'Blue', 'SC205M', 24.55, ADULT],
  MH10125: ["Men's Oxford Short", 'Red', 'SC205M', 24.55, ADULT],
  SH20744: ["Scottsdale Women's SS Crew Neck jersey", 'White', 'LS102W-X', 25.15, ADULT],
  FH05082: ["Scottsdale Women's SS Crew Neck jersey", 'Blue', 'LS102W-X', 25.15, ADULT],
  SH04790: ["Women's Oxford Short", 'Blue', 'SC205W', 24.55, ADULT],
  AH06194: ["Women's Oxford Short", 'Red', 'SC205W', 24.55, ADULT],
  RG62943: ["Scottsdale Boys' SS Crew Neck jersey", 'White', 'LS102B-X', 25.15, YOUTH],
  GG67522: ["Scottsdale Boys' SS Crew Neck jersey", 'Blue', 'LS102B-X', 25.15, YOUTH],
  PG71390: ["Boys' Oxford Short", 'Blue', 'SC205B', 24.55, YOUTH],
  MG58831: ["Boys' Oxford Short", 'Red', 'SC205B', 24.55, YOUTH],
  FG67880: ["Scottsdale Girls' SS Crew Neck jersey", 'White', 'LS102G-X', 25.15, YOUTH],
  WG58920: ["Scottsdale Girls' SS Crew Neck jersey", 'Blue', 'LS102G-X', 25.15, YOUTH],
  QG71667: ["Girls' Oxford Short", 'Blue', 'SC205G', 24.55, YOUTH],
  KG70242: ["Girls' Oxford Short", 'Red', 'SC205G', 24.55, YOUTH],
  GG58697: ['Cambridge Sock', 'White', 'SC314U', 10.20, ['S', 'M', 'L']],
  PG56547: ['Cambridge Sock', 'Blue', 'SC314U', 10.20, ['S', 'M', 'L']],
  KL06347: ['104 Seneca jersey', 'Red', '104', 11.35, SENECA],
  DL00749: ['104 Seneca jersey', 'White', '104', 11.35, SENECA],
  UL09237: ['104 Seneca jersey', 'Grey', '104', 11.35, SENECA],
  VL00915: ['104 Seneca jersey', 'Light blue', '104', 11.35, SENECA],
  NL12383: ['108 Wichita goalkeeper jersey', 'Orange', '108', 20.45, ['YM', 'YL', 'S', 'M', 'L', 'XL', '2XL']],
  WL13540: ['108 Wichita goalkeeper jersey', 'Green', '108', 20.45, ['YM', 'YL', 'S', 'M', 'L', 'XL', '2XL']],
  ZL04169: ['554 Alliance Full Zip Jacket', 'Black', '554', 30.95, ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL']],
  CL03886: ['555 Alliance Pants', 'Black', '555', 30.95, ['YS', 'YL', 'S', 'M', 'L', 'XL', '2XL']],
  ZL07093: ['808 Pulsar Backpack', 'Black', '808', 36.45, ['One size']]
};

var ORDER_HEAD = ['Received', 'Order ID', 'Player', 'Jersey #', 'Team', 'Parent', 'Contact', 'Item', 'Colour', 'Style',
                  'Store item', 'Size', 'Qty', 'Price', 'Line total'];
var FAMILY_HEAD = ['Received', 'Order ID', 'Player', 'Jersey #', 'Team', 'Parent', 'Contact', 'Notes', 'Items',
                   'Subtotal', 'Tax', 'Total', 'Paid?'];

/** Run once from the Apps Script editor: creates the three sheets and the Full order summary. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var orders = sheet_(ss, 'Orders', ORDER_HEAD);
  var fams = sheet_(ss, 'Families', FAMILY_HEAD);
  orders.getRange('N:O').setNumberFormat('$#,##0.00');
  fams.getRange('J:L').setNumberFormat('$#,##0.00');
  fams.getRange('M2:M').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Yes', 'No'], true).build());

  var full = ss.getSheetByName('Full order') || ss.insertSheet('Full order');
  full.clear();
  full.getRange('A1').setValue('Full order: every item added up by colour and size. Place these in the Challenger team store.');
  full.getRange('A1').setFontWeight('bold');
  full.getRange('A3').setFormula('=IFERROR(QUERY(Orders!H:O,"select K, H, I, L, sum(M), sum(O) where M > 0 group by K, H, I, L ' +
      'order by H, I, L label K \'Store item\', H \'Item\', I \'Colour\', L \'Size\', sum(M) \'Qty\', sum(O) \'Amount\'",1),"No orders yet.")');
  full.getRange('H3').setValue('Items');
  full.getRange('I3').setFormula('=SUM(Orders!M2:M)');
  full.getRange('H4').setValue('Subtotal');
  full.getRange('I4').setFormula('=SUM(Orders!O2:O)');
  full.getRange('H5').setValue('Michigan sales tax');
  full.getRange('I5').setFormula('=SUM(Families!K2:K)');
  full.getRange('H6').setValue('Total');
  full.getRange('I6').setFormula('=SUM(Families!L2:L)');
  full.getRange('H7').setValue('Families');
  full.getRange('I7').setFormula('=COUNTA(Families!B2:B)');
  full.getRange('H3:H7').setFontWeight('bold');
  full.getRange('F:F').setNumberFormat('$#,##0.00');
  full.getRange('I4:I6').setNumberFormat('$#,##0.00');
  full.setColumnWidth(2, 300);
  ss.setActiveSheet(full);
}

function sheet_(ss, name, head) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#12233D').setFontColor('#FFFFFF');
  sh.setFrozenRows(1);
  return sh;
}

/** Keeps typed text as text, so nothing a family types is run as a spreadsheet formula. */
function clean_(v, max) {
  var s = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max || 100);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return reply_({ ok: true, message: 'River Oaks AYSO 212 order sheet is running.' });
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'The order could not be read.' });
  }
  var id = clean_(data.orderId, 30);
  var player = clean_(data.playerName, 80), parent = clean_(data.parentName, 80), contact = clean_(data.contact, 100);
  if (!id || !player || !parent || !contact) return reply_({ ok: false, error: 'Player name, parent name and contact are required.' });
  if (!Array.isArray(data.lines) || !data.lines.length || data.lines.length > 60) return reply_({ ok: false, error: 'The order has no items.' });

  var now = new Date(), rows = [], sub = 0, count = 0;
  for (var i = 0; i < data.lines.length; i++) {
    var l = data.lines[i], it = ITEMS[String(l.code)];
    var qty = Math.floor(Number(l.qty));
    if (!it || it[4].indexOf(String(l.size)) < 0 || !(qty >= 1 && qty <= 20)) {
      return reply_({ ok: false, error: 'An item, size or quantity is not valid. Reload the page and try again.' });
    }
    var amount = Math.round(qty * it[3] * 100) / 100;
    sub += amount; count += qty;
    rows.push([now, id, player, clean_(data.playerNumber, 3), clean_(data.team, 60), parent, contact,
               it[0], it[1], it[2], String(l.code), String(l.size), qty, it[3], amount]);
  }
  sub = Math.round(sub * 100) / 100;
  var tax = Math.round(sub * TAX_RATE * 100) / 100;

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var fams = ss.getSheetByName('Families'), orders = ss.getSheetByName('Orders');
    if (!fams || !orders) { setup(); fams = ss.getSheetByName('Families'); orders = ss.getSheetByName('Orders'); }
    // The page may send the same order twice if it could not read the first reply; keep only one copy.
    var ids = fams.getLastRow() > 1 ? fams.getRange(2, 2, fams.getLastRow() - 1, 1).getValues() : [];
    for (var k = 0; k < ids.length; k++) if (ids[k][0] === id) return reply_({ ok: true, orderId: id, duplicate: true });
    orders.getRange(orders.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    fams.appendRow([now, id, player, clean_(data.playerNumber, 3), clean_(data.team, 60), parent, contact,
                    clean_(data.notes, 200), count, sub, tax, Math.round((sub + tax) * 100) / 100, 'No']);
  } finally {
    lock.releaseLock();
  }
  return reply_({ ok: true, orderId: id, subtotal: sub, tax: tax, total: Math.round((sub + tax) * 100) / 100 });
}
