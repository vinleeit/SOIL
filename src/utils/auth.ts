import { User } from "../types/User";
import bcyrpt from "bcryptjs-react";

function login(email: string, password: string): boolean {
  const userString = localStorage.getItem("users");
  const users: User[] = userString ? JSON.parse(userString) : [];

  const matchedUser = users.find((e) => e.email === email);
  if (matchedUser) {
    if (bcyrpt.compareSync(password, matchedUser.password)) {
      setUser(matchedUser);
      return true;
    }
  }
  return false;
}

function setUser(user: User) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function register(email: string, name: string, password: string): boolean {
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
    password: bcyrpt.hashSync(password),
    joinDate: Date.now(),
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  setUser(newUser);
  return true;
}

export { login, register };
