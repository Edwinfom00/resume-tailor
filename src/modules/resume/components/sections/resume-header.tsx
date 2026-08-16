import { Fragment } from "react";
import type {
  ResumeData,
  ResumeLink,
  ResumeLocation,
} from "@/@types/resume-data";

type ResumeHeaderProps = Readonly<{
  resume: ResumeData;
}>;

type ContactItem = Readonly<{
  id: string;
  label: string;
  href?: string;
}>;

function getLocationLabel(location?: ResumeLocation) {
  if (!location) {
    return undefined;
  }

  return [location.city, location.region, location.country]
    .filter((part): part is string => Boolean(part))
    .join(", ");
}

function getWebsite(links: readonly ResumeLink[]) {
  return links.find((link) => link.kind === "website");
}

function getContactItems(resume: ResumeData): readonly ContactItem[] {
  const { contact } = resume.identity;
  const locationLabel = getLocationLabel(contact.location);
  const website = getWebsite(contact.links);

  return [
    locationLabel
      ? {
        id: "location",
        label: locationLabel,
      }
      : undefined,
    contact.location?.remote && contact.location.remoteStatus
      ? {
        id: "remote-status",
        label: contact.location.remoteStatus,
      }
      : undefined,
    contact.phone
      ? {
          id: "phone",
          label: contact.phone,
        }
      : undefined,
    {
      id: "email",
      label: contact.email,
      href: `mailto:${contact.email}`,
    },
    website
      ? {
        id: "website",
        label: website.label,
        href: website.url,
      }
      : undefined,
  ].filter((item): item is ContactItem => Boolean(item));
}

export function ResumeHeader({ resume }: ResumeHeaderProps) {
  const contactItems = getContactItems(resume);

  return (
    <header>
      <h1 className="m-0 font-bold tracking-normal text-(--rt-color-resume-heading) [font-size:var(--rt-font-size-resume-name)] leading-(--rt-line-height-resume-name)">
        {resume.identity.name}
      </h1>
      <p className="m-0 text-sm leading-snug text-(--rt-color-resume-body)">
        {resume.identity.headline}
      </p>
      <address className="mt-1 not-italic text-xs leading-tight text-(--rt-color-resume-body)">
        {contactItems.map((item, index) => (
          <Fragment key={item.id}>
            {index > 0 ? (
              <span aria-hidden="true" className="px-1">
                |
              </span>
            ) : null}
            {item.href ? (
              <a
                className="text-(--rt-color-resume-heading) no-underline"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </Fragment>
        ))}
      </address>
    </header>
  );
}
