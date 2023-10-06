import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React from "react";
import { Link } from "react-router-dom";
import { db } from "../data/db.server";
import { signup, createUserSession } from "../data/sessions.server";

export const meta = () => {
  return [{ title: "SignUp" }];
};
//vaidation of the form inputs
function validateUsername(username) {
  if (typeof username !== "string" || username.length < 4) {
    return "The username must be have at least 4 characters";
  }
}
function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return "The password must be have at least 6 characters";
  }
}
//bad request if there is an error
function badRequest(data) {
  return json(data, { status: 400 });
}
export const action = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const data = { username, password };
  const dataError = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(dataError).some(Boolean)) {
    console.log(dataError);
    return badRequest({ dataError, data });
  }
  //check if the user has login or no
  const userExists = await db.user.findFirst({
    where: {
      username,
    },
  });
  if (userExists) {
    return badRequest({
      data,
      dataError: { username: `username ${username} is already exists` },
    });
  }
  const user = await signup({ username, password });
  if (!user) {
    return badRequest({ data, dataError });
  }
  return createUserSession(user.id, "/");
};
export default function SignUp() {
  const action = useActionData();
  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className=" text-xl md:text-3xl uppercase tracking-wider mb-5 py-8">
        SignUp
      </h1>
      <div className="m-6 bg-gray-200 rounded-xl p-10 flex-col gap-3 w-[70vw] ">
        <Form method="post">
          <div className="label">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="input"
              defaultValue={action?.data?.username}
            />
            <div>
              {action?.dataError?.username ? (
                <p className="text-red-500 text-sm">
                  {action.dataError.username}
                </p>
              ) : null}
            </div>
          </div>
          <div className="label">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="input"
              defaultValue={action?.data?.password}
            />
            <div>
              {action?.dataError?.password ? (
                <p className="text-red-500 text-sm">
                  {action.dataError.password}
                </p>
              ) : null}
            </div>
          </div>
          <div className="label">
            <h1 className="text-sm text-center">
              You Have an Account?
              <Link
                to="/auth/login"
                className="text-md font-bold px-2 text-red-600"
              >
                Login
              </Link>
            </h1>
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
