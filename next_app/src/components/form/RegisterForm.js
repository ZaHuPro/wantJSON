import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { useForm, ErrorMessage } from "react-hook-form";
import {
  required_input_msg,
  email_invalid_msg,
  password_minLength_msg,
  repeat_password_not_match,
} from "../../msg";
import axios from '../../lib/axios';
export default function RegisterForm() {
  const [componentLoading, setComponentLoading] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    errors,
    setError,
    reset,
    formState,
  } = useForm({ mode: "onChange" });
  const router = useRouter();

  useEffect(() => {
    setComponentLoading(false)
  }, []);

  const onSubmit = async (data) => {
    let response = await axios('signup', 'post', data);
    if(response.success){
      localStorage.setItem('email_verify', data.email);
      reset();
      router.push('/email_verify')
    }else{
      response.message.map((m) => {
        setError(m.param, "invalid", m.msg);
      });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-item">
          <div className={`form-input${errors.email ? ' has-error' : ''}`}>
            <input
              type="text"
              ref={register({
                required: required_input_msg,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: email_invalid_msg,
                },
              })}
              name="email"
              required
            />
            <label>Your Email</label>
            <span className="error-block">
              <ErrorMessage errors={errors} name="email" />
            </span>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-item">
          <div className={`form-input${errors.password ? ' has-error' : ''}`}>
            <input
              type="password"
              ref={register({
                required: required_input_msg,
                minLength: {
                  value: 8,
                  message: password_minLength_msg,
                },
              })}
              name="password"
              required
            />
            <label>Password</label>
            <span className="error-block">
              <ErrorMessage errors={errors} name="password" />
            </span>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-item">
          <div className={`form-input${errors.repeat_password ? ' has-error' : ''}`}>
            <input
              type="password"
              ref={register({
                required: required_input_msg,
                validate: (value) =>
                  value === watch("password") || repeat_password_not_match,
              })}
              name="repeat_password"
              required
            />
            <label>Repeat Password</label>
            <span className="error-block">
              <ErrorMessage errors={errors} name="repeat_password" />
            </span>
          </div>
        </div>
      </div>


      <div className="form-row">
        <div className="form-item">
          <button
            type="submit"
            formNoValidate
            className="button large primary"
            disabled={!formState.isValid || formState.isSubmitting || componentLoading}
          >
            Register Now!
          </button>
        </div>
      </div>
    </form>
  );
}
