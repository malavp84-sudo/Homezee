// Free geo helpers: OpenStreetMap Nominatim (search / reverse) and India Post (pincode lookup).

export type PlaceFields = {
  area: string;
  city: string;
  state: string;
  pincode: string;
  street: string;
  lat?: number;
  lng?: number;
  label?: string;
};

const NOMINATIM = 'https://nominatim.openstreetmap.org';

function fromNominatim(r: any): PlaceFields {
  const a = r.address ?? {};
  return {
    area: a.suburb || a.neighbourhood || a.city_district || a.quarter || a.hamlet || '',
    city: a.city || a.town || a.village || a.state_district || a.county || '',
    state: a.state || '',
    pincode: (a.postcode || '').replace(/\s/g, ''),
    street: a.road || '',
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    label: r.display_name,
  };
}

export async function searchPlaces(q: string): Promise<PlaceFields[]> {
  const url = `${NOMINATIM}/search?format=jsonv2&addressdetails=1&countrycodes=in&limit=6&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Search failed. Check your internet.');
  return (await res.json()).map(fromNominatim);
}

export async function reverseGeocode(lat: number, lng: number): Promise<PlaceFields> {
  const url = `${NOMINATIM}/reverse?format=jsonv2&addressdetails=1&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Could not read this location.');
  const r = await res.json();
  return { ...fromNominatim(r), lat, lng };
}

export async function lookupPincode(pin: string): Promise<{ city: string; state: string; areas: string[] } | null> {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const j = await res.json();
    const d = j?.[0];
    if (d?.Status !== 'Success' || !d.PostOffice?.length) return null;
    return {
      city: d.PostOffice[0].District,
      state: d.PostOffice[0].State,
      areas: d.PostOffice.map((p: any) => p.Name),
    };
  } catch {
    return null;
  }
}
