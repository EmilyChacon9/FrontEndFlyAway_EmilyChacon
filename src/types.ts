export interface User {
    email: string;
    name: string;
    lastname: string;
    password: string;
}

export interface CreateUserDTO{
    email: string;
    name: string;
    lastname: string;
    password: string;    
}

// types.ts
export interface Flight {
  id: number;
  flightNumber: string;
  airlineName: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: number;
}

export interface Booking {
  id: number;
  bookingDate: string;
  flightId: number;
  flightNumber: string;
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
  estDepartureTime: string;
  estArrivalTime: string;
}

export interface BookingDetail {
  id: number;
  bookingDate: string;
  flightId: number;
  flightNumber: string;
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
  estDepartureTime: string;
  estArrivalTime: string;
}