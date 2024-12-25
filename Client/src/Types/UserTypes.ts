
export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture? :string,
  
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
   
  }
  