import {
  BarChart3,
  Check,
  Globe2,
  Palette,
  ShieldCheck,
  Workflow,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Footer,
  Grid,
  Heading,
  Inline,
  LinkButton,
  List,
  ListItem,
  Section,
  SiteHeader,
  Stack,
  Text,
  Toggle,
  ToggleGroup,
  type Selection,
} from "@devcommunityit/ui";
import { Brand } from "./chrome";

const anchors = [
  { id: "funzionalita", label: "Funzionalità" },
  { id: "prezzi", label: "Prezzi" },
  { id: "faq", label: "Domande frequenti" },
];

const features = [
  {
    icon: <Workflow />,
    title: "Flussi ordinati",
    text: "Ordini, spedizioni e rinnovi in un’unica vista, con stati chiari e azioni di massa.",
  },
  {
    icon: <BarChart3 />,
    title: "Numeri leggibili",
    text: "Indicatori con confronto sul periodo precedente e tabelle esportabili in CSV.",
  },
  {
    icon: <ShieldCheck />,
    title: "Ruoli e permessi",
    text: "Sezioni visibili solo a chi ne ha bisogno; le regole restano sul tuo server.",
  },
  {
    icon: <Palette />,
    title: "Il tuo marchio",
    text: "Palette, modalità chiara o scura e densità adattabili senza toccare il codice.",
  },
  {
    icon: <Globe2 />,
    title: "Pronto per più lingue",
    text: "Formati di date e valute locali, testi traducibili e supporto RTL.",
  },
  {
    icon: <Zap />,
    title: "Leggero",
    text: "Componenti accessibili da tastiera e con lettori di schermo, senza dipendenze superflue.",
  },
];

const plans = [
  {
    id: "base",
    name: "Base",
    monthly: 19,
    description: "Per piccoli team che iniziano.",
    features: ["3 utenti", "Clienti illimitati", "Esportazione CSV"],
  },
  {
    id: "pro",
    name: "Professional",
    monthly: 49,
    description: "Per team commerciali in crescita.",
    features: [
      "15 utenti",
      "Ruoli e permessi",
      "Report trimestrali",
      "Assistenza prioritaria",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 129,
    description: "Per organizzazioni con più sedi.",
    features: [
      "Utenti illimitati",
      "Single sign-on",
      "Ambiente dedicato",
      "Referente tecnico",
    ],
  },
];

const faqs = [
  {
    q: "Posso provare il servizio prima di pagare?",
    a: "Sì, la prova dura 30 giorni e non richiede un metodo di pagamento. Questa pagina è un template: non esiste un servizio reale.",
  },
  {
    q: "Come funziona lo sconto annuale?",
    a: "Con la fatturazione annuale paghi 10 mesi invece di 12. Il selettore “Annuale” nella sezione prezzi mostra l’importo mensile equivalente.",
  },
  {
    q: "Posso cambiare piano in seguito?",
    a: "Sì, in qualsiasi momento: la differenza viene calcolata in proporzione ai giorni rimanenti.",
  },
  {
    q: "Dove sono conservati i dati?",
    a: "In un portale reale lo decide il tuo backend. In questo template tutti i dati sono fittizi e restano nel browser.",
  },
];

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export function Landing() {
  const [billing, setBilling] = useState<Selection>(new Set(["monthly"]));
  const yearly = billing !== "all" && billing.has("yearly");

  return (
    <div className="sc-landing">
      <SiteHeader
        brand={<Brand />}
        navigationLabel="Sezioni della pagina"
        links={anchors.map((a) => ({
          id: a.id,
          label: a.label,
          href: `#${a.id}`,
        }))}
        actions={
          <Inline gap={2} align="center" wrap={false}>
            <LinkButton
              href="/showcase/accesso"
              variant="ghost"
              className="sc-hide-mobile"
            >
              Accedi
            </LinkButton>
            <LinkButton href="/showcase/accesso?vista=registrazione">
              Prova gratis
            </LinkButton>
          </Inline>
        }
        drawerFooter={
          <LinkButton href="/showcase/accesso" variant="secondary" fullWidth>
            Accedi
          </LinkButton>
        }
      />

      <main>
        <Container size="xl">
          <section className="sc-hero" aria-labelledby="hero-title">
            <Stack gap={5} align="start">
              <Badge tone="brand" variant="soft">
                Template dimostrativo
              </Badge>
              <Heading level={1} size="display" id="hero-title" gradient>
                Il portale clienti che il tuo team userà davvero
              </Heading>
              <Text variant="body-lg" tone="secondary" className="sc-hero-text">
                Northwind riunisce clienti, ordini e rinnovi in un’interfaccia
                chiara, accessibile e coerente con il tuo marchio.
              </Text>
              <Inline gap={3}>
                <LinkButton href="/showcase/dashboard" size="lg">
                  Esplora la demo
                </LinkButton>
                <LinkButton
                  href="/showcase/accesso?vista=registrazione"
                  size="lg"
                  variant="outline"
                >
                  Crea un account
                </LinkButton>
              </Inline>
              <Text variant="body-sm" tone="muted">
                Nessuna carta richiesta · 30 giorni di prova · Dati fittizi
              </Text>
            </Stack>
            <div className="sc-hero-art" aria-hidden="true">
              <div className="sc-hero-card sc-hero-card--1" />
              <div className="sc-hero-card sc-hero-card--2" />
              <div className="sc-hero-card sc-hero-card--3" />
            </div>
          </section>
        </Container>

        <Section
          id="funzionalita"
          tabIndex={-1}
          title="Tutto quello che serve, niente di superfluo"
          description="Sei motivi per cui i team scelgono Northwind."
          surface="subtle"
          spacing="lg"
          container="xl"
        >
          <Grid
            columns={{ base: 1, sm: 2, lg: 3 }}
            gap={4}
            as="ul"
            className="sc-plain-list"
          >
            {features.map((f) => (
              <li key={f.title}>
                <Card variant="filled" className="sc-feature">
                  <CardBody>
                    <Stack gap={3}>
                      <span className="sc-feature-icon" aria-hidden="true">
                        {f.icon}
                      </span>
                      <Heading level={3} size="title-md">
                        {f.title}
                      </Heading>
                      <Text tone="secondary">{f.text}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              </li>
            ))}
          </Grid>
        </Section>

        <Section
          id="prezzi"
          tabIndex={-1}
          title="Prezzi semplici"
          description="Prezzi IVA esclusa. Con la fatturazione annuale due mesi sono inclusi."
          spacing="lg"
          container="xl"
          actions={
            <ToggleGroup
              aria-label="Periodo di fatturazione"
              selectedKeys={billing}
              onSelectionChange={setBilling}
              disallowEmptySelection
            >
              <Toggle id="monthly">Mensile</Toggle>
              <Toggle id="yearly">Annuale</Toggle>
            </ToggleGroup>
          }
        >
          <Grid columns={{ base: 1, md: 3 }} gap={4}>
            {plans.map((p) => {
              const price = yearly ? (p.monthly * 10) / 12 : p.monthly;
              return (
                <Card
                  key={p.id}
                  variant={p.featured ? "accent" : "outlined"}
                  className={
                    p.featured ? "sc-plan sc-plan--featured" : "sc-plan"
                  }
                >
                  <CardHeader
                    headingLevel={3}
                    title={p.name}
                    subtitle={p.description}
                    actions={
                      p.featured ? (
                        <Badge tone="brand">Il più scelto</Badge>
                      ) : undefined
                    }
                  />
                  <CardBody>
                    <Stack gap={4}>
                      <p className="sc-price">
                        <span className="sc-price-value">
                          {euro.format(price)}
                        </span>
                        <Text as="span" tone="secondary">
                          {" "}
                          / utente al mese
                          {yearly
                            ? `, ${euro.format(p.monthly * 10)} l’anno`
                            : ""}
                        </Text>
                      </p>
                      <List variant="none" gap={2}>
                        {p.features.map((f) => (
                          <ListItem key={f} className="sc-check-item">
                            <Check aria-hidden="true" /> {f}
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </CardBody>
                  <CardFooter>
                    <LinkButton
                      href="/showcase/accesso?vista=registrazione"
                      fullWidth
                      variant={p.featured ? "primary" : "outline"}
                    >
                      Scegli {p.name}
                    </LinkButton>
                  </CardFooter>
                </Card>
              );
            })}
          </Grid>
        </Section>

        <Section
          id="faq"
          tabIndex={-1}
          title="Domande frequenti"
          spacing="lg"
          surface="subtle"
          container="md"
        >
          <Accordion>
            {faqs.map((f) => (
              <AccordionItem key={f.q} id={f.q} title={f.q} headingLevel={3}>
                <Text>{f.a}</Text>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        <Container size="lg">
          <section className="sc-cta" aria-labelledby="cta-title">
            <Heading level={2} id="cta-title" size="headline-md">
              Pronto a provarlo con il tuo team?
            </Heading>
            <Text tone="secondary">
              La demo è interattiva e non richiede registrazione.
            </Text>
            <LinkButton href="/showcase/dashboard" size="lg">
              Apri la demo
            </LinkButton>
          </section>
        </Container>
      </main>

      <Footer
        brand={<Brand />}
        columns={[
          {
            title: "Prodotto",
            links: [
              { label: "Funzionalità", href: "#funzionalita" },
              { label: "Prezzi", href: "#prezzi" },
              { label: "FAQ", href: "#faq" },
            ],
          },
          {
            title: "Template",
            links: [
              { label: "Dashboard", href: "/showcase/dashboard" },
              { label: "Clienti", href: "/showcase/elenco" },
              { label: "Accesso", href: "/showcase/accesso" },
            ],
          },
          {
            title: "Design system",
            links: [
              { label: "Documentazione", href: "/" },
              { label: "Pattern", href: "/pattern" },
            ],
          },
        ]}
        legalLinks={[
          { label: "Documentazione", href: "/" },
          { label: "Accessibilità", href: "/guide/accessibilita" },
        ]}
        legal="© 2025 Northwind Servizi S.r.l. — azienda fittizia, pagina dimostrativa."
      />
    </div>
  );
}
