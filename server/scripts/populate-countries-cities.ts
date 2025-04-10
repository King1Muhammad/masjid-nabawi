import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * This script populates the database with countries and major cities worldwide
 * Each country admin is created with username as the country name (lowercase)
 * Each city admin is created with username as the city name (lowercase)
 * All admins have the password "qw12er43" for testing purposes
 */

// The password hash for "qw12er43"
const DEFAULT_PASSWORD = "c42a30c7fd95ab585580a8657118ee8bd0d9908a6f629f5b3b300cedeecf9a10.e0de6ac7c53a6a03d67609ca11bae5ef";

// World countries and their major cities
const countriesAndCities = [
  // Africa
  {
    name: "Algeria",
    cities: ["Algiers", "Oran", "Constantine", "Annaba"]
  },
  {
    name: "Angola",
    cities: ["Luanda", "Huambo", "Lobito", "Benguela"]
  },
  {
    name: "Egypt",
    cities: ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan"]
  },
  {
    name: "Ethiopia",
    cities: ["Addis Ababa", "Dire Dawa", "Mek'ele", "Adama"]
  },
  {
    name: "Kenya",
    cities: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"]
  },
  {
    name: "Morocco",
    cities: ["Casablanca", "Rabat", "Marrakesh", "Fez", "Tangier"]
  },
  {
    name: "Nigeria",
    cities: ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt"]
  },
  {
    name: "South Africa",
    cities: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Bloemfontein"]
  },
  {
    name: "Tanzania",
    cities: ["Dar es Salaam", "Dodoma", "Mwanza", "Zanzibar City"]
  },
  
  // Asia
  {
    name: "Bangladesh",
    cities: ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet"]
  },
  {
    name: "China",
    cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Hong Kong", "Chongqing", "Tianjin", "Wuhan"]
  },
  {
    name: "India",
    cities: ["New Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Ahmedabad", "Jaipur"]
  },
  {
    name: "Indonesia",
    cities: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar"]
  },
  {
    name: "Iran",
    cities: ["Tehran", "Mashhad", "Isfahan", "Karaj", "Tabriz", "Shiraz"]
  },
  {
    name: "Iraq",
    cities: ["Baghdad", "Basra", "Mosul", "Erbil", "Najaf", "Karbala"]
  },
  {
    name: "Japan",
    cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo", "Fukuoka"]
  },
  {
    name: "Malaysia",
    cities: ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh", "Melaka"]
  },
  {
    name: "Pakistan",
    cities: ["Islamabad", "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Peshawar", "Multan", "Quetta"]
  },
  {
    name: "Philippines",
    cities: ["Manila", "Cebu", "Davao", "Quezon City", "Makati"]
  },
  {
    name: "Saudi Arabia",
    cities: ["Riyadh", "Jeddah", "Makkah", "Madinah", "Dammam", "Taif", "Tabuk"]
  },
  {
    name: "South Korea",
    cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju"]
  },
  {
    name: "Thailand",
    cities: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Krabi"]
  },
  {
    name: "Turkey",
    cities: ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa", "Konya"]
  },
  {
    name: "United Arab Emirates",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"]
  },
  {
    name: "Vietnam",
    cities: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hue", "Nha Trang"]
  },
  
  // Europe
  {
    name: "France",
    cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux", "Lille"]
  },
  {
    name: "Germany",
    cities: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Dusseldorf"]
  },
  {
    name: "Italy",
    cities: ["Rome", "Milan", "Naples", "Turin", "Florence", "Venice", "Bologna"]
  },
  {
    name: "Netherlands",
    cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"]
  },
  {
    name: "Poland",
    cities: ["Warsaw", "Krakow", "Lodz", "Wroclaw", "Poznan", "Gdansk"]
  },
  {
    name: "Russia",
    cities: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Sochi"]
  },
  {
    name: "Spain",
    cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Malaga"]
  },
  {
    name: "Sweden",
    cities: ["Stockholm", "Gothenburg", "Malmo", "Uppsala", "Vasteras"]
  },
  {
    name: "United Kingdom",
    cities: ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Liverpool", "Cardiff"]
  },
  
  // Americas
  {
    name: "Argentina",
    cities: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza", "La Plata"]
  },
  {
    name: "Brazil",
    cities: ["Brasilia", "Sao Paulo", "Rio de Janeiro", "Salvador", "Fortaleza", "Belo Horizonte"]
  },
  {
    name: "Canada",
    cities: ["Toronto", "Montreal", "Vancouver", "Ottawa", "Calgary", "Edmonton", "Quebec City"]
  },
  {
    name: "Colombia",
    cities: ["Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena"]
  },
  {
    name: "Mexico",
    cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Cancun"]
  },
  {
    name: "Peru",
    cities: ["Lima", "Arequipa", "Trujillo", "Cusco", "Chiclayo"]
  },
  {
    name: "United States",
    cities: ["Washington", "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
             "San Antonio", "San Diego", "Dallas", "San Francisco", "Austin", "Seattle", "Boston", 
             "Las Vegas", "Miami", "Atlanta", "Denver"]
  },
  
  // Oceania
  {
    name: "Australia",
    cities: ["Canberra", "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast"]
  },
  {
    name: "New Zealand",
    cities: ["Wellington", "Auckland", "Christchurch", "Hamilton", "Tauranga"]
  }
];

/**
 * Main function to populate the database with countries and cities
 */
export async function populateCountriesAndCities() {
  console.log("Starting to populate countries and cities...");
  
  // Create country admins
  for (const country of countriesAndCities) {
    const countrySlug = country.name.toLowerCase().replace(/\s+/g, '_');
    
    try {
      // Check if country admin already exists
      const existingCountry = await db.select().from(users).where(eq(users.username, countrySlug));
      
      if (existingCountry.length === 0) {
        // Create country admin
        await db.insert(users).values({
          username: countrySlug,
          name: country.name,
          email: `admin@${countrySlug}.com`,
          password: DEFAULT_PASSWORD,
          role: 'country_admin',
          status: 'active',
          is_admin: true,
        });
        
        console.log(`Created country admin for ${country.name}`);
      } else {
        console.log(`Country admin for ${country.name} already exists`);
      }
      
      // Create city admins for each city in the country
      for (const city of country.cities) {
        const citySlug = city.toLowerCase().replace(/\s+/g, '_');
        
        // Check if city admin already exists
        const existingCity = await db.select().from(users).where(eq(users.username, citySlug));
        
        if (existingCity.length === 0) {
          // Create city admin with managed_entities pointing to its country
          await db.insert(users).values({
            username: citySlug,
            name: city,
            email: `admin@${citySlug}.com`,
            password: DEFAULT_PASSWORD,
            role: 'city_admin',
            status: 'active',
            is_admin: true,
            managedEntities: JSON.stringify({ country: countrySlug }),
          });
          
          console.log(`Created city admin for ${city} in ${country.name}`);
        } else {
          console.log(`City admin for ${city} already exists`);
        }
      }
    } catch (error) {
      console.error(`Error creating admins for ${country.name}:`, error);
    }
  }
  
  console.log("Finished populating countries and cities!");
}

// Run the population function
populateCountriesAndCities()
  .then(() => console.log("Population complete"))
  .catch(error => {
    console.error("Error in population script:", error);
    process.exit(1);
  });