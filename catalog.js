// River Oaks AYSO 212 team store, read from gearup.challengerteamwear.com/store/GC82496 on 2026-10-03.
// One entry per store item (each colour is its own item). Colour names are taken from the store's product photos.
// apps-script/Code.gs keeps its own copy of codes and prices; change both together.
window.TAX_RATE = 0.06; // Michigan sales tax
window.STORE_URL = "https://gearup.challengerteamwear.com/store/GC82496";

(function () {
  const ADULT = "XS S M L XL 2XL 3XL 4XL".split(" ");
  const YOUTH = "YXS YS YM YL YXL".split(" ");
  const SENECA = "Y2XS YXS YS YM YL S M L XL 2XL 3XL".split(" ");
  const P = (section, name, style, price, sizes, colors) => ({ section, name, style, price, sizes, colors });
  window.CATALOG = [
    P("Men's uniform", "Scottsdale Men's SS Crew Neck jersey", "LS102M-X", 25.15, ADULT, { White: "BH14033", Blue: "UH12830" }),
    P("Men's uniform", "Men's Oxford Short", "SC205M", 24.55, ADULT, { Blue: "HH06341", Red: "MH10125" }),
    P("Women's uniform", "Scottsdale Women's SS Crew Neck jersey", "LS102W-X", 25.15, ADULT, { White: "SH20744", Blue: "FH05082" }),
    P("Women's uniform", "Women's Oxford Short", "SC205W", 24.55, ADULT, { Blue: "SH04790", Red: "AH06194" }),
    P("Boys' uniform", "Scottsdale Boys' SS Crew Neck jersey", "LS102B-X", 25.15, YOUTH, { White: "RG62943", Blue: "GG67522" }),
    P("Boys' uniform", "Boys' Oxford Short", "SC205B", 24.55, YOUTH, { Blue: "PG71390", Red: "MG58831" }),
    P("Girls' uniform", "Scottsdale Girls' SS Crew Neck jersey", "LS102G-X", 25.15, YOUTH, { White: "FG67880", Blue: "WG58920" }),
    P("Girls' uniform", "Girls' Oxford Short", "SC205G", 24.55, YOUTH, { Blue: "QG71667", Red: "KG70242" }),
    P("Socks", "Cambridge Sock", "SC314U", 10.20, ["S", "M", "L"], { White: "GG58697", Blue: "PG56547" }),
    P("Additional items", "104 Seneca jersey", "104", 11.35, SENECA, { Red: "KL06347", White: "DL00749", Grey: "UL09237", "Light blue": "VL00915" }),
    P("Additional items", "108 Wichita goalkeeper jersey", "108", 20.45, "YM YL S M L XL 2XL".split(" "), { Orange: "NL12383", Green: "WL13540" }),
    P("Additional items", "554 Alliance Full Zip Jacket", "554", 30.95, "YS YM YL S M L XL 2XL".split(" "), { Black: "ZL04169" }),
    P("Additional items", "555 Alliance Pants", "555", 30.95, "YS YL S M L XL 2XL".split(" "), { Black: "CL03886" }),
    P("Additional items", "808 Pulsar Backpack", "808", 36.45, ["One size"], { Black: "ZL07093" }),
  ];
})();
