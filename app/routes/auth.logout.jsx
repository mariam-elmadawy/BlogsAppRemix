import { redirect } from "@remix-run/node";
import { logout } from "../data/sessions.server";

export async function action({ request }) {
  return logout(request);
}
export async function loader() {
  return redirect("/");
}
