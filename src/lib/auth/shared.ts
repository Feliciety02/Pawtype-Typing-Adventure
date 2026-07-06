import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const EMAIL_MAX_LENGTH = 254;

export const passwordHint = "Use 8+ characters with uppercase, lowercase, a number, and a symbol.";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(EMAIL_MAX_LENGTH, "Email is too long.")
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase());

export const signInPasswordSchema = z
  .string()
  .min(1, "Password is required.")
  .max(PASSWORD_MAX_LENGTH, "Password is too long.");

export const signUpPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, "Password is too long.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/\d/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a symbol.");

export const signInCredentialsSchema = z.object({
  email: emailSchema,
  password: signInPasswordSchema,
});

export const signUpCredentialsSchema = z.object({
  email: emailSchema,
  password: signUpPasswordSchema,
});

export type SignInCredentials = z.infer<typeof signInCredentialsSchema>;
export type SignUpCredentials = z.infer<typeof signUpCredentialsSchema>;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
