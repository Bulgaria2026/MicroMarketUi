import { z } from "zod";

export const emailField = z.email("Enter a valid email address");
export const passwordField = z.string().min(8, "Password must be at least 8 characters");
export const passwordLoginField = z.string().min(1, "Password is required");
