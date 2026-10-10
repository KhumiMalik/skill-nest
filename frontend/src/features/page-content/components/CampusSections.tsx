import Image from "next/image";
import { Carousel } from "@/components/ui/Carousel";
import { Icon, toIconName } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { type TabItem, Tabs } from "@/components/ui/Tabs";
import type { CampusPage } from "../types";
import { IntroWithStats } from "./IntroSection";

/** Introduction and one tab per group of facilities, each with a slideshow and short descriptions. */
export function CampusFacilities({ page }: { page: CampusPage }) {
  const tabs: TabItem[] = page.facilityGroups.map((group) => ({
    id: group.id,
    label: group.label,
    panel: (
      <div className="row g-4 align-items-center">
        <div className="col-md-7">
          <Carousel images={group.images} label={`${group.label} photos`} sizes="(max-width: 767px) 100vw, 55vw" />
        </div>
        <div className="col-md-5">
          <ul className="list-unstyled mb-0">
            {group.facilities.map((facility) => (
              <li className="card-box mb-3" key={facility.title}>
                <div className="d-flex gap-3 align-items-start">
                  <div className="icon-circle">
                    <Icon name={toIconName(facility.icon, "building")} />
                  </div>
                  <div>
                    <h3 className="h4 mt-0">{facility.title}</h3>
                    <p>{facility.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  }));

  return (
    <section id="campus-facilities" className="section">
      <div className="container">
        <IntroWithStats intro={page.intro} />
        <h2 className="visually-hidden">Facilities</h2>
        <div className="reveal">
          <Tabs label="Facilities" tabs={tabs} />
        </div>
      </div>
    </section>
  );
}

/** Site plan with a numbered key of the main buildings. */
export function CampusMap({ map }: { map: CampusPage["map"] }) {
  return (
    <section id="campus-map" className="section section-alt">
      <div className="container">
        <SectionTitle title={map.title} subtitle={map.text} />
        <div className="row g-4">
          <div className="col-lg-8 reveal">
            <Image
              src={map.image.src}
              alt={map.image.alt}
              width={map.image.width}
              height={map.image.height}
              sizes="(max-width: 991px) 100vw, 65vw"
              className="rounded-img"
            />
          </div>
          <div className="col-lg-4 reveal">
            <div className="sidebar-box h-100 mb-0">
              <h3>Key</h3>
              <ol className="map-key">
                {map.key.map((place) => (
                  <li key={place.name}>
                    <strong>{place.name}</strong>
                    <span>{place.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
