import { FormEvent, useEffect, useRef, useState } from "react";

const A = "/assets";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "accent" | "secondary";
  type?: "button" | "submit";
};

function Button({ children, href, onClick, variant = "primary", type = "button" }: ButtonProps) {
  const className = `button button--${variant}`;
  return href ? (
    <a className={className} href={href}>
      {children}
    </a>
  ) : (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

const navItems = [
  ["Work", "/work"],
  ["Estudio", "/studio"],
  ["Servicios", "/services"],
  ["Contacto", "/contact"],
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <a className="brand" href="/" aria-label="Lapsus, inicio">
        <img src="/assets/logo.svg" alt="Lapsus" />
      </a>
      <button
        className="menu-button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
      <nav
        className={open ? "nav-links nav-links--open" : "nav-links"}
        aria-label="Navegación principal"
      >
        {navItems.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <a className="footer-brand" href="/" aria-label="Lapsus, inicio">
        <img src="/assets/logo.svg" alt="Lapsus" />
      </a>
      <p>©2026</p>
    </footer>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

const projections = [
  {
    title: "Casi algo",
    text: "Te quise en silencio y te construí una historia entera en mi cabeza, mientras tú apenas sabías que yo estaba ahí. Me duele extrañar algo que nunca pasó, pero más me cuesta soltar la idea de lo bonito que habría sido si me hubieras mirado igual.",
  },
  {
    title: "En otra vida",
    text: "A veces me pregunto si en otra vida sí coincidimos a tiempo. Te pienso en cada canción, sabiendo que lo nuestro vive más de lo que imaginé que en lo que realmente fue.",
  },
  {
    title: "Mi versión de ti",
    text: "Me enamoré de lo que pensé que sentías y llené tus silencios con promesas que nunca hiciste. Al final no te extraño a ti, extraño a la persona que inventé cuando te miraba.",
  },
];

function ProjectionCarousel() {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const rotate = (direction: number) => {
    setActive((current) => (current + direction + projections.length) % projections.length);
  };

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => rotate(1), 6000);
    return () => window.clearInterval(interval);
  }, [paused]);

  return (
    <div
      className="projection-stage"
      tabIndex={0}
      aria-label="Proyectadas"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          rotate(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          rotate(1);
        }
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(distance) > 45) rotate(distance > 0 ? -1 : 1);
        touchStart.current = null;
      }}
    >
      <div className="projection-grid">
        {projections.map((projection, index) => {
          const position = (index - active + projections.length) % projections.length;
          const positionName = position === 0 ? "active" : position === 1 ? "right" : "left";
          return (
            <article
              className={`projection-card projection-card--${positionName}`}
              key={projection.title}
              aria-current={position === 0 ? "true" : undefined}
              onClick={() => setActive(index)}
            >
              <h3 className="display">{projection.title}</h3>
              <p className="h3">{projection.title}</p>
              <p>{projection.text}</p>
            </article>
          );
        })}
      </div>
      <div className="projection-arrows">
        <button
          className="projection-arrow projection-arrow--left"
          type="button"
          aria-label="Proyectada anterior"
          onClick={() => rotate(-1)}
        >
          <svg viewBox="0 0 37.2391 32.25" aria-hidden="true">
            <path d="M18.6195 0L37.2391 32.25H0L18.6195 0Z" fill="currentColor" />
          </svg>
        </button>
        <button
          className="projection-arrow projection-arrow--right"
          type="button"
          aria-label="Siguiente proyectada"
          onClick={() => rotate(1)}
        >
          <svg viewBox="0 0 37.2391 32.25" aria-hidden="true">
            <path d="M18.6195 0L37.2391 32.25H0L18.6195 0Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Home() {
  return (
    <Layout>
      <section className="home-hero">
        <div>
          <h1>Retratamos lo que sientes cuando te proyectas</h1>
          <p>
            Un estudio de fotografía para cuando andas migajeando, sobrepensando o atravesando tu
            evento canónico.
          </p>
          <Button href="/contact">Agenda Migajeada</Button>
        </div>
        <div
          className="home-hero__image"
          role="img"
          aria-label="Corazón roto unido con una curita"
        />
      </section>

      <section className="featured section">
        <h2>Proyectos Destacados</h2>
        <div className="featured-cards">
          <a className="featured-card" href="/work/todavia-lo-intento">
            <img src={`${A}/2a439.webp`} alt="Dos rosas intentando alcanzarse" />
            <div>
              <h3 className="display">Todavía lo intento</h3>
              <p className="h3">Todavía lo intento</p>
              <p className="caption">
                Fotografía conceptual diseñada como portada oficial del álbum. La pieza busca
                traducir la atmósfera y esencia del proyecto musical a un plano visual, funcionando
                como la primera puerta de entrada al universo sonoro del disco.
              </p>
            </div>
          </a>
          <a className="featured-card" href="/work/atado-al-silencio">
            <img src={`${A}/394b3.webp`} alt="Corazón rojo atado con una cuerda verde" />
            <div>
              <h3 className="display">Atado al silencio</h3>
              <p className="h3">Atado al silencio</p>
              <p className="caption">
                Fotografía conceptual diseñada como portada oficial del álbum. La pieza busca
                traducir la atmósfera y esencia del proyecto musical a un plano visual, funcionando
                como la primera puerta de entrada al universo sonoro del disco.
              </p>
            </div>
          </a>
        </div>
        <Button href="/work" variant="accent">
          Ver Proyectadas
        </Button>
      </section>

      <section className="projected section">
        <h2>Proyectadas</h2>
        <ProjectionCarousel />
        <p className="section-note">
          Conoce las diferentes experiencias que han sufrido nuestros usuarios
        </p>
      </section>
    </Layout>
  );
}

const workItems = [
  {
    title: "Todavía lo intento",
    image: "2a439.webp",
    href: "/work/todavia-lo-intento",
    cta: "Conoce la Proyectada",
  },
  {
    title: "Atado al silencio",
    image: "394b3.webp",
    href: "/work/atado-al-silencio",
    cta: "Conoce la Proyectada",
  },
];

function Work() {
  return (
    <Layout>
      <section className="work-page page-gradient">
        <header className="page-heading">
          <h1>Nuestro Trabajo</h1>
          <p>Proyectadas en alta resolución</p>
        </header>
        <div className="work-list">
          {workItems.map((item) => (
            <article className="work-card" key={item.title}>
              <img src={`${A}/${item.image}`} alt={item.title} />
              <div>
                <h2 className="display">{item.title}</h2>
                <p className="h3">{item.title}</p>
                <Button href={item.href}>{item.cta}</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

type CaseData = {
  title: string;
  problem: React.ReactNode;
  process: React.ReactNode;
  result: React.ReactNode;
  images: string[];
};

const cases: Record<string, CaseData> = {
  "/work/todavia-lo-intento": {
    title: "Todavía lo intento",
    problem:
      "Había que diseñar la portada de un álbum a partir de una sola canción asignada y convertir su sonido, su ritmo y su concepto en una imagen. La canción fue As It Was, de Harry Styles. La fotografía tenía que transmitir la nostalgia por el pasado y la historia detrás de la letra, de modo que se sintiera lo que se siente al escucharla.",
    process:
      "La canción habla de despedidas y de extrañar lo que alguna vez fue. De ahí salió la idea inicial: reinterpretar La creación de Adán, donde dos manos casi se tocan, pero con dos rosas que intentan alcanzarse mientras la de abajo se consume en fuego. En estudio, lo más difícil fue controlar la flama sobre la rosa y disparar la cámara en el instante justo antes de que la flor se destruyera por completo.",
    result:
      "La fotografía conceptual muestra el intento por alcanzar aquello que se extraña, aunque el proceso duela o desgaste. En la composición contrastan el cielo despejado y la tensión del fuego sobre la flor. Como portada, reúne la nostalgia y el tono agridulce de la canción en una sola escena.",
    images: ["f50aa.webp", "29a9f.webp", "6f874.webp", "d955a.webp", "a9c51.webp"],
  },
  "/work/atado-al-silencio": {
    title: "Atado al silencio",
    problem: (
      <>
        ¿Cómo representar visualmente una experiencia emocional que no puede observarse
        directamente?
        <br />
        <br />
        El proyecto explora la tendencia a aferrarse emocionalmente a una persona como una forma de
        protección, incluso cuando mantener esos sentimientos comienza a generar daño personal.
      </>
    ),
    process: (
      <>
        Se utilizó un globo en forma de corazón como metáfora visual del vínculo emocional.
        <br />
        <br />
        Al manipularlo y comprimirlo mientras permanece sujeto, se genera una tensión entre su forma
        asociada al amor y el daño provocado por contenerlo.
      </>
    ),
    result: (
      <>
        La fotografía representa el desgaste emocional que provoca reprimir lo que uno siente hacia
        alguien por miedo a arruinar la relación.
        <br />
        <br />
        Guardar el sentimiento para evitar un posible rechazo termina generando tensión, frustración
        y una presión constante.
        <br />
        <br />
        La emoción contenida deja de ser un mecanismo de protección y se convierte en una carga que
        va deteriorando el bienestar emocional.
      </>
    ),
    images: [
      "c4f01.webp",
      "atado-proceso-1.webp",
      "atado-proceso-2.webp",
      "atado-proceso-3.webp",
      "394b3.webp",
    ],
  },
};

function CaseStudy({ data }: { data: CaseData }) {
  return (
    <Layout>
      <article className="case-page page-gradient">
        <header className="case-heading">
          <h1 className="display-large">{data.title}</h1>
          <p>{data.title}</p>
        </header>
        <section className="case-section">
          <h2>Problema</h2>
          <p>{data.problem}</p>
          <img className="case-wide" src={`${A}/${data.images[0]}`} alt="" />
        </section>
        <section className="case-section">
          <h2>Proceso</h2>
          <p>{data.process}</p>
          <div className="process-grid">
            {data.images.slice(1, 4).map((image, index) => (
              <img key={`${image}-${index}`} src={`${A}/${image}`} alt="" />
            ))}
          </div>
        </section>
        <section className="case-section case-result">
          <h2>Resultado</h2>
          <p>{data.result}</p>
          <img src={`${A}/${data.images[4]}`} alt={data.title} />
        </section>
      </article>
    </Layout>
  );
}

const services = [
  {
    title: "Enamordimiento",
    price: "$3,200 MXN",
    cta: "Encargar mi proyectada",
    text: "Para cuando llevan dos salidas y ya le estás buscando nombre a sus hijos. Armamos una escena con objetos que aterrizan tu proyectada antes de que te baje la nube; incluye la idea de la foto, montaje con cosas hechas a medida y 3 fotos en buena calidad.",
  },
  {
    title: "Línea de migajeros",
    price: "$4,500 MXN",
    cta: "Cotizar mis migajas",
    text: 'Cuando te tienen a pan y agua, te contestan cada que se acuerdan y tú ahí sigues de necio. Agarramos esos vistos, los "jajaja" secos y tus ganas de que funcione para volverlos fotos; sirven para portadas de rolas, proyectos o nomás para guardar de recuerdo tus migajas. Incluye dirección de arte, armado en estudio y 5 fotos finales.',
  },
  {
    title: "Ex-itocina",
    price: "$5,800 MXN",
    cta: "Producir mi cierre",
    text: "Para sacar todo lo que te tragaste cuando te cortaron o cuando por fin mandaste todo a volar. Armamos una serie de fotos con objetos que cuentan tu cierre de ciclo; incluye la idea, producción en estudio, 6 fotos finales y una impresa en papel algodón para que la enmarques o la quemes.",
  },
];

function Services() {
  const [openServices, setOpenServices] = useState<Set<string>>(new Set());

  function toggleService(title: string) {
    setOpenServices((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <Layout>
      <section className="services-page page-gradient">
        <header className="page-heading">
          <h1>¿En qué fase de la proyectada andas?</h1>
          <p>
            No damos terapia ni consejos amorosos, pero sí convertimos tus enredos sentimentales en
            series de fotografías
          </p>
        </header>
        <div className="service-list">
          {services.map((service) => {
            const isOpen = openServices.has(service.title);
            const panelId = `service-${service.title.toLowerCase().replace(/ /g, "-")}`;
            return (
              <article
                className={isOpen ? "service-card service-card--open" : "service-card"}
                key={service.title}
              >
                <h2>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleService(service.title)}
                  >
                    {service.title}
                    <img src={`${A}/e6492.svg`} alt="" aria-hidden="true" />
                  </button>
                </h2>
                <div className="service-panel" id={panelId}>
                  <div>
                    <p>{service.text}</p>
                    <aside>
                      <strong>{service.price}</strong>
                      <Button href="/contact">{service.cta}</Button>
                    </aside>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}

function Studio() {
  return (
    <Layout>
      <section className="studio-page page-gradient">
        <header className="page-heading">
          <h1>¿Qué es Lapsus y cómo se creó?</h1>
          <p>
            Conoce el origen de este estudio fotográfico
            <br />y sobre sus fundadores
          </p>
        </header>
        <article className="history-card">
          <h2>Historia</h2>
          <p>
            Lapsus nació porque nos la vivimos proyectando y necesitábamos dónde poner tanta
            película mental.
            <br />
            <br />
            Nos cansamos de guardar nuestros eventos canónicos, ilusiones absurdas y cierres de
            ciclo nomás en notas del celular, así que agarramos objetos, buena luz y una cámara para
            darles forma real; abrimos este estudio para traducir en fotos todo eso que te inventas
            en la cabeza cuando quieres de más.
          </p>
        </article>
        <h2 className="founders-title">Fundadores</h2>
        <div className="founders">
          <article>
            <div>
              <h2>Damaris Cisneros - Fotógrafa</h2>
              <p>
                Detrás del lente en Lapsus. Me encargo de escuchar tus películas mentales,
                proyectarme junto contigo y aterrizar todo ese caos emocional en escenas con objetos
                bien iluminados; además de conectar con cualquier POV o video de TikTok como si
                hablara de mi vida.
              </p>
            </div>
            <img src={`${A}/c5d80.webp`} alt="Damaris Cisneros" />
          </article>
          <article>
            <div>
              <h2>Fernando Ibarra - Conceptualizador</h2>
              <p>
                Soy un individuo con personalidad, estilo y gustos extraños, absurdos y sin sentido.
                Soy tan impredecible y espontáneo que nunca sabes lo siguiente que voy a hacer.
                <br />
                <br />
                Me encargo de desarrollar el concepto de las diferentes propuestas de los
                clientes para darles una estructura firme, dramática y que logren causar un impacto
                genuino.
              </p>
            </div>
            <img src={`${A}/73806.webp`} alt="Fernando Ibarra" />
          </article>
        </div>
      </section>
    </Layout>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const confirmationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (status === "success") {
      confirmationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const body = new URLSearchParams();
    formData.forEach((value, key) => body.append(key, String(value)));

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) throw new Error(`Netlify form submission failed: ${response.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Layout>
      <section className="contact-page page-gradient">
        <header className="page-heading">
          <h1>¿Ya te proyectaste?</h1>
          <p>
            Mándanos tu idea, tu evento canónico o el paquete que te llamó la atención; nosotros
            ponemos el estudio y las luces, tú nomás llega con tu historia.
          </p>
        </header>
        {status === "success" ? (
          <section className="confirmation-card" aria-live="polite" ref={confirmationRef}>
            <h2>¡Proyectada enviada!</h2>
            <div>
              <p>Ya recibimos tu historia; te escribimos pronto para aterrizar tu proyectada.</p>
              <Button variant="secondary" onClick={() => setStatus("idle")}>
                Mandar otra proyectada
              </Button>
            </div>
          </section>
        ) : (
          <form
            className="contact-form"
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={submit}
          >
            <input type="hidden" name="form-name" value="contact" />
            <p hidden>
              <label>
                No llenes este campo: <input name="bot-field" />
              </label>
            </p>
            <Field label="Nombre" className="field-full">
              <input required name="name" placeholder="¿Cómo te decimos?" />
            </Field>
            <Field label="Correo">
              <input required type="email" name="email" placeholder="ejemplo@gmail.com" />
            </Field>
            <Field label="Número / WhatsApp">
              <input required type="tel" name="phone" placeholder="+52 81 1234 5678" />
            </Field>
            <Field label="Servicio" className="field-full">
              <select required name="service" defaultValue="">
                <option value="" disabled>
                  ¿En qué etapa vas? (Selecciona un paquete)
                </option>
                {services.map((service) => (
                  <option key={service.title}>{service.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Comentario / Tu historia" className="field-full">
              <textarea
                required
                name="message"
                placeholder="Suéltalo todo: ¿qué pasó, qué idea traes en mente?"
              />
            </Field>
            {status === "error" && (
              <p className="field-full" role="alert">
                No pudimos enviar tu proyectada. Inténtalo de nuevo en un momento.
              </p>
            )}
            <div className="form-action field-full">
              <Button type="submit">
                {status === "submitting" ? "Enviando..." : "Mandar mi proyectada"}
              </Button>
            </div>
          </form>
        )}
        <section className="direct-contact">
          <h2>¿Migajeas pero te da miedo dar el primer paso?</h2>
          <p>
            Aquí no te vamos a dejar en visto; escríbenos directo o mándanos mensaje y aterrizamos
            tu idea sin tanto rollo.
          </p>
          <address>
            <strong>Correo:</strong> proyectadas@lapsus.mx
            <br />
            <strong>WhatsApp / Teléfono:</strong> +52 81 2490 8315
            <br />
            <strong>Ubicación:</strong> Monterrey, N.L. (Sesiones solo con previa cita)
            <br />
            <strong>Instagram:</strong> @lapsus.estudio
          </address>
        </section>
      </section>
    </Layout>
  );
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname.replace(/\/+$/, "") || "/");
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || anchor.target || anchor.origin !== window.location.origin) return;
      event.preventDefault();
      history.pushState({}, "", anchor.href);
      setPath(window.location.pathname.replace(/\/+$/, "") || "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const onPop = () => setPath(window.location.pathname.replace(/\/+$/, "") || "/");
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);
  return path;
}

const pageMetadata: Record<string, { name: string; description: string }> = {
  "/": {
    name: "Inicio",
    description:
      "Lapsus es un estudio de fotografía para cuando andas migajeando, sobrepensando o atravesando tu evento canónico.",
  },
  "/work": {
    name: "Trabajo",
    description:
      "Conoce el trabajo de Lapsus y nuestras series de fotografía conceptual sobre conflictos románticos.",
  },
  "/work/todavia-lo-intento": {
    name: "Todavía lo intento",
    description:
      "Descubre Todavía lo intento, una fotografía conceptual de Lapsus inspirada en la nostalgia y en aquello que aún buscamos alcanzar.",
  },
  "/work/atado-al-silencio": {
    name: "Atado al silencio",
    description:
      "Descubre Atado al silencio, una serie conceptual de Lapsus sobre contener sentimientos y el desgaste emocional que provoca.",
  },
  "/services": {
    name: "Servicios",
    description:
      "Explora los servicios de fotografía conceptual de Lapsus para convertir tus enredos sentimentales en imágenes.",
  },
  "/studio": {
    name: "Estudio",
    description:
      "Conoce la historia de Lapsus, nuestro estudio de fotografía conceptual, y a las personas detrás de cada proyectada.",
  },
  "/contact": {
    name: "Contacto",
    description:
      "Contacta a Lapsus para compartir tu historia, elegir un servicio y comenzar tu próxima sesión de fotografía conceptual.",
  },
};

export default function App() {
  const path = usePath();
  const metadata = pageMetadata[path] ?? pageMetadata["/"];

  useEffect(() => {
    const title = `${metadata.name} — Lapsus`;
    document.title = title;

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');

    description?.setAttribute("content", metadata.description);
    ogTitle?.setAttribute("content", title);
    ogDescription?.setAttribute("content", metadata.description);
    ogUrl?.setAttribute(
      "content",
      `https://lapsus.photography${path === "/" ? "" : path}`,
    );
  }, [metadata, path]);

  if (path === "/") return <Home />;
  if (path === "/work") return <Work />;
  if (cases[path]) return <CaseStudy data={cases[path]} />;
  if (path === "/services") return <Services />;
  if (path === "/studio") return <Studio />;
  if (path === "/contact") return <Contact />;
  return <Home />;
}
