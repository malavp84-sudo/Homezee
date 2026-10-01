import { CategoryId, Listing } from './data';

export type Opt = { value: string | number; label: string };

// multi  : listing value is one of (or, for array values, overlaps) the selected options
// min    : listing value >= selected number      max : listing value <= selected number
// toggle : listing value is truthy when switched on
export type FilterDef =
  | { key: string; label: string; field: string; kind: 'multi'; options: Opt[]; quick?: boolean }
  | { key: string; label: string; field: string; kind: 'min' | 'max'; options: Opt[]; suffix?: string }
  | { key: string; label: string; field: string; kind: 'toggle'; quick?: boolean };

export type FilterState = Record<string, any>;

export type SortDef = { key: string; label: string; fn: (a: Listing, b: Listing) => number };

const val = (l: Listing, field: string) => (field in l ? (l as any)[field] : l.attrs[field]);

export function applyFilters(list: Listing[], defs: FilterDef[], state: FilterState): Listing[] {
  return list.filter((l) =>
    defs.every((d) => {
      const s = state[d.key];
      if (s === undefined || s === null || s === false || (Array.isArray(s) && s.length === 0)) return true;
      const v = val(l, d.field);
      switch (d.kind) {
        case 'multi':
          return Array.isArray(v) ? v.some((x) => s.includes(x)) : s.includes(v);
        case 'min':
          return v >= s;
        case 'max':
          return v <= s;
        case 'toggle':
          return !!v;
      }
    }),
  );
}

export const activeCount = (state: FilterState) =>
  Object.values(state).filter((s) => s !== undefined && s !== null && s !== false && !(Array.isArray(s) && s.length === 0)).length;

// ---------- reusable pieces ----------
const sortRecommended: SortDef = { key: 'rec', label: 'Recommended', fn: (a, b) => b.rating * Math.log(b.reviews + 2) - a.rating * Math.log(a.reviews + 2) };
const sortRating: SortDef = { key: 'rating', label: 'Rating: high to low', fn: (a, b) => b.rating - a.rating };
const sortReviews: SortDef = { key: 'reviews', label: 'Most reviewed', fn: (a, b) => b.reviews - a.reviews };
const sortNear: SortDef = { key: 'near', label: 'Distance: near to far', fn: (a, b) => a.distance - b.distance };
const sortFar: SortDef = { key: 'far', label: 'Distance: far to near', fn: (a, b) => b.distance - a.distance };
const sortPriceLow: SortDef = { key: 'plow', label: 'Price: low to high', fn: (a, b) => a.priceNum - b.priceNum };
const sortPriceHigh: SortDef = { key: 'phigh', label: 'Price: high to low', fn: (a, b) => b.priceNum - a.priceNum };

const rating: FilterDef = {
  key: 'rating', label: 'Rating', field: 'rating', kind: 'min',
  options: [{ value: 3.5, label: '3.5+ ⭐' }, { value: 4, label: '4.0+ ⭐' }, { value: 4.5, label: '4.5+ ⭐' }],
};
const distance: FilterDef = {
  key: 'distance', label: 'Distance', field: 'distance', kind: 'max',
  options: [{ value: 1, label: 'Within 1 km' }, { value: 2, label: 'Within 2 km' }, { value: 5, label: 'Within 5 km' }, { value: 10, label: 'Within 10 km' }],
};
const verified: FilterDef = { key: 'verified', label: '✔ Verified only', field: 'verified', kind: 'toggle', quick: true };
const areaOf = (areas: string[]): FilterDef => ({
  key: 'area', label: 'Location / Area', field: 'area', kind: 'multi', options: areas.map((a) => ({ value: a, label: a })),
});
const allAreas = ['Vijay Nagar', 'Palasia', 'Bhawarkuan', 'Scheme 78', 'Rau', 'Sudama Nagar'];
const opts = (...labels: string[]): Opt[] => labels.map((l) => ({ value: l, label: l }));

export type CategoryConfig = {
  searchHint: string;
  filters: FilterDef[];
  sorts: SortDef[];
};

export const config: Record<CategoryId, CategoryConfig> = {
  rental: {
    searchHint: 'Search flats, PG, area...',
    sorts: [
      sortRecommended,
      sortPriceLow,
      sortPriceHigh,
      sortNear,
      sortRating,
      { key: 'new', label: 'Newest first', fn: (a, b) => a.attrs.posted - b.attrs.posted },
    ],
    filters: [
      {
        key: 'bhk', label: 'BHK / Bedrooms', field: 'bhk', kind: 'multi', quick: true,
        options: [{ value: 0, label: '1 RK' }, { value: 1, label: '1 BHK' }, { value: 2, label: '2 BHK' }, { value: 3, label: '3 BHK' }, { value: 4, label: '4+ BHK' }],
      },
      {
        key: 'budget', label: 'Budget (per month)', field: 'priceNum', kind: 'max', suffix: 'max',
        options: [{ value: 7000, label: 'Under ₹7,000' }, { value: 10000, label: 'Under ₹10,000' }, { value: 15000, label: 'Under ₹15,000' }, { value: 25000, label: 'Under ₹25,000' }, { value: 50000, label: 'Under ₹50,000' }],
      },
      {
        key: 'baths', label: 'Bathrooms', field: 'baths', kind: 'min',
        options: [{ value: 1, label: '1+' }, { value: 2, label: '2+' }, { value: 3, label: '3+' }, { value: 4, label: '4+' }],
      },
      { key: 'ptype', label: 'Property type', field: 'ptype', kind: 'multi', options: opts('Flat', 'Independent House', 'PG / Hostel') },
      { key: 'furnishing', label: 'Furnishing', field: 'furnishing', kind: 'multi', options: opts('Furnished', 'Semi-furnished', 'Unfurnished') },
      { key: 'tenants', label: 'Preferred tenants', field: 'tenants', kind: 'multi', options: opts('Family', 'Bachelors', 'Students') },
      areaOf(allAreas),
      { key: 'parking', label: '🅿️ Parking', field: 'parking', kind: 'toggle', quick: true },
      { key: 'zero', label: '🎉 Zero brokerage', field: 'zeroBrokerage', kind: 'toggle', quick: true },
      verified,
      distance,
      rating,
    ],
  },
  food: {
    searchHint: 'Search tiffin, restaurants, snacks...',
    sorts: [sortRecommended, sortRating, sortPriceLow, sortPriceHigh, sortNear, sortReviews],
    filters: [
      { key: 'ftype', label: 'Type', field: 'ftype', kind: 'multi', quick: true, options: opts('Tiffin', 'Restaurant', 'Street food', 'Bakery') },
      { key: 'diet', label: 'Food preference', field: 'diet', kind: 'multi', options: opts('Veg', 'Non-veg', 'Jain') },
      {
        key: 'budget', label: 'Cost per person / meal', field: 'priceNum', kind: 'max',
        options: [{ value: 100, label: 'Under ₹100' }, { value: 200, label: 'Under ₹200' }, { value: 300, label: 'Under ₹300' }],
      },
      { key: 'delivery', label: '🛵 Home delivery', field: 'delivery', kind: 'toggle', quick: true },
      { key: 'late', label: '🌙 Open late night', field: 'late', kind: 'toggle', quick: true },
      areaOf(allAreas),
      verified,
      distance,
      rating,
    ],
  },
  doctor: {
    searchHint: 'Search doctor or speciality...',
    sorts: [
      sortRecommended,
      sortRating,
      { key: 'exp', label: 'Experience: high to low', fn: (a, b) => b.attrs.experience - a.attrs.experience },
      sortPriceLow,
      sortPriceHigh,
      sortNear,
    ],
    filters: [
      { key: 'speciality', label: 'Speciality', field: 'speciality', kind: 'multi', quick: true, options: opts('General Physician', 'Dentist', 'Pediatrician', 'Gynecologist', 'Orthopedic', 'Eye Specialist') },
      {
        key: 'fee', label: 'Consultation fee', field: 'priceNum', kind: 'max',
        options: [{ value: 400, label: 'Under ₹400' }, { value: 600, label: 'Under ₹600' }, { value: 1000, label: 'Under ₹1,000' }],
      },
      {
        key: 'exp', label: 'Experience', field: 'experience', kind: 'min',
        options: [{ value: 5, label: '5+ yrs' }, { value: 10, label: '10+ yrs' }, { value: 15, label: '15+ yrs' }],
      },
      { key: 'gender', label: 'Doctor gender', field: 'gender', kind: 'multi', options: opts('Female', 'Male') },
      { key: 'today', label: '📅 Available today', field: 'today', kind: 'toggle', quick: true },
      { key: 'home', label: '🏠 Home visit', field: 'homeVisit', kind: 'toggle', quick: true },
      areaOf(allAreas),
      verified,
      distance,
      rating,
    ],
  },
  shop: {
    searchHint: 'Search kirana, medical, electronics...',
    sorts: [sortRecommended, sortRating, sortNear, sortFar, sortReviews],
    filters: [
      { key: 'stype', label: 'Shop type', field: 'stype', kind: 'multi', quick: true, options: opts('Grocery', 'Medical', 'Electronics', 'Clothing', 'Hardware') },
      { key: 'delivery', label: '🛵 Home delivery', field: 'delivery', kind: 'toggle', quick: true },
      { key: 'discount', label: '🏷️ Has offers', field: 'discount', kind: 'toggle', quick: true },
      { key: 'late', label: '🌙 Open late / 24x7', field: 'late', kind: 'toggle' },
      areaOf(allAreas),
      verified,
      distance,
      rating,
    ],
  },
  transport: {
    searchHint: 'Search auto, cab, bike taxi...',
    sorts: [sortRecommended, sortPriceLow, sortPriceHigh, sortNear, sortRating],
    filters: [
      { key: 'ttype', label: 'Vehicle type', field: 'ttype', kind: 'multi', quick: true, options: opts('Auto', 'Cab', 'Bike taxi', 'E-rickshaw') },
      {
        key: 'fare', label: 'Fare per km', field: 'priceNum', kind: 'max',
        options: [{ value: 8, label: 'Under ₹8' }, { value: 12, label: 'Under ₹12' }, { value: 20, label: 'Under ₹20' }],
      },
      { key: 'ac', label: '❄️ AC', field: 'ac', kind: 'toggle', quick: true },
      { key: 'allDay', label: '⏰ Available 24x7', field: 'allDay', kind: 'toggle', quick: true },
      areaOf(allAreas),
      verified,
      distance,
      rating,
    ],
  },
  helper: {
    searchHint: 'Search bai, doodh wala, cook...',
    sorts: [
      sortRecommended,
      sortRating,
      { key: 'exp', label: 'Experience: high to low', fn: (a, b) => b.attrs.experience - a.attrs.experience },
      sortNear,
      sortReviews,
    ],
    filters: [
      { key: 'htype', label: 'Helper type', field: 'htype', kind: 'multi', quick: true, options: opts('Bai', 'Doodh wala', 'Sabji wala', 'Laundry', 'Cook', 'Driver') },
      { key: 'slot', label: 'Preferred time', field: 'slot', kind: 'multi', options: opts('Morning', 'Evening', 'Anytime') },
      {
        key: 'exp', label: 'Experience', field: 'experience', kind: 'min',
        options: [{ value: 3, label: '3+ yrs' }, { value: 5, label: '5+ yrs' }, { value: 10, label: '10+ yrs' }],
      },
      areaOf(allAreas),
      verified,
      distance,
      rating,
    ],
  },
};

const bhkLabel = (n: number) => (n === 0 ? '1 RK' : n >= 4 ? '4+ BHK' : `${n} BHK`);

// Short facts shown under the title on every card
export function metaOf(l: Listing): string[] {
  const a = l.attrs;
  switch (l.category) {
    case 'rental':
      return [bhkLabel(a.bhk), `${a.baths} Bath`, a.furnishing, a.ptype];
    case 'food':
      return [a.ftype, a.diet.join(' / '), a.delivery ? 'Delivery' : 'Dine-in'];
    case 'doctor':
      return [a.speciality, `${a.experience} yrs exp`, a.today ? 'Available today' : ''];
    case 'shop':
      return [a.stype, a.delivery ? 'Home delivery' : '', a.discount ? 'Offers' : ''];
    case 'transport':
      return [a.ttype, a.ac ? 'AC' : 'Non-AC', a.allDay ? '24x7' : ''];
    case 'helper':
      return [a.htype, a.slot.join(' / '), `${a.experience} yrs exp`];
  }
}
