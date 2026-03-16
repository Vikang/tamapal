#!/bin/bash
# =============================================================================
# Universal Pre-Publish Security Scanner
# Drop this into any project's scripts/ folder
# Add to package.json: "prepublishOnly": "bash scripts/security-check.sh"
#
# Scans for: emails, API keys, tokens, personal paths, Discord IDs,
#            private keys, sensitive files, personal names in author field
#
# Exit 1 = BLOCKED (fix before publishing)
# Exit 0 = CLEAR (safe to publish)
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ISSUES=0

echo "🔒 Security Scanner"
echo "════════════════════════════════════════"
echo ""

# Directories to scan (adjust per project)
SCAN_DIRS="src/ bin/ lib/ app/ pages/ components/ README.md CHANGELOG.md package.json"

# --- 1. Email addresses ---
echo -n "Checking for email addresses... "
EMAILS=$(grep -rn '[a-zA-Z0-9._%+-]\+@[a-zA-Z0-9.-]\+\.[a-zA-Z]\{2,\}' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' | \
  grep -v 'example.com\|user@\|test@\|foo@\|noreply' || true)
if [ -n "$EMAILS" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$EMAILS"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 2. API keys (OpenAI, Anthropic, generic sk-) ---
echo -n "Checking for API keys... "
KEYS=$(grep -rn 'sk-[a-zA-Z0-9]\{20,\}' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' | grep -v 'REDACTED' | \
  grep -v '"sk-\.\.\."' | grep -v "'sk-'" | grep -v 'example' | \
  grep -v 'regex\|pattern\|match\|replace\|sanitize\|redact' || true)
if [ -n "$KEYS" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$KEYS"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 3. OAuth / OAT tokens ---
echo -n "Checking for OAuth tokens... "
OAT=$(grep -rn 'sk-ant-oat01-[a-zA-Z0-9_-]\{10,\}' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' | grep -v 'REDACTED' || true)
if [ -n "$OAT" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$OAT"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 4. Bearer tokens ---
echo -n "Checking for Bearer tokens... "
BEARER=$(grep -rn 'Bearer [a-zA-Z0-9_-]\{20,\}' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' | grep -v 'REDACTED' | \
  grep -v 'regex\|pattern\|match\|replace\|sanitize\|redact' || true)
if [ -n "$BEARER" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$BEARER"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 5. npm tokens ---
echo -n "Checking for npm tokens... "
NPM=$(grep -rn 'npm_[a-zA-Z0-9]\{20,\}' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' | grep -v 'REDACTED' | \
  grep -v 'regex\|pattern\|match\|replace\|sanitize\|redact' || true)
if [ -n "$NPM" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$NPM"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 6. AWS keys ---
echo -n "Checking for AWS keys... "
AWS=$(grep -rn 'AKIA[A-Z0-9]\{16\}' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' || true)
if [ -n "$AWS" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$AWS"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 7. Personal file paths ---
echo -n "Checking for personal file paths... "
PATHS=$(grep -rn '/Users/\|/home/[a-z]\|C:\\Users\\' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' | \
  grep -v 'os.homedir\|process.env.HOME\|example\|placeholder\|~/' || true)
if [ -n "$PATHS" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$PATHS"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 8. Discord / Slack IDs ---
echo -n "Checking for platform IDs... "
IDS=$(grep -rn '[0-9]\{17,20\}' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' | \
  grep -v 'timestamp\|Date\|sha512\|sha256\|Integrity\|Shasum\|uuid' | head -5 || true)
# Only flag if there are suspiciously many
ID_COUNT=$(echo "$IDS" | grep -c '[0-9]' || true)
if [ "$ID_COUNT" -gt 3 ]; then
  echo -e "${YELLOW}REVIEW ($ID_COUNT potential IDs)${NC}"
  echo "$IDS"
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 9. Private keys ---
echo -n "Checking for private keys... "
PRIVKEYS=$(grep -rn 'BEGIN.*PRIVATE KEY\|BEGIN RSA\|BEGIN EC\|BEGIN OPENSSH' \
  $SCAN_DIRS 2>/dev/null | \
  grep -v 'node_modules' | grep -v '.test.' || true)
if [ -n "$PRIVKEYS" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$PRIVKEYS"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 10. Sensitive tracked files ---
echo -n "Checking for sensitive tracked files... "
SENSITIVE=$(git ls-files 2>/dev/null | grep -iE '\.(env|db|sqlite|pem|key|jsonl)$|secrets' | grep -v 'tsconfig\|bun.lock' || true)
if [ -n "$SENSITIVE" ]; then
  echo -e "${RED}FOUND${NC}"
  echo "$SENSITIVE"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}clean${NC}"
fi

# --- 11. Author field ---
echo -n "Checking author field... "
if [ -f "package.json" ]; then
  AUTHOR=$(grep '"author"' package.json 2>/dev/null || true)
  if echo "$AUTHOR" | grep -qi 'victoria\|vicky\|personal name'; then
    echo -e "${YELLOW}WARNING — personal name detected${NC}"
    echo "  $AUTHOR"
    ISSUES=$((ISSUES + 1))
  else
    echo -e "${GREEN}clean${NC}"
  fi
else
  echo -e "${GREEN}no package.json${NC}"
fi

# --- RESULT ---
echo ""
echo "════════════════════════════════════════"
if [ $ISSUES -gt 0 ]; then
  echo -e "${RED}❌ BLOCKED — $ISSUES issue(s) found. Fix before publishing.${NC}"
  exit 1
else
  echo -e "${GREEN}✅ ALL CLEAR — safe to publish.${NC}"
  exit 0
fi
