"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["READER", "PUBLISHER"]),
});

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    throw new Error("Invalid signup data");
  }

  const existingUser = await db.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
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

  redirect("/auth");
}