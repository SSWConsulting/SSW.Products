import { docSlugFromBreadcrumbs, renamedDocSlug } from "../utils/docPath";

describe("docSlugFromBreadcrumbs", () => {
  it("drops the product from a doc at the root of a product", () => {
    expect(docSlugFromBreadcrumbs(["TimePro", "introduction"])).toBe(
      "introduction"
    );
  });

  it("keeps the folder for a doc filed into one", () => {
    expect(
      docSlugFromBreadcrumbs(["TimePro", "tenants", "create-tenant"])
    ).toBe("tenants/create-tenant");
  });

  it("keeps every level of nesting", () => {
    expect(
      docSlugFromBreadcrumbs(["TimePro", "invoices", "credits", "allocate"])
    ).toBe("invoices/credits/allocate");
  });

  // A translation is served on its English doc's URL - the locale comes from the
  // request headers - so the zh folder must never reach the slug.
  it("drops the locale folder so a translation shares the English URL", () => {
    expect(
      docSlugFromBreadcrumbs(["YakShaver", "zh", "recording-on-mobile"])
    ).toBe("recording-on-mobile");
  });

  it("drops the locale folder for a nested translation", () => {
    expect(
      docSlugFromBreadcrumbs(["TimePro", "zh", "tenants", "create-tenant"])
    ).toBe("tenants/create-tenant");
  });

  it("only treats zh as a locale directly under the product", () => {
    expect(docSlugFromBreadcrumbs(["TimePro", "tenants", "zh"])).toBe(
      "tenants/zh"
    );
  });

  it("returns an empty slug for missing or product-only breadcrumbs", () => {
    expect(docSlugFromBreadcrumbs(undefined)).toBe("");
    expect(docSlugFromBreadcrumbs(null)).toBe("");
    expect(docSlugFromBreadcrumbs([])).toBe("");
    expect(docSlugFromBreadcrumbs(["TimePro"])).toBe("");
  });
});

describe("renamedDocSlug", () => {
  it("maps a doc that was renamed when it was filed into a folder", () => {
    expect(renamedDocSlug("TimePro", "ezl-introduction")).toBe(
      "easyleave/introduction"
    );
  });

  it("returns null for a doc that only moved", () => {
    expect(renamedDocSlug("TimePro", "create-tenant")).toBeNull();
  });

  it("returns null for an unknown product", () => {
    expect(renamedDocSlug("YakShaver", "ezl-introduction")).toBeNull();
  });
});
