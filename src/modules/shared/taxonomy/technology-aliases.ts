import { normalizeComparable } from "@/modules/shared/text/normalize-text";

const canonicalAliasGroups: Readonly<Record<string, readonly string[]>> = {
  "node.js": ["node", "nodejs", "node js"],
  "next.js": ["next", "nextjs", "next js"],
  "nest.js": ["nest", "nestjs"],
  "vue.js": ["vue", "vuejs"],
  "nuxt.js": ["nuxt", "nuxtjs"],
  "express.js": ["express", "expressjs"],
  react: ["react.js", "reactjs"],
  "react native": ["reactnative"],
  javascript: ["js", "ecmascript"],
  typescript: ["ts"],
  postgresql: ["postgres", "psql", "postgre", "postgresql database"],
  "microsoft sql server": ["mssql", "sql server", "sqlserver", "t-sql", "tsql"],
  mysql: ["my sql"],
  mongodb: ["mongo"],
  redis: [],
  "c#": ["csharp", "c sharp"],
  "c++": ["cpp", "cplusplus"],
  ".net": ["dotnet", "dot net", "asp.net", "aspnet"],
  golang: ["go", "go lang"],
  kubernetes: ["k8s"],
  docker: ["dockerized", "containerization"],
  "ci/cd": ["cicd", "continuous integration", "continuous delivery", "continuous deployment"],
  aws: ["amazon web services"],
  gcp: ["google cloud", "google cloud platform"],
  azure: ["microsoft azure"],
  "rest api": ["rest", "restful", "rest apis", "restful api", "restful apis"],
  graphql: ["graph ql"],
  grpc: ["g rpc"],
  "prisma orm": ["prisma"],
  "drizzle orm": ["drizzle"],
  "tailwind css": ["tailwind", "tailwindcss"],
  "github actions": ["gh actions"],
  "unit testing": ["unit tests", "jest", "vitest", "testing"],
  "rbac": ["role based access control", "role-based access control", "authorization"],
  "oauth": ["oauth2", "oauth 2.0", "open authorization"],
  microservices: ["micro services", "microservice"],
  "message queue": ["rabbitmq", "kafka", "sqs", "queueing"],
  agile: ["scrum", "kanban"],

  english: ["englisch", "anglais", "inglese", "ingles"],
  german: ["deutsch", "allemand", "tedesco", "aleman"],
  french: ["franzosisch", "francais", "francese", "frances"],
  spanish: ["spanisch", "espagnol", "espanol", "spagnolo"],
  italian: ["italienisch", "italien", "italiano"],
  dutch: ["niederlandisch", "neerlandais", "olandese"],
  portuguese: ["portugiesisch", "portugais", "portugues"],
  arabic: ["arabisch", "arabe"],
  chinese: ["chinesisch", "chinois", "mandarin"],

  "project management": ["projektmanagement", "gestion de projet", "projektleitung"],
  "customer service": ["kundenservice", "kundenbetreuung", "service client"],
  accounting: ["buchhaltung", "comptabilite", "rechnungswesen"],
  "microsoft excel": ["excel", "ms excel", "tabellenkalkulation"],
  "microsoft office": ["ms office", "office paket", "pack office"],
  sap: ["sap erp"],
  salesforce: [],
  "team leadership": ["teamleitung", "führung", "fuhrung", "management d'equipe"],
};

function buildAliasIndex() {
  const index = new Map<string, string>();

  Object.entries(canonicalAliasGroups).forEach(([canonical, aliases]) => {
    index.set(normalizeComparable(canonical), canonical);
    aliases.forEach((alias) => index.set(normalizeComparable(alias), canonical));
  });

  return index;
}

const aliasIndex = buildAliasIndex();

export function canonicalizeTerm(value: string) {
  const comparable = normalizeComparable(value);

  return aliasIndex.get(comparable) ?? value.trim().toLowerCase();
}

export function areEquivalentTerms(first: string, second: string) {
  return canonicalizeTerm(first) === canonicalizeTerm(second);
}

export function canonicalizeAll(values: readonly string[]) {
  return Array.from(new Set(values.map(canonicalizeTerm))).filter(Boolean);
}
