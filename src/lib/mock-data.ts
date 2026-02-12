
export type BusRoute = {
  id: string;
  busName: string;
  type: 'AC' | 'Non-AC' | 'Sleeper' | 'Luxury';
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  origin: string;
  destination: string;
  rating: number;
  busPark: string;
};

export const MOCK_STATIONS = [
  'Kigali',
  'Musanze',
  'Rubavu',
  'Huye',
  'Rusizi',
  'Rwamagana',
  'Nyagatare',
  'Muhanga',
];

export const MOCK_ROUTES: BusRoute[] = [
  {
    id: '1',
    busName: 'Volcano Express',
    type: 'Luxury',
    departureTime: '07:00 AM',
    arrivalTime: '10:00 AM',
    duration: '3h 00m',
    price: 3500,
    availableSeats: 10,
    totalSeats: 30,
    origin: 'Kigali',
    destination: 'Huye',
    rating: 4.8,
    busPark: 'Nyabugogo Bus Park',
  },
  {
    id: '2',
    busName: 'Ritco',
    type: 'AC',
    departureTime: '08:30 AM',
    arrivalTime: '12:00 PM',
    duration: '3h 30m',
    price: 3200,
    availableSeats: 15,
    totalSeats: 45,
    origin: 'Kigali',
    destination: 'Rubavu',
    rating: 4.2,
    busPark: 'Nyabugogo Bus Park',
  },
  {
    id: '3',
    busName: 'Horizon Express',
    type: 'Non-AC',
    departureTime: '09:00 AM',
    arrivalTime: '11:30 AM',
    duration: '2h 30m',
    price: 2500,
    availableSeats: 5,
    totalSeats: 35,
    origin: 'Kigali',
    destination: 'Musanze',
    rating: 4.0,
    busPark: 'Nyabugogo Bus Park',
  },
  {
    id: '4',
    busName: 'Stella Express',
    type: 'Luxury',
    departureTime: '06:00 AM',
    arrivalTime: '11:00 AM',
    duration: '5h 00m',
    price: 5500,
    availableSeats: 12,
    totalSeats: 30,
    origin: 'Kigali',
    destination: 'Rusizi',
    rating: 4.6,
    busPark: 'Nyabugogo Bus Park',
  },
  {
    id: '5',
    busName: 'Jaguar Executive',
    type: 'Sleeper',
    departureTime: '08:00 PM',
    arrivalTime: '06:00 AM',
    duration: '10h 00m',
    price: 15000,
    availableSeats: 8,
    totalSeats: 25,
    origin: 'Kigali',
    destination: 'Kampala',
    rating: 4.9,
    busPark: 'Nyabugogo Bus Park',
  },
  {
    id: '6',
    busName: 'Royal Express',
    type: 'AC',
    departureTime: '02:00 PM',
    arrivalTime: '03:30 PM',
    duration: '1h 30m',
    price: 1800,
    availableSeats: 20,
    totalSeats: 40,
    origin: 'Kigali',
    destination: 'Muhanga',
    rating: 4.3,
    busPark: 'Nyabugogo Bus Park',
  },
];
