import { siteConfig } from "@/config/site";

/** Half the width and height of the area shown around the school, in degrees. */
const SPAN = { lat: 0.004, lon: 0.008 };

/**
 * OpenStreetMap embed: no API key and no cookies. The CSP allows frames from openstreetmap.org only.
 * `loading="lazy"` keeps the map from slowing down the first paint.
 */
export function ContactMap() {
  const { lat, lon } = siteConfig.contact.map;
  const bbox = [lon - SPAN.lon, lat - SPAN.lat, lon + SPAN.lon, lat + SPAN.lat].join(",");
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const large = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;

  return (
    <figure className="contact-map">
      <iframe src={embed} title={`Map showing the location of ${siteConfig.name}`} loading="lazy" />
      <figcaption>
        <a href={large}>View a larger map</a>
      </figcaption>
    </figure>
  );
}
