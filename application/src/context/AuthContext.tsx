import { createContext, useEffect, useState } from "react";
import { deleteAccountService, loginService, registerService, updateProfileService as updateUserService } from "../shared/services/AuthService";

export interface AuthContextValue {
  token: string | null;
  updateCurrentToken: () => void;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  register: (email: string, username: string, password: string) => Promise<string | null>;
  deleteUser: () => Promise<string | null>;
  updateUser: (email: string, username: string) => Promise<string | null>;
  updatePassword: (currentEmail: string, passwordHash: string) => void;
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

  useEffect(updateCurrentToken, []);

  function updateCurrentToken() {
    const token = localStorage.getItem("token");
    if (token && token.length > 0) {
      setToken(token);
    }
  }

  async function login(email: string, password: string): Promise<string | null> {
    const [token, error] = await loginService({
      email: email,
      password: password,
    });
    if (token) {
      localStorage.setItem("token", token);
    }
    return error;
  }

  const logout = () => {
    localStorage.setItem("token", "");
    setToken(null);
  };

  async function register(
    email: string,
    username: string,
    password: string
  ): Promise<string | null> {
    const error = await registerService({ email, username, password });
    return error;
  }

  async function deleteUser(): Promise<string | null> {
    const error = deleteAccountService(token!);
    if (error) {
      return error;
    }
    logout();
    return null;
  }

  async function updateUser(
    email: string,
    username: string,
  ): Promise<string | null> {
    const error = updateUserService(token!, {
      email: email,
      username: username,
    });
    return error;
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

  return (
    <AuthContext.Provider
      value={{
        token: token,
        updateCurrentToken: updateCurrentToken,
        login: login,
        logout: logout,
        register: register,
        deleteUser: deleteUser,
        updateUser: updateUser,
        updatePassword: updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
