import * as yup from "yup";

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .required("Username is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  bio: yup
    .string()
    .max(200, "Bio must not exceed 200 characters")
    .optional(),
});

export type RegisterFormType = yup.InferType<typeof registerSchema>;
