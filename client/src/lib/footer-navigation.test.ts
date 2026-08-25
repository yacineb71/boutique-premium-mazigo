import { describe, expect, it } from "vitest";
import { footerLegalLinks, footerNavigation } from "@/components/Footer";

describe("footer navigation", () => {
  it("points FAQ and primary navigation to real public routes", () => {
    expect(footerNavigation).toContainEqual(["FAQ", "/faq"]);
    expect(footerNavigation.map(([, href]) => href)).not.toContain("#");
  });

  it("points legal links to dedicated pages", () => {
    expect(footerLegalLinks).toEqual([
      ["Conditions générales", "/legal/terms"],
      ["Livraison et retours", "/legal/shipping-returns"],
      ["Politique de confidentialité", "/legal/privacy"],
    ]);
  });
});
