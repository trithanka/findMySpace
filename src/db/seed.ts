import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { count, eq } from "drizzle-orm";
import { db } from ".";
import * as schema from "./schema";
import { localities, properties, propertyImages, user } from "./schema";
import { slugify } from "../lib/utils";

const GUWAHATI_LOCALITIES = [
  "Ganeshguri",
  "Six Mile",
  "Zoo Road",
  "Beltola",
  "Hatigaon",
  "Dispur",
  "Ulubari",
  "Paltan Bazaar",
  "Maligaon",
  "Jalukbari",
  "Kahilipara",
  "Chandmari",
  "Silpukhuri",
  "Uzan Bazar",
  "Bhangagarh",
  "Christian Basti",
  "Khanapara",
  "Panjabari",
  "Narengi",
  "Noonmati",
  "Rehabari",
  "Athgaon",
  "Fancy Bazaar",
  "Lachit Nagar",
  "Anil Nagar",
  "VIP Road",
] as const;

// Standalone auth instance without the Next.js cookie plugin so it can run
// outside a request scope.
const seedAuth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: { enabled: true },
});

async function seedLocalities() {
  await db
    .insert(localities)
    .values(
      GUWAHATI_LOCALITIES.map((name) => ({ name, slug: slugify(name) })),
    )
    .onConflictDoNothing();
  console.log(`Localities seeded (${GUWAHATI_LOCALITIES.length}).`);
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("SEED_ADMIN_EMAIL/PASSWORD not set — skipping admin user.");
    return;
  }
  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  if (existing) {
    console.log("Admin user already exists — skipping.");
    return;
  }
  await seedAuth.api.signUpEmail({
    body: { email, password, name: "Admin" },
  });
  console.log(`Admin user created: ${email}`);
}

const SAMPLE_PROPERTIES = [
  {
    title: "Boys PG near Ganeshguri flyover",
    type: "pg" as const,
    price: 5500,
    localityName: "Ganeshguri",
    landmark: "5 min walk from Ganeshguri flyover",
    genderPreference: "male" as const,
    furnishing: "semi_furnished" as const,
    amenities: ["WiFi", "Food / Mess", "Attached Bathroom", "Power Backup"],
    description:
      "Well-maintained boys PG with twin-sharing rooms, home-style meals twice a day and 24/7 water supply. Ideal for working professionals around Dispur.",
  },
  {
    title: "Girls PG with food, Zoo Road",
    type: "pg" as const,
    price: 6000,
    localityName: "Zoo Road",
    landmark: "Near Zoo Road Tiniali",
    genderPreference: "female" as const,
    furnishing: "fully_furnished" as const,
    amenities: ["WiFi", "Food / Mess", "CCTV", "Housekeeping", "Geyser"],
    description:
      "Safe and secure girls PG with CCTV, warden and nutritious meals. Single and twin sharing options available.",
  },
  {
    title: "2BHK family flat in Beltola",
    type: "rent" as const,
    price: 12000,
    deposit: 24000,
    localityName: "Beltola",
    landmark: "Near Beltola Bazaar",
    bedrooms: 2,
    furnishing: "unfurnished" as const,
    amenities: ["Parking", "Balcony"],
    description:
      "Spacious 2BHK on the first floor of an independent house. Family preferred. Separate meter, borewell water and covered parking.",
  },
  {
    title: "1BHK near Six Mile, ideal for couples",
    type: "rent" as const,
    price: 8500,
    deposit: 17000,
    localityName: "Six Mile",
    landmark: "Behind Excelcare Hospital",
    bedrooms: 1,
    furnishing: "semi_furnished" as const,
    amenities: ["Parking", "Geyser", "Balcony"],
    description:
      "Compact 1BHK with modular kitchen and attached bathroom. Walking distance from Six Mile bus stop and supermarkets.",
  },
  {
    title: "Riverside homestay, Uzan Bazar",
    type: "homestay" as const,
    price: 1800,
    localityName: "Uzan Bazar",
    landmark: "Near Brahmaputra riverfront",
    bedrooms: 1,
    furnishing: "fully_furnished" as const,
    amenities: ["WiFi", "AC", "Kitchen Access", "Housekeeping"],
    description:
      "Cozy riverside homestay with a view of the Brahmaputra. Perfect for tourists and short work stays. Home-cooked Assamese breakfast included.",
  },
  {
    title: "Family homestay near Kamakhya, Maligaon",
    type: "homestay" as const,
    price: 1500,
    localityName: "Maligaon",
    landmark: "15 min from Kamakhya temple",
    bedrooms: 2,
    furnishing: "fully_furnished" as const,
    amenities: ["WiFi", "Parking", "Kitchen Access", "Geyser"],
    description:
      "Warm family-run homestay for pilgrims and travellers visiting Kamakhya. Clean rooms, secure parking and local sightseeing help.",
  },
] as const;

async function seedSampleProperties() {
  const [{ value: existing }] = await db
    .select({ value: count() })
    .from(properties);
  if (existing > 0) {
    console.log("Properties already present — skipping samples.");
    return;
  }

  const allLocalities = await db.query.localities.findMany();
  const localityIdByName = new Map(allLocalities.map((l) => [l.name, l.id]));

  for (const sample of SAMPLE_PROPERTIES) {
    const { localityName, ...values } = sample;
    const localityId = localityIdByName.get(localityName);
    if (!localityId) continue;

    const [created] = await db
      .insert(properties)
      .values({
        ...values,
        localityId,
        priceUnit: sample.type === "homestay" ? "night" : "month",
        slug: `${slugify(sample.title)}`,
        amenities: [...values.amenities],
      })
      .returning({ id: properties.id });

    await db.insert(propertyImages).values(
      [0, 1, 2].map((n) => ({
        propertyId: created.id,
        url: `https://picsum.photos/seed/fms-${created.id}-${n}/1200/800`,
        sortOrder: n,
      })),
    );
  }
  console.log(`Sample properties seeded (${SAMPLE_PROPERTIES.length}).`);
}

async function main() {
  await seedLocalities();
  await seedAdmin();
  await seedSampleProperties();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
