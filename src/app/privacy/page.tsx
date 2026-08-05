import type { Metadata } from "next";
import { LegalPage, List, Section } from "@/components/legal/legal-page";
import { legalConfig, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your personal data.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`How ${siteConfig.name} collects, uses and protects personal data — for people looking for a place, and for owners who list one.`}
    >
      <Section id="who-we-are" heading="1. Who we are">
        <p>
          {siteConfig.name} (“we”, “us”) is operated by{" "}
          <strong>{legalConfig.entityName}</strong>, {legalConfig.address}. We
          run a listing service for PGs, rental homes and homestays in{" "}
          {siteConfig.city}. We are the data fiduciary for the personal data
          described below, within the meaning of India’s Digital Personal
          Data Protection Act, 2023.
        </p>
        <p>
          Questions about this policy:{" "}
          <a href={`mailto:${legalConfig.contactEmail}`}>
            {legalConfig.contactEmail}
          </a>
          .
        </p>
      </Section>

      <Section id="what-we-collect" heading="2. What we collect">
        <p>
          <strong>If you enquire about a property</strong>, we collect your name,
          phone number, your intended move-in date if you give one, and any
          message you write. We need your phone number because a callback is how
          we respond.
        </p>
        <p>
          <strong>If you list a property</strong>, we collect your name and email
          address (or your name, email address and profile picture from Google,
          if you sign in that way), a password if you create one, and everything
          you enter about the property: its type, locality, description,
          amenities, rent and deposit, photographs, a contact phone number, and{" "}
          <strong>
            the exact location you pin on the map, together with the street
            address you provide
          </strong>
          .
        </p>
        <p>
          <strong>Automatically</strong>, our hosting provider records standard
          server logs (IP address, browser type, pages requested, timestamps) for
          security and troubleshooting. We set a session cookie when you sign in
          so you stay signed in. We do not run advertising or analytics trackers.
        </p>
      </Section>

      <Section id="exact-location" heading="3. Your exact address, specifically">
        <p>
          This deserves its own section because it is the most sensitive thing an
          owner gives us.
        </p>
        <p>
          <strong>What happens depends on the kind of listing</strong>, and you
          are told which applies before you place the pin.
        </p>
        <p>
          <strong>PGs and rental homes.</strong> Your pinned coordinates and
          street address are <strong>never published</strong>. They are not shown
          on your listing page, are not included in the page’s underlying code,
          and are not given to search engines.
        </p>
        <List>
          <li>
            The map a visitor sees shows a shaded circle of roughly 600 metres,
            centred on a point deliberately offset from your real one. It is
            calculated on our servers, and the calculation itself never reaches a
            visitor’s browser, so the offset cannot be worked backwards.
          </li>
          <li>
            Your exact location is visible only to our review team, who use it to
            verify the listing and to find the property when arranging a visit.
          </li>
          <li>
            We share it with an interested visitor only after you have agreed to
            a viewing.
          </li>
        </List>
        <p>
          <strong>Homestays.</strong> Because a guest booking a short stay has to
          be able to find the door, a homestay listing{" "}
          <strong>
            does show the exact pin and the street address you give
          </strong>
          , along with the host name. The location step tells you this before you
          pin, and the address field is labelled as public. If you would rather
          not publish it, list the property as a rental instead.
        </p>
        <p>
          The contact phone number stays private on every kind of listing —
          enquiries always reach us first.
        </p>
      </Section>

      <Section id="why" heading="4. Why we use it">
        <List>
          <li>To publish and run your listing, and to keep your account.</li>
          <li>
            To review listings before they go public — the check that makes the
            site worth using.
          </li>
          <li>
            To pass genuine enquiries between an interested visitor and an owner,
            and to arrange viewings.
          </li>
          <li>To respond when you contact us.</li>
          <li>
            To keep the service secure, prevent fraudulent or duplicate listings,
            and comply with the law.
          </li>
        </List>
        <p>
          We process this data on the basis of the consent you give when you
          submit a form or create an account, and for the legitimate uses
          permitted under the DPDP Act. We do not sell personal data, and we do
          not use it for advertising.
        </p>
      </Section>

      <Section id="sharing" heading="5. Who else processes it">
        <p>
          We use a small number of service providers. They process data on our
          instructions only.
        </p>
        <List>
          <li>
            <strong>Neon</strong> — our database, hosted in the United States
            (US-East region). All listing, account and enquiry data is stored
            there.
          </li>
          <li>
            <strong>Cloudinary</strong> — stores and serves listing photographs.
          </li>
          <li>
            <strong>Vercel</strong> — hosts the website and produces the server
            logs described above.
          </li>
          <li>
            <strong>Google</strong> — only if you choose to sign in with Google,
            in which case Google confirms your identity and shares your name,
            email address and profile picture with us.
          </li>
          <li>
            <strong>OpenStreetMap</strong> — supplies map tiles. Loading a map
            sends your IP address to their servers, as any image request does.
          </li>
          <li>
            <strong>Komoot (Photon)</strong> — converts a typed address into
            coordinates when an owner searches on the location step. Only the
            text searched is sent.
          </li>
          <li>
            <strong>Meta</strong> — if you choose to enquire over WhatsApp, or if
            a listing embeds an Instagram reel, your interaction with those
            features is subject to Meta’s own privacy policy.
          </li>
        </List>
        <p>
          Because our database is hosted outside India, your personal data is
          transferred and stored abroad. We will also disclose data where we are
          legally required to, or to establish or defend a legal claim.
        </p>
      </Section>

      <Section id="retention" heading="6. How long we keep it">
        <List>
          <li>
            <strong>Enquiries</strong> — kept while we are helping you find a
            place, and for up to 12 months afterwards so we can follow up on
            disputes.
          </li>
          <li>
            <strong>Listings and host accounts</strong> — kept while your account
            is open. Delete a listing and it is removed immediately; ask us to
            close your account and we delete it, apart from anything we must
            retain by law.
          </li>
          <li>
            <strong>Server logs</strong> — retained for a short period by our
            hosting provider for security purposes.
          </li>
        </List>
      </Section>

      <Section id="your-rights" heading="7. Your rights">
        <p>Under the DPDP Act you may ask us to:</p>
        <List>
          <li>tell you what personal data of yours we hold and who we shared it with;</li>
          <li>correct anything inaccurate, or complete anything missing;</li>
          <li>erase your data where we no longer need it;</li>
          <li>
            nominate someone to exercise these rights on your behalf if you die
            or become incapacitated;
          </li>
          <li>withdraw a consent you previously gave.</li>
        </List>
        <p>
          Hosts can edit or delete most of this directly from{" "}
          <strong>My listings</strong>. For anything else, email{" "}
          <a href={`mailto:${legalConfig.contactEmail}`}>
            {legalConfig.contactEmail}
          </a>{" "}
          and we will respond within 30 days. Withdrawing consent does not undo
          processing we already carried out lawfully.
        </p>
      </Section>

      <Section id="security" heading="8. Security">
        <p>
          Traffic is encrypted in transit. Passwords are stored hashed, never in
          readable form. Access to exact addresses and owner phone numbers is
          restricted to our review team, and host accounts can only ever reach
          their own listings. No system is perfectly secure, but if a breach
          affects your data we will notify you and the Data Protection Board as
          the law requires.
        </p>
      </Section>

      <Section id="children" heading="9. Children">
        <p>
          The service is not intended for anyone under 18, and we do not
          knowingly collect their data. If you believe a child has given us
          personal data, contact us and we will delete it.
        </p>
      </Section>

      <Section id="changes" heading="10. Changes and grievances">
        <p>
          If we change this policy we will update the date at the top of this
          page, and tell you directly if the change is significant.
        </p>
        <p>
          If you are unhappy with how we have handled your data, contact our
          grievance officer, <strong>{legalConfig.grievance.name}</strong>, at{" "}
          <a href={`mailto:${legalConfig.grievance.email}`}>
            {legalConfig.grievance.email}
          </a>
          . If we do not resolve it to your satisfaction, you may complain to the
          Data Protection Board of India.
        </p>
      </Section>
    </LegalPage>
  );
}
