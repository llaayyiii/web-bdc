import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  SEED_PROFILES,
  SEED_SESSIONS,
  SEED_ASSIGNMENTS,
  SEED_ATTENDANCES,
} from "../src/lib/data/store";

// Baca .env.local secara manual tanpa dependensi tambahan
try {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn("Could not read .env.local", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE env variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("Connecting to Supabase at:", supabaseUrl);

  // 1. Seed Auth Users & Profiles
  console.log("\n--- Seeding Users to Auth & Profiles ---");
  const { data: existingUsersData } = await supabase.auth.admin.listUsers();
  const existingUsers = existingUsersData?.users || [];

  for (const profile of SEED_PROFILES) {
    let authUser = existingUsers.find((u) => u.email?.toLowerCase() === profile.email.toLowerCase());

    const rawPassword = profile.password || "secretPassword123";
    const passwordHash = bcrypt.hashSync(rawPassword, 10);

    if (!authUser) {
      console.log(`Creating Auth User: ${profile.email}`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: profile.email,
        password: rawPassword,
        email_confirm: true,
        user_metadata: {
          full_name: profile.full_name,
          nim_id: profile.nim_id,
        },
      });

      if (createError) {
        console.error(`Failed to create ${profile.email}:`, createError.message);
        continue;
      }
      authUser = newUser.user;
    } else {
      console.log(`Auth User already exists: ${profile.email} (${authUser.id}) - Updating password`);
      await supabase.auth.admin.updateUserById(authUser.id, {
        password: rawPassword,
        user_metadata: {
          full_name: profile.full_name,
          nim_id: profile.nim_id,
        },
      });
    }

    if (authUser) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: authUser.id,
          nim_id: profile.nim_id,
          full_name: profile.full_name,
          email: profile.email,
          role: profile.role,
          role_title: profile.role_title,
          division: profile.division,
          period: profile.period,
          location: profile.location,
          score: profile.score,
          completed_modules: profile.completed_modules,
          total_hours: profile.total_hours,
          password_hash: passwordHash,
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.error(`Error saving profile for ${profile.email}:`, profileError.message);
      } else {
        console.log(`Profile synced for: ${profile.full_name} (${profile.role}) with password_hash`);
      }
    }
  }

  // 2. Seed Meet Sessions
  console.log("\n--- Seeding Meet Sessions ---");
  for (const session of SEED_SESSIONS) {
    const { error } = await supabase.from("meet_sessions").upsert(
      {
        id: session.id,
        course_id: session.course_id,
        course_title: session.course_title,
        title: session.title,
        instructor: session.instructor,
        meet_url: session.meet_url,
        qr_token: session.qr_token,
        scheduled_at: session.scheduled_at,
        expires_at: session.expires_at,
        status: session.status,
      },
      { onConflict: "id" }
    );
    if (error) console.error("Session error:", error.message);
    else console.log(`Session synced: ${session.title}`);
  }

  // 3. Seed Assignments
  console.log("\n--- Seeding Assignments ---");
  for (const assign of SEED_ASSIGNMENTS) {
    const { error } = await supabase.from("assignments").upsert(
      {
        id: assign.id,
        course_id: assign.course_id,
        course_title: assign.course_title,
        title: assign.title,
        description: assign.description,
        deadline: assign.deadline,
        max_score: assign.max_score,
        submission_format: assign.submission_format,
      },
      { onConflict: "id" }
    );
    if (error) console.error("Assignment error:", error.message);
    else console.log(`Assignment synced: ${assign.title}`);
  }

  // 4. Verify Total Profiles in Supabase
  const { data: allProfiles, error: countErr } = await supabase.from("profiles").select("id, nim_id, full_name, email, role");
  if (countErr) {
    console.error("Count error:", countErr.message);
  } else {
    console.log("\nLive Supabase Profiles Table:");
    console.table(allProfiles);
  }

  console.log("\nSync with Supabase completed successfully!");
}

main().catch(console.error);
