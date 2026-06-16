import React, { useState, useCallback, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');`;

// ─── TRANSLATIONS ──────────────────────────────────────────
const LANG = {
  en: {
    // Header
    appTitle: "Arch Render",
    // Left tabs
    tabBuild: "Build", tabSaved: "Saved", tabHistory: "History", tabCompare: "Compare", tabTheme: "Theme",
    // Sections
    secRenderType: "Render Type", secProgram: "Program Type", secBuildings: "Building Configuration",
    secMaterials: "Materials", secGreenery: "Biophilic Greenery", secUrban: "Urban Setting",
    secNeighbor: "Neighboring Context", secPeople: "People & Activity", secInterior: "Interior Space",
    secBiophilic: "Biophilic Elements", secPlan: "Plan Configuration", secPlanElements: "Plan Elements",
    secSurface: "Surface Materials", secLighting: "Season & Lighting", secCamera: "Camera & Framing",
    secQuality: "Render Quality", secStyleRefs: "Style References", secNegative: "Negative Prompts",
    secWeights: "Section Weights",
    // Fields
    frame: "Frame", glazing: "Glazing", railings: "Railings",
    greeneryTypes: "Greenery Types", greeneryDensity: "Density / Placement",
    location: "Location", streetContext: "Street Context", background: "Background", foreground: "Foreground",
    israeliContext: "Israeli Planning Context",
    adjacentBuildings: "Adjacent Buildings", streetCharacter: "Street Character",
    crowdDensity: "Crowd Density", activityType: "Activity Type",
    spaceType: "Space Type", ceilingHeight: "Ceiling Height", flooring: "Flooring",
    interiorLighting: "Lighting Scheme", intMood: "Mood & Atmosphere",
    planView: "View / Projection", planStyle: "Graphic Style", planFloor: "Floor Level",
    planScale: "Scale", planColorScheme: "Color Scheme", shownElements: "Shown Elements",
    floorFinish: "Floor Finish", wallMaterial: "Wall Material",
    season: "Season / Weather", timeOfDay: "Time of Day", sunAngle: "Sun Angle",
    skyDescription: "Sky Description", shadowPlay: "Dramatic shadow play",
    siteOrientation: "Site Orientation", cameraAngle: "Camera Angle", lens: "Lens",
    tilt: "Tilt", composition: "Composition", dof: "Depth of Field",
    renderer: "Renderer", resolution: "Resolution", aspectRatio: "Aspect Ratio",
    cameraBody: "Camera Body", style: "Style", filmGrain: "Film Grain",
    chromaticAtm: "Chromatic Atmosphere",
    refUrls: "Reference Image URLs", addRef: "⊕ Add Reference",
    // Building config
    buildings: "Buildings", allSame: "All Same", individual: "Individual",
    sharedPodium: "Shared Podium / Base", heightCategory: "Height Category",
    shapeForm: "Shape / Form", facadeLang: "Facade Language",
    buildingLabel: (name) => `Building ${name}`,
    bldgLabel: (name) => `Bldg ${name}`,
    sharedAll: (n) => `Shared — all ${n} building${n > 1 ? "s" : ""}`,
    // Output panel
    platform: "Platform", outputMode: "Mode", generatedPrompt: "Generated Prompt",
    verbose: "Verbose", compact: "Compact", timelapse: "⏱ ×3",
    copyPrompt: "Copy Prompt", copied: "✓ Copied!", exportPDF: "PDF", reset: "Reset",
    shareCode: "Share Code", loadFromCode: "Load from Code", pasteCode: "Paste code...",
    copyCode: "Copy Code", close: "Close", load: "Load", share: "🔗 Share",
    compareA: "→ A", compareB: "→ B",
    promptQuality: "Prompt Quality", qualityBasic: "Basic", qualityGood: "Good",
    qualityDetailed: "Detailed", qualityExpert: "Expert",
    statMode: "Mode", statWords: "Words", statCustom: "Custom",
    nearLimit: " ⚠ Near limit", overLimit: " ✕ Over limit",
    // Saved panel
    templates: "⚡ Templates", savedPresets: "📁 Saved",
    presetName: "Preset name...", save: "Save",
    noPresets: "No saved presets yet. Save your current settings.",
    loadBtn: "Load",
    // History
    nowLabel: "● Now — ", clickToCopy: "Click to copy",
    noHistory: "No history yet. Start editing to track changes.",
    // Compare
    useAB: 'Use "→ A" and "→ B" in the output panel.',
    slotA: "Slot A", slotB: "Slot B", clearBtn: "Clear", empty: "Empty",
    diffLabel: "Diff", identical: "Identical",
    // Theme
    themeTitle: "Theme Factory", themeMode: "Mode", dark: "◑ Dark", light: "☀ Light",
    accentPresets: "Accent Color Presets", customAccent: "Custom Accent Color",
    // Onboarding
    skipBtn: "Skip", nextBtn: "Next →", startBtn: "Start Building ✦",
    addCustomField: "⊕ Add Custom Field",
    labelPlaceholder: "Label", valuePlaceholder: "Value",
    // Location badge
    locationBadge: "📍 Location",
    // Custom fields in section
    customLabel: "Label", customValue: "Value (optional)",
  },
  he: {
    appTitle: "Arch Render",
    tabBuild: "בנייה", tabSaved: "שמורים", tabHistory: "היסטוריה", tabCompare: "השוואה", tabTheme: "ערכת נושא",
    secRenderType: "סוג רנדר", secProgram: "סוג פרוגרמה", secBuildings: "הגדרת בניינים",
    secMaterials: "חומרים", secGreenery: "ירק ביופיליה", secUrban: "הקשר עירוני",
    secNeighbor: "הקשר שכנות", secPeople: "אנשים ופעילות", secInterior: "מרחב פנימי",
    secBiophilic: "אלמנטים ביופיליים", secPlan: "הגדרת תוכנית", secPlanElements: "אלמנטי תוכנית",
    secSurface: "חומרי משטח", secLighting: "עונה ותאורה", secCamera: "מצלמה ופריימינג",
    secQuality: "איכות רנדר", secStyleRefs: "הפניות סגנון", secNegative: "פרומפטים שליליים",
    secWeights: "משקלות סקציות",
    frame: "מסגרת", glazing: "זיגוג", railings: "מעקות",
    greeneryTypes: "סוגי ירק", greeneryDensity: "צפיפות / מיקום",
    location: "מיקום", streetContext: "הקשר רחוב", background: "רקע", foreground: "חזית",
    israeliContext: "הקשר תכנוני ישראלי",
    adjacentBuildings: "בניינים סמוכים", streetCharacter: "אופי הרחוב",
    crowdDensity: "צפיפות אנשים", activityType: "סוג פעילות",
    spaceType: "סוג מרחב", ceilingHeight: "גובה תקרה", flooring: "ריצוף",
    interiorLighting: "תכנית תאורה", intMood: "אווירה ומצב רוח",
    planView: "תצוגה / הקרנה", planStyle: "סגנון גרפי", planFloor: "קומה",
    planScale: "קנה מידה", planColorScheme: "פלטת צבעים", shownElements: "אלמנטים מוצגים",
    floorFinish: "גימור רצפה", wallMaterial: "חומר קיר",
    season: "עונה / מזג אוויר", timeOfDay: "שעה ביום", sunAngle: "זווית שמש",
    skyDescription: "תיאור שמיים", shadowPlay: "משחק צללים דרמטי",
    siteOrientation: "אוריינטציה של האתר", cameraAngle: "זווית מצלמה", lens: "עדשה",
    tilt: "הטיה", composition: "קומפוזיציה", dof: "עומק שדה",
    renderer: "תוכנת רנדר", resolution: "רזולוציה", aspectRatio: "יחס גובה-רוחב",
    cameraBody: "גוף מצלמה", style: "סגנון", filmGrain: "גרעיניות פילם",
    chromaticAtm: "אטמוספרה כרומטית",
    refUrls: "כתובות URL להפניה", addRef: "⊕ הוסף הפניה",
    buildings: "בניינים", allSame: "כולם זהים", individual: "נפרד",
    sharedPodium: "פודיום משותף / בסיס", heightCategory: "קטגוריית גובה",
    shapeForm: "צורה / פורמה", facadeLang: "שפת חזית",
    buildingLabel: (name) => `בניין ${name}`,
    bldgLabel: (name) => `בניין ${name}`,
    sharedAll: (n) => `משותף — ${n} בניינ${n > 1 ? "ים" : ""}`,
    platform: "פלטפורמה", outputMode: "מצב", generatedPrompt: "פרומפט שנוצר",
    verbose: "מלא", compact: "קומפקטי", timelapse: "⏱ ×3",
    copyPrompt: "העתק פרומפט", copied: "✓ הועתק!", exportPDF: "PDF", reset: "איפוס",
    shareCode: "קוד שיתוף", loadFromCode: "טען מקוד", pasteCode: "הדבק קוד...",
    copyCode: "העתק קוד", close: "סגור", load: "טען", share: "🔗 שתף",
    compareA: "→ A", compareB: "→ B",
    promptQuality: "איכות פרומפט", qualityBasic: "בסיסי", qualityGood: "טוב",
    qualityDetailed: "מפורט", qualityExpert: "מומחה",
    statMode: "מצב", statWords: "מילים", statCustom: "מותאם",
    nearLimit: " ⚠ קרוב לגבול", overLimit: " ✕ חרג מגבול",
    templates: "⚡ תבניות", savedPresets: "📁 שמורים",
    presetName: "שם הפריסט...", save: "שמור",
    noPresets: "אין פריסטים שמורים עדיין. שמור את ההגדרות הנוכחיות.",
    loadBtn: "טען",
    nowLabel: "● עכשיו — ", clickToCopy: "לחץ להעתקה",
    noHistory: "אין היסטוריה עדיין. התחל לערוך כדי לעקוב.",
    useAB: 'השתמש ב"→ A" ו"→ B" בפאנל הפלט.',
    slotA: "חריץ A", slotB: "חריץ B", clearBtn: "נקה", empty: "ריק",
    diffLabel: "הבדלים", identical: "זהים",
    themeTitle: "מפעל ערכת נושא", themeMode: "מצב", dark: "◑ כהה", light: "☀ בהיר",
    accentPresets: "פלטת צבעי הדגשה", customAccent: "צבע הדגשה מותאם",
    skipBtn: "דלג", nextBtn: "הבא →", startBtn: "התחל לבנות ✦",
    addCustomField: "⊕ הוסף שדה",
    labelPlaceholder: "תווית", valuePlaceholder: "ערך",
    locationBadge: "📍 מיקום",
    customLabel: "תווית", customValue: "ערך (אופציונלי)",
  }
};


function hexToHsl(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0;
  const l = (max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    if (max === r) h = ((g-b)/d + (g<b?6:0))/6;
    else if (max === g) h = ((b-r)/d + 2)/6;
    else h = ((r-g)/d + 4)/6;
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}
function hslToHex(h,s,l) {
  s /= 100; l /= 100;
  const k = n => (n + h/30) % 12;
  const a = s * Math.min(l, 1-l);
  const f = n => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)));
  const hex = x => Math.round(x*255).toString(16).padStart(2,'0');
  return '#' + hex(f(0)) + hex(f(8)) + hex(f(4));
}
function buildTheme(accent, isDark) {
  const [h, s, l] = hexToHsl(accent);
  const cl = d => Math.min(Math.max(l+d, 8), 94);
  const light   = hslToHex(h, Math.max(s-5,0), cl(14));
  const bright  = hslToHex(h, Math.max(s-10,0), cl(26));
  const bHov    = hslToHex(h, Math.min(s+8,100), cl(18));
  const glow    = 'hsla('+h+','+s+'%,'+l+'%,0.22)';
  const glow2   = 'hsla('+h+','+s+'%,'+l+'%,0.08)';
  if (isDark) return {
    bg:"#050510",surface:"#0D0D1C",surface2:"#111120",card:"#0F0F1F",
    border:"#1E1E3C",borderHover:bHov,purple:accent,purpleLight:light,purpleBright:bright,
    purpleGlow:glow,purpleGlow2:glow2,text:"#ECE8FA",muted:"#6A6585",subtle:"#2A2540",
    inputBg:"#0A0A18",optBg:"#0D0D1C",optHover:"#181830",
    red:"#E05555",green:"#34D399",yellow:"#FBBF24",shadow:"rgba(0,0,0,0.85)",isDark:true
  };
  return {
    bg:hslToHex(h,35,96),surface:"#FFFFFF",surface2:hslToHex(h,28,97),card:"#FDFCFF",
    border:hslToHex(h,32,88),borderHover:light,purple:accent,
    purpleLight:hslToHex(h,Math.min(s+4,100),Math.max(l-10,18)),
    purpleBright:hslToHex(h,Math.min(s+8,100),Math.max(l-5,22)),
    purpleGlow:'hsla('+h+','+s+'%,'+l+'%,0.15)',purpleGlow2:'hsla('+h+','+s+'%,'+l+'%,0.06)',
    text:hslToHex(h,42,11),muted:hslToHex(h,18,46),subtle:hslToHex(h,32,82),
    inputBg:"#FFFFFF",optBg:hslToHex(h,28,97),optHover:hslToHex(h,32,93),
    red:"#C0392B",green:"#059669",yellow:"#D97706",shadow:"rgba(0,0,0,0.08)",isDark:false
  };
}
const ACCENT_PRESETS = [
  {name:"Purple",accent:"#8B5CF6"},{name:"Gold",accent:"#D4A017"},
  {name:"Cyan",accent:"#06B6D4"},{name:"Coral",accent:"#F97316"},
  {name:"Emerald",accent:"#10B981"},{name:"Rose",accent:"#F43F5E"},
];

const HEIGHT_TIERS = {
  low:{label:"Low",floors:"2–5F",icon:"▂▂▂",dark:{color:"#5EEAD4",glow:"rgba(94,234,212,0.18)"},light:{color:"#0D9488",glow:"rgba(13,148,136,0.12)"},shapes:["Compact horizontal form","U-shaped courtyard typology","Flat roofline with rooftop amenity deck","Stepped green rooftop terraces","H-shaped perimeter block","Linear bar building"],facades:["Continuous horizontal louvres with planted balconies","Punched window facade with deep stone reveals","Flush glass with structural grid expression","Textured GRC panel facade","Horizontal brise-soleil fins","Solid-to-void rhythm — 60% solid 40% glass"]},
  medium:{label:"Medium",floors:"6–15F",icon:"▄▄▄",dark:{color:"#A78BFA",glow:"rgba(167,139,250,0.18)"},light:{color:"#7C3AED",glow:"rgba(124,58,237,0.12)"},shapes:["Straight prismatic block","Subtle forward lean","L-shaped with internal courtyard","Setbacks at upper floors creating terraces","Slightly curved plan form","Stepped massing with projecting bays"],facades:["Horizontal banding alternating opaque and transparent","Projecting bay windows with vertical expression","Layered balconies with continuous horizontal railing","Precast concrete grid with deep-set windows","Wave pattern of projecting and recessed bays","Vertical fins every two bays"]},
  high:{label:"High",floors:"16F+",icon:"█▆▄",dark:{color:"#F472B6",glow:"rgba(244,114,182,0.18)"},light:{color:"#DB2777",glow:"rgba(219,39,119,0.12)"},shapes:["Subtle vertical curve","Slight forward lean","S-curve tapering to crown","Twisted facade rotation 5°","Straight prismatic slender tower","Angular setbacks stepping to crown","Tapered — wider at base"],facades:["Deeply articulated floor-slab overhangs with triangular sun-shade fins","Continuous vertical blade fins with deep shadow reveals","Faceted polygonal glass panels with expressed steel joints","Layered horizontal louvres with recessed glazing","Minimal flush curtain wall with shadow-reveal joints","Wave of projecting balcony slabs creating depth"]},
};
const PROGRAM_TYPES = {
  residential:{label:"Residential",icon:"⌂",desc:"Apartments, penthouses, sky amenity floors"},
  office:{label:"Office",icon:"▣",desc:"Corporate HQ, co-working, sky lobbies"},
  hotel:{label:"Hotel",icon:"◈",desc:"Suites, infinity pool deck, sky bar"},
  mixed:{label:"Mixed-Use",icon:"⊞",desc:"Retail, office mid-zone, residential upper floors"},
};
const SEASONS = {
  summer:{label:"Summer ☀",sky:"Deep blue sky, harsh Mediterranean sun, heat haze on horizon",sun:"High noon direct overhead"},
  spring:{label:"Spring 🌿",sky:"Scattered clouds, fresh warm light, slight golden tone",sun:"45° from the left"},
  winter:{label:"Winter 🌥",sky:"Pale overcast sky, soft diffuse light, cool color temperature",sun:"Low 20° from the left — long winter shadows"},
  rainy:{label:"Rain 🌧",sky:"Dark stormy sky, wet reflective pavement, dramatic low clouds",sun:"Backlit contre-jour breaking through storm clouds"},
  dust:{label:"Dust 🟠",sky:"Orange-brown atmospheric haze, dramatic warm diffuse glow",sun:"Diffuse reddish light through dust particles"},
  night:{label:"Night 🌃",sky:"Deep indigo sky, city glow on horizon, interior lights visible",sun:"No sun — building interior lights and street lighting"},
};
const RENDER_MODES = {
  exterior:{label:"Exterior",icon:"🏙",desc:"Facade · street · sky · context"},
  interior:{label:"Interior",icon:"🏠",desc:"Rooms · spaces · materials · light"},
  plan:{label:"Plan / Aerial",icon:"📐",desc:"Top-down · axonometric · bird's eye"},
};
const MODE_PRESETS = {
  exterior:{cameraAngle:"Low street-level perspective",lens:"35mm",tilt:"Slight upward tilt",composition:"Wide-angle hero — all buildings with urban context",renderer:"Unreal Engine 5",resolution:"8K",aspectRatio:"16:9",style:"Award-winning architectural photography",camera:"Hasselblad H6D-400c",filmGrain:true,chromaticAtm:true},
  interior:{cameraAngle:"Eye-level interior — one-point perspective",lens:"24mm",tilt:"Perfectly level — no tilt",composition:"Wide-angle showing full depth of space",renderer:"Enscape",resolution:"8K",aspectRatio:"16:9",style:"Archdaily editorial style",camera:"Sony A7R V",filmGrain:false,chromaticAtm:false},
  plan:{cameraAngle:"True orthographic top-down",lens:"50mm",tilt:"Perfectly level — no tilt",composition:"Tight framing — plan centered with thin margin",renderer:"Chaos V-Ray",resolution:"8K",aspectRatio:"1:1",style:"Archdaily editorial style",camera:"Phase One IQ4 150MP",shadows:true,filmGrain:false,chromaticAtm:false},
};
const PLAN_VIEW_OPTIONS=["True orthographic top-down","Axonometric 45° projection","Isometric 30° projection","Perspective aerial bird's eye","Oblique cavalier — 60°","Exploded axonometric"];
const PLAN_STYLE_OPTIONS=["Hand-drafted ink on white — architectural line weight","Watercolor wash — soft pastel fills","Technical BIM documentation — clean white background","Photorealistic material surfaces — rendered textures","Pastel color-coded program zones","Bold graphic — solid colored fills, minimal line","Pencil sketch — loose expressive lines","Blackline — maximum contrast, minimal gray"];
const PLAN_FLOOR_OPTIONS=["Ground floor — retail, lobby, public realm","Typical residential floor — apartments","Penthouse floor — large units","Roof plan — amenity deck, pools, green roofs","Underground parking level","Site plan — all floors massing","Podium floor — amenities, gym, pool"];
const PLAN_SCALE_OPTIONS=["1:50 — detail plan","1:100 — standard floor plan","1:200 — overview plan","1:500 — site plan","1:1000 — masterplan","Illustrative — no specific scale"];
const PLAN_COLOR_OPTIONS=["Monochrome — black, white, grey only","Warm tones — cream, sand, timber","Cool blues and greys — contemporary","Pastel program zones — color-coded use","Full material realism","Muted minimal — light grey fills","High contrast — dark walls, light floors"];
const PLAN_ELEMENTS=["Furniture layout","Interior trees and plants","Shadow casting (45° sun angle)","North arrow","Scale bar","People silhouettes overhead","Color-coded program zones","Structural grid expressed","Wall section hatching","Outdoor landscaping","Parking layout","Circulation paths highlighted","Door swing arcs","Window glazing expressed","Room labels and areas"];
const INTERIOR_SPACES=["Luxury apartment — open plan living","Penthouse — double-height living","Hotel lobby — grand atrium","Corporate office — open floor","Sky bar — panoramic views","Building lobby — grand reception","Master bedroom suite","Spa — wellness center","Gourmet kitchen","Conference room — executive"];
const CEIL_OPTIONS=["2.7m standard ceiling","3.0m elevated ceiling","3.2m premium ceiling","3.6m loft ceiling","4.5m double height","6m+ dramatic volume"];
const FLOOR_OPTIONS=["Polished concrete","Large-format porcelain tile","Oak engineered timber","Marble — Carrara white","Terrazzo","Dark basalt stone","Limestone slabs","Epoxy resin — light reflective"];
const INT_LIGHT_OPTIONS=["Recessed LED — warm 2700K","Pendant feature lighting","Cove lighting — indirect ambient glow","Natural — floor-to-ceiling windows, direct sun","Dramatic chandelier focal point","Track lighting — gallery style","Mixed — natural + warm artificial"];
const INT_MOOD_OPTIONS=["Calm and serene — minimal","Warm and intimate — evening","Bright and airy — midday sun","Dramatic — high contrast, deep shadows","Luxurious — rich materials and mood lighting","Editorial — cool, magazine quality"];
const PRESETS = {
  podium:["Shared curved glass-and-stone podium with retail and public plaza","Split sunken courtyard podium with water feature","Elevated sky-bridge podium connecting buildings","Stepped terraced podium with rooftop garden","Transparent glass podium with double-height retail atrium","No podium — buildings rise from landscaped ground"],
  frame:["White precast concrete","Off-white GRC panels","Dark charcoal concrete","Travertine stone cladding","Terracotta ceramic panels","Burnished bronze anodized aluminum","Pale limestone"],
  glazing:["Floor-to-ceiling cool blue-silver glass","Warm bronze-tinted low-E glass","Ultra-clear low-iron glass","Dark grey fritted glass","Mirror-finish reflective glass","Acid-etched translucent glass"],
  railings:["Brushed aluminum","Polished stainless steel","Matte black powder-coated steel","Rose gold anodized aluminum","Glass balustrade with minimal steel frame","Corten weathered steel"],
  greeneryDensity:["Every third balcony","Every other balcony","All balconies","Top 30% of floors only","Ground level only","Alternating buildings checkerboard"],
  location:["Ramat Gan, Israel","Tel Aviv beachfront, Israel","Herzliya Pituach, Israel","Jerusalem hills, Israel","Tel Aviv city center, Israel","Petah Tikva, Israel"],
  streetContext:["Dense Israeli urban street context","Open waterfront promenade","Suburban campus setting","Historic city center","Modern business district","Hillside residential neighborhood"],
  background:["Ramat Gan skyline with Tel Aviv towers on horizon","Mediterranean sea on horizon","Lush green hillside","Sprawling city skyline at dusk","Mountain range backdrop","Open desert horizon"],
  foreground:["Wide landscaped boulevard with mature ficus trees, pedestrians, parked cars","Active street with cafés, cyclists and pedestrians","Quiet residential street with parked cars","Reflecting pool in plaza","Children's play area and community garden"],
  cameraAngle:["Low street-level perspective","Eye-level pedestrian view","Elevated 3-point view from across boulevard","Bird's eye 45° aerial","Worm's eye looking straight up","Mid-level symmetrical framing","Eye-level interior — one-point perspective","True orthographic top-down"],
  tilt:["Slight upward tilt","Strong upward tilt — converging verticals","Perfectly level — no tilt","Dutch angle — subtle 5° rotation"],
  composition:["Wide-angle hero — all buildings with urban context","Tight framing on tallest building","Panoramic showing full site","Buildings framed by boulevard tree canopy","Wide-angle showing full depth of space","Tight framing — plan centered with thin margin"],
  skyDescription:["Deep blue Israeli sky with scattered cumulus clouds","Dramatic stormy sky with crepuscular rays","Clear azure sky — no clouds","Pastel golden hour gradient","Twilight — deep indigo to orange","Overcast silver sky — diffuse bright light"],
  renderer:["Chaos V-Ray","Enscape","Lumion","Corona Renderer","3ds Max + Arnold","Unreal Engine 5","Rhino + Cycles","Twinmotion","Revit + V-Ray"],
  camera:["Phase One IQ4 150MP","Hasselblad H6D-400c","Sony A7R V","Canon EOS R5","DJI Mavic 3 Pro (aerial)","Fujifilm GFX 100S"],
  style:["Award-winning architectural photography","Archdaily editorial style","Peter Zumthor monograph photography","ArchViz competition winner","Professional real-estate marketing photography"],
  negativePrompts:["no cars","no people","no scaffolding","no cranes","no lens distortion","no watermarks","no text overlay","no power lines","no oversaturation","no HDR tonemapping","avoid fisheye","avoid excessive lens flare","avoid cartoon style","avoid CGI plastic look"],
  israeliContext:["Tama 38 urban renewal project","YAMA zone — urban densification","National Priority Area","Tel Aviv master plan corridor","Pinui-Binui scheme","Urban renewal committee approval"],
};
const GREENERY_OPTIONS=["Olive trees","Bougainvillea","Climbing vines","Ornamental grasses","Jasmine","Cypress","Lavender","Succulents","Ferns","Bamboo","Agave","Date palms"];
const TIME_OPTIONS=["Golden hour sunrise","Early morning","Midday","Afternoon","Golden hour sunset","Blue hour dusk","Night — artificial lighting"];
const LENS_OPTIONS=["14mm ultra-wide","24mm","28mm","35mm","50mm","85mm","105mm"];
const ASPECT_OPTIONS=["1:1","4:3","3:2","16:9","2.35:1","21:9","9:16 vertical"];
const RES_OPTIONS=["4K","6K","8K","12K","16K"];
const PLATFORMS=[{id:"gemini",label:"Gemini Imagen"},{id:"midjourney",label:"Midjourney"}];
const B_COLORS_DARK=["#A78BFA","#5EEAD4","#60A5FA","#F472B6","#FBBF24","#34D399"];
const B_COLORS_LIGHT=["#7C3AED","#0D9488","#2563EB","#DB2777","#D97706","#059669"];
const B_NAMES=["A","B","C","D","E","F"];
const ORIENTATIONS=["N","NE","E","SE","S","SW","W","NW"];
const SECTION_WEIGHTS_DEF={buildings:1,materials:1,greenery:1,setting:1,lighting:1.2,camera:1,render:1};
const MJ_LIMIT=6000;
const TEMPLATES=[
  {name:"Tama 38 — Tel Aviv",icon:"🏗",tag:"Urban Renewal",desc:"Mid-rise residential renewal",s:{location:"Tel Aviv city center, Israel",streetContext:"Dense Israeli urban street context",background:"Ramat Gan skyline with Tel Aviv towers on horizon",foreground:"Active street with cafés, cyclists and pedestrians",frame:"Off-white GRC panels",glazing:"Warm bronze-tinted low-E glass",railings:"Glass balustrade with minimal steel frame",style:"Archdaily editorial style",cameraAngle:"Eye-level pedestrian view",skyDescription:"Deep blue Israeli sky with scattered cumulus clouds"},buildings:[{id:0,name:"A",tier:"medium",shape:"Straight prismatic block",facade:"Horizontal banding alternating opaque and transparent"}],count:1,season:"spring",israeliCtx:["Tama 38 urban renewal project"],podium:"No podium — buildings rise from landscaped ground",renderMode:"exterior"},
  {name:"Herzliya Pituach Tower",icon:"🌊",tag:"Coastal Luxury",desc:"High-rise luxury, Mediterranean backdrop",s:{location:"Herzliya Pituach, Israel",streetContext:"Open waterfront promenade",background:"Mediterranean sea on horizon",foreground:"Reflecting pool in plaza",frame:"Pale limestone",glazing:"Ultra-clear low-iron glass",railings:"Glass balustrade with minimal steel frame",style:"Award-winning architectural photography",cameraAngle:"Low street-level perspective",skyDescription:"Clear azure sky — no clouds"},buildings:[{id:0,name:"A",tier:"high",shape:"Slight forward lean",facade:"Deeply articulated floor-slab overhangs with triangular sun-shade fins"}],count:1,season:"summer",israeliCtx:["Pinui-Binui scheme"],podium:"Shared curved glass-and-stone podium with retail and public plaza",renderMode:"exterior"},
  {name:"Penthouse Interior",icon:"🛋",tag:"Interior",desc:"Luxury penthouse, double height, Tel Aviv views",s:{spaceType:"Penthouse — double-height living",ceilingHeight:"4.5m double height",flooring:"Marble — Carrara white",interiorLighting:"Natural — floor-to-ceiling windows, direct sun",intMood:"Luxurious — rich materials and mood lighting",location:"Tel Aviv beachfront, Israel",frame:"White precast concrete",glazing:"Ultra-clear low-iron glass",renderer:"Enscape",style:"Archdaily editorial style",cameraAngle:"Eye-level interior — one-point perspective",lens:"24mm",composition:"Wide-angle showing full depth of space",aspectRatio:"16:9"},buildings:[{id:0,name:"A",tier:"high",shape:"Subtle vertical curve",facade:"Minimal flush curtain wall with shadow-reveal joints"}],count:1,season:"summer",israeliCtx:[],podium:"No podium — buildings rise from landscaped ground",renderMode:"interior"},
  {name:"Ground Floor Plan",icon:"📐",tag:"Plan Render",desc:"Watercolor plan render, ground floor",s:{planView:"True orthographic top-down",planStyle:"Watercolor wash — soft pastel fills",planFloor:"Ground floor — retail, lobby, public realm",planScale:"1:100 — standard floor plan",planColorScheme:"Pastel program zones — color-coded use",planElements:["Furniture layout","Shadow casting (45° sun angle)","North arrow","Scale bar","Outdoor landscaping","Color-coded program zones"],location:"Ramat Gan, Israel",renderer:"Chaos V-Ray",resolution:"8K",aspectRatio:"1:1",style:"Archdaily editorial style"},buildings:[{id:0,name:"A",tier:"high",shape:"Straight prismatic slender tower",facade:"Minimal flush curtain wall with shadow-reveal joints"}],count:1,season:"summer",israeliCtx:[],podium:"No podium — buildings rise from landscaped ground",renderMode:"plan"},
  {name:"Ramat Gan Office Hub",icon:"🏢",tag:"Corporate",desc:"Paired glass towers, business district",s:{location:"Ramat Gan, Israel",streetContext:"Modern business district",background:"Ramat Gan skyline with Tel Aviv towers on horizon",foreground:"Wide landscaped boulevard with mature ficus trees, pedestrians, parked cars",frame:"Dark charcoal concrete",glazing:"Mirror-finish reflective glass",railings:"Matte black powder-coated steel",style:"ArchViz competition winner",cameraAngle:"Elevated 3-point view from across boulevard",skyDescription:"Dramatic stormy sky with crepuscular rays"},buildings:[{id:0,name:"A",tier:"high",shape:"Straight prismatic slender tower",facade:"Deeply articulated floor-slab overhangs with triangular sun-shade fins"},{id:1,name:"B",tier:"medium",shape:"Straight prismatic block",facade:"Horizontal banding alternating opaque and transparent"}],count:2,season:"summer",israeliCtx:[],podium:"Transparent glass podium with double-height retail atrium",renderMode:"exterior"},
  {name:"Jerusalem Contextual",icon:"⛪",tag:"Historic",desc:"Limestone-clad, hill setting, historic context",s:{location:"Jerusalem hills, Israel",streetContext:"Historic city center",background:"Mountain range backdrop",foreground:"Quiet residential street with parked cars",frame:"Pale limestone",glazing:"Warm bronze-tinted low-E glass",railings:"Brushed aluminum",style:"Archdaily editorial style",cameraAngle:"Eye-level pedestrian view",skyDescription:"Clear azure sky — no clouds"},buildings:[{id:0,name:"A",tier:"low",shape:"Compact horizontal form",facade:"Punched window facade with deep stone reveals"}],count:1,season:"spring",israeliCtx:[],podium:"No podium — buildings rise from landscaped ground",renderMode:"exterior"},
];

function computeSmartSunAngle(orientation, timeOfDay) {
  if (timeOfDay === "Night — artificial lighting") return "No direct sun — interior lights and street lighting";
  const m = {"Golden hour sunrise":"E","Early morning":"E","Midday":"S","Afternoon":"SW","Golden hour sunset":"W","Blue hour dusk":"W"};
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  const fi = dirs.indexOf(orientation), si = dirs.indexOf(m[timeOfDay] || "S");
  if (fi < 0 || si < 0) return "45° from the left";
  const d = (si - fi + 8) % 8;
  if (d === 0) return "Direct frontlit — sun illuminating main facade";
  if (d === 4) return "Backlit contre-jour — dramatic silhouette";
  if (d === 1 || d === 2) return "45° from the right — warm sidelight";
  if (d === 6 || d === 7) return "45° from the left — dramatic shadow play";
  return "Raking sidelight — long shadows";
}
function computeQuality(s, count, cf, negPr, renderMode) {
  const ext  = [s.greeneryTypes && s.greeneryTypes.length >= 3, Object.values(cf).flat().length > 0, negPr.length >= 3, count > 1, s.dof, s.shadows, s.filmGrain || s.chromaticAtm];
  const intr = [s.spaceType !== "", s.flooring !== "", s.intMood !== "", s.ceilingHeight !== "", negPr.length >= 2];
  const plan = [s.planElements && s.planElements.length >= 4, s.planStyle !== "", s.planColorScheme !== "", s.planScale !== "", s.planFloor !== ""];
  const checks = renderMode === "interior" ? intr : renderMode === "plan" ? plan : ext;
  const pct = (checks.filter(Boolean).length / checks.length) * 100;
  if (pct < 30) return {label:"Basic",  color:"#60A5FA", pct};
  if (pct < 55) return {label:"Good",   color:"#A78BFA", pct};
  if (pct < 75) return {label:"Detailed",color:"#F472B6",pct};
  return {label:"Expert", color:"#34D399", pct};
}
function buildMarkdown(prompt, renderMode, programType, s) {
  const lines = [
    "# Architectural Render Brief","",
    "| Field | Value |","|---|---|",
    "| **Date** | " + new Date().toLocaleDateString() + " |",
    "| **Type** | " + RENDER_MODES[renderMode].label + " |",
    "| **Program** | " + PROGRAM_TYPES[programType].label + " |",
    "| **Location** | " + s.location + " |",
    "| **Renderer** | " + s.renderer + " |",
    "| **Resolution** | " + s.resolution + " |",
    "| **Camera** | " + s.cameraAngle + " |","",
    "## Render Prompt","","```",prompt,"```","","---",
    "*Generated by Arch Render Prompt Builder*",
  ];
  return lines.join("\n");
}

function makeCSS(t) {
  return `
@keyframes fadeIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeSlide{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.subtle};border-radius:4px}
.app{min-height:100vh;background:${t.bg};background-image:${t.isDark?`radial-gradient(ellipse 70% 50% at 50% -5%,${t.purpleGlow} 0%,transparent 65%)`:`radial-gradient(ellipse 70% 50% at 50% -5%,${t.purpleGlow2} 0%,transparent 65%)`};color:${t.text};font-family:'DM Sans',sans-serif;font-weight:300;transition:background .35s,color .35s}
.hdr{padding:11px 22px;display:flex;align-items:center;gap:10px;background:${t.isDark?"rgba(5,5,16,.93)":"rgba(255,255,255,.93)"};backdrop-filter:blur(24px);border-bottom:1px solid ${t.border};position:sticky;top:0;z-index:200;transition:background .35s}
.hdr-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;letter-spacing:.04em;background:linear-gradient(130deg,${t.purpleBright} 0%,${t.purple} 55%,${t.purpleLight} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;flex-shrink:0}
.hdr-badge{font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:${t.purple};border:1px solid ${t.purple};padding:3px 9px;border-radius:20px;background:${t.purpleGlow2};font-family:'Syne',sans-serif;font-weight:600;flex-shrink:0}
.hdr-right{display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap}
.hdr-btn{display:flex;align-items:center;gap:5px;padding:5px 11px;background:${t.purpleGlow2};border:1px solid ${t.border};color:${t.purpleLight};font-family:'DM Sans',sans-serif;font-size:11px;cursor:pointer;transition:all .2s;border-radius:20px;white-space:nowrap}
.hdr-btn:hover{background:${t.purpleGlow};border-color:${t.purple};transform:translateY(-1px)}
.hamburger{background:none;border:1px solid ${t.border};color:${t.muted};padding:6px 10px;border-radius:9px;cursor:pointer;font-size:16px;display:none;align-items:center;justify-content:center;transition:all .2s}
.hamburger:hover{border-color:${t.purple};color:${t.purpleLight}}
.layout{display:grid;grid-template-columns:1fr 415px;min-height:calc(100vh - 47px)}
.drawer-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:298;backdrop-filter:blur(4px)}
.drawer-overlay.show{display:block}
.left{display:flex;flex-direction:column;border-right:1px solid ${t.border};transition:transform .3s ease;background:${t.isDark?"rgba(5,5,14,1)":"rgba(248,246,255,1)"}}
.left-tabs{display:flex;background:${t.isDark?"rgba(5,5,14,.97)":"rgba(248,246,255,.97)"};border-bottom:1px solid ${t.border};padding:0 14px;overflow-x:auto;flex-shrink:0}
.ltab{padding:10px 12px;font-size:9px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;background:transparent;color:${t.muted};border:none;font-family:'Syne',sans-serif;font-weight:600;transition:all .2s;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}
.ltab:hover{color:${t.purpleLight}}.ltab.on{color:${t.purpleLight};border-bottom-color:${t.purple}}
.left-content{padding:18px 20px;overflow-y:auto;flex:1}
.out{padding:14px 13px;display:flex;flex-direction:column;gap:9px;position:sticky;top:47px;height:calc(100vh - 47px);overflow-y:auto;background:${t.isDark?"rgba(5,5,14,.78)":"rgba(248,246,255,.84)"};backdrop-filter:blur(16px);border-left:1px solid ${t.border};transition:background .35s}
.sec{margin-bottom:18px;animation:fadeIn .28s ease}
.sec-hdr{display:flex;align-items:center;gap:8px;margin-bottom:11px;padding-bottom:8px;border-bottom:1px solid ${t.border};cursor:pointer;user-select:none}
.sec-hdr:hover .sec-lbl{color:${t.purpleLight}}
.sec-icon{font-size:12px;opacity:.75;flex-shrink:0}
.sec-lbl{font-family:'Syne',sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${t.purple};font-weight:600;transition:color .2s;flex:none}
.sec-line{flex:1;height:1px;background:linear-gradient(90deg,${t.border},transparent)}
.sec-count{font-size:9px;color:${t.purple};border:1px solid ${t.border};padding:2px 7px;border-radius:10px;background:${t.purpleGlow2}}
.sec-toggle{font-size:12px;color:${t.muted};width:17px;height:17px;display:flex;align-items:center;justify-content:center;background:${t.purpleGlow2};border:1px solid ${t.border};border-radius:5px;flex-shrink:0}
.sec-body{animation:fadeSlide .2s ease}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.of-label{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${t.muted};font-weight:500;font-family:'Syne',sans-serif;margin-bottom:5px}
.of-wrap{display:flex;flex-direction:column;gap:5px}
.of-input,.of-ta{width:100%;background:${t.inputBg};border:1px solid ${t.border};color:${t.text};font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;padding:7px 10px;outline:none;transition:all .2s;border-radius:8px}
.of-input:hover,.of-ta:hover{border-color:${t.borderHover}}
.of-input:focus,.of-ta:focus{border-color:${t.purple};box-shadow:0 0 0 3px ${t.purpleGlow}}
.of-ta{resize:vertical;min-height:50px;line-height:1.55}
.of-opts{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}
.of-opt{padding:4px 10px;font-size:12px;border:1px solid ${t.border};cursor:pointer;transition:all .18s;background:${t.optBg};color:${t.muted};font-family:'DM Sans',sans-serif;border-radius:20px;line-height:1.4}
.of-opt:hover{border-color:${t.purple};color:${t.purpleLight};background:${t.optHover};transform:translateY(-1px)}
.of-opt.picked{background:${t.purpleGlow};border-color:${t.purple};color:${t.purpleBright};font-weight:500}
.chips{display:flex;flex-wrap:wrap;gap:4px}
.chip-wrap{display:inline-flex;align-items:stretch}
.chip{padding:3px 9px;font-size:11px;border:1px solid ${t.border};cursor:pointer;transition:all .18s;background:${t.optBg};color:${t.muted};font-family:'DM Sans',sans-serif;border-radius:20px 0 0 20px;line-height:1.4}
.chip:hover{border-color:${t.purple};color:${t.purpleLight};background:${t.optHover}}
.chip.on{background:${t.purpleGlow};border-color:${t.purple};color:${t.purpleBright};font-weight:500}
.chip-star{background:none;border:1px solid ${t.border};border-left:none;color:${t.muted};font-size:9px;padding:0 6px;cursor:pointer;border-radius:0 20px 20px 0;transition:all .15s}
.chip-star:hover{color:#FBBF24;border-color:#FBBF24}.chip-star.starred{color:#FBBF24;border-color:rgba(251,191,36,.45)}
.chip-p{padding:3px 9px;font-size:11px;border:1px solid ${t.border};cursor:pointer;transition:all .18s;background:${t.optBg};color:${t.muted};font-family:'DM Sans',sans-serif;border-radius:20px;line-height:1.4}
.chip-p:hover{border-color:${t.purple};color:${t.purpleLight};background:${t.optHover}}
.chip-p.on{background:${t.purpleGlow};border-color:${t.purple};color:${t.purpleBright};font-weight:500}
.chips-plain{display:flex;flex-wrap:wrap;gap:4px}
.tog-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid ${t.border}}
.tog-row:last-child{border-bottom:none}
.tog-lbl{font-size:12px;color:${t.text}}
.tog{width:35px;height:18px;background:${t.border};border-radius:9px;cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0}
.tog.on{background:${t.purple};box-shadow:0 0 8px ${t.purpleGlow}}
.tog::after{content:\'\';position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;top:2px;left:2px;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.tog.on::after{transform:translateX(17px)}
.render-mode-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-bottom:14px}
.rm-btn{padding:11px 7px;border:1px solid ${t.border};cursor:pointer;background:${t.surface};font-family:'DM Sans',sans-serif;transition:all .22s;text-align:center;border-radius:11px;position:relative}
.rm-btn:hover{border-color:${t.borderHover};background:${t.purpleGlow2};transform:translateY(-2px)}
.rm-btn.on{border-color:${t.purple};background:${t.purpleGlow2};box-shadow:0 0 16px ${t.purpleGlow};transform:translateY(-2px)}
.rm-icon{font-size:19px;margin-bottom:4px;display:block}
.rm-label{font-size:11px;font-weight:600;color:${t.text};font-family:'Syne',sans-serif;letter-spacing:.05em;margin-bottom:2px}
.rm-desc{font-size:9px;color:${t.muted};line-height:1.35}
.rm-dot{position:absolute;top:7px;right:7px;width:6px;height:6px;border-radius:50%;background:${t.purple};box-shadow:0 0 5px ${t.purpleGlow}}
.prog-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.prog-btn{padding:10px 8px;border:1px solid ${t.border};cursor:pointer;background:${t.surface};font-family:'DM Sans',sans-serif;transition:all .2s;text-align:left;border-radius:10px}
.prog-btn:hover,.prog-btn.on{border-color:${t.purple};background:${t.purpleGlow2};box-shadow:0 0 12px ${t.purpleGlow};transform:translateY(-1px)}
.prog-icon{font-size:15px;margin-bottom:3px;display:block}
.prog-label{font-size:11px;font-weight:500;color:${t.text};font-family:'Syne',sans-serif;letter-spacing:.05em}
.prog-desc{font-size:9px;color:${t.muted};margin-top:2px;line-height:1.35}
.season-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.season-btn{padding:6px 3px;border:1px solid ${t.border};cursor:pointer;background:${t.surface};font-family:'DM Sans',sans-serif;transition:all .2s;text-align:center;border-radius:8px;font-size:11px;color:${t.muted}}
.season-btn:hover{border-color:${t.borderHover};background:${t.purpleGlow2};transform:translateY(-1px)}
.season-btn.on{background:${t.purpleGlow};border-color:${t.purple};color:${t.purpleBright};font-weight:500;transform:translateY(-1px)}
.compass-wrap{display:flex;align-items:center;gap:10px;margin-bottom:11px}
.smart-sun{display:flex;align-items:flex-start;gap:6px;padding:7px 9px;background:${t.purpleGlow2};border:1px solid ${t.border};border-radius:8px;font-size:11px;color:${t.purpleLight};line-height:1.45;flex:1}
.bc-controls{display:flex;align-items:center;gap:7px;margin-bottom:11px;flex-wrap:wrap}
.count-ctrl{display:flex;align-items:center;background:${t.surface};border:1px solid ${t.border};border-radius:10px;overflow:hidden}
.count-lbl{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:${t.muted};padding:6px 9px;border-right:1px solid ${t.border};background:${t.purpleGlow2};white-space:nowrap;font-family:'Syne',sans-serif;font-weight:600}
.count-num{font-family:'Syne',sans-serif;font-size:17px;color:${t.purpleBright};font-weight:700;padding:0 11px;min-width:36px;text-align:center;line-height:1}
.count-step{background:transparent;border:none;color:${t.muted};width:29px;height:32px;cursor:pointer;font-size:15px;transition:all .15s;display:flex;align-items:center;justify-content:center}
.count-step:hover{color:${t.purpleLight};background:${t.purpleGlow2}}
.count-step:first-of-type{border-left:1px solid ${t.border}}.count-step:last-of-type{border-left:1px solid ${t.border}}
.mode-sw{display:flex;border:1px solid ${t.border};border-radius:10px;overflow:hidden;background:${t.surface};margin-left:auto}
.msw-btn{padding:6px 11px;font-size:9px;letter-spacing:.14em;text-transform:uppercase;background:transparent;color:${t.muted};border:none;cursor:pointer;font-family:'Syne',sans-serif;transition:all .18s;font-weight:600}
.msw-btn:not(:last-child){border-right:1px solid ${t.border}}
.msw-btn.on{background:${t.purpleGlow};color:${t.purpleLight}}
.tier-row{display:flex;gap:6px;margin-bottom:10px}
.tier-btn{flex:1;padding:9px 5px;border:1px solid ${t.border};cursor:pointer;background:${t.surface};transition:all .2s;text-align:center;border-radius:10px}
.tier-btn:hover,.tier-btn.on{border-color:var(--tc);background:var(--tglow);box-shadow:0 0 10px var(--tglow);transform:translateY(-1px)}
.tier-icon{font-size:11px;margin-bottom:3px;display:block;color:var(--tc)}
.tier-lbl{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--tc);font-weight:500;font-family:'Syne',sans-serif}
.tier-fl{font-size:9px;color:${t.muted};margin-top:1px}
.b-tabs{display:flex;gap:2px;border-bottom:1px solid ${t.border};flex-wrap:wrap}
.b-tab{padding:6px 11px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;background:transparent;color:${t.muted};border:none;font-family:'Syne',sans-serif;transition:all .2s;border-bottom:2px solid transparent;margin-bottom:-1px;font-weight:600}
.b-tab.on{color:var(--bc);border-bottom-color:var(--bc)}
.b-card{background:${t.card};border:1px solid ${t.border};padding:13px;border-top:2px solid var(--bc);border-radius:0 0 10px 10px;box-shadow:0 4px 14px ${t.shadow}}
.b-dot{width:6px;height:6px;border-radius:50%;background:var(--bc);box-shadow:0 0 5px var(--bc);flex-shrink:0}
.uniform-card{background:${t.card};border:1px solid ${t.border};padding:13px;margin-bottom:10px;border-radius:11px;border-top:2px solid ${t.purple}}
.cf-area{margin-top:8px;padding-top:8px;border-top:1px solid ${t.border}}
.cf-row{display:flex;gap:5px;align-items:center;margin-bottom:5px}
.cf-del{background:none;border:1px solid ${t.border};color:${t.muted};width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;border-radius:6px;transition:all .15s;flex-shrink:0}
.cf-del:hover{border-color:${t.red};color:${t.red}}
.add-btn{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${t.purple};background:${t.purpleGlow2};border:1px dashed ${t.border};padding:5px 9px;cursor:pointer;font-family:'Syne',sans-serif;transition:all .2s;margin-top:6px;border-radius:7px;font-weight:600}
.add-btn:hover{border-color:${t.purple};background:${t.purpleGlow};border-style:solid}
.af-wrap{margin-top:6px;padding:8px;background:${t.surface2};border:1px dashed ${t.border};display:flex;gap:5px;align-items:center;border-radius:8px}
.af-input{background:${t.inputBg};border:1px solid ${t.border};color:${t.text};font-family:'DM Sans',sans-serif;font-size:11px;padding:5px 8px;outline:none;border-radius:7px;transition:border-color .15s}
.af-input:focus{border-color:${t.purple}}
.af-ok{background:${t.purple};border:none;color:#fff;font-family:'Syne',sans-serif;font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:5px 9px;cursor:pointer;border-radius:6px;font-weight:600}
.af-cancel{background:none;border:1px solid ${t.border};color:${t.muted};font-family:'DM Sans',sans-serif;font-size:10px;padding:5px 7px;cursor:pointer;border-radius:6px}
.tpl-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:7px}
.tpl-card{padding:11px 9px;border:1px solid ${t.border};border-radius:10px;background:${t.surface};cursor:pointer;transition:all .2s;text-align:left}
.tpl-card:hover{border-color:${t.purple};background:${t.purpleGlow2};transform:translateY(-2px);box-shadow:0 6px 16px ${t.shadow}}
.tpl-head{display:flex;align-items:flex-start;gap:7px;margin-bottom:4px}
.tpl-icon{font-size:16px;flex-shrink:0}
.tpl-name{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:${t.text};letter-spacing:.04em}
.tpl-tag{font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:${t.purple};border:1px solid ${t.border};padding:2px 6px;border-radius:9px;background:${t.purpleGlow2};font-family:'Syne',sans-serif;font-weight:600;margin-top:3px;display:inline-block}
.tpl-desc{font-size:10px;color:${t.muted};line-height:1.4;margin-top:4px}
.preset-list{display:flex;flex-direction:column;gap:6px;margin-bottom:10px}
.preset-item{display:flex;align-items:center;gap:7px;padding:8px 10px;background:${t.surface};border:1px solid ${t.border};border-radius:8px;transition:all .15s}
.preset-item:hover{border-color:${t.borderHover};background:${t.purpleGlow2};transform:translateX(2px)}
.preset-name{flex:1;font-size:12px;color:${t.text}}
.preset-date{font-size:9px;color:${t.muted};margin-top:1px}
.pact-btn{padding:3px 8px;font-size:9px;border-radius:5px;border:1px solid ${t.border};background:none;color:${t.muted};cursor:pointer;font-family:'Syne',sans-serif;font-weight:600;letter-spacing:.1em;transition:all .15s;text-transform:uppercase}
.pact-btn.load{color:${t.purpleLight};border-color:${t.purple};background:${t.purpleGlow2}}
.pact-btn.load:hover{background:${t.purpleGlow}}
.pact-btn.del:hover{border-color:${t.red};color:${t.red}}
.save-row{display:flex;gap:6px}
.hist-item{padding:8px 10px;background:${t.surface};border:1px solid ${t.border};border-radius:8px;margin-bottom:6px;cursor:pointer;transition:all .15s}
.hist-item:hover{border-color:${t.borderHover};background:${t.purpleGlow2};transform:translateX(2px)}
.hist-time{font-size:9px;color:${t.muted};margin-bottom:3px;font-family:'Syne',sans-serif}
.hist-preview{font-size:11px;color:${t.text};overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.5}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.compare-slot{border:1px solid ${t.border};border-radius:8px;overflow:hidden}
.compare-slot-hdr{padding:7px 10px;background:${t.surface2};border-bottom:1px solid ${t.border};display:flex;align-items:center;justify-content:space-between}
.compare-slot-lbl{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:${t.purple};font-family:'Syne',sans-serif;font-weight:600}
.compare-text{padding:9px 10px;font-size:10px;line-height:1.7;color:${t.text};white-space:pre-wrap;max-height:220px;overflow-y:auto;background:${t.bg};font-family:'DM Sans',sans-serif}
.compare-empty{padding:16px;text-align:center;color:${t.muted};font-size:11px}
.diff-add{background:rgba(94,234,212,.1);color:#5EEAD4;padding:1px 3px;border-radius:3px}
.diff-remove{background:rgba(224,85,85,.1);color:${t.red};text-decoration:line-through;padding:1px 3px;border-radius:3px}
.out-lbl{font-family:'Syne',sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:${t.purple};font-weight:600}
.ptabs{display:flex;border:1px solid ${t.border};border-radius:8px;overflow:hidden;background:${t.surface}}
.ptab{flex:1;padding:7px 4px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;text-align:center;cursor:pointer;background:transparent;color:${t.muted};border:none;font-family:'Syne',sans-serif;transition:all .2s;border-right:1px solid ${t.border};font-weight:600}
.ptab:last-child{border-right:none}.ptab.on{background:${t.purpleGlow};color:${t.purpleLight}}
.out-toggles{display:flex;gap:5px;flex-wrap:wrap}
.out-tog{padding:4px 10px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;border:1px solid ${t.border};background:${t.surface};color:${t.muted};cursor:pointer;font-family:'Syne',sans-serif;font-weight:600;border-radius:20px;transition:all .18s}
.out-tog:hover{border-color:${t.borderHover};color:${t.purpleLight}}
.out-tog.on{background:${t.purpleGlow};border-color:${t.purple};color:${t.purpleLight}}
.prompt-box{background:${t.isDark?"rgba(5,5,16,.92)":"rgba(252,250,255,.95)"};border:1px solid ${t.border};padding:11px;font-size:11.5px;line-height:1.85;color:${t.text};flex:1;overflow-y:auto;font-family:'DM Sans',sans-serif;font-weight:300;white-space:pre-wrap;border-radius:8px;min-height:100px;transition:border-color .2s}
.prompt-box:hover{border-color:${t.borderHover}}
.token-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:3px}
.token-track{height:2px;background:${t.border};border-radius:2px;overflow:hidden}
.token-fill{height:100%;border-radius:2px;transition:width .3s,background .3s}
.quality-wrap{display:flex;flex-direction:column;gap:4px}
.quality-row{display:flex;align-items:center;justify-content:space-between}
.quality-track{height:2px;background:${t.border};border-radius:2px;overflow:hidden}
.quality-fill{height:100%;border-radius:2px;transition:width .55s,background .55s}
.tl-wrap{display:flex;flex-direction:column;gap:6px}
.tl-item{background:${t.isDark?"rgba(5,5,16,.88)":"rgba(252,250,255,.95)"};border:1px solid ${t.border};border-radius:8px;overflow:hidden}
.tl-hdr{padding:6px 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${t.border};background:${t.surface2}}
.tl-lbl{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${t.purple};font-family:'Syne',sans-serif;font-weight:600}
.tl-body{padding:8px 10px;font-size:11px;line-height:1.7;color:${t.text};white-space:pre-wrap;max-height:85px;overflow-y:auto;font-family:'DM Sans',sans-serif}
.ai-panel{border:1px solid ${t.border};border-radius:8px;overflow:hidden}
.ai-tabs{display:flex;border-bottom:1px solid ${t.border};background:${t.surface2}}
.ai-tab{flex:1;padding:7px 3px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;background:transparent;color:${t.muted};border:none;border-right:1px solid ${t.border};cursor:pointer;font-family:'Syne',sans-serif;font-weight:600;transition:all .2s}
.ai-tab:last-child{border-right:none}.ai-tab.on{background:${t.purpleGlow};color:${t.purpleLight}}
.ai-body{padding:10px}
.ai-desc{font-size:11px;color:${t.muted};margin-bottom:8px;line-height:1.5}
.var-card{margin-bottom:6px;border:1px solid ${t.border};border-radius:7px;overflow:hidden}
.var-card:hover{border-color:${t.borderHover}}
.var-hdr{padding:5px 9px;background:${t.surface2};display:flex;justify-content:space-between;align-items:center}
.var-lbl{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${t.purple};font-family:'Syne',sans-serif;font-weight:600}
.var-body{padding:7px 9px;font-size:11px;line-height:1.6;color:${t.text};max-height:70px;overflow-y:auto;font-family:'DM Sans',sans-serif}
.ai-result-box{font-size:11.5px;line-height:1.7;color:${t.text};background:${t.surface};border:1px solid ${t.border};border-radius:7px;padding:9px;white-space:pre-wrap;max-height:160px;overflow-y:auto;font-family:'DM Sans',sans-serif}
.loading-spin{width:18px;height:18px;border:2px solid ${t.border};border-top-color:${t.purple};border-radius:50%;animation:spin 1s linear infinite}
.share-panel{background:${t.surface};border:1px solid ${t.border};border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:6px}
.share-code-box{background:${t.inputBg};border:1px solid ${t.border};border-radius:6px;padding:6px 8px;font-size:9px;word-break:break-all;color:${t.muted};font-family:monospace;max-height:42px;overflow:auto}
.btn-row{display:flex;gap:5px}
.btn{flex:1;padding:8px 4px;font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;font-family:'Syne',sans-serif;font-weight:700;transition:all .2s;border:none;border-radius:8px}
.btn-p{background:linear-gradient(135deg,${t.purple} 0%,${t.purpleLight} 100%);color:#fff;box-shadow:0 4px 12px ${t.purpleGlow}}
.btn-p:hover{box-shadow:0 6px 18px ${t.purpleGlow};transform:translateY(-2px)}.btn-p:active{transform:translateY(0)}
.btn-s{background:${t.purpleGlow2};border:1px solid ${t.border};color:${t.muted}}
.btn-s:hover{border-color:${t.purple};color:${t.purpleLight};background:${t.purpleGlow};transform:translateY(-1px)}
.btn-sm{padding:5px 9px;font-size:9px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;font-family:'Syne',sans-serif;font-weight:700;transition:all .2s;border-radius:7px;background:${t.purpleGlow2};border:1px solid ${t.border};color:${t.muted}}
.btn-sm:hover{border-color:${t.purple};color:${t.purpleLight};transform:translateY(-1px)}
.btn-sm.active{background:${t.purple};color:#fff;border-color:${t.purple}}
.copied-msg{font-size:9px;letter-spacing:.16em;color:${t.purple};text-align:center;height:11px;font-family:'Syne',sans-serif;font-weight:600}
.stats{display:flex;gap:5px;border-top:1px solid ${t.border};padding-top:7px}
.stat-card{flex:1;padding:6px 7px;background:${t.purpleGlow2};border:1px solid ${t.border};border-radius:8px;text-align:center;transition:all .2s}
.stat-card:hover{border-color:${t.borderHover};background:${t.purpleGlow}}
.stat-v{font-family:'Syne',sans-serif;font-size:17px;color:${t.purpleBright};font-weight:700;line-height:1}
.stat-l{font-size:8px;color:${t.muted};letter-spacing:.14em;text-transform:uppercase;margin-top:2px;font-family:'Syne',sans-serif;font-weight:600}
.g-badge{display:inline-flex;align-items:center;gap:5px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:${t.muted};background:${t.purpleGlow2};border:1px solid ${t.border};padding:3px 8px;margin-top:4px;border-radius:20px;font-family:'Syne',sans-serif;font-weight:600}
.g-dot{width:6px;height:6px;border-radius:50%;background:conic-gradient(#4285F4 0deg 90deg,#34A853 90deg 180deg,#FBBC05 180deg 270deg,#EA4335 270deg 360deg)}
.weight-row{display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid ${t.border}}
.weight-row:last-child{border-bottom:none}
.weight-lbl{font-size:11px;color:${t.text};width:80px;flex-shrink:0;text-transform:capitalize}
.weight-slider{flex:1;-webkit-appearance:none;height:3px;background:${t.border};border-radius:2px;outline:none;border:none;background-image:linear-gradient(${t.purple},${t.purple});background-size:var(--pct) 100%;background-repeat:no-repeat}
.weight-slider::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:${t.purple};cursor:pointer;box-shadow:0 0 5px ${t.purpleGlow}}
.weight-val{font-size:11px;color:${t.purpleLight};width:22px;text-align:right;font-family:'Syne',sans-serif;font-weight:600}
.empty-state{padding:22px 12px;text-align:center;color:${t.muted};font-size:12px;font-family:'DM Sans',sans-serif;line-height:1.65}
.empty-icon{font-size:24px;margin-bottom:7px;opacity:.45}
.tf-swatch{width:32px;height:32px;border-radius:8px;cursor:pointer;border:3px solid transparent;transition:all .2s;flex-shrink:0}
.tf-swatch:hover{transform:scale(1.1)}.tf-swatch.on{border-color:#fff;box-shadow:0 0 10px rgba(255,255,255,.4)}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
.modal{background:${t.surface};border:1px solid ${t.border};border-radius:16px;padding:28px;max-width:460px;width:90%;animation:modalIn .25s ease;position:relative}
.modal-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:${t.purpleBright};margin-bottom:7px;background:linear-gradient(130deg,${t.purpleBright},${t.purpleLight});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.modal-sub{font-size:13px;color:${t.muted};margin-bottom:20px;line-height:1.6}
.modal-step{display:flex;gap:12px;align-items:flex-start;padding:12px;background:${t.purpleGlow2};border:1px solid ${t.border};border-radius:10px;margin-bottom:10px}
.modal-step-num{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:${t.purple};flex-shrink:0;width:28px}
.modal-step-text{font-size:12px;color:${t.text};line-height:1.5}
.modal-step-title{font-family:'Syne',sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${t.purpleLight};margin-bottom:3px;font-weight:600}
.tooltip{position:relative;display:inline-block}
.tooltip-text{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:${t.card};border:1px solid ${t.border};color:${t.text};font-size:10px;padding:5px 9px;border-radius:7px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s;z-index:100;font-family:'DM Sans',sans-serif;box-shadow:0 4px 12px ${t.shadow}}
.tooltip:hover .tooltip-text{opacity:1}
@media (max-width:860px){
  .hdr-badge{display:none}
  .hamburger{display:flex}
  .hdr-btn.desktop-only{display:none}
  .layout{grid-template-columns:1fr}
  .left{position:fixed;top:0;left:0;width:82vw;max-width:380px;height:100vh;z-index:299;transform:translateX(-100%)}
  .left.open{transform:translateX(0)}
  .out{position:static;height:auto;max-height:none;border-left:none;border-top:1px solid ${t.border}}
  .modal{width:95%;padding:20px}
}
`;
}

function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const steps = [
    {title:"Welcome to Arch Render Prompt Builder",sub:"The professional AI prompt generator for Israeli architectural visualization. Build photorealistic render prompts in seconds.",items:[{n:"1",title:"Pick your render type",text:"Exterior (facade + street), Interior (rooms + spaces), or Plan (top-down architectural drawing)"},{n:"2",title:"Configure your project",text:"Buildings, materials, lighting, season, camera angle — with smart Israeli context built in"},{n:"3",title:"Generate & refine with AI",text:"Use AI Variations, Critic, and Brief tools to polish your output"}]},
    {title:"Three Render Modes",sub:"Each mode auto-applies optimized settings and generates a distinct prompt structure.",items:[{n:"🏙",title:"Exterior",text:"Street-level or aerial facade renders. Smart compass auto-calculates sun direction based on building orientation."},{n:"🏠",title:"Interior",text:"Room, lobby, penthouse, or sky bar renders. Controls for ceiling height, flooring, lighting mood, and biophilic elements."},{n:"📐",title:"Plan / Aerial",text:"Orthographic, axonometric, or watercolor plan renders. Choose floor level, graphic style, scale, and shown elements."}]},
  ];
  const current = steps[step];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{current.title}</div>
        <div className="modal-sub">{current.sub}</div>
        {current.items.map((item, i) => (
          <div key={i} className="modal-step">
            <div className="modal-step-num">{item.n}</div>
            <div><div className="modal-step-title">{item.title}</div><div className="modal-step-text">{item.text}</div></div>
          </div>
        ))}
        <div style={{display:"flex", gap:8, marginTop:18, alignItems:"center"}}>
          <div style={{display:"flex", gap:5}}>
            {steps.map((_,i) => (<div key={i} style={{width: i===step?18:6, height:6, borderRadius:3, background: i===step?"#8B5CF6":"#2A2540", transition:"all .2s"}}/>))}
          </div>
          <div style={{marginLeft:"auto", display:"flex", gap:7}}>
            <button className="btn-sm" onClick={onClose}>Skip</button>
            {step < steps.length - 1
              ? <button className="btn-sm active" onClick={() => setStep(s => s+1)}>Next →</button>
              : <button className="btn-sm active" onClick={onClose}>Start Building ✦</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeFactoryPanel({ accent, setAccent, isDark, setIsDark, tr }) {
  return (
    <div>
      <div className="sec-hdr" style={{cursor:"default", marginBottom:14}}><span className="sec-icon">🎨</span><span className="sec-lbl">{tr.themeTitle}</span><span className="sec-line"/></div>
      <div className="sec">
        <div className="of-label" style={{marginBottom:10}}>{tr.themeMode}</div>
        <div style={{display:"flex", gap:7, marginBottom:18}}>
          <button className={"btn-sm"+(isDark?" active":"")} style={{flex:1}} onClick={() => setIsDark(true)}>{tr.dark}</button>
          <button className={"btn-sm"+(!isDark?" active":"")} style={{flex:1}} onClick={() => setIsDark(false)}>{tr.light}</button>
        </div>
        <div className="of-label" style={{marginBottom:10}}>{tr.accentPresets}</div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:16}}>
          {ACCENT_PRESETS.map(p => (
            <div key={p.name} className="tooltip">
              <div className={"tf-swatch"+(accent===p.accent?" on":"")} style={{background:p.accent}} onClick={() => setAccent(p.accent)}/>
              <span className="tooltip-text">{p.name}</span>
            </div>
          ))}
        </div>
        <div className="of-label" style={{marginBottom:8}}>{tr.customAccent}</div>
        <div style={{display:"flex", gap:9, alignItems:"center"}}>
          <input type="color" value={accent} onChange={e => setAccent(e.target.value)} style={{width:44, height:38, border:"1px solid var(--bdr)", borderRadius:8, cursor:"pointer", padding:2, background:"none"}}/>
          <input className="of-input" value={accent} onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setAccent(e.target.value); }} style={{flex:1, fontFamily:"monospace", fontSize:13}} placeholder="#8B5CF6"/>
        </div>
      </div>
    </div>
  );
}

function OptionField({ label, value, onChange, options, multiline, fullRow }) {
  const opts = options || [];
  return (
    <div className="of-wrap" style={{gridColumn: fullRow ? "1/-1" : undefined}}>
      {label && <div className="of-label">{label}</div>}
      {multiline ? <textarea className="of-ta" value={value} onChange={e => onChange(e.target.value)} /> : <input className="of-input" value={value} onChange={e => onChange(e.target.value)} />}
      {opts.length > 0 && (<div className="of-opts">{opts.map((o, i) => (<button key={i} className={"of-opt" + (value === o ? " picked" : "")} onClick={() => onChange(value === o ? "" : o)}>{o}</button>))}</div>)}
    </div>
  );
}
function PinnableChips({ field, options, value, onChange, pins, togglePin }) {
  const pinned = pins[field] || [];
  const sorted = [...pinned.filter(p => options.includes(p)), ...options.filter(o => !pinned.includes(o))];
  return (
    <div className="chips">
      {sorted.map(o => {
        const on = value.includes(o), pin = pinned.includes(o);
        return (<span key={o} className="chip-wrap"><button className={"chip" + (on ? " on" : "")} onClick={() => onChange(on ? value.filter(x => x !== o) : [...value, o])}>{pin && <span style={{marginRight:3,fontSize:8}}>★</span>}{o}</button><button className={"chip-star" + (pin ? " starred" : "")} onClick={() => togglePin(field, o)}>{pin ? "★" : "☆"}</button></span>);
      })}
    </div>
  );
}
function PlainChips({ options, value, onChange }) {
  return (<div className="chips-plain">{options.map(o => (<button key={o} className={"chip-p" + (value.includes(o) ? " on" : "")} onClick={() => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o])}>{o}</button>))}</div>);
}
function Toggle({ v, set }) { return (<button className={"tog" + (v ? " on" : "")} onClick={() => set(!v)} />); }
let uid = 0;
function CustomFields({ fields, onChange }) {
  const [lbl, setLbl] = useState(""), [val, setVal] = useState("");
  const addNew = () => { if (!lbl.trim()) return; onChange([...fields, {id: ++uid, label: lbl.trim(), value: val}]); setLbl(""); setVal(""); };
  const upd = (id, k, v) => onChange(fields.map(f => f.id === id ? {...f, [k]: v} : f));
  return (
    <div className="cf-area">
      {fields.map(f => (<div key={f.id} className="cf-row"><input className="of-input" style={{width:90,flexShrink:0}} value={f.label} onChange={e => upd(f.id,"label",e.target.value)} placeholder="Label"/><input className="of-input" style={{flex:1}} value={f.value} onChange={e => upd(f.id,"value",e.target.value)} placeholder="Value"/><button className="cf-del" onClick={() => onChange(fields.filter(x => x.id !== f.id))}>×</button></div>))}
      <div className="af-wrap">
        <input className="af-input" style={{width:85}} placeholder="Label" value={lbl} onChange={e => setLbl(e.target.value)} onKeyDown={e => e.key==="Enter" && addNew()}/>
        <input className="af-input" style={{flex:1}} placeholder="Value (optional)" value={val} onChange={e => { setVal(e.target.value); }} onBlur={addNew} onKeyDown={e => e.key==="Enter" && addNew()}/>
        <button className="af-ok" onClick={addNew}>+</button>
      </div>
    </div>
  );
}
function Section({ label, icon, cfKey, cf, setCF, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen !== false);
  const count = (cf[cfKey] || []).length;
  return (
    <div className="sec">
      <div className="sec-hdr" onClick={() => setOpen(p => !p)}>{icon && <span className="sec-icon">{icon}</span>}<span className="sec-lbl">{label}</span><span className="sec-line"/>{count > 0 && <span className="sec-count">+{count}</span>}<span className="sec-toggle">{open ? "−" : "+"}</span></div>
      {open && (<div className="sec-body">{children}<CustomFields fields={cf[cfKey] || []} onChange={v => setCF(p => ({...p, [cfKey]: v}))}/></div>)}
    </div>
  );
}
function Collapsible({ label, icon, children }) {
  const [open, setOpen] = useState(false);
  return (<div className="sec"><div className="sec-hdr" onClick={() => setOpen(p => !p)}>{icon && <span className="sec-icon">{icon}</span>}<span className="sec-lbl">{label}</span><span className="sec-line"/><span className="sec-toggle">{open ? "−" : "+"}</span></div>{open && <div className="sec-body">{children}</div>}</div>);
}
function CompassRose({ orientation, onChange, t }) {
  const cx = 55, cy = 55, r = 42;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" style={{flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r} fill={t.surface} stroke={t.border} strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={r-14} fill="none" stroke={t.border} strokeWidth="1" strokeDasharray="2,5"/>
      {ORIENTATIONS.map((d, i) => {
        const a = (i*45-90)*Math.PI/180;
        const xo = cx+(r-9)*Math.cos(a), yo = cy+(r-9)*Math.sin(a);
        const on = orientation === d, pri = ["N","E","S","W"].includes(d);
        return (<g key={d} onClick={() => onChange(d)} style={{cursor:"pointer"}}><circle cx={xo} cy={yo} r={pri?9:7} fill={on?t.purple:t.optBg} stroke={on?t.purple:t.border} strokeWidth="1.5"/><text x={xo} y={yo} textAnchor="middle" dominantBaseline="middle" fill={on?"#fff":t.muted} fontSize={pri?"9":"8"} fontFamily="Syne,sans-serif" fontWeight="600">{d}</text></g>);
      })}
      <polygon points={(cx)+","+(cy-15)+" "+(cx-3)+","+(cy-6)+" "+(cx)+","+(cy-2)+" "+(cx+3)+","+(cy-6)} fill={t.purple} opacity=".9" transform={"rotate("+(ORIENTATIONS.indexOf(orientation)*45)+","+cx+","+cy+")"} style={{transition:"transform .3s ease"}}/>
      <circle cx={cx} cy={cy} r={3} fill={t.purpleLight}/>
    </svg>
  );
}
function TierSelector({ value, onChange, isDark }) {
  return (<div className="tier-row">{Object.entries(HEIGHT_TIERS).map(([k, tier]) => { const tc = tier[isDark ? "dark" : "light"]; return (<button key={k} className={"tier-btn" + (value === k ? " on" : "")} style={{"--tc":tc.color,"--tglow":tc.glow}} onClick={() => onChange(k)}><span className="tier-icon">{tier.icon}</span><div className="tier-lbl">{tier.label}</div><div className="tier-fl">{tier.floors}</div></button>); })}</div>);
}
function BuildingForm({ b, onChange, isDark }) {
  const tier = HEIGHT_TIERS[b.tier];
  const setTier = tt => onChange({...b, tier:tt, shape:HEIGHT_TIERS[tt].shapes[0], facade:HEIGHT_TIERS[tt].facades[0]});
  return (<div style={{display:"flex", flexDirection:"column", gap:10}}><div><div className="of-label" style={{marginBottom:7}}>{tr.heightCategory}</div><TierSelector value={b.tier} onChange={setTier} isDark={isDark}/></div><OptionField label={tr.shapeForm} value={b.shape} onChange={v => onChange({...b, shape:v})} options={tier.shapes}/><OptionField label={tr.facadeLang} value={b.facade} onChange={v => onChange({...b, facade:v})} options={tier.facades} multiline/></div>);
}
const defBldg = i => ({id:i, name:B_NAMES[i], tier:"high", shape:HEIGHT_TIERS.high.shapes[0], facade:HEIGHT_TIERS.high.facades[0]});
function BuildingConfig({ buildings, setBuildings, count, setCount, mode, setMode, podium, setPodium, cf, setCF, isDark, t }) {
  const [activeTab, setActiveTab] = useState(0);
  const [uniform, setUniform] = useState(defBldg(0));
  const BCOLS = isDark ? B_COLORS_DARK : B_COLORS_LIGHT;
  const updateCount = n => { const c = Math.max(1, Math.min(6, n)); if (c > count) setBuildings(p => [...p, ...Array.from({length:c-count}, (_,i) => defBldg(count+i))]); else setBuildings(p => p.slice(0, c)); setCount(c); setActiveTab(tab => Math.min(tab, c-1)); };
  return (
    <div className="sec">
      <div className="sec-hdr" style={{cursor:"default"}}><span className="sec-icon">🏢</span><span className="sec-lbl">{tr.secBuildings}</span><span className="sec-line"/></div>
      <div className="bc-controls">
        <div className="count-ctrl"><span className="count-lbl">{tr.buildings}</span><button className="count-step" onClick={() => updateCount(count-1)}>−</button><span className="count-num">{count}</span><button className="count-step" onClick={() => updateCount(count+1)}>+</button></div>
        <div className="mode-sw"><button className={"msw-btn" + (mode==="all"?" on":"")} onClick={() => setMode("all")}>{tr.allSame}</button><button className={"msw-btn" + (mode==="individual"?" on":"")} onClick={() => setMode("individual")}>{tr.individual}</button></div>
      </div>
      {mode === "all" && (<div className="uniform-card"><div className="of-label" style={{marginBottom:8}}>Shared — all {count} building{count>1?"s":""}</div><BuildingForm b={uniform} onChange={b => { setUniform(b); setBuildings(p => p.map(x => ({...x, tier:b.tier, shape:b.shape, facade:b.facade}))); }} isDark={isDark}/></div>)}
      {mode === "individual" && (<div style={{marginBottom:10}}><div className="b-tabs">{buildings.map((b, i) => (<button key={b.id} className={"b-tab" + (activeTab===i?" on":"")} style={{"--bc":BCOLS[i]}} onClick={() => setActiveTab(i)}>Bldg {b.name}</button>))}</div>{buildings.map((b, i) => (<div key={b.id} style={{display: activeTab===i?"block":"none"}}><div className="b-card" style={{"--bc":BCOLS[i]}}><div style={{display:"flex", alignItems:"center", gap:7, marginBottom:10}}><span className="b-dot" style={{"--bc":BCOLS[i]}}/><span style={{fontFamily:"'Syne',sans-serif", fontSize:10, letterSpacing:".16em", textTransform:"uppercase", color:BCOLS[i], fontWeight:600}}>Building {b.name}</span></div><BuildingForm b={b} onChange={v => setBuildings(p => p.map((x,j) => j===i?v:x))} isDark={isDark}/></div></div>))}</div>)}
      <OptionField label={tr.sharedPodium} value={podium} onChange={setPodium} options={PRESETS.podium}/>
      <CustomFields fields={cf.buildings||[]} onChange={v => setCF(p => ({...p, buildings:v}))}/>
    </div>
  );
}
function AIPanel({ prompt, t, programType, location }) {
  const [tab, setTab] = useState("var");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const AI_TABS = [{id:"var",label:"✦ Vary"},{id:"critic",label:"◎ Critic"},{id:"brief",label:"✉ Brief"},{id:"preview",label:"🖼 Preview"}];
  const AI_DESCS = {var:"3 style variations: cinematic, minimal, editorial.",critic:"Find contradictions, gaps, and improvements.",brief:"Professional brief in English + Hebrew.",preview:"Vivid description of the expected AI render output."};
  const call = async () => {
    setLoading(true); setResult(null);
    let content = "";
    if (tab === "var") content = "You are an expert architectural visualization prompt writer. Generate 3 distinct variations. Return ONLY valid JSON, no markdown:\n{\"variations\":[{\"label\":\"Cinematic Dramatic\",\"prompt\":\"...\"},{\"label\":\"Minimal Clean\",\"prompt\":\"...\"},{\"label\":\"Editorial Natural\",\"prompt\":\"...\"}]}\n\nBase:\n" + prompt;
    else if (tab === "critic") content = "You are an AI image generation expert for architectural visualization. Analyze this prompt for contradictions, missing details, and give 3 specific improvements. Be direct and concise.\n\nPrompt:\n" + prompt;
    else if (tab === "brief") content = "Write a professional architectural project brief in BOTH English (2 paragraphs) and Hebrew (2 paragraphs). Professional AEC language for Israeli market.\n\nProject: " + programType + ", " + location + "\n\n" + prompt.slice(0, 600);
    else content = "You are an expert architectural visualization renderer. Based on this render prompt, write a vivid, photorealistic 120-word description of what the AI-generated image would actually look like — describe lighting quality, material textures, spatial depth, color palette, atmosphere, and composition. Write in present tense, no preamble.\n\nPrompt:\n" + prompt.slice(0, 800);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content}]})});
      const data = await resp.json();
      const text = (data.content && data.content[0] && data.content[0].text) || "No response";
      if (tab === "var") { try { const parsed = JSON.parse(text.replace(/```json|```/g,"").trim()); setResult({type:"var", variations: parsed.variations}); } catch (e) { setResult({type:"text", text}); } }
      else setResult({type:"text", text});
    } catch (e) { setResult({type:"text", text:"Connection error. Please try again."}); }
    setLoading(false);
  };
  return (
    <div className="ai-panel">
      <div className="ai-tabs">{AI_TABS.map(({id, label}) => (<button key={id} className={"ai-tab" + (tab===id?" on":"")} onClick={() => { setTab(id); setResult(null); }}>{label}</button>))}</div>
      <div className="ai-body">
        <div className="ai-desc">{AI_DESCS[tab]}</div>
        <button className="btn btn-p" style={{width:"100%", marginBottom: (loading||result)?"8px":0}} onClick={call} disabled={loading}>
          {loading ? <span style={{display:"flex", alignItems:"center", justifyContent:"center", gap:8}}><span className="loading-spin"/>Generating...</span> : tab==="var" ? "Generate Variations" : tab==="critic" ? "Analyze Prompt" : tab==="brief" ? "Generate Brief" : "Describe Render"}
        </button>
        {result && !loading && (result.type === "var" && result.variations
          ? result.variations.map((v, i) => (<div key={i} className="var-card"><div className="var-hdr"><span className="var-lbl">{v.label}</span><button className="btn-sm" onClick={() => navigator.clipboard.writeText(v.prompt)} style={{padding:"2px 7px",fontSize:"8px"}}>Copy</button></div><div className="var-body">{v.prompt}</div></div>))
          : <div className="ai-result-box">{result.text}</div>)}
      </div>
    </div>
  );
}
const SEC_COLORS = [["BUILDINGS","#F472B6"],["MATERIALS","#5EEAD4"],["BIOPHILIC","#34D399"],["PLAN VIEW","#FB923C"],["INTERIOR SPACE","#FB923C"],["URBAN SETTING","#60A5FA"],["LIGHTING","#FBBF24"],["CAMERA","#A78BFA"],["RENDER","#F97316"],["NEIGHBORING","#38BDF8"],["STREET ACTIVITY","#A3E635"],["NEGATIVE","#E05555"],["COLOR &","#5EEAD4"],["SHADOW","#FBBF24"],["PROGRAM","#A78BFA"]];
function ColorPrompt({ prompt, t }) {
  let cc = t.muted;
  return (<div className="prompt-box">{prompt.split("\n").map((line, i) => { const m = SEC_COLORS.find(([k]) => line.startsWith(k)); if (m) cc = m[1]; const hdr = !!m; return (<div key={i} style={{color: hdr ? cc : (line.startsWith("--") || line.startsWith("NEGATIVE")) ? "#E05555" : t.text, fontFamily: hdr ? "'Syne',sans-serif" : "'DM Sans',sans-serif", fontWeight: hdr ? 600 : 300, fontSize: hdr ? "10px" : "11.5px", letterSpacing: hdr ? ".2em" : "normal", textTransform: hdr ? "uppercase" : "none", paddingLeft: "8px", borderLeft: hdr ? "2px solid " + cc : "2px solid transparent", marginTop: hdr ? "10px" : 0, lineHeight: "1.85"}}>{line || "\u00A0"}</div>); })}</div>);
}
function SavedPanel({ applyTemplate, getSnapshot, applySnapshot, tr }) {
  const [presets, setPresets] = useState(() => {
    try { return JSON.parse(localStorage.getItem("arch-render-presets") || "[]"); } catch { return []; }
  });
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("templates");

  const save = () => {
    if (!name.trim()) return;
    const p = {name: name.trim(), ts: Date.now(), snapshot: getSnapshot()};
    const updated = [...presets.filter(x => x.name !== p.name), p];
    setPresets(updated);
    localStorage.setItem("arch-render-presets", JSON.stringify(updated));
    setName("");
  };
  const del = n => {
    const updated = presets.filter(x => x.name !== n);
    setPresets(updated);
    localStorage.setItem("arch-render-presets", JSON.stringify(updated));
  };

  return (
    <div>
      <div style={{display:"flex", borderBottom:"1px solid var(--bdr)", marginBottom:16}}>
        {[["templates",tr.templates],["presets",tr.savedPresets]].map(([id,lbl]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{flex:1, padding:"9px 4px", fontSize:11, fontFamily:"'Syne',sans-serif", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", background:"transparent", border:"none", borderBottom: activeTab===id ? "2px solid var(--p)" : "2px solid transparent", color: activeTab===id ? "var(--pl)" : "var(--mut)", cursor:"pointer", transition:"all .2s", marginBottom:-1}}>{lbl}</button>
        ))}
      </div>

      {activeTab === "templates" && (
        <div className="tpl-grid">
          {TEMPLATES.map(tpl => (
            <button key={tpl.name} className="tpl-card" onClick={() => applyTemplate(tpl)}>
              <div className="tpl-head"><span className="tpl-icon">{tpl.icon}</span><div><div className="tpl-name">{tpl.name}</div><span className="tpl-tag">{tpl.tag}</span></div></div>
              <div className="tpl-desc">{tpl.desc}</div>
            </button>
          ))}
        </div>
      )}

      {activeTab === "presets" && (
        <div>
          <div className="save-row" style={{marginBottom:14}}>
            <input className="of-input" style={{flex:1}} value={name} onChange={e => setName(e.target.value)} placeholder={tr.presetName} onKeyDown={e => e.key==="Enter" && save()}/>
            <button className="btn-sm active" onClick={save}>{tr.save}</button>
          </div>
          {presets.length === 0
            ? <div className="empty-state"><div className="empty-icon">📂</div><div>{tr.noPresets}</div></div>
            : <div className="preset-list">{presets.map(p => (
                <div key={p.name} className="preset-item">
                  <div style={{flex:1}}><div className="preset-name">{p.name}</div><div className="preset-date">{new Date(p.ts).toLocaleDateString()}</div></div>
                  <div style={{display:"flex", gap:5}}>
                    <button className="pact-btn load" onClick={() => applySnapshot(p.snapshot)}>{tr.loadBtn}</button>
                    <button className="pact-btn del" onClick={() => del(p.name)}>×</button>
                  </div>
                </div>
              ))}</div>
          }
        </div>
      )}
    </div>
  );
}
function HistoryPanel({ history, onSelect, tr }) {
  if (!history.length) return (<div className="empty-state"><div className="empty-icon">🕐</div><div>{tr.noHistory}</div></div>);
  return (<div className="sec"><div className="sec-hdr" style={{cursor:"default"}}><span className="sec-icon">🕐</span><span className="sec-lbl">{tr.tabHistory}</span><span className="sec-line"/><span className="sec-count">{history.length}</span></div>{history.map((h, i) => (<div key={h.ts} className="hist-item" onClick={() => onSelect(h.prompt)} title={tr.clickToCopy}><div className="hist-time">{i===0?tr.nowLabel:""}{new Date(h.ts).toLocaleTimeString()}</div><div className="hist-preview">{h.prompt}</div></div>))}</div>);
}
function ComparePanel({ slotA, slotB, onClearA, onClearB, tr }) {
  const lines = slotA && slotB ? (() => { const aL = slotA.split("\n"), bL = slotB.split("\n"); const mx = Math.max(aL.length, bL.length); return Array.from({length:mx}, (_,i) => ({a:aL[i]||"", b:bL[i]||"", changed:(aL[i]||"")!==(bL[i]||"")})); })() : null;
  return (
    <div className="sec">
      <div className="sec-hdr" style={{cursor:"default"}}><span className="sec-icon">⚖</span><span className="sec-lbl">{tr.tabCompare}</span><span className="sec-line"/></div>
      <div style={{fontSize:11, color:"#7A7590", marginBottom:10, lineHeight:1.5}}>{tr.useAB}</div>
      <div className="compare-grid">
        {[{l:tr.slotA,c:slotA,clr:onClearA},{l:tr.slotB,c:slotB,clr:onClearB}].map(({l,c,clr}) => (<div key={l} className="compare-slot"><div className="compare-slot-hdr"><span className="compare-slot-lbl">{l}</span>{c && <button className="pact-btn del" onClick={clr}>{tr.clearBtn}</button>}</div>{c ? <div className="compare-text">{c}</div> : <div className="compare-empty">{tr.empty}</div>}</div>))}
      </div>
      {lines && (<div style={{marginTop:10}}><div className="of-label" style={{marginBottom:6}}>{tr.diffLabel}</div><div style={{background:"rgba(7,7,20,.85)", border:"1px solid #1E1E3A", borderRadius:8, padding:10, maxHeight:130, overflowY:"auto", fontSize:11, fontFamily:"'DM Sans',sans-serif", lineHeight:1.7}}>{lines.filter(l => l.changed).length === 0 ? <span style={{color:"#7A7590"}}>{tr.identical}</span> : lines.filter(l => l.changed).map((l, i) => (<div key={i} style={{marginBottom:3}}>{l.a && <div className="diff-remove">− {l.a}</div>}{l.b && <div className="diff-add">+ {l.b}</div>}</div>))}</div></div>)}
    </div>
  );
}
function buildExteriorPrompt(s, buildings, count, podium, cf, plat, prog, iCtx, negPr, styleRefs, weights, season, orientation, smartSun) {
  const extra = k => (cf[k]||[]).filter(f => f.label && f.value).map(f => f.label+": "+f.value).join(". ");
  const p = PROGRAM_TYPES[prog];
  const gr = s.greeneryTypes && s.greeneryTypes.length ? s.greeneryTypes.join(", ")+" overflowing from "+s.greeneryDensity.toLowerCase()+", creating cascading vertical gardens" : "minimal greenery accents";
  const bLines = buildings.slice(0, count).map((b, i) => { const tier = HEIGHT_TIERS[b.tier]; const pos = count===1 ? "The building" : count===2 ? (i===0?"LEFT building":"RIGHT building") : "Building "+b.name; return pos+" — "+tier.label+"-rise ("+tier.floors+"): "+b.shape+". Facade: "+b.facade+"."; });
  const israelCtx = iCtx.length ? "\nPlanning context: "+iCtx.join(", ")+"." : "";
  const neg = negPr.filter(Boolean).length ? "\nNEGATIVE: "+negPr.filter(Boolean).join(", ")+"." : "";
  const refs = styleRefs.filter(Boolean).length ? "\nSTYLE REFERENCES: "+styleRefs.filter(Boolean).join(" ") : "";
  const wt = plat==="midjourney" ? Object.entries(weights).filter(([,v]) => v!==1).map(([k,v]) => " "+k+"::"+v).join("") : "";
  const suf = plat==="midjourney" ? "\n\n--ar "+s.aspectRatio+" --q 2 --style raw --v 6"+wt : "\n\nGenerate as photorealistic architectural visualization. Professional photography. Ultra high detail, natural lighting physics.";
  const seaInfo = season && season!=="none" && SEASONS[season] ? " Season: "+SEASONS[season].label+"." : "";
  const neighborSection = s.neighborBuildings ? "\n\nNEIGHBORING CONTEXT:\n"+s.neighborBuildings+"." : "";
  const activitySection = s.crowdDensity ? "\n\nSTREET ACTIVITY:\n"+s.crowdDensity+(s.activityType?" — "+s.activityType:"")+"." : "";
  const lines = ["Ultra-photorealistic architectural visualization of "+count+" premium "+p.label.toLowerCase()+" building"+(count>1?"s":"")+" in "+s.location+".","Program: "+p.desc+".", "","BUILDINGS:", ...bLines, "Base: "+podium+".", extra("buildings"), "","MATERIALS:", s.frame+" structural frame, "+s.glazing+", "+s.railings+" balcony railings.", extra("materials"), "","BIOPHILIC GREENERY:", gr+".", extra("greenery"), "","URBAN SETTING:", s.streetContext+", "+s.background+". "+s.foreground+"."+israelCtx+neighborSection+activitySection, extra("setting"), "","LIGHTING & ATMOSPHERE:", s.timeOfDay+" at "+smartSun+(s.shadows?", dramatic shadow play across facade":"")+". "+s.skyDescription+"."+seaInfo, extra("lighting"), "","CAMERA & FRAMING:", s.cameraAngle+", "+s.lens+" lens, "+s.tilt+", "+s.composition+(s.dof?", shallow DoF":"")+(orientation?" Building faces "+orientation+".":""), extra("camera"), "","RENDER SPECIFICATION:", s.renderer+", "+s.resolution+(s.filmGrain?", subtle film grain":"")+(s.chromaticAtm?", chromatic atmosphere":"")+", "+s.style+", shot on "+s.camera+".", extra("quality"), neg, refs];
  return lines.filter(r => r !== undefined).join("\n") + suf;
}
function buildInteriorPrompt(s, plat, prog, negPr) {
  const p = PROGRAM_TYPES[prog];
  const neg = negPr.filter(Boolean).length ? "\nNEGATIVE: "+negPr.filter(Boolean).join(", ")+"." : "";
  const suf = plat==="midjourney" ? "\n\n--ar "+s.aspectRatio+" --q 2 --style raw --v 6" : "\n\nGenerate as photorealistic interior architectural photography. Ultra high detail, natural lighting physics, no lens distortion.";
  const lines = ["Ultra-photorealistic interior architectural render — "+s.spaceType+".",p.label+" building, "+s.location+".","","INTERIOR SPACE:","Space: "+s.spaceType+". Ceiling height: "+s.ceilingHeight+".","Flooring: "+s.flooring+". Lighting scheme: "+s.interiorLighting+".","Mood: "+(s.intMood||"Calm and serene")+".","","MATERIALS & SURFACES:","Walls and structure: "+s.frame+". Window glazing: "+s.glazing+".","Details and railings: "+s.railings+".","","BIOPHILIC ELEMENTS:",s.greeneryTypes && s.greeneryTypes.length ? s.greeneryTypes.join(", ")+" as interior plant features — potted, built-in, or wall-mounted." : "Minimal greenery — no interior plants.","","LIGHTING & ATMOSPHERE:",s.timeOfDay+". "+s.skyDescription+". "+(s.shadows?"Dramatic window shadow patterns cast across surfaces.":"Soft diffuse ambient light throughout space."),"","CAMERA & FRAMING:",s.cameraAngle+", "+s.lens+" lens, "+s.composition+(s.dof?", shallow depth of field, background softly blurred":".")+".","","RENDER SPECIFICATION:",s.renderer+", "+s.resolution+", "+s.style+", shot on "+s.camera+".",neg];
  return lines.filter(r => r !== undefined).join("\n") + suf;
}
function buildPlanPrompt(s, plat, prog) {
  const p = PROGRAM_TYPES[prog];
  const elements = s.planElements && s.planElements.length ? s.planElements.join(", ") : "furniture layout, north arrow, scale bar";
  const suf = plat==="midjourney" ? "\n\n--ar "+s.aspectRatio+" --q 2 --style raw --v 6" : "\n\nGenerate as a high-resolution architectural plan visualization. Precise geometry, clean edges, professional drafting quality.";
  const lines = ["Ultra-high-resolution architectural plan render — "+s.planView+" of "+p.label.toLowerCase()+" building, "+s.location+".","","PLAN VIEW & PROJECTION:","View type: "+s.planView+". Floor shown: "+s.planFloor+". Scale: "+s.planScale+".","Graphic style: "+s.planStyle+".","","PROGRAM:",p.label+" — "+p.desc+".","","COLOR & MATERIALS:","Color scheme: "+s.planColorScheme+".","Flooring: "+s.flooring+". Wall thickness hierarchy — thick structural walls, thin partition lines.","Glazing shown as thin double lines with glass infill pattern.","","SHADOW & DEPTH:","Sun angle: "+s.sunAngle+(s.shadows?", soft drop shadows at 45°, depth opacity 30%.":". No shadows.")+".","","PLAN ELEMENTS:",elements+".","","RENDER SPECIFICATION:",s.renderer+", "+s.resolution+", "+s.style+".","","NEGATIVE: perspective distortion, fisheye lens, 3D extrusion, angled walls, cartoon style, watermarks."];
  return lines.filter(r => r !== undefined).join("\n") + suf;
}
function buildCompactPrompt(s, buildings, count, podium, plat, prog, negPr, styleRefs, season, weights, smartSun, renderMode) {
  const p = PROGRAM_TYPES[prog]; const neg = negPr.filter(Boolean).join(", ");
  const wt = plat==="midjourney" ? Object.entries(weights).filter(([,v]) => v!==1).map(([k,v]) => " "+k+"::"+v).join("") : "";
  const suf = plat==="midjourney" ? "\n\n--ar "+s.aspectRatio+" --q 2 --style raw --v 6"+wt : "\n\nPhotorealistic architectural render, ultra-detailed, professional photography.";
  if (renderMode === "interior") { const lines = ["Photorealistic "+p.label+" interior, "+s.spaceType+", "+s.location,"Ceiling: "+s.ceilingHeight+". Floor: "+s.flooring+".","Lighting: "+s.interiorLighting+". Mood: "+(s.intMood||"calm")+".","Materials: "+s.frame+", "+s.glazing,s.cameraAngle+", "+s.lens+" lens, "+s.composition,s.renderer+", "+s.resolution+", "+s.style,neg?"Negative: "+neg:""]; return lines.filter(Boolean).join("\n") + suf; }
  if (renderMode === "plan") { const lines = ["Architectural plan render — "+s.planView,p.label+" building, "+s.planFloor+", "+s.location,"Style: "+s.planStyle+". Scale: "+s.planScale+".","Colors: "+s.planColorScheme,"Elements: "+(s.planElements||[]).slice(0,5).join(", "),s.renderer+", "+s.resolution+", "+s.style,"NEGATIVE: perspective distortion, 3D extrusion, fisheye"]; return lines.filter(Boolean).join("\n") + suf; }
  const bDesc = buildings.slice(0,count).map(b => HEIGHT_TIERS[b.tier].label+"-rise "+b.shape+", "+b.facade).join(" | ");
  const refs = styleRefs.filter(Boolean).length ? " --iref "+styleRefs.filter(Boolean).join(" ") : "";
  const seaLabel = season && season!=="none" && SEASONS[season] ? " "+SEASONS[season].label : "";
  const lines = ["Photorealistic "+p.label+" architecture, "+s.location,"Buildings: "+bDesc,"Materials: "+s.frame+", "+s.glazing+", "+s.railings,"Greenery: "+(s.greeneryTypes||[]).slice(0,3).join(", "),""+s.streetContext+", "+s.background,""+s.timeOfDay+", "+smartSun+", "+s.skyDescription+seaLabel,""+s.cameraAngle+", "+s.lens+", "+s.composition,""+s.renderer+", "+s.resolution+", "+s.style,neg?"Negative: "+neg:""];
  return lines.filter(Boolean).join("\n") + refs + suf;
}
function buildTimelapse(s, buildings, count, podium, plat, prog, smartSun) {
  return [{label:"🌅 Sunrise", tod:"Golden hour sunrise", sun:"15° low from left — long raking shadows", sky:"Pastel golden hour gradient"},{label:"☀ Midday", tod:"Midday", sun:smartSun, sky:"Deep blue Israeli sky with scattered cumulus clouds"},{label:"🌆 Dusk", tod:"Blue hour dusk", sun:"Backlit contre-jour from behind buildings",sky:"Twilight — deep indigo to orange"}].map(sl => { const m = {...s, timeOfDay:sl.tod, sunAngle:sl.sun, skyDescription:sl.sky}; return {label:sl.label, prompt:buildExteriorPrompt(m,buildings,count,podium,{},{},plat,prog,[],[],{},SECTION_WEIGHTS_DEF,"none","",sl.sun)}; });
}
const DEF_S = {
  frame:"White precast concrete", glazing:"Floor-to-ceiling cool blue-silver glass", railings:"Brushed aluminum",
  greeneryTypes:["Olive trees","Bougainvillea","Climbing vines","Ornamental grasses"], greeneryDensity:"Every third balcony",
  location:"Ramat Gan, Israel", streetContext:"Dense Israeli urban street context",
  background:"Ramat Gan skyline with Tel Aviv towers on horizon",
  foreground:"Wide landscaped boulevard with mature ficus trees, pedestrians, parked cars",
  timeOfDay:"Midday", sunAngle:"45° from the left", shadows:true,
  skyDescription:"Deep blue Israeli sky with scattered cumulus clouds",
  cameraAngle:"Low street-level perspective", lens:"35mm", tilt:"Slight upward tilt",
  composition:"Wide-angle hero — all buildings with urban context", dof:true,
  renderer:"Unreal Engine 5", resolution:"8K", aspectRatio:"16:9",
  camera:"Hasselblad H6D-400c", style:"Award-winning architectural photography",
  filmGrain:true, chromaticAtm:true,
  neighborBuildings:"", neighborStreet:"", crowdDensity:"", activityType:"",
  spaceType:"Luxury apartment — open plan living", ceilingHeight:"3.2m premium ceiling",
  flooring:"Polished concrete", interiorLighting:"Recessed LED — warm 2700K", intMood:"Calm and serene — minimal",
  planView:"True orthographic top-down", planStyle:"Hand-drafted ink on white — architectural line weight",
  planFloor:"Ground floor — retail, lobby, public realm", planScale:"1:100 — standard floor plan",
  planColorScheme:"Monochrome — black, white, grey only",
  planElements:["Furniture layout","Shadow casting (45° sun angle)","North arrow","Scale bar","Outdoor landscaping"],
};
const DEF_CF = {buildings:[],materials:[],greenery:[],setting:[],lighting:[],camera:[],quality:[]};
const DEF_BLDGS = [defBldg(0)];

export default function App() {
  const [accent, setAccent] = useState("#8B5CF6");
  const [isDark, setIsDark] = useState(true);
  const [s, setS] = useState(DEF_S);
  const [cf, setCF] = useState(DEF_CF);
  const [plat, setPlat] = useState("gemini");
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(1);
  const [mode, setMode] = useState("all");
  const [buildings, setBuildings] = useState(DEF_BLDGS);
  const [podium, setPodium] = useState("Shared curved glass-and-stone podium with retail and landscaped public plaza");
  const [leftTab, setLeftTab] = useState("Build");
  const [renderMode, setRenderMode] = useState("exterior");
  const [programType, setProgramType] = useState("residential");
  const [season, setSeason] = useState("summer");
  const [orientation, setOrientation] = useState("S");
  const [israeliCtx, setIsraeliCtx] = useState([]);
  const [negPr, setNegPr] = useState([]);
  const [styleRefs, setStyleRefs] = useState(["",""]);
  const [weights, setWeights] = useState(SECTION_WEIGHTS_DEF);
  const [compact, setCompact] = useState(false);
  const [tlMode, setTlMode] = useState(false);
  const [colorMode, setColorMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [pins, setPins] = useState({});
  const [aiVisible, setAiVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [pasteCode, setPasteCode] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem("arch-render-lang") || "en");
  const tr = LANG[lang];
  const toggleLang = () => { const next = lang === "en" ? "he" : "en"; setLang(next); localStorage.setItem("arch-render-lang", next); };
  const histTimer = useRef(null);

  const t = buildTheme(accent, isDark);
  const set = k => v => setS(p => ({...p, [k]: v}));

  const switchRenderMode = m => { setRenderMode(m); const preset = MODE_PRESETS[m]; if (preset) setS(prev => ({...prev, ...preset})); if (m === "plan") setTlMode(false); };
  const togglePin = (field, val) => { setPins(prev => { const curr = prev[field] || []; const updated = curr.includes(val) ? curr.filter(x => x !== val) : [...curr, val]; return {...prev, [field]: updated}; }); };

  const smartSun = computeSmartSunAngle(orientation, s.timeOfDay);
  const prompt = compact ? buildCompactPrompt(s,buildings,count,podium,plat,programType,negPr,styleRefs,season,weights,smartSun,renderMode) : renderMode==="interior" ? buildInteriorPrompt(s,plat,programType,negPr) : renderMode==="plan" ? buildPlanPrompt(s,plat,programType) : buildExteriorPrompt(s,buildings,count,podium,cf,plat,programType,israeliCtx,negPr,styleRefs,weights,season,orientation,smartSun);
  const tlSlots = tlMode && renderMode==="exterior" ? buildTimelapse(s,buildings,count,podium,plat,programType,smartSun) : [];
  const charCount = prompt.length, wordCount = prompt.split(/\s+/).filter(Boolean).length;
  const overLimit = charCount > MJ_LIMIT, nearLimit = charCount > MJ_LIMIT*0.8;

  useEffect(() => { clearTimeout(histTimer.current); histTimer.current = setTimeout(() => { setHistory(prev => prev[0] && prev[0].prompt===prompt ? prev : [{prompt,ts:Date.now()},...prev].slice(0,12)); }, 1400); }, [prompt]);

  const doCopy = (txt) => { const finish = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); }; if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(finish).catch(finish); } else { finish(); } };
  const copy = useCallback(() => { const txt = tlSlots.length ? tlSlots.map(sl=>"=== "+sl.label+" ===\n"+sl.prompt).join("\n\n") : prompt; doCopy(txt); }, [prompt, tlSlots]);

  const reset = () => { setS(DEF_S); setCF(DEF_CF); setCount(1); setMode("all"); setBuildings(DEF_BLDGS); setPodium("Shared curved glass-and-stone podium with retail and landscaped public plaza"); setRenderMode("exterior"); setProgramType("residential"); setSeason("summer"); setOrientation("S"); setIsraeliCtx([]); setNegPr([]); setStyleRefs(["",""]); setWeights(SECTION_WEIGHTS_DEF); };
  const getSnapshot = () => ({s,buildings,count,mode,podium,cf,plat,programType,season,orientation,israeliCtx,negPr,styleRefs,weights,renderMode,accent,isDark});
  const applySnapshot = snap => { setS(snap.s); setBuildings(snap.buildings); setCount(snap.count); setMode(snap.mode); setPodium(snap.podium); setCF(snap.cf||DEF_CF); setPlat(snap.plat||"gemini"); if (snap.renderMode) setRenderMode(snap.renderMode); if (snap.programType) setProgramType(snap.programType); if (snap.season) setSeason(snap.season); if (snap.orientation) setOrientation(snap.orientation); if (snap.israeliCtx) setIsraeliCtx(snap.israeliCtx); if (snap.negPr) setNegPr(snap.negPr); if (snap.styleRefs) setStyleRefs(snap.styleRefs); if (snap.weights) setWeights(snap.weights); if (snap.accent) setAccent(snap.accent); if (snap.isDark !== undefined) setIsDark(snap.isDark); setLeftTab("Build"); };
  const applyTemplate = tpl => { setS(prev => ({...prev, ...tpl.s})); setBuildings(tpl.buildings); setCount(tpl.count); setSeason(tpl.season); setIsraeliCtx(tpl.israeliCtx); setPodium(tpl.podium); if (tpl.renderMode) setRenderMode(tpl.renderMode); setMode("all"); setLeftTab("Build"); };
  const randomize = () => { const pick = arr => arr[Math.floor(Math.random()*arr.length)]; setS(p => ({...p, frame: pick(PRESETS.frame), glazing: pick(PRESETS.glazing), railings: pick(PRESETS.railings), greeneryDensity: pick(PRESETS.greeneryDensity), skyDescription: pick(PRESETS.skyDescription), timeOfDay: pick(TIME_OPTIONS.filter(t => t!=="Night — artificial lighting")), cameraAngle: pick(PRESETS.cameraAngle), lens: pick(LENS_OPTIONS), composition: pick(PRESETS.composition), tilt: pick(PRESETS.tilt), renderer: pick(PRESETS.renderer)})); setSeason(pick(Object.keys(SEASONS).filter(k => k!=="night"))); };
  const genShareCode = () => { try { return btoa(encodeURIComponent(JSON.stringify(getSnapshot()))); } catch(e) { return ""; } };
  const loadFromCode = code => { try { applySnapshot(JSON.parse(decodeURIComponent(atob(code)))); setShareVisible(false); setPasteCode(""); } catch(e) { alert("Invalid code."); } };
  const exportPDF = () => { const w = window.open("","_blank"); if(!w) return; w.document.write("<html><head><title>Arch Brief</title><style>body{font-family:'Segoe UI',sans-serif;padding:48px;max-width:820px;margin:auto;color:#1a1530}h1{color:#6D28D9;font-size:24px;margin-bottom:6px}.meta{color:#888;font-size:12px;margin-bottom:24px}pre{background:#f5f2ff;padding:20px;font-size:12px;line-height:1.8;white-space:pre-wrap;border-radius:8px;border:1px solid #d8d0f0}</style></head><body><h1>Architectural Render Prompt Brief</h1><div class='meta'>"+new Date().toLocaleString()+" · "+RENDER_MODES[renderMode].label+" · "+PROGRAM_TYPES[programType].label+" · "+s.location+"</div><pre>"+(tlSlots.length?tlSlots.map(sl=>"=== "+sl.label+" ===\n"+sl.prompt).join("\n\n"):prompt)+"</pre></body></html>"); w.document.close(); w.print(); };
  const exportMarkdownFn = () => { const md = buildMarkdown(prompt, renderMode, programType, s); doCopy(md); };
  const quality = computeQuality(s, count, cf, negPr, renderMode);
  const modeColor = renderMode==="exterior" ? t.purple : renderMode==="interior" ? "#FB923C" : "#38BDF8";
  const OF = (label, key, multi, fullRow) => (<OptionField label={label} value={s[key]} onChange={set(key)} options={PRESETS[key]||[]} multiline={multi} fullRow={fullRow}/>);
  const cssVars = "--p:"+t.purple+";--pl:"+t.purpleLight+";--pb:"+t.purpleBright+";--pg:"+t.purpleGlow+";--pg2:"+t.purpleGlow2+";--bdr:"+t.border+";--txt:"+t.text+";--mut:"+t.muted;

  return (
    <div style={{cssText: cssVars}}>
      <style>{FONTS + makeCSS(t)}</style>
      {showOnboarding && (<OnboardingModal onClose={() => setShowOnboarding(false)}/>)}
      <div className="app" dir={lang === "he" ? "rtl" : "ltr"}>
        <div className="hdr">
          <button className="hamburger" onClick={() => setDrawerOpen(p => !p)}>☰</button>
          <span className="hdr-title">Arch Render</span>
          <span className="hdr-badge" style={{borderColor:modeColor, color:modeColor}}>{RENDER_MODES[renderMode].icon} {RENDER_MODES[renderMode].label}</span>
          <div className="hdr-right">
            <button className="hdr-btn desktop-only" onClick={randomize}>🎲</button>
            <button className="hdr-btn desktop-only" onClick={() => { setShareCode(genShareCode()); setShareVisible(p => !p); }}>🔗</button>
            <button className="hdr-btn" onClick={toggleLang} style={{fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12}}>{lang === "en" ? "עב" : "EN"}</button>
            <button className="hdr-btn" onClick={() => setShowOnboarding(true)}>❓</button>
            <button className="hdr-btn" onClick={() => setIsDark(p => !p)}>{isDark?"☀":"◑"}</button>
          </div>
        </div>
        {drawerOpen && <div className="drawer-overlay show" onClick={() => setDrawerOpen(false)}/>}
        <div className="layout">
          <div className={"left" + (drawerOpen?" open":"")}>
            <div className="left-tabs">
              {[["Build",tr.tabBuild],["Saved",tr.tabSaved],["History",tr.tabHistory],["Compare",tr.tabCompare],["Theme",tr.tabTheme]].map(([id,lbl]) => (<button key={id} className={"ltab" + (leftTab===id?" on":"")} onClick={() => { setLeftTab(id); setDrawerOpen(false); }}>{lbl}</button>))}
            </div>
            <div className="left-content">
              {leftTab==="Build" && (<div>
                <div className="sec"><div className="sec-hdr" style={{cursor:"default"}}><span className="sec-icon">🎬</span><span className="sec-lbl">{tr.secRenderType}</span><span className="sec-line"/></div><div className="render-mode-grid">{Object.entries(RENDER_MODES).map(([k,m]) => (<button key={k} className={"rm-btn"+(renderMode===k?" on":"")} onClick={() => switchRenderMode(k)}>{renderMode===k && <span className="rm-dot"/>}<span className="rm-icon">{m.icon}</span><div className="rm-label">{m.label}</div><div className="rm-desc">{m.desc}</div></button>))}</div></div>
                <div className="sec"><div className="sec-hdr" style={{cursor:"default"}}><span className="sec-icon">🏗</span><span className="sec-lbl">{tr.secProgram}</span><span className="sec-line"/></div><div className="prog-grid">{Object.entries(PROGRAM_TYPES).map(([k,p]) => (<button key={k} className={"prog-btn"+(programType===k?" on":"")} onClick={() => setProgramType(k)}><span className="prog-icon">{p.icon}</span><div className="prog-label">{p.label}</div><div className="prog-desc">{p.desc}</div></button>))}</div></div>
                {renderMode==="exterior" && (<div>
                  <BuildingConfig buildings={buildings} setBuildings={setBuildings} count={count} setCount={setCount} mode={mode} setMode={setMode} podium={podium} setPodium={setPodium} cf={cf} setCF={setCF} isDark={isDark} t={t}/>
                  <Section label={tr.secMaterials} icon="🧱" cfKey="materials" cf={cf} setCF={setCF}><div className="g3">{OF(tr.frame,"frame")}{OF(tr.glazing,"glazing")}{OF(tr.railings,"railings")}</div></Section>
                  <Section label={tr.secGreenery} icon="🌿" cfKey="greenery" cf={cf} setCF={setCF}><div style={{display:"flex",flexDirection:"column",gap:10}}><div><div className="of-label" style={{marginBottom:6}}>{tr.greeneryTypes}</div><PinnableChips field="greenery" options={GREENERY_OPTIONS} value={s.greeneryTypes} onChange={set("greeneryTypes")} pins={pins} togglePin={togglePin}/></div>{OF(tr.greeneryDensity,"greeneryDensity")}</div></Section>
                  <Section label={tr.secUrban} icon="🏙" cfKey="setting" cf={cf} setCF={setCF}><div className="g2">{OF(tr.location,"location")}{OF(tr.streetContext,"streetContext")}{OF(tr.background,"background")}{OF(tr.foreground,"foreground")}</div><div style={{marginTop:11}}><div className="of-label" style={{marginBottom:6}}>{tr.israeliContext}</div><PinnableChips field="israeliCtx" options={PRESETS.israeliContext} value={israeliCtx} onChange={setIsraeliCtx} pins={pins} togglePin={togglePin}/></div></Section>
                  <Collapsible label={tr.secNeighbor} icon="🏘"><div style={{display:"flex",flexDirection:"column",gap:10}}><OptionField label={tr.adjacentBuildings} value={s.neighborBuildings} onChange={set("neighborBuildings")} options={["Lower-rise residential surroundings","Similar-height office towers","Historic low-rise preservation zone","Mixed-height dense urban fabric","Open site — no significant neighbors","Waterfront with open views"]}/><OptionField label={tr.streetCharacter} value={s.neighborStreet} onChange={set("neighborStreet")} options={["Wide 4-lane boulevard with mature trees","Narrow pedestrian lane","Tree-lined avenue","Coastal waterfront promenade","Park-adjacent open green"]}/></div></Collapsible>
                  <Collapsible label={tr.secPeople} icon="👥"><div style={{display:"flex",flexDirection:"column",gap:10}}><OptionField label={tr.crowdDensity} value={s.crowdDensity} onChange={set("crowdDensity")} options={["Deserted — architectural focus","Sparse — few distant figures","Moderate everyday urban activity","Busy lively street scene","Evening social atmosphere"]}/><OptionField label={tr.activityType} value={s.activityType} onChange={set("activityType")} options={["Families with children in plaza","Business professionals walking","Mixed casual urban crowd","Cyclists and joggers","Outdoor café terrace culture"]}/></div></Collapsible>
                </div>)}
                {renderMode==="interior" && (<div>
                  <Section label={tr.secInterior} icon="🏠" cfKey="quality" cf={cf} setCF={setCF}><div style={{display:"flex",flexDirection:"column",gap:10}}><OptionField label={tr.spaceType} value={s.spaceType} onChange={set("spaceType")} options={INTERIOR_SPACES}/><div className="g2"><OptionField label={tr.ceilingHeight} value={s.ceilingHeight} onChange={set("ceilingHeight")} options={CEIL_OPTIONS}/><OptionField label={tr.flooring} value={s.flooring} onChange={set("flooring")} options={FLOOR_OPTIONS}/></div><OptionField label={tr.interiorLighting} value={s.interiorLighting} onChange={set("interiorLighting")} options={INT_LIGHT_OPTIONS}/><OptionField label={tr.intMood} value={s.intMood} onChange={set("intMood")} options={INT_MOOD_OPTIONS}/></div></Section>
                  <Section label="Materials" icon="🧱" cfKey="materials" cf={cf} setCF={setCF}><div className="g3">{OF(tr.frame,"frame")}{OF(tr.glazing,"glazing")}{OF(tr.railings,"railings")}</div></Section>
                  <Section label={tr.secBiophilic} icon="🌿" cfKey="greenery" cf={cf} setCF={setCF}><div><div className="of-label" style={{marginBottom:6}}>{tr.greeneryTypes}</div><PinnableChips field="greenery" options={GREENERY_OPTIONS} value={s.greeneryTypes} onChange={set("greeneryTypes")} pins={pins} togglePin={togglePin}/></div></Section>
                  <div style={{marginBottom:14,padding:"9px 11px",background:t.purpleGlow2,border:"1px solid "+t.border,borderRadius:9,fontSize:11,color:t.purpleLight,lineHeight:1.5}}><span style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:9,letterSpacing:".14em",textTransform:"uppercase",display:"block",marginBottom:5}}>{tr.locationBadge}</span>{OF("","location")}</div>
                </div>)}
                {renderMode==="plan" && (<div>
                  <Section label={tr.secPlan} icon="📐" cfKey="quality" cf={cf} setCF={setCF}><div style={{display:"flex",flexDirection:"column",gap:10}}><OptionField label={tr.planView} value={s.planView} onChange={set("planView")} options={PLAN_VIEW_OPTIONS}/><OptionField label={tr.planStyle} value={s.planStyle} onChange={set("planStyle")} options={PLAN_STYLE_OPTIONS}/><div className="g2"><OptionField label={tr.planFloor} value={s.planFloor} onChange={set("planFloor")} options={PLAN_FLOOR_OPTIONS}/><OptionField label={tr.planScale} value={s.planScale} onChange={set("planScale")} options={PLAN_SCALE_OPTIONS}/></div><OptionField label={tr.planColorScheme} value={s.planColorScheme} onChange={set("planColorScheme")} options={PLAN_COLOR_OPTIONS}/></div></Section>
                  <Section label={tr.secPlanElements} icon="☑" cfKey="setting" cf={cf} setCF={setCF}><div><div className="of-label" style={{marginBottom:6}}>{tr.shownElements}</div><PlainChips options={PLAN_ELEMENTS} value={s.planElements||[]} onChange={set("planElements")}/></div></Section>
                  <Section label={tr.secSurface} icon="🧱" cfKey="materials" cf={cf} setCF={setCF}><div className="g2"><OptionField label={tr.floorFinish} value={s.flooring} onChange={set("flooring")} options={FLOOR_OPTIONS}/>{OF(tr.wallMaterial,"frame")}</div></Section>
                  <div style={{marginBottom:14,padding:"9px 11px",background:t.purpleGlow2,border:"1px solid "+t.border,borderRadius:9,fontSize:11,color:t.purpleLight}}><span style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:9,letterSpacing:".14em",textTransform:"uppercase",display:"block",marginBottom:5}}>📍 Location</span>{OF("","location")}</div>
                </div>)}
                <Section label={tr.secLighting} icon="☀" cfKey="lighting" cf={cf} setCF={setCF}>
                  {renderMode!=="plan" && (<div style={{marginBottom:11}}><div className="of-label" style={{marginBottom:6}}>{tr.season}</div><div className="season-grid">{Object.entries(SEASONS).map(([k,v]) => (<button key={k} className={"season-btn"+(season===k?" on":"")} onClick={() => { setSeason(k); set("skyDescription")(v.sky); set("sunAngle")(v.sun); }}>{v.label}</button>))}</div></div>)}
                  <div className="g2" style={{marginBottom:9}}>{renderMode!=="plan" && <OptionField label={tr.timeOfDay} value={s.timeOfDay} onChange={set("timeOfDay")} options={TIME_OPTIONS}/>}{OF(tr.sunAngle,"sunAngle")}{renderMode!=="plan" && OF(tr.skyDescription,"skyDescription",false,true)}</div>
                  {renderMode!=="plan" && <div className="tog-row"><span className="tog-lbl">{tr.shadowPlay}</span><Toggle v={s.shadows} set={set("shadows")}/></div>}
                </Section>
                <Section label={tr.secCamera} icon="📷" cfKey="camera" cf={cf} setCF={setCF}>
                  {renderMode==="exterior" && (<div style={{marginBottom:11}}><div className="of-label" style={{marginBottom:7}}>{tr.siteOrientation}</div><div className="compass-wrap"><CompassRose orientation={orientation} onChange={setOrientation} t={t}/><div className="smart-sun"><span style={{fontSize:13,flexShrink:0,marginTop:1}}>☀</span><div><div style={{fontSize:9,color:t.muted,marginBottom:3,fontFamily:"'Syne',sans-serif",letterSpacing:".1em",textTransform:"uppercase"}}>{orientation}-facing</div>{smartSun}</div></div></div></div>)}
                  <div className="g2" style={{marginBottom:9}}>{OF(tr.cameraAngle,"cameraAngle")}<OptionField label={tr.lens} value={s.lens} onChange={set("lens")} options={LENS_OPTIONS}/>{renderMode!=="plan" && OF(tr.tilt,"tilt")}{OF(tr.composition,"composition",false,renderMode==="plan")}</div>
                  {renderMode!=="plan" && <div className="tog-row"><span className="tog-lbl">{tr.dof}</span><Toggle v={s.dof} set={set("dof")}/></div>}
                </Section>
                <Section label={tr.secQuality} icon="✦" cfKey="quality" cf={cf} setCF={setCF}>
                  <div className="g3" style={{marginBottom:9}}><OptionField label={tr.renderer} value={s.renderer} onChange={set("renderer")} options={PRESETS.renderer}/><OptionField label={tr.resolution} value={s.resolution} onChange={set("resolution")} options={RES_OPTIONS}/><OptionField label={tr.aspectRatio} value={s.aspectRatio} onChange={set("aspectRatio")} options={ASPECT_OPTIONS}/><OptionField label={tr.cameraBody} value={s.camera} onChange={set("camera")} options={PRESETS.camera} fullRow/><OptionField label={tr.style} value={s.style} onChange={set("style")} options={PRESETS.style} fullRow/></div>
                  {renderMode!=="plan" && (<div><div className="tog-row"><span className="tog-lbl">{tr.filmGrain}</span><Toggle v={s.filmGrain} set={set("filmGrain")}/></div><div className="tog-row"><span className="tog-lbl">{tr.chromaticAtm}</span><Toggle v={s.chromaticAtm} set={set("chromaticAtm")}/></div></div>)}
                </Section>
                {renderMode==="exterior" && (<Collapsible label={tr.secStyleRefs} icon="🖼"><div style={{display:"flex",flexDirection:"column",gap:6}}><div className="of-label">{tr.refUrls}</div>{styleRefs.map((ref,i) => (<input key={i} className="of-input" value={ref} onChange={e => setStyleRefs(p => p.map((r,j) => j===i?e.target.value:r))} placeholder={"Reference URL "+(i+1)+"..."}/>))}<button className="add-btn" onClick={() => setStyleRefs(p => [...p,""])}>{tr.addRef}</button></div></Collapsible>)}
                <Collapsible label={tr.secNegative} icon="⊘"><PinnableChips field="negPr" options={PRESETS.negativePrompts} value={negPr} onChange={setNegPr} pins={pins} togglePin={togglePin}/></Collapsible>
                {plat==="midjourney" && renderMode==="exterior" && (<div className="sec"><div className="sec-hdr" style={{cursor:"default"}}><span className="sec-icon">⚖</span><span className="sec-lbl">{tr.secWeights}</span><span className="sec-line"/></div>{Object.entries(weights).map(([k,v]) => { const pct = ((v-0.5)/(2-0.5))*100; return (<div key={k} className="weight-row"><span className="weight-lbl">{k}</span><input type="range" className="weight-slider" min="0.5" max="2" step="0.1" value={v} style={{"--pct":pct+"%"}} onChange={e => setWeights(p => ({...p, [k]:parseFloat(e.target.value)}))}/><span className="weight-val">{v.toFixed(1)}</span></div>); })}</div>)}
              </div>)}
              {leftTab==="Saved" && <SavedPanel applyTemplate={applyTemplate} getSnapshot={getSnapshot} applySnapshot={applySnapshot} tr={tr}/>}
              {leftTab==="History" && <HistoryPanel history={history} onSelect={p => doCopy(p)} tr={tr}/>}
              {leftTab==="Compare" && <ComparePanel slotA={compareA} slotB={compareB} onClearA={() => setCompareA(null)} onClearB={() => setCompareB(null)} tr={tr}/>}
              {leftTab==="Theme" && <ThemeFactoryPanel accent={accent} setAccent={setAccent} isDark={isDark} setIsDark={setIsDark} tr={tr}/>}
            </div>
          </div>
          <div className="out">
            <div><div className="out-lbl" style={{marginBottom:6}}>{tr.platform}</div><div className="ptabs">{PLATFORMS.map(p => (<button key={p.id} className={"ptab"+(plat===p.id?" on":"")} onClick={() => setPlat(p.id)}>{p.label}</button>))}</div>{plat==="gemini" && <div className="g-badge"><span className="g-dot"/>Gemini Imagen 3</div>}</div>
            <div><div className="out-lbl" style={{marginBottom:6}}>{tr.outputMode}</div><div className="out-toggles"><button className={"out-tog"+(!compact&&!tlMode?" on":"")} onClick={() => { setCompact(false); setTlMode(false); }}>{tr.verbose}</button><button className={"out-tog"+(compact&&!tlMode?" on":"")} onClick={() => { setCompact(true); setTlMode(false); }}>{tr.compact}</button>{renderMode==="exterior" && <button className={"out-tog"+(tlMode?" on":"")} onClick={() => { setTlMode(p => !p); setCompact(false); }}>{tr.timelapse}</button>}<button className={"out-tog"+(colorMode?" on":"")} onClick={() => setColorMode(p => !p)}>🎨</button></div></div>
            <div className="out-lbl">{tr.generatedPrompt}</div>
            {tlMode && tlSlots.length ? <div className="tl-wrap">{tlSlots.map(sl => (<div key={sl.label} className="tl-item"><div className="tl-hdr"><span className="tl-lbl">{sl.label}</span><button className="btn-sm" onClick={() => doCopy(sl.prompt)}>Copy</button></div><div className="tl-body">{sl.prompt}</div></div>))}</div> : colorMode ? <ColorPrompt prompt={prompt} t={t}/> : <div className="prompt-box">{prompt}</div>}
            <div><div className="token-row"><span style={{fontSize:9, color:overLimit?t.red:nearLimit?t.yellow:t.muted, fontFamily:"'Syne',sans-serif", letterSpacing:".1em", textTransform:"uppercase", fontWeight:600}}>{charCount.toLocaleString()} chars · {wordCount} words{plat==="midjourney" && nearLimit && !overLimit ? " ⚠ Near limit" : ""}{plat==="midjourney" && overLimit ? " ✕ Over limit" : ""}</span>{plat==="midjourney" && <span style={{fontSize:9,color:t.muted,fontFamily:"'Syne',sans-serif"}}>{MJ_LIMIT.toLocaleString()} max</span>}</div>{plat==="midjourney" && (<div className="token-track"><div className="token-fill" style={{width:Math.min(100,(charCount/MJ_LIMIT)*100)+"%", background:overLimit?t.red:nearLimit?t.yellow:t.green}}/></div>)}</div>
            <div className="btn-row"><button className="btn btn-p" onClick={copy}>{copied?tr.copied:tr.copyPrompt}</button><button className="btn btn-s" onClick={exportPDF}>{tr.exportPDF}</button><button className="btn btn-s" onClick={reset}>{tr.reset}</button></div>
            <div style={{display:"flex", gap:5}}><button className="btn-sm" style={{flex:1}} onClick={() => setCompareA(prompt)}>→ A</button><button className="btn-sm" style={{flex:1}} onClick={() => setCompareB(prompt)}>→ B</button><button className="btn-sm" style={{flex:1}} onClick={() => { setShareCode(genShareCode()); setShareVisible(p => !p); }}>🔗 Share</button></div>
            <div className="copied-msg">{copied?"✓ Copied to clipboard":""}</div>
            {shareVisible && (<div className="share-panel"><div className="of-label">{tr.shareCode}</div><div className="share-code-box">{shareCode}</div><div style={{display:"flex",gap:5}}><button className="btn-sm active" style={{flex:1}} onClick={() => doCopy(shareCode)}>Copy Code</button><button className="btn-sm" style={{flex:1}} onClick={() => setShareVisible(false)}>Close</button></div><div className="of-label" style={{marginTop:2}}>{tr.loadFromCode}</div><div style={{display:"flex",gap:5}}><input className="of-input" style={{flex:1,fontSize:11}} value={pasteCode} onChange={e => setPasteCode(e.target.value)} placeholder={tr.pasteCode}/><button className="btn-sm active" onClick={() => loadFromCode(pasteCode)}>{tr.load}</button></div></div>)}
            <div className="quality-wrap"><div className="quality-row"><span style={{fontFamily:"'Syne',sans-serif",fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:t.muted,fontWeight:600}}>{tr.promptQuality}</span><span style={{fontFamily:"'Syne',sans-serif",fontSize:9,letterSpacing:".16em",textTransform:"uppercase",color:quality.color,fontWeight:700}}>{quality.label}</span></div><div className="quality-track"><div className="quality-fill" style={{width:quality.pct+"%",background:quality.color}}/></div></div>
            <div className="stats">{[[tr.statMode,RENDER_MODES[renderMode].icon],[tr.statWords,wordCount],[tr.statCustom,Object.values(cf).flat().length]].map(([l,v]) => (<div key={l} className="stat-card"><div className="stat-v">{v}</div><div className="stat-l">{l}</div></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
