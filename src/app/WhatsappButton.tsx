"use client";

import type { ReactNode } from "react";
import styles from "./page.module.css";

declare global {
  interface Window {
    rdt?: (command: string, event: string) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

type WhatsappButtonProps = {
  children: ReactNode;
  className?: string;
  floating?: boolean;
};

const whatsappUrl =
  "https://wa.me/5513988658518?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20a%20demonstra%C3%A7%C3%A3o%20do%20meu%20site%20em%2048h%20com%20a%20Lexora.";

export default function WhatsappButton({
  children,
  className,
  floating = false,
}: WhatsappButtonProps) {
  function trackLead() {
    // The Reddit Pixel base tag defines `rdt` and queues this event for delivery.
    window.rdt?.("track", "Lead");
    window.gtag?.("event", "conversion", {
      send_to: "AW-18263949464/25oBCIi71dgcEJiB94RE",
      value: 1,
      currency: "BRL",
    });
    window.gtag?.("event", "generate_lead", {
      event_category: "engagement",
      event_label: "WhatsApp Click",
    });
  }

  function handleClick() {
    trackLead();
  }

  return (
    <a
      className={className}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={floating ? "Conversar com a Lexora pelo WhatsApp" : undefined}
    >
      {floating && (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.whatsappIcon}>
          <path d="M20.52 3.48A11.87 11.87 0 0 0 12.07 0C5.5 0 .15 5.34.15 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.78 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.47-8.42ZM12.07 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.47 4.45-9.92 9.93-9.92a9.86 9.86 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.93 9.92Zm5.45-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.06 2.88 1.2 3.08c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      )}
      {children}
    </a>
  );
}
