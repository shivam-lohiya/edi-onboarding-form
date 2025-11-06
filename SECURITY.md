# Security Best Practices

## ⚠️ CRITICAL SECURITY NOTICE

Your API key has been exposed in our conversation:
```
pk_82243107_ZTM4488GLERKVNOKQ8UBSO1F4SSQLJNO
```

**ACTION REQUIRED**: You MUST rotate this key immediately through your API provider!

---

## API Key Management

### What is an API Key?

An API key is like a password that allows applications to access protected services. Anyone with your API key can:
- Make requests to your API
- Access your data
- Potentially incur costs on your account
- Impersonate your application

### Never Share API Keys

❌ **DO NOT** share API keys in:
- Chat conversations
- Email
- Slack/Teams messages
- Screenshots
- Screen recordings
- Public repositories
- Documentation with real keys

### Where to Store API Keys

✅ **DO** store API keys in:
- `.env` files (locally, never committed)
- Environment variables (production)
- Secret management services (AWS Secrets Manager, etc.)
- Password managers (for personal reference)

---

## Environment Variables

### Local Development

**File: `.env`** (in project root)
```env
# ❌ BAD - Real key exposed
VITE_API_KEY=pk_82243107_ZTM4488GLERKVNOKQ8UBSO1F4SSQLJNO

# ✅ GOOD - Placeholder only
VITE_API_KEY=your_api_key_here
```

The `.env` file:
- Is listed in `.gitignore` (✅ already configured)
- Should NEVER be committed to Git
- Should be added manually on each environment
- Should contain real keys only for the developer using it

### Example Template

**File: `.env.example`** (safe to commit)
```env
# API Configuration
VITE_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.yourdomain.com/v1

# ClickUp Configuration (optional)
VITE_CLICKUP_API_TOKEN=your_clickup_token_here
VITE_CLICKUP_LIST_ID=your_list_id_here
```

Developers copy this to `.env` and fill in real values.

---

## Git Security

### .gitignore Configuration

Verify these patterns are in `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.*.local

# API keys and secrets
*.key
*.pem
secrets/
credentials/

# Configuration with secrets
config/secrets.js
config/keys.js
```

### Check Before Committing

Before each commit:

```bash
# Check what will be committed
git status

# Review changes
git diff

# Ensure no .env files are staged
git ls-files | grep -E '\.env$|\.env\.'
```

### If You Accidentally Committed a Key

1. **Rotate the key immediately** (get a new one)
2. Remove from Git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (⚠️ dangerous if others use the repo):
   ```bash
   git push origin --force --all
   ```

---

## Production Deployment

### Environment Variable Configuration

Different platforms have different methods:

#### Vercel
```bash
# Using CLI
vercel env add VITE_API_KEY

# Or in dashboard: Settings → Environment Variables
```

#### Netlify
```bash
# Using CLI
netlify env:set VITE_API_KEY "your-key-here"

# Or in dashboard: Site Settings → Build & Deploy → Environment
```

#### AWS / EC2
```bash
# Add to ~/.bashrc or ~/.zshrc
export VITE_API_KEY="your-key-here"

# Or use AWS Secrets Manager
aws secretsmanager create-secret \
  --name EDI_ONBOARDING_API_KEY \
  --secret-string "your-key-here"
```

#### Docker
```yaml
# docker-compose.yml
services:
  app:
    environment:
      - VITE_API_KEY=${VITE_API_KEY}
```

Then use `.env` file with docker-compose or pass as argument:
```bash
docker-compose --env-file .env up
```

---

## Code Security

### Access Environment Variables Safely

```javascript
// ✅ GOOD - Check if variable exists
const API_KEY = import.meta.env.VITE_API_KEY
if (!API_KEY) {
  console.error('API key not configured')
}

// ❌ BAD - Hardcoded key
const API_KEY = 'pk_82243107_...'

// ❌ BAD - Key in source code
const API_KEY = process.env.EXPOSED_KEY || 'pk_82243107_...'
```

### Never Log Sensitive Data

```javascript
// ❌ BAD - Logs full API key
console.log('API Key:', API_KEY)

// ✅ GOOD - Logs masked version
console.log('API Key:', API_KEY ? `${API_KEY.slice(0, 8)}...` : 'not set')

// ❌ BAD - Logs request with auth header
console.log('Request:', config)

// ✅ GOOD - Logs without sensitive headers
console.log('Request:', {
  method: config.method,
  url: config.url,
  // Don't log headers
})
```

### Remove Debug Logs in Production

```javascript
// Use environment-aware logging
const isDevelopment = import.meta.env.DEV

if (isDevelopment) {
  console.log('Debug info:', data)
}

// Or use a logging library that supports levels
import logger from './logger'
logger.debug('Debug info:', data) // Only in dev
logger.info('Info:', data)        // In all environments
```

---

## API Key Rotation

### When to Rotate Keys

Rotate immediately if:
- Key was accidentally exposed (chat, email, commit)
- Suspicious activity detected
- Team member leaves who had access
- Regular schedule (every 90 days recommended)

### Rotation Process

1. **Generate new key** from API provider
2. **Test new key** in development
3. **Update all environments**:
   - Local: Update `.env`
   - Staging: Update env vars
   - Production: Update env vars
4. **Deploy with new key**
5. **Verify application works**
6. **Invalidate old key** on API provider
7. **Update team documentation**

### Zero-Downtime Rotation

For production systems:
1. API supports multiple keys simultaneously
2. Add new key alongside old key
3. Deploy new key to all instances
4. Monitor for errors
5. Remove old key after 24-48 hours

---

## Monitoring & Auditing

### API Usage Monitoring

Monitor for suspicious patterns:
- Unusual request volumes
- Requests from unexpected IPs
- Failed authentication attempts
- Requests outside business hours

### Set Up Alerts

Configure alerts for:
- High error rates (401, 403)
- Unusual traffic spikes
- Rate limit warnings
- Failed login attempts

### Regular Security Audits

**Weekly**:
- Review API usage logs
- Check for exposed credentials in commits
- Verify .gitignore is working

**Monthly**:
- Rotate API keys
- Review access permissions
- Update dependencies (`npm audit`)

**Quarterly**:
- Security audit of codebase
- Penetration testing
- Review third-party integrations

---

## Additional Security Measures

### Rate Limiting

Implement rate limiting on your API:
```javascript
// Example with express-rate-limit
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

app.use('/api/', limiter)
```

### IP Whitelisting

Restrict API access to known IPs:
- Add IP whitelist on API server
- Use VPN for remote access
- Update whitelist when IPs change

### HTTPS Only

Always use HTTPS:
```javascript
// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production' && req.protocol !== 'https') {
  return res.redirect('https://' + req.headers.host + req.url)
}
```

### Request Signing

For extra security, sign requests:
```javascript
import crypto from 'crypto'

const signature = crypto
  .createHmac('sha256', SECRET_KEY)
  .update(JSON.stringify(payload))
  .digest('hex')

axios.post('/api/endpoint', payload, {
  headers: {
    'X-Signature': signature
  }
})
```

---

## Team Education

### Onboarding Checklist

When new team members join:
- [ ] Explain API key importance
- [ ] Show where keys are stored
- [ ] Review .gitignore configuration
- [ ] Demonstrate proper key usage
- [ ] Share this security document
- [ ] Provide their own API keys (don't share)

### Common Mistakes to Avoid

1. **Sharing keys in Slack**: Use "code" formatting or DMs, but prefer secret management
2. **Committing .env files**: Check .gitignore first
3. **Using production keys in development**: Use separate keys per environment
4. **Hardcoding fallback keys**: Never provide default real keys
5. **Logging full error objects**: May contain sensitive headers

---

## Incident Response

### If a Key is Exposed

**Immediate Actions** (within 1 hour):
1. ✅ Rotate the key
2. ✅ Review recent API logs for unauthorized access
3. ✅ Notify team
4. ✅ Document the incident

**Follow-up** (within 24 hours):
1. ✅ Update all environments with new key
2. ✅ Remove exposed key from all locations
3. ✅ Review security practices
4. ✅ Implement additional safeguards

**Post-Mortem** (within 1 week):
1. ✅ Write incident report
2. ✅ Identify root cause
3. ✅ Update processes to prevent recurrence
4. ✅ Train team on lessons learned

---

## Checklist

### Before Every Commit
- [ ] Check `git status` for .env files
- [ ] Review `git diff` for API keys
- [ ] Run `npm audit` for vulnerabilities
- [ ] Verify .gitignore is working

### Before Every Deployment
- [ ] Environment variables set correctly
- [ ] API keys are valid and not expired
- [ ] Rate limiting is configured
- [ ] Monitoring/alerts are active
- [ ] Backup of current keys exists

### Monthly Security Review
- [ ] Rotate API keys
- [ ] Review access logs
- [ ] Update dependencies
- [ ] Check for security advisories
- [ ] Verify backup/recovery procedures

---

## Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Secrets Management**: https://12factor.net/config
- **Git Security**: https://git-scm.com/book/en/v2/Git-Tools-Credentials
- **Environment Variables**: https://vitejs.dev/guide/env-and-mode.html

---

## Summary

🔐 **The Golden Rules**:
1. Never commit API keys to Git
2. Always use environment variables
3. Rotate keys regularly
4. Monitor for suspicious activity
5. Educate your team
6. Have an incident response plan

**If you take away one thing**: Your API key is as important as your password. Treat it that way!
