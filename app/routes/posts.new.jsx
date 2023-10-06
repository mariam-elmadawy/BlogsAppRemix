import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { db } from "../data/db.server";
import { isLogged } from "../data/sessions.server";
//validation for the form inputs fields
function validateTitle(title) {
  if (typeof title !== "string" || title.length < 3) {
    return "The title must be have at least 3 characters";
  }
}
function validateContent(content) {
  if (typeof content !== "string" || content.length < 4) {
    return "The content must be have at least 4 characters";
  }
}
//bad request if there is an error
function badRequest(data) {
  return json(data, { status: 400 });
}

export async function action({ request }) {
  const postData = await request.formData();
  // const dataP = Object.fromEntries(postData);
  const title = postData.get("title");
  const content = postData.get("content");
  const user = await isLogged(request);
  const data = { title, content };

  const dataError = {
    title: validateTitle(title),
    content: validateContent(content),
  };
  if (Object.values(dataError).some(Boolean)) {
    console.log(dataError);
    return badRequest({ dataError, data });
  }

  const post = await db.post.create({ data: { ...data, userId: user.id } });
  return redirect(`/posts/${post.id}`);
}
function New() {
  const action = useActionData();
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="text-center py-8">
        <h1 className=" text-xl md:text-3xl uppercase tracking-wider mb-5">
          New Post
        </h1>
        <Link to="/" className="btn ">
          Back
        </Link>
      </div>
      <div
        className="m-6 bg-black rounded-xl text-white p-10
     flex-col gap-3  w-[70vw] "
      >
        <Form method="post">
          <div className="label">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="input"
              defaultValue={action?.data?.title}
            />
            <div>
              {action?.dataError?.title ? (
                <p className="text-red-500 text-sm">{action.dataError.title}</p>
              ) : null}
            </div>
          </div>
          <div className="label">
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              row="5"
              className="input"
              defaultValue={action?.data?.content}
            />
            <div>
              {action?.dataError?.content ? (
                <p className="text-red-500 text-sm">
                  {action.dataError.content}
                </p>
              ) : null}
            </div>
          </div>
          <div className="label">
            <button type="submit" className="btn-gray ">
              Add post
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default New;
