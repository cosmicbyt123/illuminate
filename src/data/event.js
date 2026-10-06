/**
 * Centralized Event Configuration
 * Unconfirmed items use [ADD ...] placeholders as instructed.
 */

export const EVENT_DATA = {
  name: "ILLUMINATE 2026",
  tagline: "Empowering The Next Generation of Changemakers",
  badge: "National Entrepreneurship Flagship Initiative",
  offerBadge: "EARLY BIRD OFFER ACTIVE",
  organizer: {
    name: "NEC Team, Entrepreneurship Cell",
    college: "Raghu Engineering College (Autonomous)",
    city: "Visakhapatnam",
    collegeUrl: "https://raghuenggcollege.com",
    partner: "E-Cell, IIT Bombay",
    partnerUrl: "https://www.ecell.in"
  },
  dates: {
    display: "October 13, 2026",
    time: "09:30 AM - 04:00 PM",
    duration: "1-Day Intensive Masterclass",
  },
  venue: {
    name: "Raghu Engineering College",
    address: "Raghu Engineering College, Dakamarri, Bheemunipatnam Mandal, Visakhapatnam, Andhra Pradesh 531162",
    mapUrl: "https://maps.google.com/?q=Raghu+Engineering+College+Visakhapatnam"
  },
  pricing: {
    currency: "₹",
    price: "₹799",
    earlyBirdPrice: "₹799 Solo / ₹699 Squad",
    regularPrice: "[ADD REGULAR PRICE]",
    individual: {
      price: 799,
      displayPrice: "₹799",
      label: "Individual Delegate",
      description: "Solo access for 1 student"
    },
    group: {
      pricePerHead: 699,
      teamSize: 4,
      totalPrice: 2796,
      displayPrice: "₹2,796",
      perHeadDisplay: "₹699 / head",
      label: "Squad Pass (Fixed 4 Members)",
      description: "Fixed 4 members • ₹699 per head (₹2,796 total) • Save ₹400"
    },
    includes: ["Official Certificate", "Founder Masterclass", "Startup Toolkit"]
  },
  payment: {
    upiId: "9391183459@ybl",
    qrCodeImage: "/assets/payment/qr-code.png",
    groupQrCodeImage: "/assets/payment/qr-code-group.png",
    payeeName: "illuminate",
    whatsappGroupUrl: "https://chat.whatsapp.com/LtSa3ftDjZT7jmwGwK4nUM",
    instructions: "Scan the QR code using any UPI app (PhonePe, Google Pay, Paytm, BHIM) or pay via the UPI ID. Once completed, enter the 12-digit UTR and upload your payment screenshot."
  },
  stats: [
    { value: "50+", label: "Cities Nationwide" },
    { value: "100K+", label: "Students Mentored" },
    { value: "25+", label: "Years E-Cell Legacy" },
    { value: "100%", label: "Hands-on Drills" }
  ]
};

export default EVENT_DATA;
