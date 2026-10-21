import { cacheLife } from "next/cache";
import Link from "next/link";

import { DigneMark, DigneSignature } from "@/components/brand/DigneMark";
import { clientCareNav, collectionNav, legalNav, type NavItem } from "@/config/navigation";
import { formattedAddress, site, telHref } from "@/config/site";
import { whatsappHref } from "@/lib/whatsapp";

import { BackToTop } from "./BackToTop";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

function Column({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h2 className="eyebrow mb-5 text-gold-soft">{title}</h2>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-ivory/80 transition-colors duration-500 hover:text-ivory">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-noir text-ivory">
      <div className="gutter grid grid-cols-2 gap-x-6 gap-y-10 pt-16 pb-12 sm:gap-y-12 sm:pt-20 sm:pb-14 md:grid-cols-4 lg:grid-cols-12 lg:pt-28">
        <div className="col-span-2 md:col-span-4 lg:col-span-4">
          <DigneMark className="h-20 w-auto text-ivory sm:h-24 lg:h-28" title="Digne Suits & More" />
          <p className="mt-6 max-w-sm text-[0.95rem] text-muted-dark sm:mt-8">
            Formalwear and occasion dressing in Agbogba, Accra — to be seen, tried on and chosen in person.
          </p>
        </div>

        <div className="lg:col-span-2 lg:col-start-6">
          <Column title="Collections" items={collectionNav} />
        </div>
        <div className="lg:col-span-2">
          <Column title="Client care" items={clientCareNav} />
        </div>
        <div className="col-span-2 md:col-span-2 lg:col-span-3 lg:col-start-10">
          <h2 className="eyebrow mb-5 text-gold-soft">The showroom</h2>
          <address className="space-y-2.5 not-italic text-ivory/80">
            <p>{site.name}</p>
            <p>{formattedAddress}</p>
            <p>
              <a href={telHref} className="transition-colors duration-500 hover:text-ivory">
                {site.phone.display}
              </a>
            </p>
            <p className="flex flex-wrap gap-x-5 gap-y-1 pt-2">
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line text-ivory">
                Directions <span className="sr-only">(opens Google Maps)</span>
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="link-line text-ivory">
                WhatsApp <span className="sr-only">(opens WhatsApp)</span>
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="gutter" aria-hidden>
        <DigneSignature className="w-full text-burgundy" />
      </div>

      <div className="gutter flex flex-col gap-5 border-t border-ivory/10 py-7 text-[0.8rem] text-muted-dark sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p>
            © <CopyrightYear /> {site.name}. Accra, Ghana.
          </p>
          <nav aria-label="Legal">
            <ul className="flex gap-5">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors duration-500 hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="max-w-md sm:text-center">Photography represents the showroom. Pieces, sizes and availability are confirmed in store.</p>
        <BackToTop />
      </div>
    </footer>
  );
}
