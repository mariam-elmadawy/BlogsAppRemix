import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcrypt";

//login function
export async function login({ username, password }) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) return null;
  //check password if it is correct or no
  const isCorrectPassword = bcrypt.compare(password, user.password);
  if (!isCorrectPassword) return null;
  return user;
}

//signup function
export function signup({ username, password }) {
  const pass = bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      password,
    },
  });
}

// Create session storage
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("No session secret Founded");
const storage = createCookieSessionStorage({
  cookie: {
    name: "remixblog",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true,
  },
});

// Create user session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
//get user session
export function getUser(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}
//check if the user has logged in
export async function isLogged(request: Request) {
  const session = await getUser(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (e) {
    return null;
  }
}
//logout and remove user record from cookies
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/auth/logout", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
