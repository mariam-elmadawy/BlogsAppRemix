import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/data/db.server";
export const meta = () => {
  return [{ title: "posts App" }];
};
export async function loader() {
  const data = {
    posts: await db.post.findMany({
      take: 10,
      select: { id: true, title: true, addeddAt: true },
      orderBy: { addeddAt: "desc" },
    }),
  };
  return data;
}

export default function Posts() {
  const { posts } = useLoaderData();
  return (
    <main className="px-10 md:px-20 py-4 ">
      <div className="text-center py-8">
        <h1 className="text-xl md:text-3xl uppercase tracking-wider mb-5">
          Welcome to Remix Blogs Application
        </h1>
        <Link to="/posts/new" className="btn">
          New Post
        </Link>
      </div>
      <ul className="flex justify-center items-center flex-col gap-2 ">
        {posts.map((post) => {
          return (
            <li
              key={post.id}
              className=" bg-gray-100 rounded w-[50vw] p-4 h-fit "
            >
              <div className="border-b-2 border-black flex justify-between items-center gap-3 py-2">
                <h1 className="md:text-2xl text-md font-bold uppercase text-gray-950 ">
                  {post.title}
                </h1>
                <Link to={"/posts/" + post.id} className="text-xs md:text-sm">
                  View Details
                </Link>
              </div>

              <p className="text-gray-600 my-2">
                {new Date(post.addeddAt).toLocaleString()}
              </p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
