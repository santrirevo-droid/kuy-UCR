import { houses, fullAddress, UCR_CAMPUS } from "@/lib/housing";

// File KML semua housing + kampus — untuk diimpor ke Google My Maps
// (Buat peta baru → Impor) supaya rombongan punya link peta Google sendiri.
// Dibangun dari lib/housing.ts, jadi selalu sinkron dengan halaman /housing.

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** "#2563eb" → warna KML "ffeb6325" (aabbggrr). */
function kmlColor(hex: string): string {
  const h = hex.replace("#", "");
  return `ff${h.slice(4, 6)}${h.slice(2, 4)}${h.slice(0, 2)}`;
}

const PIN = "https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png";

function style(id: string, color: string): string {
  return `    <Style id="${id}">
      <IconStyle>
        <color>${kmlColor(color)}</color>
        <scale>1</scale>
        <Icon><href>${PIN}</href></Icon>
        <hotSpot x="32" xunits="pixels" y="64" yunits="insetPixels"/>
      </IconStyle>
    </Style>`;
}

export function GET() {
  const styles = [...houses.map((h) => style(`house-${h.id}`, h.color)), style("campus", "#967228")].join("\n");

  const placemarks = houses
    .map((h, i) => {
      const residents = h.residents
        .map((r) => `${r.name}${r.nickname !== r.name ? ` (${r.nickname})` : ""}${r.phone ? ` — ${r.phone}` : ""}`)
        .join("<br>");
      const desc = `${fullAddress(h)}<br><br><b>Penghuni (${h.residents.length} orang):</b><br>${residents}`;
      return `    <Placemark>
      <name>${xml(`${i + 1}. ${h.name}`)}</name>
      <description><![CDATA[${desc}]]></description>
      <styleUrl>#house-${h.id}</styleUrl>
      <Point><coordinates>${h.lng},${h.lat},0</coordinates></Point>
    </Placemark>`;
    })
    .join("\n");

  const total = houses.reduce((n, h) => n + h.residents.length, 0);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Housing PKUMI–UCR 06 · Riverside</name>
    <description><![CDATA[Lokasi ${houses.length} rumah (${total} peserta) Short Course PKUMI–LPDP di UC Riverside, California.]]></description>
${styles}
    <Folder>
      <name>Housing</name>
${placemarks}
    </Folder>
    <Folder>
      <name>Kampus</name>
    <Placemark>
      <name>UC Riverside (${xml(UCR_CAMPUS.name)})</name>
      <description><![CDATA[900 University Ave, Riverside, CA 92521]]></description>
      <styleUrl>#campus</styleUrl>
      <Point><coordinates>${UCR_CAMPUS.lng},${UCR_CAMPUS.lat},0</coordinates></Point>
    </Placemark>
    </Folder>
  </Document>
</kml>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.google-earth.kml+xml; charset=utf-8",
      "Content-Disposition": 'attachment; filename="housing-pkumi-ucr.kml"',
    },
  });
}
