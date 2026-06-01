"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";

export type SignupState = {
  error?: string;
  success?: string;
};

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["READER", "PUBLISHER"]),
});

export async function signupAction(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.name?.[0] ||
        parsed.error.flatten().fieldErrors.email?.[0] ||
        parsed.error.flatten().fieldErrors.password?.[0] ||
        parsed.error.flatten().fieldErrors.role?.[0] ||
        "Invalid signup data",
    };
  }

  const existingUser = await db.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (existingUser) {
    return {
      error: "User already exists. Please sign in instead.",
    };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      role: parsed.data.role,
    },
  });

  return {
    success: "Account created successfully. Please sign in.",
  };
}