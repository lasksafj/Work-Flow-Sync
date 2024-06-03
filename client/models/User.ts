export interface User {
    username: string | undefined;
    last_name: string | undefined;
    first_name: string | undefined;
    email: string | undefined;
    phone_number: string | undefined;
    date_of_birth: string | undefined
}

export interface Jwt {
    token: string;
}

export interface Credentials extends Jwt {
    user: User;
}