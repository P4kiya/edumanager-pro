import { useEffect } from "react";
import { schoolSettingsService } from "@/services";

const DEFAULT_TITLE = "EduManager - Gestion Scolaire";
const DEFAULT_DESCRIPTION = "Plateforme de gestion scolaire moderne pour écoles et établissements éducatifs";

function ensureMetaTag(selector: string, create: () => HTMLMetaElement): HTMLMetaElement {
  const existing = document.querySelector(selector) as HTMLMetaElement | null;
  if (existing) return existing;
  const tag = create();
  document.head.appendChild(tag);
  return tag;
}

function ensureFaviconTag(): HTMLLinkElement {
  const existing = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
  if (existing) return existing;
  const link = document.createElement("link");
  link.rel = "icon";
  document.head.appendChild(link);
  return link;
}

export function HeadBranding() {
  useEffect(() => {
    let isMounted = true;

    const ogTitleTag = ensureMetaTag("meta[property='og:title']", () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:title");
      return tag;
    });
    const ogDescriptionTag = ensureMetaTag("meta[property='og:description']", () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:description");
      return tag;
    });
    const ogImageTag = ensureMetaTag("meta[property='og:image']", () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:image");
      return tag;
    });
    const twitterImageTag = ensureMetaTag("meta[name='twitter:image']", () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:image");
      return tag;
    });
    const faviconTag = ensureFaviconTag();

    const applyBranding = (schoolName: string, logoData?: string | null) => {
      const appTitle = `${schoolName} - Gestion Scolaire`;
      document.title = appTitle;
      ogTitleTag.content = appTitle;
      ogDescriptionTag.content = DEFAULT_DESCRIPTION;

      if (logoData) {
        faviconTag.href = logoData;
        ogImageTag.content = logoData;
        twitterImageTag.content = logoData;
      } else {
        faviconTag.removeAttribute("href");
        ogImageTag.removeAttribute("content");
        twitterImageTag.removeAttribute("content");
      }
    };

    const applyFallback = () => {
      document.title = DEFAULT_TITLE;
      ogTitleTag.content = DEFAULT_TITLE;
      ogDescriptionTag.content = DEFAULT_DESCRIPTION;
    };

    const loadBranding = async () => {
      try {
        const settings = await schoolSettingsService.get();
        if (!isMounted) return;
        const schoolName = settings.schoolName?.trim() || "EduManager";
        applyBranding(schoolName, settings.logoData ?? null);
      } catch {
        if (!isMounted) return;
        applyFallback();
      }
    };

    const onSchoolSettingsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ schoolName?: string; logoData?: string | null }>;
      const schoolName = customEvent.detail?.schoolName?.trim() || "EduManager";
      applyBranding(schoolName, customEvent.detail?.logoData ?? null);
    };

    loadBranding();
    window.addEventListener("school-settings-updated", onSchoolSettingsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("school-settings-updated", onSchoolSettingsUpdated);
    };
  }, []);

  return null;
}

export default HeadBranding;
