import { createContext, useEffect, useState } from "react";
import { User } from "../types/User";
import bcrypt from "bcryptjs-react";
import { loginService } from "../shared/services/AuthService";

export interface AuthContextValue {
  token: string | null;
  updateCurrentToken: () => void;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  register: (email: string, name: string, password: string) => boolean;
  deleteUser: () => void;
  updateUser: (currentEmail: string, email: string, name: string) => void;
  updatePassword: (currentEmail: string, passwordHash: string) => void;
  checkRegister: (email: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
/*
 * Component to provide authentication context to widget tree
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);

  async function login(email: string, password: string): Promise<string | null> {
    const [token, error] = await loginService(email, password);
    if (token) {
      localStorage.setItem("token", token);
    }
    return error;
  }

  function updateCurrentToken() {
    const token = localStorage.getItem("token")
    if (token && token.length > 0) {
      setToken(token);
    }
  }

  useEffect(updateCurrentToken, []);

  function deleteUser() {
    // const deletedUser = user?.email;
    // logout();
    // let users = getUsersFromLocalStorage();
    // users = users.filter((u) => u.email != deletedUser);
    // localStorage.setItem("users", JSON.stringify(users));
  }

  function updateUser(currentEmail: string, email: string, name: string) {
    // let users = getUsersFromLocalStorage();
    // const current = users.find((u) => u.email == currentEmail) as User;
    // users = users.filter((u) => u.email != currentEmail);
    // current.email = email;
    // current.name = name;
    // setUser(current);
    // localStorage.setItem("users", JSON.stringify(users));
  }
  function updatePassword(currentEmail: string, passwordHash: string) {
    // let users = getUsersFromLocalStorage();
    // const current = users.find((u) => u.email == currentEmail) as User;
    // users = users.filter((u) => u.email != currentEmail);
    // current.password = passwordHash;
    // users.push(current);
    // setUser(current);
    // localStorage.setItem("users", JSON.stringify(users));
  }

  // const login = (email: string, password: string) => {
  //   email = email.toLowerCase();
  //   const users = getUsersFromLocalStorage();

  //   const matchedUser = users.find((e) => e.email === email);
  //   if (matchedUser) {
  //     if (bcrypt.compareSync(password, matchedUser.password)) {
  //       setUser(matchedUser);
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  const logout = () => {
    localStorage.setItem("token", "");
    return setToken(null);
  };

  const checkRegister = (email: string) => {
    email = email.toLowerCase();
    const usersString = localStorage.getItem("users");
    let users: User[] = [];
    if (usersString) {
      users = JSON.parse(usersString);
      if (users.find((v) => v.email === email)) {
        return false;
      }
    }
    return true;
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
    setToken(null);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        updateCurrentToken,
        login,
        logout,
        register,
        deleteUser,
        updateUser,
        updatePassword,
        checkRegister
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
