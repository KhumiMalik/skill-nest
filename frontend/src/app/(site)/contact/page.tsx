import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { ContactDetails, ContactForm, ContactMap } from "@/features/contact";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Greenfield Academy: send us a message, or find our address, phone numbers, email addresses, office hours and a map.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact" description="We'd love to hear from you. Here is how to reach the school." />
      <section id="contact" className="section">
        <div className="container">
          <ContactDetails />
          <div className="row g-4">
            <div className="col-lg-5 reveal">
              <ContactMap />
            </div>
            <div className="col-lg-7 reveal">
              <div className="form-card">
                <h2 className="h3 mb-2">Get in Touch</h2>
                <p className="mb-4">Send us a message and the right person will reply within one working day.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
