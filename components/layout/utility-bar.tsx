import { OutletStatus } from "@/components/layout/outlet-status";
import { site } from "@/lib/site";

export function UtilityBar() {
  return (
    <nav className="utility-bar" aria-label="Hours and contact">
      <div className="wrap">
        <div className="utility-cluster">
          <OutletStatus />
          <span className="utility-sep" aria-hidden="true" />
          <a href={site.phoneHref} className="data" data-track="call">{site.phoneDisplay}</a>
          <span className="utility-sep" aria-hidden="true" />
          <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="data" data-track="whatsapp">
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
