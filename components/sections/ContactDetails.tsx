import { CONTACT_EMAIL, CONTACT_PHONE, LINKEDIN_URL, OFFICE_ADDRESS } from "@/lib/site";

// Contact details, shown only when set
export default function ContactDetails() {
  const items = [
    CONTACT_EMAIL && (
      <a key="e" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
    ),
    CONTACT_PHONE && (
      <a key="p" href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`}>
        {CONTACT_PHONE}
      </a>
    ),
    OFFICE_ADDRESS && <span key="a">{OFFICE_ADDRESS}</span>,
    LINKEDIN_URL && (
      <a key="l" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
    ),
  ].filter(Boolean);
  if (!items.length) return null;
  return <div className="c-details">{items}</div>;
}
