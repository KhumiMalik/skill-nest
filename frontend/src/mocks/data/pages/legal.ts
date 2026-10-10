import type { LegalPage } from "@/features/page-content";
import type { ContentBlock } from "@/lib/api/schemas";

const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const h = (text: string): ContentBlock => ({ type: "heading", text });
const list = (...items: string[]): ContentBlock => ({ type: "list", items });

export const privacyPage: LegalPage = {
  summary: "How Greenfield Academy collects, uses and protects personal information.",
  updatedOn: "2026-09-01",
  body: [
    p(
      'Greenfield Academy ("the school", "we") is the data controller for the personal information described in this notice. We take our responsibility to protect the privacy of pupils, parents, staff and visitors seriously, and we process personal data in line with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.',
    ),
    h("1. Who this notice is for"),
    p(
      "This notice explains how we use information about visitors to our website, people who contact us or make an enquiry, and parents of prospective pupils. Separate notices for current pupils, parents and staff are available from the school office.",
    ),
    h("2. Information we collect"),
    p("Depending on how you interact with us, we may collect:"),
    list(
      "Contact details such as your name, email address, phone number and postal address",
      "Information you give us in an enquiry, application or event booking, including details about your child",
      "Technical information about your visit to our website, such as your browser type and the pages you view",
    ),
    p(
      "We only ask for the information we need. Admissions applications may include special category data, such as health information or special educational needs, which we handle with extra care.",
    ),
    h("3. How we use information"),
    list(
      "To reply to your enquiries and send you the information you ask for",
      "To process applications for admission, bursaries and event bookings",
      "To keep our website secure and understand how it is used, so we can improve it",
      "To meet our legal obligations, including safeguarding",
    ),
    p(
      "Our lawful bases are your consent, the performance of a contract with you, our legitimate interests in running the school and communicating with families, and compliance with the law.",
    ),
    h("4. Sharing information"),
    p(
      "We never sell personal information. We share it only with service providers who help us run the school (for example our IT and email providers) under contracts that protect your data, and with public bodies when the law requires it.",
    ),
    h("5. How long we keep information"),
    p(
      "We keep enquiry and admissions records for two years after the intended entry date if your child does not join the school. If your child does join, their records are kept in line with our records retention policy.",
    ),
    h("6. Cookies"),
    p(
      "Our website only uses cookies that are strictly necessary for it to work. We do not use advertising or tracking cookies, so we do not ask for cookie consent.",
    ),
    h("7. Your rights"),
    p("You have the right to:"),
    list(
      "Ask for a copy of the personal information we hold about you",
      "Ask us to correct information that is wrong or incomplete",
      "Ask us to delete information or restrict how we use it, in some circumstances",
      "Object to our processing and withdraw consent at any time, where we rely on consent",
    ),
    p(
      "If you are unhappy with how we have handled your information, please contact us first. You can also complain to the Information Commissioner's Office (ico.org.uk).",
    ),
    h("8. Contact us"),
    p(
      "Our Data Protection Lead can be reached at privacy@greenfield-academy.example, or by post at Greenfield Academy, 42 Meadow Lane, Greenfield, GF1 2AB.",
    ),
  ],
};

export const termsPage: LegalPage = {
  summary: "The terms that apply when you use the Greenfield Academy website.",
  updatedOn: "2026-09-01",
  body: [
    p(
      "These terms apply to your use of the Greenfield Academy website. By using the site you accept them. If you do not agree, please do not use the website.",
    ),
    h("1. About us"),
    p(
      "This website is run by Greenfield Academy, an independent school at 42 Meadow Lane, Greenfield, GF1 2AB. You can contact us at info@greenfield-academy.example.",
    ),
    h("2. Using the website"),
    p("You may use the website for personal, non-commercial purposes. You must not:"),
    list(
      "Use the website in a way that breaks the law or harms the school, its pupils or staff",
      "Try to gain unauthorised access to the website, its server or any connected system",
      "Send us content that is offensive, defamatory or that you do not have the right to share",
    ),
    h("3. Content and accuracy"),
    p(
      "We work hard to keep the information on this website accurate and up to date, but it is provided for general information only. Term dates, fees and event details can change; please check with the school office before making plans.",
    ),
    h("4. Intellectual property"),
    p(
      "The text, photographs, logos and design of this website belong to Greenfield Academy or our licensors. You may print or download pages for personal use, but you may not reuse them for any other purpose without our written permission.",
    ),
    h("5. Photographs of pupils"),
    p(
      "We only publish photographs of pupils with their parents' consent, and we never publish a pupil's full name next to their photograph. If you would like a photograph removed, contact us and we will remove it promptly.",
    ),
    h("6. Links to other websites"),
    p(
      "Our website links to other websites, such as social networks and examination boards. We are not responsible for their content or their privacy practices.",
    ),
    h("7. Liability"),
    p(
      "We are not liable for any loss arising from the use of this website or from relying on its content, except where the law does not allow us to exclude liability.",
    ),
    h("8. Changes to these terms"),
    p(
      "We may update these terms from time to time. The date at the top of this page shows when they last changed. These terms are governed by the law of England and Wales.",
    ),
  ],
};
