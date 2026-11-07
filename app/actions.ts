"use server";

import { headers } from "next/headers";
import { careers, clientIp, contact, newsletter, type FormState } from "@/lib/server/forms";

export type { FormState };

// Contact
export async function submitContact(_: FormState, fd: FormData): Promise<FormState> {
  return (await contact(fd, clientIp(await headers()))).state;
}

// Newsletter
export async function subscribe(_: FormState, fd: FormData): Promise<FormState> {
  return (await newsletter(fd, clientIp(await headers()))).state;
}

// Careers
export async function apply(_: FormState, fd: FormData): Promise<FormState> {
  return (await careers(fd, clientIp(await headers()))).state;
}
