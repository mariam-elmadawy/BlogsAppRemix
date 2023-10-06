import { redirect } from "@remix-run/node";
import { db } from "../data/db.server";
import { Link, useLoaderData, Form } from "@remix-run/react";
import { isLogged } from "../data/sessions.server";
export const meta = () => {
  return [{ title: "Single Blog" }];
};
//loader data get data from the db
export async function loader({ params }) {
  const post = await db.post.findUnique({
    where: { id: params.id },
  });
  if (!post) {
    throw new Error("post not found");
  }
  const data = { post };
  return data;
}
//set delete post function
export async function action({ request, params }) {
  const formData = await request.formData();
  const user = await isLogged(request);
  if (formData.get("_method") === "delete") {
    const post = await db.post.findUnique({
      where: { id: params.id },
    });
    if (!post) {
      throw new Error("post not found");
    }
    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id: params.id } });
    }

    return redirect("/");
  }
}

export default function Post() {
  const { post } = useLoaderData();
  return (
    <div
      className="m-6 rounded-xl p-10
     mx-auto w-[50vw] bg-gray-100 flex flex-col"
    >
      <div className="flex justify-between items-center border-b-2 py-2">
        <h1 className="text-xl">{post.title}</h1>
        <Link to="/" className="btn">
          Back
        </Link>
      </div>
      <div className="my-4">
        <p className="my-4 text-gray-400">{post.updatedAt}</p>
        <p>{post.content}</p>
      </div>
      <Form method="post">
        <input type="hidden" name="_method" value="delete" />
        <button type="submit" className="btn-delete">
          Delete
        </button>
      </Form>
    </div>
  );
}
