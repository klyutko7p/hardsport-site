interface User {
    id: number;
    usernameTG: string;
    phoneNumber: string;
    password: string;
    repeatPassword?: string;
    role: string;
    bookings: Booking[],
    onlineBooking: OnlineBooking[];
    subscription: Subscription[];
    profile: {
        name: string;
        surname: string;
        gender: string;
        age: number;
        height: number;
        weight: number;
        userId: number;
    },
}