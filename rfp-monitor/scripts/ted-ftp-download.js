/**
 * TED FTP Download Guide
 * Alternative method to get TED data when API is unavailable
 */

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║         TED FTP Data Access - Manual Download Guide             ║
╚══════════════════════════════════════════════════════════════════╝

TED provides FREE FTP access to download tender data packages.

📦 FTP CONNECTION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Host:     ftp://ted.europa.eu
  Username: guest
  Password: guest
  Port:     21 (default FTP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 AVAILABLE DATA:
  • Daily packages: /daily-packages/
  • Monthly archives: /monthly-packages/
  • Historical data: Available from 1993

🔧 HOW TO DOWNLOAD:

Option 1: Command Line (wget)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
wget --user=guest --password=guest \\
  ftp://ted.europa.eu/daily-packages/latest.tar.gz

tar -xzf latest.tar.gz
# Contains XML files with tender notices

Option 2: Command Line (curl)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
curl -u guest:guest \\
  ftp://ted.europa.eu/daily-packages/ \\
  -o daily-tenders.tar.gz

Option 3: FTP Client (GUI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open FileZilla (or any FTP client)
2. Host: ftp://ted.europa.eu
3. Username: guest
4. Password: guest
5. Connect
6. Navigate to /daily-packages/
7. Download XML files

Option 4: Browser
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Open in your browser: ftp://ted.europa.eu
(Some browsers may not support FTP anymore)

📄 DATA FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• XML files following TED Standard Forms
• Each file = one tender notice
• Includes: Title, CPV codes, country, deadline, buyer info, etc.

🔨 PROCESSING THE DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Download daily package (tar.gz)
2. Extract XML files
3. Parse XML to extract relevant fields
4. Filter by keywords and CPV codes
5. Score and save results

💡 AUTOMATED SOLUTION:
To automate this:
1. Install basic-ftp: npm install basic-ftp
2. Create scheduled script to download daily
3. Parse XML files with xml2js (already installed)
4. Feed into existing scoring system

📚 RESOURCES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• TED Documentation: https://ted.europa.eu/en/
• TED Search: https://ted.europa.eu/en/advanced-search
• OpenTED Project: https://github.com/datasets/opented
• ExtracTED Parser: https://github.com/ONSBigData/ExtracTED

✅ NEXT STEPS:
1. Try manual download via wget/curl
2. Check if data format is usable
3. Consider implementing FTP automation
4. OR: Register on TED website for email alerts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For now, the RECOMMENDED approach is:
➡️  MANUAL REGISTRATION on TED website + other platforms
   (See PLATFORM_REGISTRATION_GUIDE.md)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
