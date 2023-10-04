import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ReactNode } from "react";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="bg-black text-white w-full uppercase tracking-wider px-20 py-4 flex justify-between ">
        <h1 className="text-2xl">Blogs</h1>
        <ul className="flex items-center gap-4 text-gray-500">
          <li>
            <NavLink to="/">Posts</NavLink>
          </li>
          <li>
            <NavLink to="/posts/new">New Post</NavLink>
          </li>
        </ul>
      </nav>
      <div>{children}</div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  if (!isRouteErrorResponse(error)) {
    let errorMessage = "Unknown error";
    return (
      <div>
        <h1>Uh oh ...</h1>
        <pre>{errorMessage}</pre>
      </div>
    );
  }
}
