import {
  ArrowRight,
  Award,
  Bell,
  BrainCircuit,
  CalendarDays,
  Cloud,
  GitBranch,
  Megaphone,
  Mic,
  Rocket,
  Star,
  Ticket,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  AchievementBadge,
  AchievementBadgeGroup,
  AnnouncementPill,
  ArticleCard,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  CodeBlock,
  Container,
  CtaPanel,
  DateBadge,
  DiscussionList,
  EventCard,
  Footer,
  GradientText,
  IconButton,
  IndicatorBadge,
  Grid,
  Heading,
  Inline,
  Leaderboard,
  LearningPathCard,
  LinkButton,
  LiveIndicator,
  NewsletterCard,
  PostList,
  ProfileCard,
  Ribbon,
  SectionHeader,
  ShareButtons,
  SiteHeader,
  SocialLinks,
  StageLabel,
  Stack,
  Tab,
  TabList,
  Tabs,
  Tag,
  TagGroup,
  Text,
  ThemeProvider,
  type Key,
  type PostListItemData,
  type Selection,
} from "@dev-community/ui";

const anchors = [
  { id: "eventi", label: "Eventi" },
  { id: "articoli", label: "Articoli" },
  { id: "speaker", label: "Speaker" },
  { id: "percorsi", label: "Learning" },
];

const heroCode = `// benvenuto nella community 👋
import { join } from "@devcommunity/core";

const me = await join({
  name: "Tu",
  interests: ["AI", "Cloud", "DevOps"],
  city: "Roma",
  wantsToSpeak: true,
});

me.attend("next-meetup");
me.share("knowledge"); // ✨`;

const topics = [
  { id: "all", label: "Tutti" },
  { id: "ai", label: "AI & Agents" },
  { id: "cloud", label: "Cloud Native" },
  { id: "dotnet", label: ".NET" },
  { id: "devops", label: "DevOps & Platform" },
  { id: "copilot", label: "GitHub Copilot" },
  { id: "security", label: "Security" },
  { id: "frontend", label: "Frontend" },
];

type EventKind = "inPerson" | "online" | "workshop";

const events: Array<{
  id: string;
  kinds: EventKind[];
  props: Parameters<typeof EventCard>[0];
}> = [
  {
    id: "ai-agents",
    kinds: ["inPerson"],
    props: {
      title: "AI Agents in Production: dal prototipo al deploy",
      href: "#eventi",
      date: "2026-11-12",
      tone: "violet",
      mode: "hybrid",
      watermark: "AI",
      tags: (
        <>
          <Badge tone="brand">AI &amp; Agents</Badge>
          <Badge tone="info">Meetup</Badge>
        </>
      ),
      location: "Roma",
      time: "18:30 – 21:00",
      seatsTaken: 86,
      capacity: 120,
      attendees: [
        { name: "Giulia Conti" },
        { name: "Elena Piras" },
        { name: "Luca Tosi" },
        { name: "Anna Ferri" },
        { name: "Paolo Neri" },
      ],
      attendeesLabel: "Partecipanti",
    },
  },
  {
    id: "dotnet-aspire",
    kinds: ["online"],
    props: {
      title: ".NET 10 + Aspire: microservizi cloud-native senza dolore",
      href: "#eventi",
      date: "2026-11-27",
      tone: "pink",
      mode: "online",
      watermark: ".NET",
      tags: (
        <>
          <Badge tone="danger">.NET</Badge>
          <Badge>Live coding</Badge>
        </>
      ),
      location: "Streaming",
      time: "19:00 – 20:30",
      attendees: [{ name: "Marco Rossi" }, { name: "Sara Leone" }],
      attendeesLabel: "Partecipanti",
    },
  },
  {
    id: "platform",
    kinds: ["inPerson", "workshop"],
    props: {
      title: "Platform Engineering hands-on: GitHub Actions, IaC e golden path",
      href: "#eventi",
      date: "2026-12-05",
      tone: "cyan",
      mode: "inPerson",
      watermark: "OPS",
      tags: (
        <>
          <Badge tone="success">DevOps</Badge>
          <Badge tone="info">Workshop</Badge>
        </>
      ),
      location: "Milano",
      time: "09:30 – 17:30",
      seatsTaken: 28,
      capacity: 30,
      attendees: [{ name: "Anna Fabbri" }, { name: "Davide Bruno" }],
      attendeesLabel: "Partecipanti",
    },
  },
];

const initialPosts: PostListItemData[] = [
  {
    id: "keda",
    title: "AKS + KEDA: autoscaling event-driven spiegato bene",
    href: "#articoli",
    thumbLabel: "K8s",
    tone: "data-2",
    author: "Marco Rossi",
    meta: "6 min",
    tags: (
      <Badge tone="info" size="sm">
        Cloud Native
      </Badge>
    ),
    votes: 186,
  },
  {
    id: "copilot",
    title: "GitHub Copilot agent mode: 10 prompt che uso ogni giorno",
    href: "#articoli",
    thumbLabel: "GH",
    tone: "brand",
    author: "Sara Leone",
    meta: "4 min",
    tags: <Badge size="sm">Copilot</Badge>,
    votes: 241,
    isVoted: true,
  },
  {
    id: "iac",
    title: "Bicep vs Terraform nel 2026: un confronto senza tifoserie",
    href: "#articoli",
    thumbLabel: "IaC",
    tone: "data-4",
    author: "Davide Bruno",
    meta: "11 min",
    tags: (
      <Badge tone="success" size="sm">
        DevOps
      </Badge>
    ),
    votes: 97,
  },
  {
    id: "sec",
    title: "Secret scanning e supply chain: checklist per la tua pipeline",
    href: "#articoli",
    thumbLabel: "SEC",
    tone: "data-6",
    author: "Elena Piras",
    meta: "7 min",
    tags: (
      <Badge tone="danger" size="sm">
        Security
      </Badge>
    ),
    votes: 133,
  },
];

const speakers = [
  {
    name: "Giulia Conti",
    jobTitle: "AI Engineer",
    tags: ["AI", "Python"],
    talks: 14,
    followers: 2100,
    tone: "brand" as const,
  },
  {
    name: "Marco Rossi",
    jobTitle: "Cloud Architect",
    tags: ["Kubernetes", "Azure"],
    talks: 22,
    followers: 3400,
    tone: "accent" as const,
  },
  {
    name: "Sara Leone",
    jobTitle: "Developer Advocate",
    tags: ["Copilot", ".NET"],
    talks: 31,
    followers: 5800,
    tone: "brand" as const,
  },
  {
    name: "Davide Bruno",
    jobTitle: "Platform Engineer",
    tags: ["DevOps", "IaC"],
    talks: 9,
    followers: 1200,
    tone: "accent" as const,
  },
];

const compact: Intl.NumberFormatOptions = {
  notation: "compact",
  maximumFractionDigits: 1,
};

export function Community() {
  const [topic, setTopic] = useState<Selection>(new Set(["all"]));
  const [eventTab, setEventTab] = useState<Key>("all");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [showDemo, setShowDemo] = useState(true);

  const visibleEvents =
    eventTab === "all"
      ? events
      : events.filter((e) => e.kinds.includes(eventTab as EventKind));

  return (
    <div className="sc-landing sc-cm">
      {showDemo ? (
        <StageLabel
          stage="demo"
          variant="banner"
          children="Ambiente demo"
          description="Community e dati fittizi: iscrizioni, voti e reazioni restano in questa pagina."
          action={
            <LinkButton href="/pattern" variant="ghost" size="sm">
              Cosa è simulato
            </LinkButton>
          }
          onDismiss={() => setShowDemo(false)}
        />
      ) : null}
      <SiteHeader
        brand={<CommunityBrand />}
        navigationLabel="Sezioni della pagina"
        links={anchors.map((a) => ({
          id: a.id,
          label: a.label,
          href: `#${a.id}`,
        }))}
        actions={
          <Inline gap={2} align="center" wrap={false}>
            <IndicatorBadge
              count={3}
              label="3 notifiche non lette"
              className="sc-hide-mobile"
            >
              <IconButton variant="ghost" label="Notifiche" icon={<Bell />} />
            </IndicatorBadge>
            <LinkButton
              href="/showcase/accesso"
              variant="ghost"
              className="sc-hide-mobile"
            >
              Accedi
            </LinkButton>
            <LinkButton href="#cta">Unisciti</LinkButton>
          </Inline>
        }
      />

      <main>
        <ThemeProvider mode="dark">
          <section className="sc-cm-hero" aria-labelledby="cm-hero-title">
            <Container size="xl">
              <div className="sc-cm-hero-grid">
                <Stack gap={5} align="start">
                  <AnnouncementPill href="#cta">
                    Call for Speaker 2027 aperta · scade il 15 dicembre
                  </AnnouncementPill>
                  <Heading
                    level={1}
                    id="cm-hero-title"
                    size="display"
                    className="sc-cm-hero-title"
                  >
                    La community dove gli sviluppatori{" "}
                    <GradientText>
                      imparano, condividono e crescono.
                    </GradientText>
                  </Heading>
                  <Text variant="body-lg" className="sc-cm-hero-lead">
                    Meetup, conferenze, workshop hands-on e contenuti tecnici su
                    AI, Cloud, DevOps e .NET — creati dalla community, per la
                    community.
                  </Text>
                  <Inline gap={3}>
                    <LinkButton href="#cta" size="lg" endIcon={<ArrowRight />}>
                      Entra nella community
                    </LinkButton>
                    <LinkButton
                      href="#eventi"
                      size="lg"
                      variant="secondary"
                      startIcon={<CalendarDays />}
                    >
                      Esplora gli eventi
                    </LinkButton>
                  </Inline>
                  <dl className="sc-cm-stats">
                    <div>
                      <dt>membri attivi</dt>
                      <dd>12.4K</dd>
                    </div>
                    <div>
                      <dt>eventi organizzati</dt>
                      <dd>180+</dd>
                    </div>
                    <div>
                      <dt>talk registrati</dt>
                      <dd>950</dd>
                    </div>
                  </dl>
                  <Inline gap={3} align="center">
                    <AvatarGroup aria-label="Nuovi membri" max={3} size="sm">
                      {[
                        "Marco Rossi",
                        "Sara Leone",
                        "Anna Fabbri",
                        "Luca Tosi",
                        "Elena Piras",
                      ].map((n) => (
                        <Avatar key={n} name={n} />
                      ))}
                    </AvatarGroup>
                    <Text variant="body-sm" className="sc-cm-muted">
                      +320 questa settimana
                    </Text>
                  </Inline>
                </Stack>

                <div className="sc-cm-hero-visual">
                  <CodeBlock
                    variant="window"
                    title="community.config.ts"
                    code={heroCode}
                    copyable={false}
                  />
                  <div className="sc-cm-float sc-cm-float--live">
                    <LiveIndicator viewers={248} label="LIVE ora" />
                  </div>
                  <div className="sc-cm-float sc-cm-float--event">
                    <Inline gap={3} align="center" wrap={false}>
                      <DateBadge
                        date="2026-11-12"
                        variant="gradient"
                        size="sm"
                      />
                      <Stack gap={0}>
                        <Text weight="bold">AI Agents in Production</Text>
                        <Text variant="body-sm" className="sc-cm-muted">
                          Roma · Ibrido · 18:30
                        </Text>
                      </Stack>
                    </Inline>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </ThemeProvider>

        <Container size="xl">
          <div className="sc-cm-topics">
            <TagGroup
              label="Esplora per tema"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={topic}
              onSelectionChange={setTopic}
            >
              {topics.map((t) => (
                <Tag key={t.id} id={t.id}>
                  {t.label}
                </Tag>
              ))}
            </TagGroup>
          </div>

          <section
            id="eventi"
            className="sc-cm-section"
            aria-labelledby="cm-eventi"
          >
            <SectionHeader
              titleId="cm-eventi"
              eyebrow="Prossimi eventi"
              title="Ci vediamo dal vivo (o in streaming)"
              actions={
                <Tabs
                  variant="pill"
                  selectedKey={eventTab}
                  onSelectionChange={setEventTab}
                >
                  <TabList aria-label="Filtra gli eventi">
                    <Tab id="all">Tutti</Tab>
                    <Tab id="inPerson">In presenza</Tab>
                    <Tab id="online">Online</Tab>
                    <Tab id="workshop">Workshop</Tab>
                  </TabList>
                </Tabs>
              }
            />
            <Grid minItemWidth="18rem" gap={5}>
              {visibleEvents.map((e) => (
                <EventCard
                  key={e.id}
                  {...e.props}
                  action={
                    e.props.mode === "online" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        startIcon={<Bell />}
                      >
                        Ricordamelo
                      </Button>
                    ) : (
                      <Button size="sm" startIcon={<Ticket />}>
                        Iscriviti
                      </Button>
                    )
                  }
                />
              ))}
            </Grid>
          </section>

          <section
            id="articoli"
            className="sc-cm-section"
            aria-labelledby="cm-articoli"
          >
            <div className="sc-cm-two">
              <Stack gap={5}>
                <SectionHeader
                  titleId="cm-articoli"
                  eyebrow="Dalla community"
                  title="Articoli e discussioni"
                />
                <ArticleCard
                  href="#articoli"
                  cover={
                    <pre>
                      {
                        "await agent.run({\n  tools: [search, deploy],\n  guardrails: true\n});"
                      }
                    </pre>
                  }
                  tags={
                    <>
                      <Badge tone="brand">AI &amp; Agents</Badge>
                      <Badge tone="warning">In evidenza</Badge>
                    </>
                  }
                  title="Come abbiamo portato un multi-agent system in produzione (e cosa abbiamo sbagliato)"
                  excerpt="Orchestrazione, osservabilità e costi: le lezioni apprese in sei mesi di agenti AI su workload reali."
                  author={{ name: "Giulia Conti" }}
                  date="3 giorni fa"
                  readingMinutes={9}
                  likes={412 + (liked ? 1 : 0)}
                  isLiked={liked}
                  onLike={setLiked}
                  comments={58}
                  commentsHref="#articoli"
                  bookmarks={130 + (saved ? 1 : 0)}
                  isBookmarked={saved}
                  onBookmark={setSaved}
                />
                <Inline gap={3} align="center" justify="between">
                  <Text variant="body-sm" tone="secondary">
                    Ti è stato utile? Condividilo con il tuo team.
                  </Text>
                  <ShareButtons
                    url="https://community.example/articoli/multi-agent-in-produzione"
                    title="Come abbiamo portato un multi-agent system in produzione"
                    networks={["linkedin", "x", "whatsapp", "email"]}
                    size="sm"
                  />
                </Inline>
                <PostList
                  aria-label="Articoli in tendenza"
                  items={posts}
                  onVote={(id, isVoted) =>
                    setPosts((list) =>
                      list.map((p) =>
                        p.id === id
                          ? {
                              ...p,
                              isVoted,
                              votes: (p.votes ?? 0) + (isVoted ? 1 : -1),
                            }
                          : p,
                      ),
                    )
                  }
                />
              </Stack>

              <aside
                className="sc-cm-aside"
                aria-label="In evidenza nella community"
              >
                <section className="sc-cm-box" aria-labelledby="cm-discussioni">
                  <Heading level={3} id="cm-discussioni" size="title-md">
                    🔥 Discussioni calde
                  </Heading>
                  <DiscussionList
                    items={[
                      {
                        id: "d1",
                        title: "Monorepo o polyrepo per team da 30 dev?",
                        href: "#articoli",
                        replies: 84,
                        time: "2h fa",
                      },
                      {
                        id: "d2",
                        title:
                          "RAG su documenti aziendali: chunking che funziona davvero",
                        href: "#articoli",
                        replies: 61,
                        time: "5h fa",
                        isNew: true,
                      },
                      {
                        id: "d3",
                        title: "Primo talk a un meetup: consigli?",
                        href: "#articoli",
                        replies: 47,
                        time: "ieri",
                      },
                    ]}
                  />
                </section>
                <Leaderboard
                  title="🏆 Top contributor del mese"
                  highlightId="mr"
                  items={[
                    {
                      id: "sl",
                      name: "Sara Leone",
                      subtitle: "12 articoli · 3 talk",
                      points: 2840,
                    },
                    {
                      id: "gc",
                      name: "Giulia Conti",
                      subtitle: "8 articoli · 2 talk",
                      points: 2115,
                    },
                    {
                      id: "mr",
                      name: "Marco Rossi",
                      subtitle: "96 risposte utili",
                      points: 1760,
                    },
                  ]}
                />
                <NewsletterCard
                  eyebrow="📬 Newsletter"
                  title="Il meglio della settimana, ogni venerdì."
                  description="Eventi, talk e articoli selezionati. Zero spam."
                  placeholder="nome@email.it"
                  submitLabel="Iscrivimi"
                  onSubmit={() =>
                    new Promise((resolve) => setTimeout(resolve, 800))
                  }
                />
              </aside>
            </div>
          </section>

          <section
            id="speaker"
            className="sc-cm-section"
            aria-labelledby="cm-speaker"
          >
            <SectionHeader
              titleId="cm-speaker"
              eyebrow="Speaker & mentor"
              title="Le persone che fanno la community"
              actions={
                <LinkButton
                  href="#speaker"
                  variant="ghost"
                  endIcon={<ArrowRight />}
                >
                  Tutti gli speaker
                </LinkButton>
              }
            />
            <Grid minItemWidth="14rem" gap={5}>
              {speakers.map((s) => (
                <ProfileCard
                  key={s.name}
                  name={s.name}
                  jobTitle={s.jobTitle}
                  tone={s.tone}
                  href="#speaker"
                  tags={s.tags.map((t) => (
                    <Badge key={t} tone="brand">
                      {t}
                    </Badge>
                  ))}
                  stats={[
                    { label: "talk", value: s.talks },
                    {
                      label: "follower",
                      value: s.followers,
                      formatOptions: compact,
                    },
                  ]}
                />
              ))}
            </Grid>
          </section>

          <section
            id="percorsi"
            className="sc-cm-section"
            aria-labelledby="cm-percorsi"
          >
            <SectionHeader
              titleId="cm-percorsi"
              eyebrow="Learning paths"
              title="Percorsi guidati, dal primo commit alla produzione"
            />
            <Grid minItemWidth="16rem" gap={5}>
              <Ribbon label="Beta" tone="accent">
                <LearningPathCard
                  href="#percorsi"
                  icon={<BrainCircuit />}
                  tone="brand"
                  title="Generative AI per sviluppatori"
                  description="LLM, RAG, agenti e valutazione. 8 moduli con lab pratici."
                  completed={5}
                  total={8}
                />
              </Ribbon>
              <LearningPathCard
                href="#percorsi"
                icon={<Cloud />}
                tone="accent"
                title="Cloud Native Foundations"
                description="Container, Kubernetes, osservabilità e sicurezza. 10 moduli."
                completed={2}
                total={10}
              />
              <LearningPathCard
                href="#percorsi"
                icon={<GitBranch />}
                tone="subtle"
                title="DevOps & Platform Engineering"
                description="CI/CD, IaC, GitOps e developer experience. 7 moduli."
                isNew
                meta="Inizia gratis"
              />
            </Grid>
          </section>

          <section
            id="badge"
            className="sc-cm-section"
            aria-labelledby="cm-badge"
          >
            <SectionHeader
              titleId="cm-badge"
              eyebrow={
                <>
                  Riconoscimenti <StageLabel stage="beta" size="sm" />
                </>
              }
              title="Badge e traguardi della community"
              description="Si sbloccano partecipando: talk, articoli, risposte utili ed eventi."
            />
            <AchievementBadgeGroup minItemWidth="10rem">
              <AchievementBadge
                icon={<Mic />}
                tier="gold"
                title="Primo talk"
                description="Hai parlato a un meetup"
                earnedAt="2026-03-14"
              />
              <AchievementBadge
                icon={<Star />}
                tier="platinum"
                title="Top contributor"
                description="Primi 3 del mese"
                earnedAt="2026-10-01"
              />
              <AchievementBadge
                icon={<Users />}
                tier="silver"
                title="Mentore"
                description="5 persone affiancate"
                earnedAt="2026-06-20"
              />
              <AchievementBadge
                icon={<Megaphone />}
                tier="bronze"
                title="Prima discussione"
                earnedAt="2025-12-02"
              />
              <AchievementBadge
                icon={<Rocket />}
                tier="brand"
                tierLabel="Speciale"
                title="Early adopter"
                description="Iscritto nel primo anno"
              />
              <AchievementBadge
                icon={<Award />}
                tier="gold"
                title="Maratoneta"
                description="10 eventi seguiti"
                isLocked
                progress={{ value: 7, max: 10 }}
              />
            </AchievementBadgeGroup>
          </section>

          <section
            id="cta"
            className="sc-cm-section"
            aria-label="Call for Speaker"
          >
            <ThemeProvider mode="light">
              <CtaPanel
                eyebrow="🎤 Call for Speaker 2027"
                title={
                  <>
                    Hai qualcosa da raccontare?{" "}
                    <GradientText tone="inverse">Sali sul palco.</GradientText>
                  </>
                }
                description="Che sia il tuo primo talk o il cinquantesimo, ti affianchiamo con mentoring, prove generali e feedback."
                actions={
                  <>
                    <LinkButton href="#cta">Proponi un talk</LinkButton>
                    <LinkButton href="#cta" variant="secondary">
                      Diventa mentor
                    </LinkButton>
                  </>
                }
                steps={[
                  { title: "Invia abstract e livello del talk" },
                  { title: "Ricevi feedback da un mentor in 7 giorni" },
                  { title: "Prova generale online con la community" },
                  { title: "Sali sul palco 🚀" },
                ]}
              />
            </ThemeProvider>
          </section>
        </Container>
      </main>

      <Footer
        brand={<CommunityBrand />}
        columns={[
          {
            title: "Community",
            links: [
              { label: "Eventi", href: "#eventi" },
              { label: "Speaker", href: "#speaker" },
              { label: "Codice di condotta", href: "#top" },
            ],
          },
          {
            title: "Contenuti",
            links: [
              { label: "Articoli", href: "#articoli" },
              { label: "Learning paths", href: "#percorsi" },
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
        social={
          <SocialLinks
            aria-label="Dev Community sui social"
            items={[
              { network: "github", href: "https://github.com/" },
              { network: "linkedin", href: "https://www.linkedin.com/" },
              { network: "youtube", href: "https://www.youtube.com/" },
              { network: "discord", href: "https://discord.com/" },
              { network: "rss", href: "/feed.xml" },
            ]}
          />
        }
        legalLinks={[{ label: "Accessibilità", href: "/guide/accessibilita" }]}
        legal="© 2026 Dev Community · community fittizia, pagina dimostrativa."
      />
    </div>
  );
}

function CommunityBrand() {
  return (
    <Inline gap={2} align="center" wrap={false} className="sc-min0">
      <span className="sc-cm-logo" aria-hidden="true">
        {"</>"}
      </span>
      <Text as="span" weight="bold" truncate className="sc-min0">
        Dev Community
      </Text>
      <StageLabel stage="beta" size="sm" className="sc-cm-brand-stage" />
    </Inline>
  );
}
