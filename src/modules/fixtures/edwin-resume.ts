import type { ResumeData } from "@/@types/resume-data";

export const edwinResume = {
  identity: {
    name: "Edwin Fom",
    headline:
      "Full-Stack-Entwickler (Schwerpunkt Backend & eigenständiger SaaS-Aufbau)",
    contact: {
      email: "edwinfom05@gmail.com",
      phone: "+237 659 33 62 61",
      location: {
        city: "Douala",
        country: "Kamerun",
        remote: true,
      },
      links: [
        {
          kind: "website",
          label: "www.edwinfom.dev",
          url: "https://www.edwinfom.dev",
        },
      ],
    },
  },
  profile: {
    summary:
      "Full-Stack-Entwickler mit nachweislicher Erfahrung im eigenständigen Aufbau, Deployment und Betrieb vollständiger Softwareplattformen – von der Idee bis zur produktiven Lösung. Programmiere seit früher Jugend und habe seither mehrere SaaS-, ERP- und KI-gestützte Plattformen komplett selbstständig konzipiert und umgesetzt, ohne Micromanagement oder enge Vorgaben. Erfahrung mit Next.js, React, Node.js, TypeScript, Prisma/Drizzle ORM und relationalen Datenbanken. Hohe Eigenverantwortung, schnelle Entscheidungsfindung und der Anspruch, Ergebnisse zu liefern statt nur Code zu schreiben.",
    highlights: [],
  },
  experiences: [
    {
      id: "softtronic-innoving",
      employer: "Softtronic Innoving",
      role: "Full-Stack-Entwickler",
      location: {
        city: "Douala",
        country: "Kamerun",
      },
      period: {
        start: {
          year: 2025,
          month: 11,
        },
      },
      achievements: [
        "Eigenständige Entwicklung und Wartung von Full-Stack-Unternehmensanwendungen mit Next.js, Node.js, Prisma ORM und Microsoft SQL Server",
        "Konzeption und Implementierung von Frontend- und Backend-Lösungen sowie Entwicklung von REST-APIs",
        "Entwicklung einer Zollabwicklungssoftware für Navitrans zur Unterstützung von Zollanmeldungs- und Deklarationsprozessen",
        "Umsetzung komplexer Geschäftslogik und Datenzugriffe mit Prisma ORM und SQL Server",
        "Aufbau einer Monorepo-Anwendung mit Next.js und Node.js für höhere Skalierbarkeit und Wartbarkeit",
        "Entwicklung eines automatisierten Reminder-Systems zur Nachverfolgung von Angeboten und Kundenanfragen",
        "Integration mit dem ERP-System BrainOpx zur zentralen Verwaltung von Vertriebs- und Kundendaten",
        "Automatisierung wiederkehrender Vertriebsprozesse und Digitalisierung von Geschäftsabläufen für mehrere Fachabteilungen",
      ],
      technologies: [
        "Next.js",
        "Node.js",
        "Prisma ORM",
        "Microsoft SQL Server",
        "REST APIs",
        "Navitrans",
        "BrainOpx",
      ],
    },
    {
      id: "achor-competence",
      employer: "Achor Competence",
      role: "Freelance-Entwickler",
      employmentType: "freelance",
      location: {
        city: "Douala",
        country: "Kamerun",
      },
      period: {
        start: {
          year: 2026,
          month: 1,
        },
        end: {
          year: 2026,
          month: 3,
        },
      },
      achievements: [
        "Eigenverantwortlicher Aufbau einer interaktiven Unternehmenswebsite mit Next.js inklusive integriertem Administrations-Dashboard",
        "Konzeption und Umsetzung einer skalierbaren Frontend-Architektur für Wartbarkeit und Erweiterbarkeit",
        "Implementierung von Dashboard-Funktionen zur effizienten Verwaltung und Pflege von Inhalten und Daten",
        "Performance-Optimierung der Anwendung für schnelle Ladezeiten und eine reibungslose Nutzererfahrung",
      ],
      technologies: ["Next.js"],
    },
    {
      id: "port-autonome-de-douala",
      employer: "Port Autonome de Douala (PAD)",
      role: "Freelance-Entwickler",
      employmentType: "freelance",
      location: {
        city: "Douala",
        country: "Kamerun",
      },
      period: {
        start: {
          year: 2025,
          month: 4,
        },
        end: {
          year: 2026,
          month: 5,
        },
      },
      achievements: [
        "Eigenständige Entwicklung einer digitalen Plattform zur Unterstützung von Mobilitäts- und Zugangsprozessen im Hafengelände",
        "Implementierung eines Systems zur Vergabe und Verwaltung von Parkberechtigungen für Mitarbeiter und autorisierte Nutzer",
        "Entwicklung von Navigationsfunktionen zur Orientierung auf dem Hafengelände",
        "Konzeption und Umsetzung von Frontend- und Backend-Komponenten mit Next.js, TypeScript und Node.js",
        "Entwicklung und Integration von REST-Schnittstellen sowie rollenbasierter Zugriffskontrolle",
      ],
      technologies: ["Next.js", "TypeScript", "Node.js", "REST APIs"],
    },
    {
      id: "delenscio",
      employer: "Delenscio",
      role: "Full-Stack-Entwickler",
      location: {
        city: "Douala",
        country: "Kamerun",
      },
      period: {
        start: {
          year: 2024,
          month: 11,
        },
        end: {
          year: 2025,
          month: 4,
        },
      },
      achievements: [
        "Entwicklung einer professionellen Social-Networking-Plattform nach dem Vorbild von LinkedIn mit Angular, NGXS und Nx Monorepo",
        "Verbesserung der Anwendungsperformance durch Optimierung des State-Managements mit NGXS – Reduzierung der Ladezeiten um 20 %",
        "Enge Zusammenarbeit mit einem belgischen Entwicklungsteam über sechs Monate zur fristgerechten Bereitstellung wichtiger Funktionen",
        "Aufbau und Pflege einer skalierbaren Monorepo-Architektur mit Nx für die langfristige Weiterentwicklung des Projekts",
      ],
      technologies: ["Angular", "NGXS", "Nx"],
    },
  ],
  projects: [
    {
      id: "agent-md-generator",
      name: "Agent-MD-Generator",
      role:
        "Full-Stack- & KI-Tool-Entwickler (eigenständig konzipiert und umgesetzt)",
      period: {
        start: {
          year: 2026,
          month: 4,
        },
        end: {
          year: 2026,
          month: 4,
        },
      },
      description: "KI-gestütztes Tool zur Automatisierung der Softwareanalyse",
      highlights: [
        "Automatische Generierung strukturierter Dokumentation (Agent.md) aus bestehenden Softwareprojekten zur Unterstützung von KI-Agenten bei Entwicklung, Wartung und Erweiterung",
        "Ca. 70 % geringere manuelle Analysezeit von Codebasen, schnellere Einarbeitung in neue Projekte und standardisierte Projektanalyse und Dokumentation",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Node.js",
        "LLM-Integration",
        "Markdown-Generierung",
      ],
      links: [],
    },
    {
      id: "interglobe",
      name: "Interglobe",
      role:
        "Full-Stack- & Product-Entwickler (eigenständig vom Konzept bis zum produktiven Betrieb)",
      period: {
        start: {
          year: 2023,
          month: 6,
        },
        end: {
          year: 2026,
          month: 1,
        },
      },
      description: "KI-gestützte Plattform zur Vermittlung von Praktika",
      highlights: [
        "Eigenständiger Aufbau einer KI-gestützten Plattform zur Vermittlung von Praktika inklusive automatischer Generierung kontextreicher Projektdokumentation für KI-Coding-Agenten",
        "Ca. 70 % geringere manuelle Analysezeit, verbesserte Effizienz beim Einsatz von KI-Agenten im Entwicklungsprozess",
      ],
      technologies: [
        "Next.js",
        "Prisma ORM",
        "PostgreSQL",
        "Vercel AI SDK",
        "Inngest",
      ],
      links: [],
    },
  ],
  education: [
    {
      id: "iut-licence-technologique",
      institution: "Institut Universitaire de Technologie (IUT) Douala",
      credential: "Technische Bachelor-Lizenz (Licence Technologique)",
      fieldOfStudy: "Informatik",
      location: {
        city: "Douala",
        country: "Kamerun",
      },
      period: {
        start: {
          year: 2024,
          month: 10,
        },
        end: {
          year: 2025,
          month: 7,
        },
      },
      highlights: [],
    },
    {
      id: "iuc-bts",
      institution: "Institut Universitaire de la Côte (IUC)",
      credential: "Höherer Technikerabschluss (BTS)",
      fieldOfStudy: "Informatik",
      location: {
        city: "Douala",
        country: "Kamerun",
      },
      period: {
        start: {
          year: 2022,
          month: 10,
        },
        end: {
          year: 2024,
          month: 5,
        },
      },
      highlights: [],
    },
    {
      id: "lycee-bilingue-bafoussam",
      institution: "Lycée Bilingue de Bafoussam",
      credential: "Abitur (Baccalauréat C)",
      fieldOfStudy: "Naturwissenschaftlicher Zweig",
      location: {
        city: "Bafoussam",
        country: "Kamerun",
      },
      period: {
        start: {
          year: 2021,
          month: 9,
        },
        end: {
          year: 2022,
          month: 5,
        },
      },
      highlights: [],
    },
  ],
  skills: [
    {
      name: "Sprachen & Frameworks",
      skills: [
        { name: "TypeScript" },
        { name: "JavaScript (ES6+)" },
        { name: "Next.js" },
        { name: "React.js" },
        { name: "Node.js" },
        { name: "Angular" },
        { name: "HTML5" },
        { name: "CSS3" },
        { name: "Bootstrap" },
      ],
    },
    {
      name: "Backend & Datenbanken",
      skills: [
        { name: "REST-API-Entwicklung" },
        { name: "Prisma ORM" },
        { name: "Drizzle ORM" },
        { name: "Datenmodellierung" },
        { name: "Microsoft SQL Server" },
        { name: "PostgreSQL" },
      ],
    },
    {
      name: "Architektur & Tools",
      skills: [
        { name: "Monorepo-Architekturen (Nx)" },
        { name: "Git" },
        { name: "Rollenbasierte Zugriffskontrolle" },
        { name: "KI-/LLM-Integration" },
      ],
    },
    {
      name: "Sonstiges",
      skills: [
        { name: "UI/UX-Integration" },
        { name: "ERP-Integration" },
        { name: "Automatisierungslösungen" },
      ],
    },
  ],
  languages: [
    {
      name: "Französisch",
      proficiency: "native",
    },
    {
      name: "Englisch",
      proficiency: "B2",
    },
    {
      name: "Deutsch",
      proficiency: "A2",
    },
  ],
  interests: [
    {
      name: "Webentwicklung und neue Technologien",
    },
    {
      name: "Künstliche Intelligenz und Software-Innovation",
    },
    {
      name: "Gaming und E-Sport",
    },
    {
      name: "Lernen neuer Technologien und technische Weiterbildung",
    },
  ],
} as const satisfies ResumeData;
