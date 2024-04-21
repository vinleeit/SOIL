import { createContext, useEffect, useState } from "react";
import { User } from "../types/User";
import bcrypt from "bcryptjs-react";

export interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, name: string, password: string) => boolean;
  deleteUser: () => void;
  updateUser: (currentEmail: string, email: string, name: string) => void;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      const user: User = JSON.parse(userString);
      setUser(user);
    }
  }, []);

  function getUsersFromLocalStorage(): User[] {
    const usersString = localStorage.getItem("users");
    const users: User[] = usersString ? JSON.parse(usersString) : [];
    return users;
  }

  function deleteUser() {
    const deletedUser = user?.email;
    logout();
    let users = getUsersFromLocalStorage();
    users = users.filter((u) => u.email != deletedUser);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Save user object to currentUSer key in localstorage
  function saveUser(user: User) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  function updateUser(currentEmail: string, email: string, name: string) {
    let users = getUsersFromLocalStorage();
    const current = users.find((u) => u.email == currentEmail) as User;
    users = users.filter((u) => u.email != currentEmail);
    current.email = email;
    current.name = name;
    users.push(current);
    saveUser(current);
    setUser(current);
    localStorage.setItem("users", JSON.stringify(users));
  }
  function updatePassword(currentEmail: string, passwordHash: string) {
    let users = getUsersFromLocalStorage();
    const current = users.find((u) => u.email == currentEmail) as User;
    users = users.filter((u) => u.email != currentEmail);
    current.password = passwordHash;
    users.push(current);
    saveUser(current);
    setUser(current);
    localStorage.setItem("users", JSON.stringify(users));
  }

  const login = (email: string, password: string) => {
    email = email.toLowerCase();
    const users = getUsersFromLocalStorage();

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
        deleteUser,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
