import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for StudioSpace.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>Last updated: January 2025.</p>
        <p>
          Your privacy matters to us. This policy explains what information
          StudioSpace collects and how it is used.
        </p>
        <h2 className="pt-2 text-base font-semibold text-foreground">Information We Collect</h2>
        <p>
          We collect information you provide directly, such as your name, email
          address, and booking details, as well as usage data needed to operate
          and improve the platform.
        </p>
        <h2 className="pt-2 text-base font-semibold text-foreground">How We Use Information</h2>
        <p>
          Information is used to process bookings, connect hosts with guests,
          provide support, and send updates you have opted into. We never sell
          your personal data.
        </p>
        <h2 className="pt-2 text-base font-semibold text-foreground">Contact</h2>
        <p>Questions about this policy? Reach us at privacy@studiospace.example.</p>
      </div>
    </div>
  );
}
