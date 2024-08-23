import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "./LoginPage.css";
import { getUser, login } from "../../services/userServices";
import { Navigate, useLocation } from "react-router-dom";

const schema = z.object({
  email: z
    .string()
    .email({ message: "Please enter valid email address." })
    .min(3, { message: "email should be at least 3 charactes." }),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters." }),
});

const LoginPage = () => {
  const location = useLocation();
  console.log("Login location: ", location);
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  //   console.log(formState.errors);
  //   console.log(register("name"));
  //   const nameRef = useRef(null);
  //   const phoneRef = useRef(null);

  //   const [user, setUser] = useState({ name: "", phone: "" });

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // const user = {
  //     //   name: "",
  //     //   phone: 0,
  //     // };
  //     // user.name = nameRef.current.value;
  //     // user.phone = parseInt(phoneRef.current.value);
  //     console.log(user);
  //   };

  const onSubmit = async (formData) => {
    try {
      const data = await login(formData);
      // console.log("login response", data);
      const { state } = location;
      window.location = state ? state.form : "/";
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(err.response.data.message);
        setFormError(err.response.data.message);
      }
    }
  };

  if (getUser()) {
    return <Navigate to="/" />;
  }
  return (
    <section className="align_center form_page">
      <form
        action=""
        className="authentication_form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2>Login Form</h2>
        <div className="form_inputs">
          <div>
            <label htmlFor="email">Email</label>
            {/* <input
              type="text"
              id="name"
              //   ref={nameRef}
              className="form_text_input"
              placeholder="Enter your name"
              //   onChange={(e) => setUser({ ...user, name: e.target.value })}
              //   value={user.name}
              {...register("name", { required: true, minLength: 3 })}
            />
            {errors.name?.type === "required" && (
              <em className="form_error">Please enter your name</em>
            )}
            {errors.name?.type === "minLength" && (
              <em className="form_error">
                Name should be 3 or more characters
              </em>
            )} */}
            <input
              type="email"
              id="email"
              //   ref={nameRef}
              className="form_text_input"
              placeholder="Enter your email"
              //   onChange={(e) => setUser({ ...user, name: e.target.value })}
              //   value={user.name}
              {...register("email")}
            />
            {errors.email && (
              <em className="form_error">{errors.email.message}</em>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            {/* <input
              type="text"
              id="phone"
              //   ref={phoneRef}
              className="form_text_input"
              placeholder="Enter your phone number"
              //   onChange={(e) =>
              //     setUser({ ...user, phone: parseInt(e.target.value) })
              //   }
              //   value={user.phone}
              {...register("phone", { valueAsNumber: true })}
            /> */}
            <input
              type="password"
              id="password"
              //   ref={phoneRef}
              className="form_text_input"
              placeholder="Enter your password"
              //   onChange={(e) =>
              //     setUser({ ...user, phone: parseInt(e.target.value) })
              //   }
              //   value={user.phone}
              {...register("password")}
            />
            {errors.password && (
              <em className="form_error">{errors.password.message}</em>
            )}
          </div>

          {formError && <em className="form_error">{formError}</em>}
          <button type="submit" className="search_button form_submit">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
