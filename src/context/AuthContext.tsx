import { createContext, useEffect, useState } from "react";
import { User } from "../types/User";
import bcrypt from "bcryptjs-react";

export interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, name: string, password: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      const user: User = JSON.parse(userString);
      setUser(user);
    }
  }, []);

  function saveUser(user: User) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  const login = (email: string, password: string) => {
    email = email.toLowerCase();
    const userString = localStorage.getItem("users");
    const users: User[] = userString ? JSON.parse(userString) : [];

    const matchedUser = users.find((e) => e.email === email);
    if (matchedUser) {
      if (bcrypt.compareSync(password, matchedUser.password)) {
        saveUser(matchedUser);
        setUser(matchedUser);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.setItem("currentUser", "");
    return setUser(null);
  };

  const register = (email: string, name: string, password: string) => {
    email = email.toLowerCase();
    name = name.toLowerCase();
    const usersString = localStorage.getItem("users");
    let users: User[] = [];
    if (usersString) {
      users = JSON.parse(usersString);
      if (users.find((v) => v.email === email)) {
        return false;
      }
    }
    const newUser: User = {
      name: name,
      email: email,
      password: bcrypt.hashSync(password),
      joinDate: Date.now(),
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    saveUser(newUser);
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
