// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { validateToken } from './apis/authorize/login';
import { useAppDispatch } from './store/hooks';
import { userLogin } from './store/slices/userSlice';


interface AuthState {
    loading: boolean;
    isAuthenticated: boolean;
}

interface AuthContextProps extends AuthState {
    setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        loading: true,
        isAuthenticated: false,
    });


    const dispatch = useAppDispatch();

    useEffect(() => {

        async function prepare() {
            const response = await validateToken();

            if (response.status) {
                dispatch(userLogin(response.data));
                setState({
                    loading: false,
                    isAuthenticated: true,
                });

            }
            else {
                setState({
                    loading: false,
                    isAuthenticated: false,
                });

            }

        }
        prepare();

    }, [dispatch]);



    return (
        <AuthContext.Provider value={{ ...state, setState }}>
            {state.loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
