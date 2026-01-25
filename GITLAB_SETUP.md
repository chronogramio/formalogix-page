# GitLab CI/CD Setup Guide for API Auto-Deployment

## Overview

This guide will walk you through configuring GitLab CI/CD variables required for automatic API deployment to Kubernetes.

## Prerequisites

Before you begin, ensure you have:
- Access to GitLab project settings (Maintainer or Owner role)
- Docker registry credentials for `registry.flickflauder.com`
- Kubernetes cluster access with kubeconfig file
- kubectl installed locally for testing

## Step 1: Configure GitLab CI/CD Variables

Navigate to: **GitLab → Settings → CI/CD → Variables → Expand → Add Variable**

Add the following variables:

### Docker Registry Configuration

| Variable Name | Type | Protected | Masked | Value | Description |
|---------------|------|-----------|--------|-------|-------------|
| `DOCKER_REGISTRY` | Variable | ❌ No | ❌ No | `registry.flickflauder.com` | Docker registry hostname |
| `DOCKER_REGISTRY_USER` | Variable | ✅ Yes | ✅ Yes | Your registry username | Docker login username |
| `DOCKER_REGISTRY_PASSWORD` | Variable | ✅ Yes | ✅ Yes | Your registry password | Docker login password |
| `DOCKER_REGISTRY_IMAGE` | Variable | ❌ No | ❌ No | `formalogix-api` | Image name in registry |
| `API_VERSION` | Variable | ❌ No | ❌ No | `1.0.0` | Semantic version for production images |

### Kubernetes Configuration

| Variable Name | Type | Protected | Masked | Value | Description |
|---------------|------|-----------|--------|-------|-------------|
| `KUBECONFIG_CONTENT` | File | ✅ Yes | ✅ Yes | Base64 encoded kubeconfig | K8s cluster access credentials |
| `K8S_NAMESPACE` | Variable | ❌ No | ❌ No | `formalogix` | Kubernetes namespace for deployment |

### How to Generate KUBECONFIG_CONTENT

Run this command on your machine where kubectl is configured:

```bash
cat ~/.kube/config | base64 -w 0
```

Copy the entire output and paste it into the GitLab variable value field.

**Security Notes:**
- Mark `KUBECONFIG_CONTENT` as **Protected** and **Masked**
- Ensure your kubeconfig has minimal permissions (only `formalogix` namespace)
- Consider creating a service account specifically for GitLab CI/CD

### Variable Configuration Summary

| Setting | Recommended Value | Reason |
|---------|------------------|---------|
| **Protected** | Yes for secrets | Only runs on protected branches (main, dev) |
| **Masked** | Yes for secrets | Hides values in job logs |
| **Type: File** | Only for KUBECONFIG | Writes content to temporary file |
| **Type: Variable** | All others | Standard environment variables |

## Step 2: Verify Existing Variables

Your project should already have these variables configured for Cloudflare Pages:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_PROJECT_NAME`
- `PUBLIC_API_URL_PROD`
- `PUBLIC_API_URL_PREVIEW`
- `PUBLIC_UMAMI_WEBSITE_ID_PROD`
- `PUBLIC_UMAMI_WEBSITE_ID_PREVIEW`

**Do not modify these** - they are used for frontend deployment.

## Step 3: Apply Updated ConfigMap to Kubernetes

Before testing the pipeline, update the email host configuration in your cluster:

```bash
# Apply the updated ConfigMap
kubectl apply -f api-server-go/deployments/kubernetes/configmap.yaml

# Restart the deployment to pick up changes
kubectl rollout restart deployment/formalogix-api -n formalogix

# Wait for rollout to complete
kubectl rollout status deployment/formalogix-api -n formalogix

# Verify new configuration
kubectl get configmap formalogix-api-config -n formalogix -o yaml
```

**Verify** that `EMAIL_HOST` is now `mail.formalogix.com`.

## Step 4: Test DNS Resolution

Ensure the new email host resolves correctly:

```bash
nslookup mail.formalogix.com
```

Expected output should show valid A records pointing to your mail server.

## Step 5: Verify GitLab Runner Configuration

Check that your GitLab Runner is properly configured:

1. Go to **GitLab → Settings → CI/CD → Runners**
2. Ensure you have an active runner with:
   - **Executor**: Docker
   - **Privileged mode**: Enabled (for Docker-in-Docker builds)
   - **Tags**: Match any tags used in `.gitlab-ci.yml` (if applicable)

If no runner is available, you may need to:
- Register a new runner
- Enable shared runners
- Contact your GitLab administrator

## Step 6: Test the Pipeline

### Test Build Only (Feature Branch)

```bash
git checkout -b test/ci-api-setup
echo "# Testing API CI" >> api-server-go/README.md
git add api-server-go/README.md
git commit -m "Test: API CI/CD pipeline setup"
git push origin test/ci-api-setup
```

**Expected behavior:**
- ✅ `build:api` job runs
- ✅ Docker image builds successfully
- ✅ Image pushed to `registry.flickflauder.com/formalogix-api:dev-{SHA}`
- ❌ No deployment jobs run (not main/dev branch)

**Check GitLab Pipelines UI:**
- Pipeline should show green checkmark for `build:api`
- Verify image exists in registry

### Test Preview Deployment (Dev Branch)

```bash
git checkout dev
git merge test/ci-api-setup
git push origin dev
```

**Expected behavior:**
- ✅ `build:api` job runs
- ✅ `deploy:api:preview` job runs
- ✅ Kubernetes deployment updated
- ✅ Health check passes

**Verify deployment:**

```bash
# Check pods are running
kubectl get pods -n formalogix -l app=formalogix-api

# Check deployment image
kubectl describe deployment formalogix-api -n formalogix | grep Image:

# Test health endpoint
curl https://forms.flickflauder.com/health
```

### Test Production Deployment (Main Branch)

```bash
git checkout main
git merge dev
git push origin main
```

**Expected behavior:**
- ✅ `build:api` job runs with tag `v1.0.0-{SHA}`
- ✅ `deploy:api:production` job runs automatically
- ✅ Zero downtime deployment
- ✅ Production API updated

**Verify:**

```bash
# Check image tag format
kubectl get deployment formalogix-api -n formalogix -o jsonpath='{.spec.template.spec.containers[0].image}'
# Should show: registry.flickflauder.com/formalogix-api:v1.0.0-{SHA}

# Test form submission from production site
# Visit https://formalogix.com/kontakt and submit test form
```

### Test Manual Deployment

1. Go to **GitLab → Pipelines** (on dev branch)
2. Find the latest successful pipeline
3. Click the **play button** (▶) next to `deploy:api:production-manual`
4. Confirm deployment

**Use case:** Emergency hotfix deployed from dev to production without merging to main.

## Step 7: Monitor First Production Deployment

After pushing to main, monitor the deployment:

```bash
# Watch pods restart
kubectl get pods -n formalogix -l app=formalogix-api -w

# Follow deployment logs in real-time
kubectl logs -n formalogix -l app=formalogix-api --tail=100 -f

# Check for errors in events
kubectl get events -n formalogix --sort-by='.lastTimestamp' | grep formalogix-api
```

**Success indicators:**
- New pod shows `Running` status
- Old pod gracefully terminates
- No error messages in logs
- Health endpoint returns 200 OK

## Rollback Procedures

### Automatic Kubernetes Rollback

If the new deployment fails health checks:

```bash
kubectl rollout undo deployment/formalogix-api -n formalogix
```

### Manual Rollback to Specific Image

```bash
# List recent deployment revisions
kubectl rollout history deployment/formalogix-api -n formalogix

# Rollback to specific image tag
kubectl set image deployment/formalogix-api \
  api-server=registry.flickflauder.com/formalogix-api:v1.0.0-abc1234 \
  -n formalogix
```

### Re-run Previous Successful Pipeline

1. Go to **GitLab → Pipelines**
2. Find the last successful pipeline
3. Click **Retry** on the deploy job

## Troubleshooting

### Issue: "unauthorized: authentication required"

**Cause:** Docker registry credentials incorrect or expired.

**Fix:**
1. Verify `DOCKER_REGISTRY_USER` and `DOCKER_REGISTRY_PASSWORD` in GitLab variables
2. Test credentials locally:
   ```bash
   echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin registry.flickflauder.com
   ```

### Issue: "error: You must be logged in to the server"

**Cause:** Invalid or expired `KUBECONFIG_CONTENT`.

**Fix:**
1. Regenerate base64 kubeconfig:
   ```bash
   cat ~/.kube/config | base64 -w 0
   ```
2. Update the `KUBECONFIG_CONTENT` variable in GitLab
3. Retry the failed job

### Issue: "timeout waiting for rollout"

**Cause:** Pods failing health checks or image pull errors.

**Fix:**
1. Check pod logs:
   ```bash
   kubectl logs -n formalogix -l app=formalogix-api --tail=50
   ```
2. Check pod events:
   ```bash
   kubectl describe pod -n formalogix -l app=formalogix-api
   ```
3. Common causes:
   - Image pull failure (check registry credentials)
   - Health check endpoint failing (check `/health` endpoint)
   - Resource limits too low (check CPU/memory)

### Issue: Email sending fails after deployment

**Cause:** DNS resolution issue or SMTP configuration.

**Fix:**
1. Verify DNS resolves inside pod:
   ```bash
   kubectl exec -it -n formalogix deployment/formalogix-api -- nslookup mail.formalogix.com
   ```
2. Check ConfigMap:
   ```bash
   kubectl get configmap formalogix-api-config -n formalogix -o yaml
   ```
3. Test SMTP connection:
   ```bash
   telnet mail.formalogix.com 587
   ```

### Issue: Pipeline runs even when no API changes

**Cause:** Changes to `.gitlab-ci.yml` trigger API build.

**Expected behavior:** This is intentional - pipeline changes should be tested.

**To avoid:** If you only want API changes to trigger builds, remove `.gitlab-ci.yml` from the `changes:` list in the job rules.

## Security Best Practices

1. **Rotate credentials regularly:**
   - Update `DOCKER_REGISTRY_PASSWORD` every 90 days
   - Regenerate kubeconfig annually or when team members leave

2. **Use service accounts:**
   - Create dedicated Kubernetes service account for CI/CD
   - Limit permissions to `formalogix` namespace only

3. **Enable audit logging:**
   - Monitor GitLab CI/CD job logs for unauthorized access
   - Review Kubernetes audit logs for deployment changes

4. **Protect branches:**
   - Ensure `main` and `dev` branches are protected
   - Require merge request approvals for main

## Next Steps

Once the pipeline is working:

1. **Set up monitoring:**
   - Configure alerts for failed deployments
   - Monitor API health metrics

2. **Document deployment process:**
   - Update team runbook with new procedures
   - Train team members on manual rollback

3. **Consider enhancements:**
   - Add vulnerability scanning (Trivy)
   - Implement Slack notifications
   - Set up separate preview environment

## Support

If you encounter issues:
1. Check GitLab pipeline logs for detailed error messages
2. Review Kubernetes pod logs: `kubectl logs -n formalogix -l app=formalogix-api`
3. Consult this troubleshooting section
4. Rollback if necessary using procedures above

---

**Last Updated:** 2026-01-25
**Pipeline Version:** 1.0.0
