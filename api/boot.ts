// Seed route - creates admin account and default settings
app.get("/api/seed", async (c) => {
  try {
    const db = getDb();

    // Check if admin already exists
    let existing: any[] = [];
    try {
      existing = await db
        .select()
        .from(admins)
        .where(sql`${admins.email} = "admin@morocco-incoming.com"`)
        .limit(1);
    } catch (tableErr: any) {
      if (tableErr?.message?.includes("doesn't exist") || tableErr?.message?.includes("does not exist") || tableErr?.code === "ER_NO_SUCH_TABLE") {
        return c.json({
          error: "Database tables do not exist yet. Please ensure db:push has been executed.",
          hint: "Wait for the Railway container to finish its first startup, or check Railway logs.",
          detail: tableErr.message,
        }, 500);
      }
      throw tableErr;
    }

    if (existing.length > 0) {
      return c.json({ message: "Already seeded", adminExists: true });
    }

    // Create admin
    const hash = await bcrypt.hash("Admin@12345", 12);
    await db.insert(admins).values({
      email: "admin@morocco-incoming.com",
      passwordHash: hash,
      name: "Super Admin",
      role: "super_admin",
    });

    // Create site settings
    const settings = [
      { key: "agency_name", value: "Suenos Travel", group: "general" },
      { key: "email", value: "resa@suenos-travel.com", group: "general" },
      { key: "phone", value: "+212 661 925 611", group: "general" },
      { key: "whatsapp", value: "+212 661 925 611", group: "general" },
      { key: "address_agadir", value: "Hay Salam Imm Elbssita Av Ahaj Messoud El Wafkaoui & Av Abdellah Guenon Bur n13 2eme Etg.", group: "general" },
      { key: "address_casablanca", value: "CASABLANCA, PHILIPS BUSINESS CENTER 304 BOULEVARD MOHAMED 5, 6EME ETG BUR 602", group: "general" },
      { key: "facebook", value: "", group: "social" },
      { key: "instagram", value: "", group: "social" },
      { key: "linkedin", value: "", group: "social" },
      { key: "tiktok", value: "", group: "social" },
      { key: "license", value: "ODV-0564", group: "general" },
      { key: "iata", value: "54273844", group: "general" },
      { key: "hero_title", value: "Your Trusted DMC Partner in Morocco", group: "home" },
      { key: "hero_subtitle", value: "Tailor-made Morocco travel experiences for international agencies, tour operators, corporate groups, and private travelers.", group: "home" },
      { key: "meta_title", value: "Morocco Incoming by Suenos Travel | DMC Morocco", group: "seo" },
      { key: "meta_description", value: "Your trusted DMC partner in Morocco. Tailor-made tours, MICE, B2B services for travel agencies and tour operators.", group: "seo" },
      { key: "google_analytics", value: "", group: "pixels" },
      { key: "google_tag_manager", value: "", group: "pixels" },
      { key: "meta_pixel", value: "", group: "pixels" },
      { key: "tiktok_pixel", value: "", group: "pixels" },
      { key: "custom_head", value: "", group: "pixels" },
    ];

    for (const s of settings) {
      try { await db.insert(siteSettings).values(s); } catch {}
    }

    return c.json({
      success: true,
      message: "Database seeded successfully",
      admin: {
        email: "admin@morocco-incoming.com",
        password: "Admin@12345",
      },
      settingsCreated: settings.length,
    });
  } catch (err: any) {
    return c.json({ error: err.message || "Seed failed" }, 500);
  }
});
