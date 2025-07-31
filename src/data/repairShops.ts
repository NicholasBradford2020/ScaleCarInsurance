/**
 * repairShops.ts
 * 
 * This file contains the centralized data model and mock data for repair shops
 * used throughout the AI-powered car insurance claims system.
 * 
 * Key Features:
 * - TypeScript interface for repair shop data structure
 * - Mock data for 5 different repair shops with realistic information
 * - Utility function to find shops by ID
 * - Centralized data source for consistency across components
 * 
 * This data is used in:
 * - RepairShops.tsx (main repair shops directory)
 * - ClaimDetails.tsx (repair shop assignment)
 * - NewClaim.tsx (default shop assignment)
 */

/**
 * RepairShop Interface
 * 
 * Defines the complete data structure for a repair shop in the system.
 * Includes contact information, ratings, specialties, and operational details.
 */
export interface RepairShop {
  id: string                    // Unique identifier for the repair shop
  name: string                  // Business name
  address: string              // Street address
  city: string                 // City name
  state: string                // State abbreviation
  zipCode: string              // ZIP code
  phone: string                // Contact phone number
  email: string                // Contact email address
  website: string              // Business website URL
  rating: number               // Average customer rating (0-5 scale)
  reviewCount: number          // Number of customer reviews
  specialties: string[]        // Array of repair specialties
  certifications: string[]     // Array of professional certifications
  distance: number             // Distance from customer location (miles)
  estimatedWaitTime: string    // Estimated repair completion time
  isOpen: boolean              // Whether the shop is currently open
  hours: {                     // Operating hours for each day
    [key: string]: string      // Day of week -> hours string
  }
}

/**
 * Mock Repair Shops Data
 * 
 * Realistic sample data for 5 different repair shops with varying specialties,
 * ratings, and operational details. This data simulates a real-world scenario
 * where customers can choose from multiple approved vendors.
 */
export const repairShops: RepairShop[] = [
  {
    id: 'shop_001',
    name: 'Premium Auto Body & Paint',
    address: '123 Main Street',
    city: 'Downtown',
    state: 'CA',
    zipCode: '90210',
    phone: '(555) 123-4567',
    email: 'info@premiumautobody.com',
    website: 'www.premiumautobody.com',
    rating: 4.8,
    reviewCount: 127,
    specialties: ['Collision Repair', 'Paint & Body', 'Frame Straightening'],
    certifications: ['I-CAR Gold Class', 'ASE Certified'],
    distance: 2.3,
    estimatedWaitTime: '3-5 days',
    isOpen: true,
    hours: {
      'Monday': '8:00 AM - 6:00 PM',
      'Tuesday': '8:00 AM - 6:00 PM',
      'Wednesday': '8:00 AM - 6:00 PM',
      'Thursday': '8:00 AM - 6:00 PM',
      'Friday': '8:00 AM - 6:00 PM',
      'Saturday': '9:00 AM - 4:00 PM',
      'Sunday': 'Closed'
    }
  },
  {
    id: 'shop_002',
    name: 'Express Collision Center',
    address: '456 Oak Avenue',
    city: 'Midtown',
    state: 'CA',
    zipCode: '90211',
    phone: '(555) 987-6543',
    email: 'service@expresscollision.com',
    website: 'www.expresscollision.com',
    rating: 4.5,
    reviewCount: 89,
    specialties: ['Quick Repairs', 'Minor Dents', 'Scratch Removal'],
    certifications: ['I-CAR Silver Class'],
    distance: 4.1,
    estimatedWaitTime: '1-2 days',
    isOpen: true,
    hours: {
      'Monday': '7:00 AM - 7:00 PM',
      'Tuesday': '7:00 AM - 7:00 PM',
      'Wednesday': '7:00 AM - 7:00 PM',
      'Thursday': '7:00 AM - 7:00 PM',
      'Friday': '7:00 AM - 7:00 PM',
      'Saturday': '8:00 AM - 5:00 PM',
      'Sunday': 'Closed'
    }
  },
  {
    id: 'shop_003',
    name: 'Classic Car Restoration',
    address: '789 Vintage Lane',
    city: 'Historic District',
    state: 'CA',
    zipCode: '90212',
    phone: '(555) 456-7890',
    email: 'restore@classiccars.com',
    website: 'www.classiccars.com',
    rating: 4.9,
    reviewCount: 203,
    specialties: ['Classic Restoration', 'Custom Paint', 'Metal Fabrication'],
    certifications: ['I-CAR Gold Class', 'ASE Master Certified'],
    distance: 6.7,
    estimatedWaitTime: '2-4 weeks',
    isOpen: false,
    hours: {
      'Monday': '9:00 AM - 5:00 PM',
      'Tuesday': '9:00 AM - 5:00 PM',
      'Wednesday': '9:00 AM - 5:00 PM',
      'Thursday': '9:00 AM - 5:00 PM',
      'Friday': '9:00 AM - 5:00 PM',
      'Saturday': '10:00 AM - 3:00 PM',
      'Sunday': 'Closed'
    }
  },
  {
    id: 'shop_004',
    name: 'Modern Auto Solutions',
    address: '321 Tech Drive',
    city: 'Innovation District',
    state: 'CA',
    zipCode: '90213',
    phone: '(555) 789-0123',
    email: 'contact@modernauto.com',
    website: 'www.modernauto.com',
    rating: 4.6,
    reviewCount: 156,
    specialties: ['Hybrid/Electric', 'Advanced Diagnostics', 'Computer Systems'],
    certifications: ['I-CAR Gold Class', 'ASE Hybrid/Electric'],
    distance: 3.8,
    estimatedWaitTime: '2-3 days',
    isOpen: true,
    hours: {
      'Monday': '8:00 AM - 6:00 PM',
      'Tuesday': '8:00 AM - 6:00 PM',
      'Wednesday': '8:00 AM - 6:00 PM',
      'Thursday': '8:00 AM - 6:00 PM',
      'Friday': '8:00 AM - 6:00 PM',
      'Saturday': '9:00 AM - 4:00 PM',
      'Sunday': 'Closed'
    }
  },
  {
    id: 'shop_005',
    name: 'Quick Fix Auto Body',
    address: '654 Speed Way',
    city: 'Fast Lane',
    state: 'CA',
    zipCode: '90214',
    phone: '(555) 321-6540',
    email: 'quick@quickfixauto.com',
    website: 'www.quickfixauto.com',
    rating: 4.2,
    reviewCount: 67,
    specialties: ['Same Day Repairs', 'Minor Collisions', 'Paint Touch-ups'],
    certifications: ['I-CAR Silver Class'],
    distance: 1.9,
    estimatedWaitTime: 'Same day',
    isOpen: true,
    hours: {
      'Monday': '6:00 AM - 8:00 PM',
      'Tuesday': '6:00 AM - 8:00 PM',
      'Wednesday': '6:00 AM - 8:00 PM',
      'Thursday': '6:00 AM - 8:00 PM',
      'Friday': '6:00 AM - 8:00 PM',
      'Saturday': '7:00 AM - 6:00 PM',
      'Sunday': '8:00 AM - 4:00 PM'
    }
  }
]

/**
 * Get Repair Shop by ID
 * 
 * Utility function to find a specific repair shop by its unique identifier.
 * Returns undefined if no shop is found with the given ID.
 * 
 * @param id - The unique identifier of the repair shop to find
 * @returns RepairShop object if found, undefined otherwise
 * 
 * @example
 * const shop = getRepairShopById('shop_001')
 * if (shop) {
 *   console.log(`Found shop: ${shop.name}`)
 * }
 */
export const getRepairShopById = (id: string): RepairShop | undefined => {
  return repairShops.find(shop => shop.id === id)
} 