import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Testimonial } from "../types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <SectionTitle title="Testimonials" subtitle="What parents, pupils and former pupils say about Greenfield." />
        <ul className="row gx-4 gy-5 list-unstyled">
          {testimonials.map((testimonial, index) => (
            <li className="col-lg-4 reveal" key={testimonial.name}>
              {/* The middle card of each row of three is highlighted, as in the template. */}
              <figure className={index % 3 === 1 ? "t-card is-featured" : "t-card"}>
                <span className="t-quote" aria-hidden="true">
                  <Icon name="quote" />
                </span>
                <blockquote>
                  <p>{testimonial.quote}</p>
                </blockquote>
                <figcaption className="t-author">
                  <Image
                    src={testimonial.photo.src}
                    alt=""
                    width={testimonial.photo.width}
                    height={testimonial.photo.height}
                    sizes="64px"
                  />
                  <div>
                    <span className="t-name">{testimonial.name}</span>
                    <span>{testimonial.role}</span>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
