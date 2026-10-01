export type CategoryId = 'rental' | 'food' | 'doctor' | 'shop' | 'transport' | 'helper';

export const categories: { id: CategoryId; label: string; title: string; emoji: string; color: string; tint: string }[] = [
  { id: 'rental', label: 'Rentals', title: 'Rental Homes', emoji: '🏠', color: '#0F766E', tint: '#D9F7F2' },
  { id: 'food', label: 'Food', title: 'Food & Tiffin', emoji: '🍛', color: '#EA580C', tint: '#FFE8D6' },
  { id: 'doctor', label: 'Doctors', title: 'Doctors & Clinics', emoji: '🩺', color: '#DC2626', tint: '#FFE0E0' },
  { id: 'shop', label: 'Shops', title: 'Local Shops', emoji: '🛒', color: '#7C3AED', tint: '#EDE4FF' },
  { id: 'transport', label: 'Transport', title: 'Transport', emoji: '🚕', color: '#2563EB', tint: '#DDEAFF' },
  { id: 'helper', label: 'Helpers', title: 'Daily Helpers', emoji: '🧹', color: '#D97706', tint: '#FFF0CC' },
];

export type Listing = {
  id: string;
  category: CategoryId;
  name: string;
  subtitle: string;
  area: string;
  rating: number;
  reviews: number;
  price: string;
  priceNum: number; // numeric price used for sort / budget filter (0 = not applicable)
  distance: number; // km from the user
  timing?: string;
  verified: boolean;
  zeroBrokerage?: boolean;
  phone: string;
  emoji: string;
  about: string;
  attrs: Record<string, any>;
};

export const cities = ['Indore', 'Pune', 'Jaipur', 'Bengaluru'];

export const listings: Listing[] = [
  // ---------- Rentals ----------
  { id: 'r1', category: 'rental', name: '2 BHK Flat, Owner Direct', subtitle: 'Semi-furnished, 2nd floor', area: 'Vijay Nagar', rating: 4.6, reviews: 12, price: '₹14,000 / month', priceNum: 14000, distance: 1.2, verified: true, zeroBrokerage: true, phone: '9999900001', emoji: '🏢', about: 'Spacious 2 BHK near main road, parking and water backup. Contact owner directly. No brokerage.', attrs: { bhk: 2, baths: 2, ptype: 'Flat', furnishing: 'Semi-furnished', tenants: ['Family', 'Bachelors'], parking: true, posted: 2, deposit: '₹28,000' } },
  { id: 'r2', category: 'rental', name: '1 RK for Students', subtitle: 'Furnished, WiFi included', area: 'Bhawarkuan', rating: 4.3, reviews: 8, price: '₹6,500 / month', priceNum: 6500, distance: 3.4, verified: true, zeroBrokerage: true, phone: '9999900002', emoji: '🛏️', about: 'Ideal for students and working singles. Close to coaching hubs and food streets.', attrs: { bhk: 0, baths: 1, ptype: 'Flat', furnishing: 'Furnished', tenants: ['Students', 'Bachelors'], parking: false, posted: 5, deposit: '₹10,000' } },
  { id: 'r3', category: 'rental', name: '3 BHK Independent House', subtitle: 'Unfurnished, garden', area: 'Palasia', rating: 4.8, reviews: 5, price: '₹25,000 / month', priceNum: 25000, distance: 4.1, verified: false, zeroBrokerage: true, phone: '9999900003', emoji: '🏡', about: 'Family-friendly house in a quiet lane, near schools and hospital.', attrs: { bhk: 3, baths: 3, ptype: 'Independent House', furnishing: 'Unfurnished', tenants: ['Family'], parking: true, posted: 9, deposit: '₹50,000' } },
  { id: 'r4', category: 'rental', name: '1 BHK Flat near Metro', subtitle: 'Semi-furnished, lift', area: 'Scheme 78', rating: 4.4, reviews: 15, price: '₹9,000 / month', priceNum: 9000, distance: 2.2, verified: true, zeroBrokerage: true, phone: '9999900004', emoji: '🏬', about: 'Compact 1 BHK for couples or working professionals. 24x7 security.', attrs: { bhk: 1, baths: 1, ptype: 'Flat', furnishing: 'Semi-furnished', tenants: ['Bachelors', 'Family'], parking: true, posted: 1, deposit: '₹18,000' } },
  { id: 'r5', category: 'rental', name: 'Boys PG with Meals', subtitle: 'Double sharing, meals included', area: 'Bhawarkuan', rating: 4.1, reviews: 22, price: '₹5,500 / month', priceNum: 5500, distance: 3, verified: true, zeroBrokerage: true, phone: '9999900005', emoji: '🛌', about: 'Clean PG with 3 meals, WiFi, laundry and a study room.', attrs: { bhk: 0, baths: 1, ptype: 'PG / Hostel', furnishing: 'Furnished', tenants: ['Students', 'Bachelors'], parking: false, posted: 3, deposit: '₹5,500' } },
  { id: 'r6', category: 'rental', name: '4 BHK Villa with Lawn', subtitle: 'Furnished, 2 car parking', area: 'Rau', rating: 4.9, reviews: 4, price: '₹42,000 / month', priceNum: 42000, distance: 9, verified: true, zeroBrokerage: true, phone: '9999900006', emoji: '🏰', about: 'Premium villa in a gated colony with garden and servant quarter.', attrs: { bhk: 4, baths: 4, ptype: 'Independent House', furnishing: 'Furnished', tenants: ['Family'], parking: true, posted: 12, deposit: '₹1,00,000' } },
  { id: 'r7', category: 'rental', name: '2 BHK Fully Furnished Flat', subtitle: 'AC in all rooms, modular kitchen', area: 'Palasia', rating: 4.5, reviews: 9, price: '₹16,500 / month', priceNum: 16500, distance: 4.4, verified: true, zeroBrokerage: false, phone: '9999900007', emoji: '🏢', about: 'Move-in ready flat in a popular locality. Close to markets and offices.', attrs: { bhk: 2, baths: 2, ptype: 'Flat', furnishing: 'Furnished', tenants: ['Family', 'Bachelors'], parking: true, posted: 4, deposit: '₹33,000' } },
  { id: 'r8', category: 'rental', name: '3 BHK Society Flat', subtitle: 'Gym, garden, clubhouse', area: 'Vijay Nagar', rating: 4.7, reviews: 11, price: '₹21,000 / month', priceNum: 21000, distance: 1.8, verified: true, zeroBrokerage: true, phone: '9999900008', emoji: '🏙️', about: 'Spacious flat in a gated society with 24x7 security and power backup.', attrs: { bhk: 3, baths: 3, ptype: 'Flat', furnishing: 'Semi-furnished', tenants: ['Family'], parking: true, posted: 7, deposit: '₹42,000' } },
  { id: 'r9', category: 'rental', name: '1 BHK Budget Flat', subtitle: 'Unfurnished, ground floor', area: 'Sudama Nagar', rating: 3.9, reviews: 6, price: '₹7,800 / month', priceNum: 7800, distance: 6.2, verified: false, zeroBrokerage: true, phone: '9999900009', emoji: '🏠', about: 'Affordable flat for small families. Near bus stop and vegetable market.', attrs: { bhk: 1, baths: 1, ptype: 'Flat', furnishing: 'Unfurnished', tenants: ['Family', 'Bachelors'], parking: false, posted: 6, deposit: '₹15,600' } },
  { id: 'r10', category: 'rental', name: 'Girls PG, Safe & Secure', subtitle: 'Single room, CCTV, meals', area: 'Vijay Nagar', rating: 4.6, reviews: 31, price: '₹6,800 / month', priceNum: 6800, distance: 1.5, verified: true, zeroBrokerage: true, phone: '9999900010', emoji: '🛏️', about: 'Women-only PG with warden, CCTV and homely food.', attrs: { bhk: 0, baths: 1, ptype: 'PG / Hostel', furnishing: 'Furnished', tenants: ['Students'], parking: false, posted: 2, deposit: '₹6,800' } },

  // ---------- Food ----------
  { id: 'f1', category: 'food', name: 'Annapurna Tiffin Service', subtitle: 'Home-style veg thali', area: 'Vijay Nagar', rating: 4.7, reviews: 96, price: '₹90 / meal', priceNum: 90, distance: 0.8, timing: 'Lunch 12-2, Dinner 7-9', verified: true, phone: '9999900011', emoji: '🍱', about: 'Monthly tiffin plans with home-cooked meals. Free delivery in the area.', attrs: { ftype: 'Tiffin', diet: ['Veg'], delivery: true, late: false } },
  { id: 'f2', category: 'food', name: 'Sarafa Night Chaat', subtitle: 'Local street food', area: 'Palasia', rating: 4.9, reviews: 340, price: '₹100 / person', priceNum: 100, distance: 4.5, timing: '8 PM - 12 AM', verified: true, phone: '9999900012', emoji: '🥘', about: 'The famous night market. Try poha-jalebi, bhutte ka kees and garadu.', attrs: { ftype: 'Street food', diet: ['Veg'], delivery: false, late: true } },
  { id: 'f3', category: 'food', name: "Bundela's Kitchen", subtitle: 'North Indian family restaurant', area: 'Scheme 78', rating: 4.3, reviews: 180, price: '₹250 / person', priceNum: 250, distance: 2.1, timing: '11 AM - 11 PM', verified: true, phone: '9999900013', emoji: '🍽️', about: 'Dal bafla, paneer dishes and tandoori. Family seating and home delivery.', attrs: { ftype: 'Restaurant', diet: ['Veg', 'Non-veg'], delivery: true, late: true } },
  { id: 'f4', category: 'food', name: "Mom's Tiffin", subtitle: 'Healthy, low-oil meals', area: 'Bhawarkuan', rating: 4.5, reviews: 58, price: '₹80 / meal', priceNum: 80, distance: 1.6, timing: 'Lunch 12-2, Dinner 7-9', verified: false, phone: '9999900014', emoji: '🥗', about: 'Students favourite. Weekly menu, Jain option available.', attrs: { ftype: 'Tiffin', diet: ['Veg', 'Jain'], delivery: true, late: false } },
  { id: 'f5', category: 'food', name: 'Bake Haven', subtitle: 'Cakes, breads and snacks', area: 'Vijay Nagar', rating: 4.6, reviews: 74, price: '₹150 / person', priceNum: 150, distance: 3.2, timing: '9 AM - 10 PM', verified: true, phone: '9999900015', emoji: '🎂', about: 'Fresh bakery with custom cakes and same-day delivery.', attrs: { ftype: 'Bakery', diet: ['Veg'], delivery: true, late: false } },
  { id: 'f6', category: 'food', name: 'Kebab Corner', subtitle: 'Biryani, kebabs, rolls', area: 'Rau', rating: 4.2, reviews: 120, price: '₹300 / person', priceNum: 300, distance: 2.7, timing: '12 PM - 12 AM', verified: true, phone: '9999900016', emoji: '🍗', about: 'Best non-veg in the area. Open late with fast delivery.', attrs: { ftype: 'Restaurant', diet: ['Non-veg'], delivery: true, late: true } },

  // ---------- Doctors ----------
  { id: 'd1', category: 'doctor', name: 'Dr. Meera Joshi', subtitle: 'General Physician', area: 'Vijay Nagar', rating: 4.8, reviews: 210, price: '₹400 consult', priceNum: 400, distance: 1.1, timing: '10 AM - 8 PM', verified: true, phone: '9999900021', emoji: '👩‍⚕️', about: '15 years of experience. Walk-in and appointment both available.', attrs: { speciality: 'General Physician', experience: 15, gender: 'Female', today: true, homeVisit: true } },
  { id: 'd2', category: 'doctor', name: 'Dr. Arjun Mehta', subtitle: 'Dentist, SmileCare Clinic', area: 'Bhawarkuan', rating: 4.5, reviews: 88, price: '₹300 consult', priceNum: 300, distance: 3.4, timing: '11 AM - 7 PM', verified: true, phone: '9999900022', emoji: '🦷', about: 'Cleaning, fillings and root canal at fair prices.', attrs: { speciality: 'Dentist', experience: 9, gender: 'Male', today: true, homeVisit: false } },
  { id: 'd3', category: 'doctor', name: 'Dr. Neha Verma', subtitle: 'Child Specialist', area: 'Palasia', rating: 4.9, reviews: 305, price: '₹500 consult', priceNum: 500, distance: 2.4, timing: '9 AM - 5 PM', verified: true, phone: '9999900023', emoji: '👶', about: 'Gentle paediatrician for newborns and kids. Vaccination clinic.', attrs: { speciality: 'Pediatrician', experience: 11, gender: 'Female', today: false, homeVisit: false } },
  { id: 'd4', category: 'doctor', name: 'Dr. Rakesh Patel', subtitle: 'Orthopedic Surgeon', area: 'Scheme 78', rating: 4.7, reviews: 142, price: '₹700 consult', priceNum: 700, distance: 3.9, timing: '4 PM - 9 PM', verified: true, phone: '9999900024', emoji: '🦴', about: 'Joint, back and sports injury specialist with 20 years of experience.', attrs: { speciality: 'Orthopedic', experience: 20, gender: 'Male', today: true, homeVisit: false } },
  { id: 'd5', category: 'doctor', name: 'Dr. Sana Khan', subtitle: 'Gynecologist', area: 'Vijay Nagar', rating: 4.8, reviews: 190, price: '₹600 consult', priceNum: 600, distance: 2, timing: '10 AM - 6 PM', verified: true, phone: '9999900025', emoji: '🤰', about: 'Women health and maternity care with female staff.', attrs: { speciality: 'Gynecologist', experience: 13, gender: 'Female', today: true, homeVisit: false } },
  { id: 'd6', category: 'doctor', name: 'Dr. Vikram Rao', subtitle: 'Eye Specialist', area: 'Rau', rating: 4.2, reviews: 61, price: '₹350 consult', priceNum: 350, distance: 6.5, timing: '12 PM - 8 PM', verified: false, phone: '9999900026', emoji: '👁️', about: 'Eye check-up, spectacles and cataract consultation.', attrs: { speciality: 'Eye Specialist', experience: 8, gender: 'Male', today: false, homeVisit: false } },

  // ---------- Shops ----------
  { id: 's1', category: 'shop', name: 'Gupta Kirana Store', subtitle: 'Groceries, free home delivery', area: 'Vijay Nagar', rating: 4.4, reviews: 54, price: 'MRP or less', priceNum: 0, distance: 0.6, timing: '7 AM - 10 PM', verified: true, phone: '9999900031', emoji: '🛍️', about: 'Everyday groceries with home delivery for orders above ₹200.', attrs: { stype: 'Grocery', delivery: true, late: false, discount: true } },
  { id: 's2', category: 'shop', name: 'HealthPlus Medical', subtitle: 'Medicines & health products', area: 'Palasia', rating: 4.6, reviews: 98, price: 'Up to 20% off', priceNum: 0, distance: 1.3, timing: 'Open 24 hours', verified: true, phone: '9999900032', emoji: '💊', about: 'Genuine medicines, discounts for monthly buyers and quick delivery.', attrs: { stype: 'Medical', delivery: true, late: true, discount: true } },
  { id: 's3', category: 'shop', name: 'Digi World Electronics', subtitle: 'Mobiles, TVs, repairs', area: 'Bhawarkuan', rating: 4.1, reviews: 37, price: 'Best price', priceNum: 0, distance: 3.5, timing: '10 AM - 9 PM', verified: false, phone: '9999900033', emoji: '📱', about: 'Authorised dealer with repair service and easy EMI.', attrs: { stype: 'Electronics', delivery: false, late: false, discount: false } },
  { id: 's4', category: 'shop', name: 'Fashion Point', subtitle: 'Clothing for all ages', area: 'Scheme 78', rating: 4.3, reviews: 66, price: 'From ₹299', priceNum: 0, distance: 2.8, timing: '11 AM - 9 PM', verified: true, phone: '9999900034', emoji: '👗', about: 'Latest styles, festival offers and alterations.', attrs: { stype: 'Clothing', delivery: false, late: false, discount: true } },
  { id: 's5', category: 'shop', name: 'Sharma Hardware', subtitle: 'Tools, paint, plumbing', area: 'Rau', rating: 4.0, reviews: 19, price: 'Fair rates', priceNum: 0, distance: 5.1, timing: '9 AM - 8 PM', verified: false, phone: '9999900035', emoji: '🔧', about: 'Everything for home repairs and renovation.', attrs: { stype: 'Hardware', delivery: true, late: false, discount: false } },

  // ---------- Transport ----------
  { id: 't1', category: 'transport', name: 'City Auto Stand', subtitle: 'Autos, fixed rates', area: 'Rau', rating: 4.1, reviews: 33, price: '₹12 / km', priceNum: 12, distance: 0.9, timing: '24 hours', verified: false, phone: '9999900041', emoji: '🛺', about: 'Fixed-rate autos. Airport and railway drop available.', attrs: { ttype: 'Auto', ac: false, allDay: true } },
  { id: 't2', category: 'transport', name: 'QuickCab Services', subtitle: 'Sedan & SUV cabs', area: 'Vijay Nagar', rating: 4.6, reviews: 120, price: '₹16 / km', priceNum: 16, distance: 1.4, timing: '24 hours', verified: true, phone: '9999900042', emoji: '🚕', about: 'AC cabs for city, airport and outstation trips with verified drivers.', attrs: { ttype: 'Cab', ac: true, allDay: true } },
  { id: 't3', category: 'transport', name: 'ZipRide Bike Taxi', subtitle: 'Quick rides, beat the traffic', area: 'Palasia', rating: 4.2, reviews: 45, price: '₹7 / km', priceNum: 7, distance: 0.7, timing: '6 AM - 11 PM', verified: true, phone: '9999900043', emoji: '🏍️', about: 'Fast and cheap rides for short distances. Helmet provided.', attrs: { ttype: 'Bike taxi', ac: false, allDay: false } },
  { id: 't4', category: 'transport', name: 'E-Rickshaw Point', subtitle: 'Eco-friendly short rides', area: 'Bhawarkuan', rating: 3.9, reviews: 18, price: '₹8 / km', priceNum: 8, distance: 2, timing: '7 AM - 9 PM', verified: false, phone: '9999900044', emoji: '🛵', about: 'Shared and private e-rickshaws for local trips.', attrs: { ttype: 'E-rickshaw', ac: false, allDay: false } },

  // ---------- Daily helpers ----------
  { id: 'h1', category: 'helper', name: 'Sunita Bai', subtitle: 'Cleaning & utensils', area: 'Vijay Nagar', rating: 4.7, reviews: 41, price: '₹1,500 / month', priceNum: 1500, distance: 0.5, timing: '7-10 AM', verified: true, phone: '9999900051', emoji: '🧹', about: 'Reliable, 8 years of experience in nearby societies.', attrs: { htype: 'Bai', slot: ['Morning'], experience: 8 } },
  { id: 'h2', category: 'helper', name: 'Ramu Doodh Wala', subtitle: 'Fresh cow & buffalo milk', area: 'Vijay Nagar', rating: 4.6, reviews: 77, price: '₹60 / litre', priceNum: 60, distance: 0.7, timing: '6-8 AM daily', verified: true, phone: '9999900052', emoji: '🥛', about: 'Pure milk delivered to your door every morning.', attrs: { htype: 'Doodh wala', slot: ['Morning'], experience: 10 } },
  { id: 'h3', category: 'helper', name: 'Kishan Sabji Wala', subtitle: 'Fresh vegetables cart', area: 'Palasia', rating: 4.5, reviews: 62, price: 'Market rate', priceNum: 0, distance: 1.9, timing: '5-9 PM', verified: false, phone: '9999900053', emoji: '🥦', about: 'Fresh seasonal vegetables at your gate every evening.', attrs: { htype: 'Sabji wala', slot: ['Evening'], experience: 6 } },
  { id: 'h4', category: 'helper', name: 'QuickPress Laundry', subtitle: 'Wash, iron, pickup', area: 'Bhawarkuan', rating: 4.4, reviews: 29, price: '₹10 / cloth', priceNum: 10, distance: 3.1, timing: 'Pickup 9-12 AM', verified: true, phone: '9999900054', emoji: '👕', about: 'Doorstep pickup and delivery within 48 hours.', attrs: { htype: 'Laundry', slot: ['Morning'], experience: 4 } },
  { id: 'h5', category: 'helper', name: 'Kamla Cook', subtitle: 'Home cook, veg & non-veg', area: 'Scheme 78', rating: 4.8, reviews: 36, price: '₹3,000 / month', priceNum: 3000, distance: 2.3, timing: '7-9 AM, 6-8 PM', verified: true, phone: '9999900055', emoji: '👩‍🍳', about: 'Cooks two meals a day. Knows North Indian and Maharashtrian dishes.', attrs: { htype: 'Cook', slot: ['Morning', 'Evening'], experience: 12 } },
  { id: 'h6', category: 'helper', name: 'Raju Driver', subtitle: 'Car driver, full or part time', area: 'Rau', rating: 4.3, reviews: 14, price: '₹12,000 / month', priceNum: 12000, distance: 5.6, timing: 'Flexible', verified: true, phone: '9999900056', emoji: '🚗', about: '7 years of city driving experience. Valid licence and police verification.', attrs: { htype: 'Driver', slot: ['Anytime'], experience: 7 } },
  { id: 'h7', category: 'helper', name: 'Geeta Bai', subtitle: 'Sweeping, mopping, dishes', area: 'Palasia', rating: 4.4, reviews: 23, price: '₹1,200 / month', priceNum: 1200, distance: 1.7, timing: '4-7 PM', verified: false, phone: '9999900057', emoji: '🧼', about: 'Evening cleaning service for working families.', attrs: { htype: 'Bai', slot: ['Evening'], experience: 5 } },
  { id: 'h8', category: 'helper', name: 'Sharma Dhobi & Iron', subtitle: 'Ironing and dry clean', area: 'Vijay Nagar', rating: 4.2, reviews: 17, price: '₹8 / cloth', priceNum: 8, distance: 1.0, timing: '4-8 PM', verified: true, phone: '9999900058', emoji: '👔', about: 'Quick ironing with pickup from your gate.', attrs: { htype: 'Laundry', slot: ['Evening'], experience: 15 } },
];

export const helperQuick = [
  { key: 'Bai', label: 'Bai', emoji: '🧹', tint: '#FFF0CC' },
  { key: 'Doodh wala', label: 'Doodh', emoji: '🥛', tint: '#E0F2FE' },
  { key: 'Sabji wala', label: 'Sabji', emoji: '🥦', tint: '#DCFCE7' },
  { key: 'Laundry', label: 'Laundry', emoji: '👕', tint: '#EDE4FF' },
];

export const specialities = [
  { id: 'sp1', title: 'Poha-Jalebi', place: 'Best breakfast', emoji: '🥞', colors: ['#FF9A44', '#FF6B6B'] as const },
  { id: 'sp2', title: 'Sarafa Bazaar', place: 'Night food market', emoji: '🌙', colors: ['#7C3AED', '#C084FC'] as const },
  { id: 'sp3', title: 'Maheshwari Sarees', place: 'Handloom', emoji: '🥻', colors: ['#DB2777', '#F472B6'] as const },
  { id: 'sp4', title: 'Rajwada Palace', place: 'Heritage', emoji: '🏰', colors: ['#0F766E', '#2DD4BF'] as const },
];
