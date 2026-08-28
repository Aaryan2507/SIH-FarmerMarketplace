// Mock user records for demo authentication. Passwords/OTPs are for
// prototype purposes only — never used with real credentials.

export const mockUsers = [
  {
    id: "f-101",
    role: "farmer",
    name: "Ramesh Patil",
    phone: "9876543210",
    email: "ramesh.patil@example.com",
    location: "Nashik, Maharashtra",
    farmName: "Patil Farms",
    memberSince: "2023-03-12",
    aadhaarVerified: true,
    avatar: null,
  },
  {
    id: "c-201",
    role: "consumer",
    name: "Aditi Sharma",
    phone: "9123456780",
    email: "aditi.sharma@example.com",
    location: "Pune, Maharashtra",
    memberSince: "2024-01-20",
    aadhaarVerified: true,
    avatar: null,
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        line1: "204, Green Meadows Apartments",
        line2: "Baner Road",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411045",
        isDefault: true,
      },
      {
        id: "addr-2",
        label: "Office",
        line1: "Tower B, Cybercity IT Park",
        line2: "Hinjewadi Phase 2",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411057",
        isDefault: false,
      },
    ],
  },
  {
    id: "w-301",
    role: "wholesaler",
    name: "Karan Mehta",
    phone: "9988776655",
    email: "karan.mehta@example.com",
    location: "Mumbai, Maharashtra",
    businessName: "Mehta Traders & Co.",
    gstNumber: "27ABCDE1234F1Z5",
    memberSince: "2022-11-05",
    aadhaarVerified: true,
    avatar: null,
  },
]

export function findUserByPhone(phone) {
  return mockUsers.find((u) => u.phone === String(phone).trim()) || null
}
