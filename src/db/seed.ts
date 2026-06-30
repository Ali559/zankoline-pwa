import { db, type Governorate } from "./schema";
import rawData from "@/data/faculties.json";

// Version your seed data so you know when it changes
const SEED_VERSION = "2025-01-01"; // Bump this when data changes

// Type for the JSON structure
interface FacultyData {
  [governorate: string]: {
    [university: string]: {
      [faculty: string]: Array<{
        department: string;
        evening: string;
        parallel: string;
        online: string;
      }>;
    };
  };
}

// Parse the threshold values (handle '-' as null)
const parseGrade = (value: string): number | null => {
  if (value === "-" || value === "") return null;
  return parseFloat(value);
};

export async function seedDatabase() {
  // 1. Check if we need to seed
  const needsSeeding = await checkIfNeedsSeeding();
  if (!needsSeeding) {
    return;
  }
  try {
    await db.transaction(
      "rw",
      db.universities,
      db.faculties,
      db.departments,
      db.thresholds,
      async () => {
        // Clear existing reference data (but NOT user data!)
        await db.universities.clear();
        await db.faculties.clear();
        await db.departments.clear();
        await db.thresholds.clear();

        const data = rawData as FacultyData;
        let universityId = 1;
        let facultyId = 1;
        let departmentId = 1;
        let thresholdId = 1;

        // Store references for lookups
        const universityMap = new Map<string, number>();
        const facultyMap = new Map<string, number>();
        const departmentMap = new Map<string, number>();

        for (const [governorate, universities] of Object.entries(data)) {
          const gov = governorate as Governorate;

          for (const [universityName, faculties] of Object.entries(
            universities,
          )) {
            // Create university
            const uniId = universityId++;
            universityMap.set(universityName, uniId);
            await db.universities.add({
              id: uniId,
              name: universityName,
              governorate: gov,
            });

            for (const [facultyName, departments] of Object.entries(
              faculties,
            )) {
              // Create faculty
              const facId = facultyId++;
              facultyMap.set(`${universityName}-${facultyName}`, facId);
              await db.faculties.add({
                id: facId,
                universityId: uniId,
                name: facultyName,
              });

              for (const deptData of departments) {
                // Create department
                const deptId = departmentId++;
                departmentMap.set(
                  `${facultyName}-${deptData.department}`,
                  deptId,
                );
                await db.departments.add({
                  id: deptId,
                  facultyId: facId,
                  name: deptData.department,
                });

                // Create thresholds for each grade type
                // For simplicity, using a generic academic year
                // You can make this configurable based on the data source
                const academicYear = "2024-2025";

                const threshold = {
                  id: thresholdId++,
                  departmentId: deptId,
                  academicYear,
                  gradeGeneral: parseGrade(deptData.online), // Assuming 'online' = general
                  gradeParallel: parseGrade(deptData.parallel),
                  gradeEvening: parseGrade(deptData.evening),
                };
                await db.thresholds.add(threshold);
              }
            }
          }
        }

        // Store the seed version so we know what's in the DB
        localStorage.setItem("zankoline-seed-version", SEED_VERSION);
      },
    );
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
    throw error;
  }
}

async function checkIfNeedsSeeding(): Promise<boolean> {
  // Check if we have ANY data
  const count = await db.universities.count();
  if (count === 0) {
    console.log("📦 No data found, seeding required");
    return true;
  }

  // Check if the version has changed
  const storedVersion = localStorage.getItem("zankoline-seed-version");
  if (storedVersion !== SEED_VERSION) {
    return true;
  }

  // Optional: Check if the data count matches expected (sanity check)
  // This is useful if someone manually cleared the DB
  const expectedCount = getExpectedCount();
  if (count !== expectedCount) {
    return true;
  }

  return false;
}

// Helper to get expected count - you can compute this or hardcode
function getExpectedCount(): number {
  // You could count this from the JSON data, or just hardcode
  // For simplicity, we'll just rely on the version check
  return -1; // Skip count check
}
