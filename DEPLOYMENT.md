# njangihub — Deployment & CI/CD (Kubernetes)

njangihub runs on a dedicated **DigitalOcean Kubernetes (DOKS)** cluster and
deploys via **Jenkins** running inside that cluster. The structure mirrors the
CareBridge setup.

```
GitHub (main)  ──poll/webhook──▶  Jenkins (in-cluster)
                                    │  ephemeral agent pod:
                                    │   • kaniko ×2  → build backend + frontend images
                                    │   • push to Docker Hub (docker.io/ejohdaryl/njangihub-*)
                                    │   • kubectl set image + rollout
                                    ▼
                          DOKS namespace: njangihub
                          backend · frontend · email-worker · db-worker · cronjob
                          (Mongo + Redis are EXTERNAL managed services)
```

## Cluster / infrastructure

| Thing | Value |
| --- | --- |
| Cluster | `njangihub-prod` (DOKS, fra1, 2 × s-2vcpu-4gb, k8s 1.34.8) |
| Ingress | ingress-nginx v1.13.3 — LoadBalancer **157.245.21.16** |
| TLS | cert-manager v1.18.2 + `letsencrypt-prod` ClusterIssuer (auto-renew) |
| Registry | Docker Hub `docker.io/ejohdaryl/njangihub-{backend,frontend}` |
| App URL | https://njangihub.loop-os.org |
| Jenkins URL | https://jenkins.njangihub.loop-os.org |

DNS (A records at the `loop-os.org` host, both → `157.245.21.16`):

```
njangihub.loop-os.org           A   157.245.21.16
jenkins.njangihub.loop-os.org   A   157.245.21.16
```

## Repo layout

```
Jenkinsfile                     # kaniko build → Docker Hub → kubectl rollout (5 deploys)
frontend/.env.production        # committed, public VITE_* build vars
k8s/njangihub/deployments.yaml  # namespace, 5 deployments, 2 services, ingress
k8s/jenkins/                    # namespace, rbac, pvc, JCasC config, deployment, ingress
.env.production.example         # documents the configmap + secret keys (values NOT committed)
```

The 3 workers (email/db/cron) reuse the **backend** image with a different
start command, so CI only builds two images.

## Runtime config (not in git)

Created directly in the `njangihub` namespace:

- `configmap/njangihub-config` — non-secret env (URLs, redis host, smtp…)
- `secret/njangihub-secrets` — secret env (Mongo URI, JWT, Stripe, AWS, Campay…)
- `secret/njangihub-regcred` — Docker Hub pull secret

Both config + secret are loaded into backend/worker pods via `envFrom`.
To update a value:

```bash
kubectl -n njangihub create secret generic njangihub-secrets \
  --from-env-file=secrets.env --dry-run=client -o yaml | kubectl apply -f -
kubectl -n njangihub rollout restart deploy/backend deploy/email-worker deploy/db-worker deploy/cronjob
```

## One-time Jenkins credentials

Jenkins reads these from `secret/jenkins-secrets` in the `jenkins` namespace
(consumed by JCasC):

| Key | Purpose |
| --- | --- |
| `admin-password` | Jenkins `admin` login |
| `dockerhub-username` / `dockerhub-token` | push images to Docker Hub |
| `github-username` / `github-token` | clone the private repo |

```bash
kubectl -n jenkins create secret generic jenkins-secrets \
  --from-literal=admin-password='...' \
  --from-literal=dockerhub-username='ejohdaryl' \
  --from-literal=dockerhub-token='...' \
  --from-literal=github-username='<gh-user>' \
  --from-literal=github-token='<gh-PAT>' \
  --dry-run=client -o yaml | kubectl apply -f -
```

## Day-to-day

Push to `main`. Jenkins polls every ~2 min (or via the GitHub push webhook at
`https://jenkins.njangihub.loop-os.org/github-webhook/`), builds, and rolls the
new image into all five deployments. Manual run: Jenkins UI → `njangihub` job →
*Build Now*.

## First-time bring-up checklist

1. Add the two DNS A records above.
2. Create `jenkins-secrets` (and `njangihub-regcred`) as above.
3. Commit + push this repo's `Jenkinsfile` + `k8s/` + `frontend/.env.production`
   to `main`.
4. Jenkins seeds the `njangihub` job (JCasC) and builds on the next poll.
5. cert-manager issues TLS for both hosts once DNS resolves.
6. Allowlist the cluster's egress IP on MongoDB Atlas + Redis Cloud if they
   restrict by IP, and point Stripe/Campay webhooks at
   `https://njangihub.loop-os.org/api/...`.
