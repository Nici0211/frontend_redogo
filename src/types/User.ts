export interface User {
    id: number;
    name: string;
    streetName: string;
    postalCode:number;
    email: string;
    role: UserRole;
}

export const USER_ROLES = ['admin', 'restaurant', 'customer'] as const;
export type UserRole = (typeof USER_ROLES)[number];