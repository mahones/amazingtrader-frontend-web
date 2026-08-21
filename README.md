# amazingtraders — Frontend

Site + tableau de bord Next.js 16 (App Router, TypeScript, React 19) de la plateforme **amazingtraders**. Consomme l'API Laravel du dossier `../backend` de ce même dépôt.

<!-- > Installation complète du dépôt (backend + frontend) : voir le [README.md racine](../README.md).
> Conventions techniques détaillées : voir le [CLAUDE.md racine](../CLAUDE.md). -->

## ⚠️ Avant de coder

Ce projet tourne sur une version de Next.js dont les conventions/API diffèrent de ce qu'un modèle de langage a pu apprendre à l'entraînement (breaking changes). **Avant d'écrire du code lié au framework**, lire `node_modules/next/dist/docs/` et voir [AGENTS.md](AGENTS.md) (régénéré automatiquement par `next dev` — ne pas le supprimer d'un diff).

## Démarrage rapide

```bash
npm install
```

Créer `.env.local` (non versionné) :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Puis :

```bash
npm run dev      # serveur de dev, :3000
npm run build    # build de production
npm run lint     # ESLint
```

Le backend (`../backend`) doit tourner en parallèle (`composer dev` depuis `backend/`) pour que les appels API fonctionnent.

## Structure

```
src/
├── app/
│   ├── (public)/         Site marketing : accueil, formations, auto-trading, bot-trading,
│   │                     articles, login/register — rendu server-side via src/lib/api/server.ts
│   └── (dashboard)/
│       └── dashboard/     Tableau de bord authentifié, conditionnel au rôle :
│                          formations, auto-trading, bots, articles, users, historique, settings
├── components/
│   ├── ui/                Composants shadcn/ui (construits sur Base UI, pas Radix)
│   ├── forms/              Formulaires admin (CRUD cours/leçons/licences/bots/articles)
│   ├── purchase/            Grilles de tarifs, bouton d'achat, modale post-achat
│   ├── licenses/, bots/, cards/, layout/, media/, editor/, home/, legal/, filters/, articles/, auto-trading/, bot-trading/
├── context/AuthContext.tsx  État d'authentification (peuplé via GET /api/me si un token existe)
├── hooks/                    useRequireAuth, useRequireRole, useAutoLogout, usePostPurchaseFlow...
├── lib/
│   ├── api/
│   │   ├── client.ts         Instance axios authentifiée (browser) — attache le Bearer token, intercepte 401/5xx
│   │   ├── server.ts          fetch non authentifié, server-side (RSC), pour les pages publiques
│   │   ├── token.ts            Lecture/écriture du token dans localStorage
│   │   └── {auth,courses,licenses,bots,orders,posts,admin}.ts   Un fichier par ressource
│   ├── toast.ts               Notifications flottantes globales (success/error/warning/info)
│   └── utils.ts
└── types/                     Types TypeScript partagés
```

## Comptes de démonstration

Voir le backend (`admin@example.com` / `dev@example.com` / `user@example.com`, mot de passe `password`).

## Conventions clés

- **Auth** : pas de `middleware.ts` — la protection des routes est **côté client uniquement**, via les hooks `useRequireAuth` (redirige si non connecté) / `useRequireRole` (redirige si mauvais rôle). Toute nouvelle page protégée doit appeler l'un des deux elle-même.
- **`AuthContext`** : à l'initialisation, n'appelle `GET /api/me` que si un token est présent en `localStorage` ; sinon `user` passe directement à `null`.
- **Client API** : `src/lib/api/client.ts` (axios) attache automatiquement `Authorization: Bearer <token>` et intercepte les réponses — un `401` sur un appel authentifié (hors login/register) déclenche un toast "session expirée" + déconnexion ; un `5xx`/erreur réseau déclenche un toast d'erreur générique. Les erreurs `422` (validation) restent gérées au niveau du formulaire via `extractApiError`.
- **Déconnexion automatique** : `useAutoLogout` (monté dans le layout dashboard) déconnecte après 15 min d'inactivité — délai à garder synchronisé avec `SANCTUM_INACTIVITY_MINUTES` côté backend.
- **Enveloppe des réponses** : Laravel enveloppe une ressource seule dans `{"data": {...}}` — toujours dé-envelopper via `response.data.data` (déjà fait dans les fichiers `lib/api/*.ts`, à répliquer pour tout nouvel appel).
- **shadcn/ui sur Base UI** : la prop polymorphique est `render`, **pas** `asChild` — ex. `<Button render={<Link href="...">Texte</Link>} />`.
- **Messages/notifications** : utiliser `<Alert variant="success|error|warning|info">` (`src/components/ui/alert.tsx`) pour les messages inline dans les formulaires, et `toast.success/error/warning/info(...)` (`src/lib/toast.ts`) pour les notifications flottantes système. Ne pas revenir à du texte brut (`<p className="text-destructive">`) ou à `alert()`.
- **Achat** : `usePostPurchaseFlow` gère la redirection post-achat et l'ouverture de `PostPurchaseDetailsModal` (identifiants broker) quand nécessaire.
- **Assainissement du HTML admin** (`post.content`, `bot.description`, `course.description`) : utiliser `sanitizeContentHtml` de `src/lib/sanitize-content-html.ts` avant tout `dangerouslySetInnerHTML` dans un Server Component. **Ne pas** utiliser `isomorphic-dompurify` côté serveur — sa dépendance `jsdom` plante en production sur Vercel (`ERR_REQUIRE_ESM`) alors qu'elle fonctionne en `next dev` et même en `next build && next start` local, car le *file tracing* de Vercel ne capture pas fiablement tout l'arbre de dépendances de jsdom. `isomorphic-dompurify` reste correct dans un Client Component (`"use client"`), où il tourne dans le DOM du navigateur.

## Tests

Pas de suite de tests automatisés côté frontend à ce jour. Toute modification UI doit être vérifiée manuellement dans le navigateur (golden path + cas limites, y compris responsive/dark mode si pertinent) avant d'être considérée terminée.
