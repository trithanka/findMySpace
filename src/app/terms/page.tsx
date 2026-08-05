import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, List, Section } from "@/components/legal/legal-page";
import { legalConfig, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms on which you may use ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro={`The terms on which you may use ${siteConfig.name} — whether you are looking for a place or listing one.`}
    >
      <Section id="acceptance" heading="1. Agreeing to these terms">
        <p>
          By using {siteConfig.name} you agree to these terms. If you do not
          agree, please do not use the service. {siteConfig.name} is operated by{" "}
          <strong>{legalConfig.entityName}</strong>, {legalConfig.address}.
        </p>
        <p>
          You must be at least 18 and legally able to enter a contract. If you
          are using the service for a company or another person, you confirm you
          are authorised to accept these terms on their behalf.
        </p>
      </Section>

      <Section id="what-we-are" heading="2. What we do — and what we don't">
        <p>
          {siteConfig.name} lists PGs, rental homes and homestays in{" "}
          {siteConfig.city}, and introduces interested people to owners. That is
          the whole of our role.
        </p>
        <p>
          <strong>
            We are not a party to any tenancy, licence, booking or other
            agreement you reach with an owner or an occupant.
          </strong>{" "}
          We do not own, manage or let the properties listed. We do not collect
          rent, deposits or any payment through this website, and we are not an
          escrow or payment service. Any agreement, payment and dispute is
          between the owner and the occupant directly.
        </p>
        <p>
          We review listings before publishing them, which includes checking the
          details an owner gives us. That review is a reasonable-effort check to
          keep obvious rubbish off the site — it is not a survey, a legal title
          check, a safety certification, or a guarantee that everything stated is
          accurate. Satisfy yourself before you commit to anything: visit the
          property, verify ownership, and read whatever you are asked to sign.
        </p>
      </Section>

      <Section id="accounts" heading="3. Your account">
        <p>
          Owners need an account to list a property. Keep your password and your
          Google account secure — you are responsible for activity under your
          account. Give us accurate details and keep them current. Tell us
          promptly if you think someone else has got in.
        </p>
      </Section>

      <Section id="host-obligations" heading="4. If you list a property">
        <p>You confirm, for every listing you submit, that:</p>
        <List>
          <li>
            you own the property or are otherwise authorised to let it, and
            letting it does not breach any lease, mortgage, society rule or local
            regulation that binds you;
          </li>
          <li>
            everything you state — rent, deposit, amenities, availability, the
            location you pin — is accurate and kept up to date;
          </li>
          <li>
            the photographs are of that property, are recent, and are yours to
            use;
          </li>
          <li>
            you will keep the property in a condition that is lawful and safe to
            occupy, and hold whatever registrations or permissions apply to you;
          </li>
          <li>
            you will pay your own taxes on any income you earn through an
            introduction we make.
          </li>
        </List>
        <p>
          <strong>On who may stay.</strong> Shared accommodation may lawfully be
          offered to men or women only, and the listing form supports that. You
          may not, however, refuse or restrict a tenancy on the basis of
          religion, caste, ethnicity, place of origin, disability, marital status
          or food preference, and listings that do so will be removed.
        </p>
        <p>
          <strong>Our review.</strong> Every listing is checked before it goes
          live. We may approve it, send it back with a note asking for changes,
          edit obvious errors, or decline it. We may also unpublish or remove a
          live listing — for instance where it is inaccurate, the property is no
          longer available, we receive credible complaints, or these terms are
          breached. We will normally tell you why.
        </p>
        <p>
          <strong>Your content.</strong> You keep ownership of your photographs
          and descriptions. You grant us a non-exclusive, royalty-free licence to
          host, resize and display them for the purpose of marketing your listing
          on {siteConfig.name} and our associated social media, for as long as
          the listing is with us.
        </p>
      </Section>

      <Section id="enquirer-obligations" heading="5. If you enquire about a property">
        <p>
          Give accurate contact details — an owner will use them to reach you.
          Enquire only where you are genuinely interested; the service is not for
          collecting owner contacts, canvassing, or any commercial purpose of
          your own.
        </p>
        <p>
          Property details and prices are supplied by owners and can change or
          become unavailable at short notice. Treat what you see here as a
          starting point, not a firm offer.
        </p>
      </Section>

      <Section id="prohibited" heading="6. Things you must not do">
        <List>
          <li>
            post anything false, misleading, obscene, defamatory, or unlawful, or
            impersonate anyone;
          </li>
          <li>
            list a property you have no right to let, or advertise something
            other than genuine accommodation;
          </li>
          <li>
            scrape, crawl or bulk-copy listings, or try to work out the exact
            address behind a listing’s approximate map;
          </li>
          <li>
            interfere with the site’s security, probe it for weaknesses, or
            attempt to reach accounts or data that are not yours;
          </li>
          <li>
            use the service to send spam or unsolicited marketing to owners or
            enquirers.
          </li>
        </List>
      </Section>

      <Section id="ip" heading="7. Our intellectual property">
        <p>
          The {siteConfig.name} name, logo, site design, text and software are
          ours and are protected by law. You may not copy or reuse them without
          our written permission. Map data is © OpenStreetMap contributors and is
          used under the Open Database Licence.
        </p>
      </Section>

      <Section id="liability" heading="8. Disclaimers and liability">
        <p>
          The service is provided on an “as is” basis. We do not
          promise that it will be uninterrupted or error-free, or that any
          listing will result in a tenancy.
        </p>
        <p>
          To the fullest extent the law allows, we are not liable for the conduct
          of any owner or occupant, for the condition, legality or safety of any
          property, for any agreement you enter into or payment you make, or for
          indirect or consequential loss. Nothing here limits liability that
          cannot lawfully be limited, including for fraud or for death or
          personal injury caused by our negligence.
        </p>
        <p>
          You agree to indemnify us against claims arising from your breach of
          these terms or from content you submitted.
        </p>
      </Section>

      <Section id="termination" heading="9. Suspension and closing your account">
        <p>
          You may close your account at any time by contacting us. We may suspend
          or terminate access where these terms are breached, where we are
          required to by law, or where continuing would expose others to harm.
          Sections that by their nature should survive — liability, indemnity,
          intellectual property, governing law — do so.
        </p>
      </Section>

      <Section id="changes" heading="10. Changes to these terms">
        <p>
          We may update these terms. The date at the top of this page shows when
          they last changed, and we will tell users directly where a change is
          significant. Continuing to use the service after a change means you
          accept it.
        </p>
      </Section>

      <Section id="law" heading="11. Governing law and grievances">
        <p>
          These terms are governed by the laws of India, and the courts at{" "}
          {legalConfig.jurisdiction} have exclusive jurisdiction.
        </p>
        <p>
          For complaints about content or about your use of the service, contact
          our grievance officer,{" "}
          <strong>{legalConfig.grievance.name}</strong>, at{" "}
          <a href={`mailto:${legalConfig.grievance.email}`}>
            {legalConfig.grievance.email}
          </a>
          . We acknowledge complaints within 24 hours and aim to resolve them
          within 15 days, in line with the Information Technology
          (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
        </p>
        <p>
          How we handle personal data is set out in our{" "}
          <Link href="/privacy">Privacy Policy</Link>, which forms part of these
          terms.
        </p>
      </Section>
    </LegalPage>
  );
}
