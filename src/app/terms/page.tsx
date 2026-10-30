import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using StudioSpace.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Terms &amp; Conditions</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>Last updated: January 2025.</p>
        <p>
          Welcome to StudioSpace. By accessing or using our platform, you agree
          to be bound by these terms. If you do not agree, please do not use the
          service.
        </p>
        <h2 className="pt-2 text-base font-semibold text-foreground">Bookings &amp; Cancellations</h2>
        <p>
          All bookings are confirmed once payment is processed. Cancellations
          made at least 24 hours before the scheduled start time are eligible
          for a full refund.
        </p>
        <h2 className="pt-2 text-base font-semibold text-foreground">Host Responsibilities</h2>
        <p>
          Hosts must keep listings accurate and spaces safe for use. Spaces that
          repeatedly fail to match their listing may be removed from the platform.
        </p>
        <h2 className="pt-2 text-base font-semibold text-foreground">Liability</h2>
        <p>
          StudioSpace facilitates connections between hosts and creators. To the
          maximum extent permitted by law, we are not liable for disputes between
          hosts and guests or for the condition of listed spaces.
        </p>
      </div>
    </div>
  );
}
