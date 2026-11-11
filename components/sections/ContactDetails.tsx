import { CONTACT_EMAIL, CONTACT_PHONE, LINKEDIN_URL, OFFICE_ADDRESS } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";

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
    LINKEDIN_URL && <SocialIcon key="l" name="LinkedIn" url={LINKEDIN_URL} className="c-social" size={26} />,
  ].filter(Boolean);
  if (!items.length) return null;
  return <div className="c-details">{items}</div>;
}
