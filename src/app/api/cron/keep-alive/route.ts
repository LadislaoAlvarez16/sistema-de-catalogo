import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // 1. Verificación de seguridad
    if (token !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration" },
        { status: 500 }
      );
    }

    // 2. Cliente con SERVICE_ROLE_KEY para evadir RLS en tareas de infra
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 3. Insertar un nuevo ping de infraestructura (Keep-Alive)
    const { error: insertError } = await supabase
      .from("infra_pings")
      .insert({}); // Inserción vacía, el id y created_at se generan solos por DB

    if (insertError) {
      console.error("Error inserting ping:", insertError);
      return NextResponse.json(
        { error: "Failed to insert ping" },
        { status: 500 }
      );
    }

    // 4. Limpieza automática: borrar registros con más de 30 días
    // Utilizamos el cliente de base de datos para borrar directamente evaluando la fecha
    // en lugar de traer los datos a memoria.
    
    // Obtenemos la fecha límite (hace 30 días) en formato ISO
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
    const cutoffDateString = date30DaysAgo.toISOString();

    const { error: deleteError } = await supabase
      .from("infra_pings")
      .delete()
      .lt("created_at", cutoffDateString);

    if (deleteError) {
      console.error("Error cleaning up old pings:", deleteError);
      // No cortamos la ejecución ni devolvemos 500 porque el ping principal (insert) fue exitoso,
      // pero logueamos el error para observabilidad.
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unhandled error in keep-alive cron:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
