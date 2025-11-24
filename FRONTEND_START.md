# 🚀 Guide de Démarrage du Frontend

## ✅ Prérequis

- Node.js 18+ installé
- npm ou pnpm installé
- Backend en cours d'exécution sur `http://localhost:3001`
- Blockchain Hardhat en cours d'exécution sur `http://127.0.0.1:8545`

## 📦 Installation des Dépendances

```powershell
# À la racine du projet
pnpm install
```

## 🔧 Configuration

Les variables d'environnement sont déjà configurées dans `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CERTIFICATE_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_FRAUD_DETECTION_STORE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_SKILL_VALIDATOR_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

## 🏃 Démarrer le Frontend

```powershell
# Mode développement avec hot reload
pnpm dev

# Le frontend sera accessible sur http://localhost:3000
```

## 📱 Accès aux Différents Rôles

### Page d'Accueil
- URL: `http://localhost:3000`
- Description: Landing page avec navigation

### Connexion
- URL: `http://localhost:3000/login`
- Comptes de test (à créer via /register):
  - **Student**: student@test.com
  - **Institution**: institution@test.com
  - **Employer**: employer@test.com
  - **Admin**: admin@test.com

### Inscription
- URL: `http://localhost:3000/register`
- Sélectionner le rôle approprié

### Dashboards (après connexion)

#### Étudiant
- Dashboard: `http://localhost:3000/student/dashboard`
- Upload: `http://localhost:3000/student/upload`

#### Institution
- Dashboard: `http://localhost:3000/institution/dashboard`
- Émettre: `http://localhost:3000/institution/issue`
- Alertes: `http://localhost:3000/institution/alerts`

#### Employeur
- Dashboard: `http://localhost:3000/employer/dashboard`
- Vérifier: `http://localhost:3000/employer/verify`

#### Administrateur
- Dashboard: `http://localhost:3000/admin/dashboard`
- Utilisateurs: `http://localhost:3000/admin/users`

## 🎨 Structure des Pages

```
app/
├── page.tsx                           # Landing page
├── layout.tsx                         # Root layout
├── globals.css                        # Styles globaux
│
├── (auth)/                            # Pages d'authentification
│   ├── login/page.tsx                # Connexion
│   ├── register/page.tsx             # Inscription
│   └── layout.tsx                    # Layout auth
│
├── (dashboard)/                       # Pages protégées
│   ├── layout.tsx                    # Layout avec sidebar
│   ├── admin/
│   │   ├── dashboard/page.tsx       # Vue d'ensemble admin
│   │   └── users/page.tsx           # Gestion utilisateurs
│   ├── student/
│   │   ├── dashboard/page.tsx       # Portfolio étudiant
│   │   └── upload/page.tsx          # Upload certificat
│   ├── institution/
│   │   ├── dashboard/page.tsx       # Vue institution
│   │   ├── issue/page.tsx           # Émettre certificat
│   │   └── alerts/page.tsx          # Alertes fraude
│   └── employer/
│       ├── dashboard/page.tsx       # Vue employeur
│       └── verify/page.tsx          # Vérifier certificat
│
└── api/                               # API Routes
    ├── auth/
    │   ├── login/route.ts
    │   └── register/route.ts
    ├── certificates/
    │   ├── route.ts
    │   └── upload/route.ts
    └── admin/
        └── stats/route.ts
```

## 🛠️ Utilitaires Créés

### Services API (lib/api.ts)
```typescript
import { authAPI, certificateAPI, institutionAPI } from '@/lib/api'

// Exemple d'utilisation
const result = await authAPI.login(email, password)
```

### Hooks Personnalisés (lib/hooks.ts)
```typescript
import { useAuth, useAPI, useDebounce } from '@/lib/hooks'

// Exemple
const { isAuthenticated, role, logout } = useAuth()
```

### Validation (lib/validation.ts)
```typescript
import { isValidEmail, validateLoginForm } from '@/lib/validation'

// Exemple
const { valid, errors } = validateLoginForm(email, password)
```

### Formatage (lib/formatters.ts)
```typescript
import { formatDate, formatBlockchainAddress } from '@/lib/formatters'

// Exemple
const formatted = formatBlockchainAddress('0x1234...5678')
```

## 🔐 Fonctionnalités Implémentées

### ✅ Authentification
- Formulaire de connexion avec validation
- Inscription avec sélection de rôle
- Protection des routes
- Gestion du token JWT
- Déconnexion

### ✅ Étudiant
- Visualisation du portfolio de certificats
- Upload de nouveaux certificats
- Suivi du statut de vérification
- Statistiques des certificats

### ✅ Institution
- Émission de certificats
- Gestion des alertes de fraude
- Statistiques d'émission
- Tableau de bord des certificats émis

### ✅ Employeur
- Vérification de certificats
- Historique des vérifications
- Score de confiance
- Détection de fraude

### ✅ Administrateur
- Vue d'ensemble du système
- Gestion des utilisateurs
- Statistiques globales
- Santé du système

## 🎨 Composants UI

Plus de 50 composants réutilisables dans `components/ui/`:
- Buttons, Cards, Forms
- Dialogs, Modals, Drawers
- Tables, Pagination
- Alerts, Toasts
- Loading states
- Et bien plus...

## 🔄 Flux de Données

### Upload de Certificat
1. Étudiant sélectionne un fichier
2. Validation côté client
3. Upload vers API Next.js
4. Proxy vers backend
5. Backend traite avec ML service
6. Enregistrement blockchain
7. Mise à jour du dashboard

### Vérification
1. Employeur entre le hash
2. Requête à l'API
3. Vérification blockchain
4. Vérification backend
5. Score de fraude ML
6. Affichage des résultats

## 🐛 Débogage

### Erreurs Communes

**Port 3000 déjà utilisé:**
```powershell
# Changer le port
$env:PORT=3001; pnpm dev
```

**Backend non accessible:**
```
Vérifier que le backend tourne sur localhost:3001
Vérifier les variables d'environnement
```

**Blockchain non connectée:**
```
Vérifier que Hardhat node tourne sur localhost:8545
Vérifier les adresses de contrats dans .env.local
```

## 📊 Suivi du Développement

### ✅ Complété
- [x] Structure des pages
- [x] Layouts et navigation
- [x] Composants UI
- [x] Services API
- [x] Utilitaires et helpers
- [x] Hooks personnalisés
- [x] Validation des formulaires
- [x] Styling avec Tailwind
- [x] Configuration TypeScript
- [x] API Routes Next.js

### 🔄 À Intégrer
- [ ] Connexion au backend réel
- [ ] Tests des flux complets
- [ ] Gestion avancée des erreurs
- [ ] Optimisation des performances
- [ ] Tests E2E

## 📝 Notes Importantes

1. **TypeScript**: Tous les fichiers utilisent TypeScript pour la sécurité des types
2. **Responsive**: Design mobile-first, fonctionne sur tous les écrans
3. **Accessibilité**: Composants conformes aux standards WCAG
4. **Performance**: Code splitting automatique avec Next.js
5. **SEO**: Metadata configuré dans layout.tsx

## 🚀 Build de Production

```powershell
# Build
pnpm build

# Démarrer en production
pnpm start
```

## 📚 Documentation Additionnelle

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)

## 💡 Aide

Pour toute question sur le frontend:
1. Vérifier FRONTEND_README.md
2. Consulter les commentaires dans le code
3. Vérifier la documentation Next.js
4. Regarder les exemples dans chaque page

---

**Le frontend est prêt à être utilisé ! 🎉**
