# Kubernetes Deployment

## Setup Instructions

### 1. Create Secret

Copy the template and add your credentials:

```bash
cd api-server-go/deployments/kubernetes
cp secret.yaml.template secret.yaml
# Edit secret.yaml with actual credentials
```

**Important**: `secret.yaml` is gitignored. Never commit real credentials!

### 2. Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

# Or apply all at once
kubectl apply -f .
```

### 3. Verify Deployment

```bash
kubectl get pods -n formalogix
kubectl logs -n formalogix -l app=formalogix-api
```

## Production Security

For production environments, consider using:
- **Sealed Secrets**: Encrypt secrets in git
- **External Secrets Operator**: Sync from external secret managers (Vault, AWS Secrets Manager)
- **SOPS**: Encrypt YAML files with age/PGP keys

## Manifests

- `namespace.yaml` - Creates formalogix namespace
- `configmap.yaml` - Non-sensitive configuration
- `secret.yaml.template` - Template for credentials (copy to secret.yaml)
- `deployment.yaml` - API deployment with 2 replicas
- `service.yaml` - ClusterIP service
- `ingress.yaml` - Traefik ingress with TLS
