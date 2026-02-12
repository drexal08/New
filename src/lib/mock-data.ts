
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
};

export const MOCK_STATIONS = [
  'New York',
  'Washington DC',
  'Boston',
  'Philadelphia',
  'Chicago',
  'Los Angeles',
  'San Francisco',
  'Miami',
];

export const MOCK_ROUTES: BusRoute[] = [
  {
    id: '1',
    busName: 'Greyhound Express',
    type: 'Luxury',
    departureTime: '08:00 AM',
    arrivalTime: '12:30 PM',
    duration: '4h 30m',
    price: 45,
    availableSeats: 12,
    totalSeats: 40,
    origin: 'New York',
    destination: 'Washington DC',
    rating: 4.5,
  },
  {
    id: '2',
    busName: 'Peter Pan Bus',
    type: 'AC',
    departureTime: '10:15 AM',
    arrivalTime: '02:45 PM',
    duration: '4h 30m',
    price: 38,
    availableSeats: 5,
    totalSeats: 40,
    origin: 'New York',
    destination: 'Boston',
    rating: 4.2,
  },
  {
    id: '3',
    busName: 'MegaBus Silver',
    type: 'Sleeper',
    departureTime: '11:00 PM',
    arrivalTime: '06:00 AM',
    duration: '7h 00m',
    price: 65,
    availableSeats: 8,
    totalSeats: 30,
    origin: 'Chicago',
    destination: 'Washington DC',
    rating: 4.8,
  },
  {
    id: '4',
    busName: 'BoltBus Premium',
    type: 'Luxury',
    departureTime: '09:30 AM',
    arrivalTime: '01:00 PM',
    duration: '3h 30m',
    price: 42,
    availableSeats: 22,
    totalSeats: 40,
    origin: 'Philadelphia',
    destination: 'New York',
    rating: 4.4,
  },
  {
    id: '5',
    busName: 'CitySlicker',
    type: 'Non-AC',
    departureTime: '07:00 AM',
    arrivalTime: '10:00 AM',
    duration: '3h 00m',
    price: 25,
    availableSeats: 15,
    totalSeats: 45,
    origin: 'Boston',
    destination: 'New York',
    rating: 3.9,
  },
];
