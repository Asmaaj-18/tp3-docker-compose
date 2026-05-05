# 📝 Smart To-Do App — Docker Compose

## 📌 Description

Cette application web permet de gérer des tâches (To-Do List) avec différents états :

* 🕒 À faire
* ⚡ En cours
* ✅ Fait

L’utilisateur peut :

* Ajouter une tâche
* Modifier une tâche
* Supprimer une tâche
* Changer l’état d’une tâche

---

## 🏗 Architecture

L’application est composée de 4 services :

* **client** → application React (Vite)
* **api** → API Node.js (Express)
* **database** → MongoDB
* **nginx** → reverse proxy

### 🔁 Flux

```id="flow1"
Navigateur → nginx → client → API → database
```

---

## 🚀 Lancement en développement

```bash id="cmd-dev"
docker compose up --build
```

### Accès :

* Frontend → http://localhost:5173
* API → http://localhost:5000/api/health

---

## 🚀 Lancement en production

```bash id="cmd-prod"
docker compose -f docker-compose.prod.yml up --build
```

### Accès :

* Application → http://localhost
* API → http://localhost/api/health

---

## ⚙️ Variables d’environnement

Créer un fichier `.env` basé sur `.env.example`

```env id="env-vars"
PORT=5000
MONGO_URL=mongodb://database:27017/tp3
```

---

## 🔗 Routes API

* GET `/api/health` → vérifier API
* GET `/api/items` → récupérer les tâches
* POST `/api/items` → ajouter une tâche
* DELETE `/api/items/:id` → supprimer une tâche
* PATCH `/api/items/:id` → modifier (nom ou état)

---

## 🐳 Docker

### Développement

* Live reload activé
* Volumes utilisés
* Code modifiable en temps réel

### Production

* Build React optimisé
* Pas de volumes
* nginx sert les fichiers statiques
* API accessible via `/api`

---

## ⚠️ Problèmes rencontrés

* Problème avec Docker Desktop et WSL (erreur credentials)
* Résolu en modifiant le fichier :

```id="fix1"
~/.docker/config.json
```

* Problème de communication frontend → API
* Résolu en utilisant `/api` avec nginx

---

## 🎯 Fonctionnalités

* CRUD complet (Create, Read, Update, Delete)
* Gestion d’état des tâches
* Interface utilisateur moderne
* Architecture multi-services avec Docker

---

## 📦 Fichiers importants

* `docker-compose.yml` → développement
* `docker-compose.prod.yml` → production
* `client/Dockerfile.prod` → build React
* `nginx/nginx.conf` → reverse proxy

---

## 🏁 Conclusion

Ce projet démontre :

* L’utilisation de Docker Compose
* La communication entre services
* La gestion d’une application complète (frontend + backend + DB)
* La séparation entre environnement de développement et production
