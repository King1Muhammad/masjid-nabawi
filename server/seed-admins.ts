import { db } from './db';
import { users } from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

export interface AdminSeed {
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
  approvedById?: number;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Clears existing admins and recreates the admin hierarchy
 */
export async function recreateAdminHierarchy() {
  try {
    // Clear all existing admin accounts
    console.log('Clearing existing admin accounts...');
    await db.delete(users);
    console.log('All admin accounts deleted successfully!');

    // Define the admin hierarchy
    const adminHierarchy: AdminSeed[] = [
      // Global Admin - United Nations
      {
        username: 'united_nations',
        name: 'United Nations',
        email: 'un@global.org',
        password: 'qw12er43',
        role: 'global_admin',
        status: 'approved',
        location: 'New York, USA',
        latitude: 40.7128,
        longitude: -74.0060,
      },

      // Country Admins - Add major countries (will use these to seed initial data)
      {
        username: 'pakistan',
        name: 'Pakistan',
        email: 'pakistan@example.com',
        password: 'qw12er43',
        role: 'country_admin',
        status: 'approved',
        location: 'Islamabad, Pakistan',
        latitude: 33.6844,
        longitude: 73.0479,
        approvedById: 1, // Will be replaced with United Nations ID
      },
      {
        username: 'saudi_arabia',
        name: 'Saudi Arabia',
        email: 'saudi@example.com',
        password: 'qw12er43',
        role: 'country_admin',
        status: 'approved', 
        location: 'Riyadh, Saudi Arabia',
        latitude: 24.7136,
        longitude: 46.6753,
        approvedById: 1, // Will be replaced with United Nations ID
      },
      {
        username: 'usa',
        name: 'United States',
        email: 'usa@example.com',
        password: 'qw12er43',
        role: 'country_admin',
        status: 'approved',
        location: 'Washington DC, USA',
        latitude: 38.9072,
        longitude: -77.0369,
        approvedById: 1, // Will be replaced with United Nations ID
      },
      {
        username: 'uk',
        name: 'United Kingdom',
        email: 'uk@example.com',
        password: 'qw12er43',
        role: 'country_admin',
        status: 'approved',
        location: 'London, UK',
        latitude: 51.5074,
        longitude: -0.1278,
        approvedById: 1, // Will be replaced with United Nations ID
      },
      {
        username: 'canada',
        name: 'Canada',
        email: 'canada@example.com',
        password: 'qw12er43',
        role: 'country_admin',
        status: 'approved',
        location: 'Ottawa, Canada',
        latitude: 45.4215,
        longitude: -75.6972,
        approvedById: 1, // Will be replaced with United Nations ID
      },
      
      // City Admins - Add major cities in Pakistan
      {
        username: 'islamabad',
        name: 'Islamabad',
        email: 'islamabad@example.com',
        password: 'qw12er43',
        role: 'city_admin',
        status: 'approved',
        location: 'Islamabad, Pakistan',
        latitude: 33.6844,
        longitude: 73.0479,
        approvedById: 2, // Will be replaced with Pakistan ID
      },
      {
        username: 'lahore',
        name: 'Lahore',
        email: 'lahore@example.com',
        password: 'qw12er43',
        role: 'city_admin',
        status: 'approved',
        location: 'Lahore, Pakistan',
        latitude: 31.5204,
        longitude: 74.3587,
        approvedById: 2, // Will be replaced with Pakistan ID
      },
      {
        username: 'karachi',
        name: 'Karachi',
        email: 'karachi@example.com',
        password: 'qw12er43',
        role: 'city_admin',
        status: 'approved',
        location: 'Karachi, Pakistan',
        latitude: 24.8607,
        longitude: 67.0011,
        approvedById: 2, // Will be replaced with Pakistan ID
      },
      
      // Community Admins
      {
        username: 'muslim_community',
        name: 'Muslim Community',
        email: 'muslim@example.com',
        password: 'qw12er43',
        role: 'community_admin',
        status: 'approved',
        location: 'Global',
        approvedById: 1, // Global admin approval
      },
      {
        username: 'islamabad_community',
        name: 'Islamabad Community',
        email: 'isb_community@example.com',
        password: 'qw12er43',
        role: 'community_admin',
        status: 'approved',
        location: 'Islamabad, Pakistan',
        latitude: 33.6844,
        longitude: 73.0479,
        approvedById: 7, // Will be replaced with Islamabad ID
      },
      
      // Society Admin - Masjid Nabvi Qureshi Hashmi
      {
        username: 'muhammad_qureshi',
        name: 'Muhammad Qureshi',
        email: 'muhammadqureshi865@gmail.com',
        password: 'qw12er43',
        role: 'society_admin',
        status: 'approved',
        location: 'FGEHF G-11/4, Islamabad, Pakistan',
        latitude: 33.6529,
        longitude: 73.0181,
        approvedById: 7, // Will be replaced with Islamabad ID
      }
    ];

    // Insert the global admin first
    console.log('Creating United Nations global admin...');
    const hashedPassword = await hashPassword(adminHierarchy[0].password);
    const [globalAdmin] = await db.insert(users).values({
      username: adminHierarchy[0].username,
      name: adminHierarchy[0].name,
      email: adminHierarchy[0].email,
      password: hashedPassword,
      role: adminHierarchy[0].role,
      status: adminHierarchy[0].status,
      location: adminHierarchy[0].location,
      latitude: adminHierarchy[0].latitude,
      longitude: adminHierarchy[0].longitude,
    }).returning();
    
    console.log(`Created Global Admin: ${globalAdmin.name} (ID: ${globalAdmin.id})`);

    // Insert country admins
    console.log('Creating country admins...');
    for (let i = 1; i <= 5; i++) {
      const admin = adminHierarchy[i];
      const hashedPassword = await hashPassword(admin.password);
      const [createdAdmin] = await db.insert(users).values({
        username: admin.username,
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: admin.role,
        status: admin.status,
        location: admin.location,
        latitude: admin.latitude,
        longitude: admin.longitude,
        approvedById: globalAdmin.id,
      }).returning();
      console.log(`Created ${admin.name} admin (ID: ${createdAdmin.id})`);
      
      // Replace the temporary ID in our array with the real one
      adminHierarchy[i].approvedById = globalAdmin.id;
    }

    // Get Pakistan's ID for city admins
    const [pakistanAdmin] = await db.select().from(users).where(eq(users.username, 'pakistan'));
    
    // Insert city admins
    console.log('Creating city admins...');
    for (let i = 6; i <= 8; i++) {
      const admin = adminHierarchy[i];
      const hashedPassword = await hashPassword(admin.password);
      const [createdAdmin] = await db.insert(users).values({
        username: admin.username,
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: admin.role,
        status: admin.status,
        location: admin.location,
        latitude: admin.latitude,
        longitude: admin.longitude,
        approvedById: pakistanAdmin.id,
      }).returning();
      console.log(`Created ${admin.name} admin (ID: ${createdAdmin.id})`);
      
      // Replace the temporary ID in our array with the real one
      adminHierarchy[i].approvedById = pakistanAdmin.id;
    }

    // Get Islamabad's ID for community admins
    const [islamabadAdmin] = await db.select().from(users).where(eq(users.username, 'islamabad'));
    
    // Insert community admins
    console.log('Creating community admins...');
    
    // Global community - approved by UN
    const admin9 = adminHierarchy[9];
    const hashedPassword9 = await hashPassword(admin9.password);
    const [createdAdmin9] = await db.insert(users).values({
      username: admin9.username,
      name: admin9.name,
      email: admin9.email,
      password: hashedPassword9,
      role: admin9.role,
      status: admin9.status,
      location: admin9.location,
      latitude: admin9.latitude,
      longitude: admin9.longitude,
      approvedById: globalAdmin.id,
    }).returning();
    console.log(`Created ${admin9.name} admin (ID: ${createdAdmin9.id})`);
    
    // Islamabad community - approved by Islamabad admin
    const admin10 = adminHierarchy[10];
    const hashedPassword10 = await hashPassword(admin10.password);
    const [createdAdmin10] = await db.insert(users).values({
      username: admin10.username,
      name: admin10.name,
      email: admin10.email,
      password: hashedPassword10,
      role: admin10.role,
      status: admin10.status,
      location: admin10.location,
      latitude: admin10.latitude,
      longitude: admin10.longitude,
      approvedById: islamabadAdmin.id,
    }).returning();
    console.log(`Created ${admin10.name} admin (ID: ${createdAdmin10.id})`);
    
    // Insert society admin - Muhammad Qureshi for Masjid Nabvi
    console.log('Creating society admin...');
    const admin11 = adminHierarchy[11];
    const hashedPassword11 = await hashPassword(admin11.password);
    const [createdAdmin11] = await db.insert(users).values({
      username: admin11.username,
      name: admin11.name,
      email: admin11.email,
      password: hashedPassword11,
      role: admin11.role,
      status: admin11.status,
      location: admin11.location,
      latitude: admin11.latitude,
      longitude: admin11.longitude,
      approvedById: islamabadAdmin.id,
      cnic: '6110132400775',
      phoneNumber: '03468953268',
    }).returning();
    console.log(`Created ${admin11.name} admin (ID: ${createdAdmin11.id})`);

    console.log('Admin hierarchy created successfully!');
    return { success: true, message: 'Admin hierarchy reset and recreated successfully!' };
  } catch (error) {
    console.error('Error recreating admin hierarchy:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
}

// Execute if this file is run directly
if (require.main === module) {
  recreateAdminHierarchy()
    .then(result => {
      console.log(result.message);
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to recreate admin hierarchy:', error);
      process.exit(1);
    });
}