import { redirect } from "@remix-run/node";

import { Form, Link } from "@remix-run/react";
import { db } from "../data/db.server";
export const meta = () => {
  return [{ title: "Add Blogs" }];
};

export async function action({ request }) {
  const postData = await request.formData();
  const dataP = Object.fromEntries(postData);
  const post = await db.post.create({ data: dataP });
  return redirect(`/posts/${post.id}`);
}
function New() {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="text-center py-8">
        <h1 className="text-3xl uppercase tracking-wider mb-5">New Post</h1>
        <Link to="/" className="btn ">
          Back
        </Link>
      </div>
      <div
        className="m-6 bg-black rounded-xl text-white p-10
     flex-col gap-3 text-center w-[40vw] "
      >
        <Form method="post">
          <div className="label">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="input"
            />
          </div>
          <div className="label">
            <label htmlFor="content">content</label>
            <textarea name="content" required row="5" className="input" />
          </div>
          <button type="submit" className="btn-reverse ">
            Add post
          </button>
        </Form>
      </div>
    </div>
  );
}

export default New;
