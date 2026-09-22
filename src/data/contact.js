/**
 * Centralized Contact Data
 * Clickable tel: and mailto: coordinator items
 */

export const CONTACT_DATA = {
  sectionTitle: "Contact Us",
  subtitle: "Institutional Coordinator Desk & Organizing Leads",
  coordinators: [
    {
      id: "iitb-liaison",
      roleBadge: "IITB",
      title: "E-Cell IIT Bombay Representative",
      subtitle: "Events & Workshop Lead",
      designation: "E-Cell IIT Bombay Liaison",
      email: "ecellrec1@gmail.com",
      phone: null
    },
    {
      id: "ops-lead",
      roleBadge: "OPS",
      title: "Student Operations Lead",
      subtitle: "Logistics & Delegate Support",
      designation: "Samitha",
      phone: "+91 93465 65707",
      phoneRaw: "+919346565707",
      email: null
    },
    {
      id: "rec-desk",
      roleBadge: "REC",
      title: "REC Student Coordinator Desk",
      subtitle: "NEC Chapter, Raghu Engg",
      designation: "Visakhapatnam On-Campus Support (Tharun & Samitha)",
      phones: [
        { label: "+91 79893 13442", raw: "+917989313442" },
        { label: "+91 93465 65707", raw: "+919346565707" }
      ],
      email: null
    }
  ],
  institution: {
    name: "Raghu Engineering College (Autonomous)",
    accreditation: "Accredited by NAAC with 'A+' Grade | Approved by AICTE, New Delhi",
    address: "Dakamarri, Bheemunipatnam Mandal, Visakhapatnam, Andhra Pradesh 531162",
    helpline: "+91 79893 13442 / +91 93465 65707",
    email: "ecellrec1@gmail.com"
  }
};

export default CONTACT_DATA;
