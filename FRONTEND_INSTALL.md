# 🔧 Installation des Dépendances Frontend

## Étapes d'Installation

### 1. Installer les dépendances principales

```powershell
# Si vous utilisez pnpm (recommandé)
pnpm install

# Ou avec npm
npm install
```

### 2. Installer ethers.js pour la blockchain

```powershell
# Avec pnpm
pnpm add ethers

# Ou avec npm
npm install ethers
```

### 3. Installer @types/node pour TypeScript

```powershell
# Avec pnpm
pnpm add -D @types/node

# Ou avec npm
npm install --save-dev @types/node
```

## ⚠️ Résolution des Erreurs TypeScript

### Erreur: Cannot find module 'react'

**Solution**: React est déjà dans package.json, il faut juste installer :
```powershell
pnpm install
```

### Erreur: Cannot find module 'ethers'

**Solution**: Installer ethers.js :
```powershell
pnpm add ethers
```

### Erreur: Cannot find name 'process'

**Solution**: Installer les types Node.js :
```powershell
pnpm add -D @types/node
```

## 📦 Dépendances Complètes

Le `package.json` contient déjà toutes les dépendances nécessaires :

### Principales
- next
- react
- react-dom
- typescript
- tailwindcss
- ethers (à installer)

### UI Components
- @radix-ui/* (tous les composants)
- lucide-react
- class-variance-authority
- tailwind-merge
- clsx

### Formulaires & Validation
- react-hook-form
- zod
- @hookform/resolvers

### Blockchain
- hardhat
- ethers

## 🚀 Après Installation

Une fois toutes les dépendances installées, les fichiers suivants fonctionneront correctement :

- ✅ `lib/api.ts` - Client API
- ✅ `lib/blockchain.ts` - Utilitaires Web3
- ✅ `lib/hooks.ts` - Hooks React personnalisés
- ✅ `lib/types.ts` - Définitions TypeScript
- ✅ Toutes les pages dans `app/`

## 🔍 Vérification

Pour vérifier que tout est bien installé :

```powershell
# Vérifier les erreurs TypeScript
pnpm tsc --noEmit

# Tenter de build
pnpm build

# Démarrer en dev
pnpm dev
```

## 📝 Note sur les Warnings

Les warnings TypeScript dans `lib/blockchain.ts` sont normaux car le code est préparé pour ethers.js. Une fois ethers installé, décommentez les lignes de code marquées.

## 🔄 Étapes Complètes

1. **Installer toutes les dépendances**
   ```powershell
   pnpm install
   ```

2. **Ajouter ethers si manquant**
   ```powershell
   pnpm add ethers
   ```

3. **Ajouter @types/node si manquant**
   ```powershell
   pnpm add -D @types/node
   ```

4. **Démarrer le dev server**
   ```powershell
   pnpm dev
   ```

5. **Ouvrir le navigateur**
   ```
   http://localhost:3000
   ```

## ✅ Checklist

- [ ] `pnpm install` exécuté avec succès
- [ ] Aucune erreur dans la console
- [ ] `pnpm dev` démarre sans erreur
- [ ] Le frontend est accessible sur localhost:3000
- [ ] Les pages de login/register fonctionnent
- [ ] Les dashboards se chargent (après login)

---

**Une fois ces étapes complétées, le frontend sera 100% fonctionnel !** 🎉
