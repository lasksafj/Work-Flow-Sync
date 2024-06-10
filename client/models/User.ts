export interface User {
    lastName: string | undefined;
    firstName: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    dateOfBirth: Date | undefined
}

export interface Jwt {
    token: string;
}

export interface Credentials extends Jwt {
    user: User;
}