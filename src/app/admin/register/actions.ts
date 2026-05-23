"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const whatsapp = formData.get("whatsapp") as string | null;

  if (!email || !password || !name || !slug) {
    return { error: "Todos los campos obligatorios deben estar completos." };
  }

  const supabase = await createClient();

  // 1. Validar que el slug no esté tomado
  const { data: existingAccount } = await supabase
    .from("accounts")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existingAccount) {
    return { error: "La URL ya está en uso. Por favor, elige otra." };
  }

  // 2. Llama a supabase.auth.signUp()
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { error: "El correo ya existe. Por favor, inicia sesión." };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Hubo un error al crear el usuario." };
  }

  const userId = authData.user.id;

  // 3. Inserta un registro en la tabla accounts
  const { error: insertError } = await supabase
    .from("accounts")
    .insert({
      id: userId,
      user_id: userId,
      name,
      slug,
      whatsapp: whatsapp || null,
      plan: "basic",
    });

  if (insertError) {
    console.error("Error inserting account:", insertError);
    // Note: In a production app you might want to handle cleaning up the auth user here
    // or use a secure database trigger instead of client-side inserts.
    return { error: "Hubo un error al configurar tu cuenta. Intenta de nuevo." };
  }

  // 4. Redirige al usuario a /admin/dashboard
  redirect("/admin/dashboard");
}
