export interface Patient {
    id: number;
    name: string;
    phone: string;
    age: number;
    selectedService: string;
    selectedDoctor: string;
    selectedDate: Date;
    selectedTime: string;
    duration: number;
    endTime: string;
    cost: number;
    additionalCost: number;
    totalAmount: number;
    note: string;
    status: string;
}