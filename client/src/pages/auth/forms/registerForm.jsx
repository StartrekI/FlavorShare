import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../../../public/assets/logo.svg";
import "../../../styles/register.css";
import Spinner from "../../../components/Spinner.jsx";
import API_BASE_URL from "../../../constant.js";

const RegisterForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Log the registration attempt
      // console.log("Registering with values:", values);

      // Make the API call
      const response = await axios.post(`${API_BASE_URL}/api/v1/users/register`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      // Log the API response
      // console.log("Registration response:", response);

      // Display success message and navigate
      message.success("Registration successful");
      navigate("/auth/login");
    } catch (err) {
      // Log the error response
      if (err.response) {
        // console.error("Error response:", err.response);
        if (err.response.status === 409) {
          message.error("Email or username already exists. Please try again.");
        } else {
          message.error("Registration failed. Please try again later.");
        }
      } else {
        // Handle network or unexpected errors
        // console.error("Unexpected error:", err);
        message.error("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <Form form={form} onFinish={onFinish}>
        <div className="registerFormLogo">
          <img src={logo} alt="logo" />
          <h2>Create a new account</h2>
        </div>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Username" className="formInput" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Email" className="formInput" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" className="formInput" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            {loading ? <Spinner /> : "Register"}
          </Button>
          <Link to="/auth/login">Already have an account? Login</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
