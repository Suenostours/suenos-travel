# GUIDE DE DÉPLOIEMENT - Suenos Travel / Morocco Incoming

## Étape 1 : GitHub Repository

### Créer le repo
```bash
# Dans le dossier app/
git init
git add .
git commit -m "Initial commit: DMC Morocco fullstack app"
git branch -M main
git remote add origin https://github.com/VOTRE-USER/morocco-incoming.git
git push -u origin main
```

### Vérifier .gitignore
Assurez-vous que ces fichiers ne sont PAS dans GitHub :
- `.env` (secrets)
- `public/uploads/*` (fichiers uploadés - utiliser un volume Railway)
- `node_modules/`
- `dist/`

---

## Étape 2 : Railway - Créer les services

### 2.1 Créer le projet Railway
1. Allez sur https://railway.app/
2. "New Project" → "Deploy from GitHub repo"
3. Sélectionnez votre repository `morocco-incoming`

### 2.2 Ajouter MySQL
1. Dans le projet Railway, cliquez "New" → "Database" → "Add MySQL"
2. Attendez que MySQL soit provisionné
3. Railway génère automatiquement `DATABASE_URL`

### 2.3 Configurer le Web Service
1. Cliquez sur votre service web
2. Onglet "Settings" :
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Healthcheck Path**: `/api/trpc/ping`
3. Onglet "Networking" :
   - Activez "Public Domain"
   - Génère une URL comme `https://morocco-incoming-production.up.railway.app`

### 2.4 Variables d'environnement
Dans Railway Dashboard → Service → Variables :

```
DATABASE_URL=${{MySQL.DATABASE_URL}}          # Auto-généré par Railway
APP_ID=your-kimi-app-id                        # Récupéré du portail Kimi
APP_SECRET=your-kimi-app-secret              # Récupéré du portail Kimi
JWT_SECRET=your-secure-jwt-secret-32chars      # Générez une chaîne aléatoire
KIMI_AUTH_URL=https://agents.cn/oauth
KIMI_OPEN_URL=https://agents.cn
PORT=3000
```

**⚠️ IMPORTANT** : Ne jamais mettre `JWT_SECRET` ou `APP_SECRET` dans le code ou GitHub.

---

## Étape 3 : Volume persistant pour les uploads

### Sur Railway (obligatoire pour les images)
Les fichiers uploadés disparaissent sans volume persistant :

1. Railway Dashboard → Service → Volumes
2. "Add Volume"
3. **Mount Path**: `/app/public/uploads`
4. **Size**: 5GB minimum

Alternative si Volume Railway indisponible : Utiliser **Cloudinary**
- Créez un compte sur https://cloudinary.com
- Ajoutez `CLOUDINARY_URL` dans les variables Railway
- Modifiez `api/upload-handler.ts` pour uploader vers Cloudinary

---

## Étape 4 : Configurer le domaine personnalisé

### 4.1 Domaine principal : www.morocco-incoming.com
1. Railway Dashboard → Service → Settings → Domains
2. "Custom Domain" → Entrez `www.morocco-incoming.com`
3. Railway vous donne un CNAME target (ex: `railway.app.cname.com`)
4. Allez chez votre registrar (OVH, Namecheap, GoDaddy...)
5. Créez un enregistrement **CNAME** :
   - Name: `www`
   - Value: `votre-cname-railway.app`
   - TTL: 300

### 4.2 Redirection non-www → www
**Option A - DNS (recommandée)** :
- Chez votre registrar, créez un enregistrement **A** pour `@` (root) qui redirige vers www
- Ou utilisez le service de redirection du registrar

**Option B - Application (Hono middleware)** :
Ajoutez dans `api/boot.ts` avant les routes :
```typescript
app.use("*", async (c, next) => {
  const host = c.req.header("host");
  if (host === "morocco-incoming.com") {
    return c.redirect(`https://www.morocco-incoming.com${c.req.url}`, 301);
  }
  await next();
});
```

---

## Étape 5 : SSL / HTTPS

Railway génère automatiquement un certificat SSL pour :
- Le domaine Railway par défaut
- Vos domaines personnalisés (après DNS propagation)

**Vérifiez** :
- `https://www.morocco-incoming.com` fonctionne
- Le cadenas vert apparaît dans le navigateur

---

## Étape 6 : Base de données en production

### 6.1 Push schema
```bash
# En local, avec DATABASE_URL pointant sur Railway MySQL
npm run db:push
```

### 6.2 Seed admin de test
```bash
# En local
export DATABASE_URL=votre-url-railway-mysql
npx tsx db/seed.ts
```

### 6.3 Vérification
```bash
# Test API
curl https://www.morocco-incoming.com/api/trpc/public.listTours
```

---

## Étape 7 : Auto-deploy depuis GitHub

1. Railway Dashboard → Service → Settings
2. "Auto-deploy" → Enable
3. Désormais, chaque `git push` sur `main` déclenche un nouveau déploiement

---

## Étape 8 : Checklist post-déploiement

### Frontend public
- [ ] Homepage s'affiche correctement
- [ ] Navigation toutes pages
- [ ] Circuits + filtres
- [ ] Circuit detail
- [ ] Destinations
- [ ] Services
- [ ] About, MICE, B2B
- [ ] Blog
- [ ] Contact form
- [ ] Quote form
- [ ] Responsive mobile
- [ ] HTTPS actif
- [ ] Images s'affichent

### Dashboard admin
- [ ] Login /admin/login
- [ ] Identifiants admin@morocco-incoming.com / Admin@12345
- [ ] Dashboard overview stats
- [ ] CRUD circuits
- [ ] CRUD villes
- [ ] CRUD excursions
- [ ] CRUD blog
- [ ] Upload image depuis laptop
- [ ] Modifier paramètres site
- [ ] Modifier SEO
- [ ] Voir formulaires reçus
- [ ] Ajouter admin (super_admin)
- [ ] Changer mot de passe
- [ ] Logout

### Technique
- [ ] Sitemap.xml (`/sitemap.xml`)
- [ ] robots.txt (`/robots.txt`)
- [ ] Build production OK
- [ ] Railway logs propres
- [ ] DB connection stable
- [ ] Upload images persist (volume)
- [ ] Redirection www OK
- [ ] Domaine custom fonctionne

---

## RÉSOLUTION DES PROBLÈMES

### Erreur "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill
```

### Erreur "Database connection refused"
Vérifiez `DATABASE_URL` dans Railway. Le format doit être :
```
mysql://user:pass@host:3306/database
```

### Images uploadées disparaissent après redéploiement
- Ajoutez un **Volume** Railway (voir Étape 3)
- Ou migrez vers **Cloudinary**

### Build échoue
```bash
# En local
cd /mnt/agents/output/app
npm run check    # Voir les erreurs TypeScript
npm run build    # Voir les erreurs de build
```

### Admin login ne fonctionne pas
Vérifiez :
1. `JWT_SECRET` est défini et identique entre envs
2. Le cookie `admin_token` est bien envoyé (vérifier dans DevTools > Application > Cookies)
3. `npm run db:push` a été exécuté
4. `npx tsx db/seed.ts` a créé l'admin

---

## CHANGER LE DOMAINE PLUS TARD

1. Mettez à jour le domaine dans Railway Dashboard
2. Mettez à jour les DNS chez votre registrar
3. Attendez la propagation DNS (5 min - 48h)
4. Mettez à jour `baseUrl` dans `api/boot.ts` (sitemap) et `api/seo-router.ts`
5. Redéployez : `git push`

---

## CONTACT ET SUPPORT

- **Email** : resa@suenos-travel.com
- **WhatsApp** : +212 661 925 611
