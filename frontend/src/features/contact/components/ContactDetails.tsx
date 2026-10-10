import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";

/** Address, phone and email, and opening hours: the three boxes at the top of the contact page. */
export function ContactDetails() {
  const { addressLines, phone, email, admissionsEmail, hours } = siteConfig.contact;
  const boxes: { icon: IconName; title: string; content: ReactNode }[] = [
    { icon: "geo-alt", title: "Our Address", content: <address className="mb-0">{addressLines.join(", ")}</address> },
    {
      icon: "envelope",
      title: "Phone & Email",
      content: (
        <p>
          <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
          <br />
          <a href={`mailto:${email}`}>{email}</a>
          <br />
          <a href={`mailto:${admissionsEmail}`}>{admissionsEmail}</a>
        </p>
      ),
    },
    {
      icon: "clock",
      title: "Office Hours",
      content: (
        <p>
          {hours.map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ),
    },
  ];

  return (
    <ul className="row g-4 mb-5 list-unstyled">
      {boxes.map((box) => (
        <li className="col-lg-4 reveal" key={box.title}>
          <div className="contact-box">
            <div className="icon-circle">
              <Icon name={box.icon} />
            </div>
            <h2 className="h4">{box.title}</h2>
            {box.content}
          </div>
        </li>
      ))}
    </ul>
  );
}
