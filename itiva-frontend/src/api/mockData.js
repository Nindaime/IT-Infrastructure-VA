// In a real application, these would be API calls to your Django backend.
// For example, using axios:
// import axios from 'axios';
// export const fetchRankings = () => axios.get('/api/v1/rankings/');
// export const fetchQuestions = () => axios.get('/api/v1/questions/');

export const fullQuestionnaireData = [
  // --- Website Strength ---
  {
    id: 1,
    category: 'Website Strength',
    text: 'Is your website traffic encrypted using a valid and current SSL/TLS certificate (HTTPS)?',
    options: [
      {
        text: 'Yes, on all pages, with HSTS enabled',
        score: 2,
        explanation:
          'The gold standard, enforcing encryption and protecting against downgrade attacks.',
        recommendation: 'Excellent. Maintain your strong TLS configuration and review it annually.',
      },
      {
        text: 'Yes, standard certificate on all pages',
        score: 1,
        explanation: 'Good security. The entire site is encrypted.',
        recommendation: 'Good. Consider implementing HSTS to further enhance security.',
      },
      {
        text: 'Only on sensitive pages',
        score: 0,
        explanation: 'A partial implementation that leaves other pages vulnerable.',
        recommendation: 'High Priority: Deploy SSL/TLS across your entire website immediately.',
      },
      {
        text: 'Certificate is expired/misconfigured',
        score: -1,
        explanation: 'Creates security warnings and may not provide proper encryption.',
        recommendation: 'Critical: Renew or fix your SSL/TLS certificate immediately.',
      },
      {
        text: 'No, we use HTTP only',
        score: -2,
        explanation: 'A critical vulnerability. All data is sent in plaintext.',
        recommendation:
          'Critical: Procure and install an SSL/TLS certificate for your website immediately.',
      },
    ],
  },
  {
    id: 2,
    category: 'Website Strength',
    text: 'Are all software components of your website (e.g., CMS, plugins, themes) kept up-to-date?',
    options: [
      {
        text: 'Yes, we use an automated process to scan and apply security patches within 48 hours of release.',
        score: 2,
        explanation:
          'A proactive and rapid patching process that minimizes the window of opportunity for attackers.',
        recommendation:
          'Excellent. Continue to monitor your automated patching system to ensure it is functioning correctly.',
      },
      {
        text: 'Yes, we check for and apply updates manually on a weekly basis.',
        score: 1,
        explanation: 'A good, disciplined process, though slightly slower than an automated one.',
        recommendation:
          'Good. To improve, investigate automated patching solutions to reduce the manual workload and shorten the time to patch.',
      },
      {
        text: 'We apply updates sporadically or only when something breaks.',
        score: 0,
        explanation:
          'An inconsistent process that likely leaves vulnerabilities open for extended periods.',
        recommendation:
          'High Priority: Implement a formal, regular patching schedule (at least weekly).',
      },
      {
        text: 'We rarely update, or only update major versions.',
        score: -1,
        explanation: 'This guarantees that numerous known vulnerabilities exist on the website.',
        recommendation:
          'Critical: Immediately implement a patch management process. Your website is almost certainly running software with known, severe vulnerabilities.',
      },
      {
        text: 'We do not know how to or never update our website components.',
        score: -2,
        explanation: 'A high-risk state, making a compromise of the website highly probable.',
        recommendation:
          'Critical: Seek immediate technical assistance to establish an update and patch management process.',
      },
    ],
  },
  {
    id: 3,
    category: 'Website Strength',
    text: 'Do you have a Web Application Firewall (WAF) in place?',
    options: [
      {
        text: 'Yes, a managed WAF with custom rules tailored to our application.',
        score: 2,
        explanation:
          'The most effective WAF implementation, offering protection against both common and application-specific attacks.',
        recommendation:
          'Excellent. Your proactive approach with a managed, custom WAF provides superior protection. Ensure rules are reviewed regularly.',
      },
      {
        text: 'Yes, we use a standard WAF provided by our hosting or CDN provider.',
        score: 1,
        explanation: 'A strong protective measure against a wide range of common attacks.',
        recommendation:
          'Good. You have a solid layer of protection. Periodically review the WAF logs to understand the types of attacks being blocked.',
      },
      {
        text: 'We are planning to implement one.',
        score: 0,
        explanation: 'Awareness without protection offers no current security benefit.',
        recommendation:
          'Recommendation: Prioritize the implementation of a WAF. It is a critical defense layer against common, automated web attacks.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation:
          'Lack of awareness of a critical security control is a significant vulnerability in itself.',
        recommendation:
          'High Priority: Investigate if your hosting provider offers a WAF and enable it. Understanding and using a WAF is key to web security.',
      },
      {
        text: 'No, we do not have a WAF.',
        score: -2,
        explanation:
          'The website is fully exposed to common attacks like SQL injection and XSS without a dedicated filter.',
        recommendation:
          'Critical: Implement a Web Application Firewall (WAF) as soon as possible to protect against common attacks like SQL Injection and Cross-Site Scripting (XSS).',
      },
    ],
  },
  {
    id: 4,
    category: 'Website Strength',
    text: 'Are user-submitted data and inputs validated on both the frontend and backend?',
    options: [
      {
        text: 'Yes, comprehensive validation is strictly enforced on both the client and server-side.',
        score: 2,
        explanation:
          'Robust protection against data injection attacks by treating all user input as untrusted.',
        recommendation:
          'Excellent. This is the correct approach and provides robust protection against injection attacks.',
      },
      {
        text: 'Yes, all inputs are validated on the server-side.',
        score: 1,
        explanation: 'Good security, as server-side validation cannot be bypassed by an attacker.',
        recommendation:
          'Good. Server-side validation is the most critical part. Ensure it covers all possible user inputs.',
      },
      {
        text: 'We mostly rely on frontend validation.',
        score: -1,
        explanation:
          'A significant vulnerability, as client-side validation can be easily bypassed.',
        recommendation:
          'Critical: Immediately implement server-side validation. Frontend validation is a user experience feature, not a security control, as it can be easily bypassed.',
      },
      {
        text: 'Validation is inconsistent and only applied to some forms.',
        score: -1,
        explanation:
          'Inconsistent validation leaves predictable and exploitable holes in security.',
        recommendation:
          'High Priority: Conduct a full review of your application and enforce server-side input validation on every single user-submitted field.',
      },
      {
        text: 'No, we do not perform input validation.',
        score: -2,
        explanation:
          'A critical flaw that makes the application highly susceptible to injection attacks.',
        recommendation:
          'Critical: Immediately implement server-side input validation across your entire application. This is a fundamental defense against many severe vulnerabilities.',
      },
    ],
  },
  {
    id: 5,
    category: 'Website Strength',
    text: 'Does your website have a strong password policy for user and administrator accounts?',
    options: [
      {
        text: 'Yes, we enforce complexity, length, and 2FA for all accounts, especially admins.',
        score: 2,
        explanation:
          'A comprehensive approach that protects against brute-force attacks and credential stuffing.',
        recommendation:
          'Excellent. This comprehensive approach provides strong defense against password-based attacks.',
      },
      {
        text: 'Yes, we enforce password complexity (e.g., uppercase, numbers, symbols) and length.',
        score: 1,
        explanation:
          'A strong foundational policy that prevents weak and easily guessable passwords.',
        recommendation:
          'Good. To improve, enforce 2FA/MFA, especially for administrative accounts, to provide an additional layer of security.',
      },
      {
        text: 'We have a basic password length requirement only.',
        score: 0,
        explanation:
          'A minimal standard that is better than nothing but still allows for weak passwords.',
        recommendation:
          'Recommendation: Enhance your password policy to include complexity requirements (uppercase, lowercase, numbers, symbols).',
      },
      {
        text: 'We have no password requirements; users can set anything.',
        score: -2,
        explanation:
          'A critical risk that allows for extremely weak passwords and easy account compromise.',
        recommendation:
          'Critical: Immediately implement and enforce a strong password policy requiring length and complexity. The current state is a high-risk invitation for account takeovers.',
      },
      {
        text: 'We have shared administrator accounts.',
        score: -2,
        explanation:
          'This is a major security risk, as it makes auditing impossible and simplifies unauthorized access.',
        recommendation:
          'Critical: Immediately create unique accounts for each administrator and user. Shared accounts are a major security risk that prevents accountability and effective access control.',
      },
    ],
  },
  {
    id: 6,
    category: 'Website Strength',
    text: 'Are regular backups of your website data performed?',
    options: [
      {
        text: 'Yes, automated daily backups are encrypted and stored in a secure, geographically separate location.',
        score: 2,
        explanation:
          'The gold standard for disaster recovery, ensuring business continuity with minimal data loss.',
        recommendation:
          'Excellent. Your backup strategy is robust and aligned with best practices for disaster recovery.',
      },
      {
        text: 'Yes, automated daily or weekly backups are stored with our hosting provider.',
        score: 1,
        explanation:
          'A good practice that ensures data can be recovered, though with a potential 24-hour data loss.',
        recommendation:
          'Good. Ensure you periodically test restoring from your backups to verify their integrity.',
      },
      {
        text: 'We perform manual backups sporadically.',
        score: -1,
        explanation: 'Unreliable and prone to human error, leading to significant data loss.',
        recommendation:
          'High Priority: Implement an automated, regular backup schedule. Manual backups are unreliable and will lead to data loss.',
      },
      {
        text: "We have backups, but they are old or we've never tested restoring them.",
        score: -2,
        explanation: 'A useless backup system that provides a false sense of security.',
        recommendation:
          'Critical: Your backups are not viable. Immediately create a new backup and implement a regular, automated backup process with periodic restoration tests.',
      },
      {
        text: 'No, we do not have backups.',
        score: -2,
        explanation:
          'A critical failure in business continuity planning. A single event could lead to total data loss.',
        recommendation:
          'Critical: Implement a backup solution immediately. Without backups, any hardware failure, ransomware attack, or major error could permanently destroy your business data.',
      },
    ],
  },
  {
    id: 7,
    category: 'Website Strength',
    text: "Does your website's design incorporate security best practices, such as the principle of least privilege?",
    options: [
      {
        text: 'Yes, user roles are strictly defined, and access is granted on a need-to-know basis.',
        score: 2,
        explanation:
          'A mature security design that minimizes the impact of a potential account compromise.',
        recommendation:
          'Excellent. This is a mature and effective implementation of the principle of least privilege.',
      },
      {
        text: 'Yes, we have different roles for administrators and regular users.',
        score: 1,
        explanation:
          'A good, basic security practice that separates administrative functions from normal use.',
        recommendation:
          'Good. Regularly review the permissions of your administrator accounts to ensure they are still appropriate.',
      },
      {
        text: 'User roles are not well-defined; many users have high-level privileges.',
        score: -1,
        explanation:
          'A significant risk, as a compromise of any user account could lead to a full system compromise.',
        recommendation:
          'High Priority: Conduct a review of all user accounts and revoke unnecessary privileges. Implement a formal process for granting and reviewing access.',
      },
      {
        text: 'All users share the same level of access.',
        score: -2,
        explanation:
          'A critical vulnerability. If one account is breached, the entire system is breached.',
        recommendation:
          "Critical: Immediately implement role-based access control. Start by creating a standard 'user' role with limited permissions and a separate 'admin' role.",
      },
      {
        text: "I don't know what the principle of least privilege is.",
        score: -1,
        explanation:
          "Lack of awareness indicates that security was not a consideration in the system's design.",
        recommendation:
          'High Priority: Research and implement the Principle of Least Privilege. This foundational security concept means users should only have access to the information and functions essential to their job.',
      },
    ],
  },
  {
    id: 8,
    category: 'Website Strength',
    text: 'Have you implemented security headers to protect against attacks like cross-site scripting (XSS) and clickjacking?',
    options: [
      {
        text: 'Yes, we have a strong Content Security Policy (CSP) and use multiple security headers.',
        score: 2,
        explanation:
          'A proactive defense that significantly hardens the website against common client-side attacks.',
        recommendation:
          'Excellent. Your use of a strong CSP and other headers shows a mature approach to client-side security.',
      },
      {
        text: 'Yes, we have implemented basic security headers like X-Frame-Options.',
        score: 1,
        explanation: 'A good first step that protects against clickjacking attacks.',
        recommendation:
          'Good. To improve, research and implement a Content Security Policy (CSP) for defense-in-depth against XSS attacks.',
      },
      {
        text: 'We are aware of them but have not implemented them yet.',
        score: 0,
        explanation: 'Awareness without action provides no security benefit.',
        recommendation:
          'Recommendation: Implement basic security headers like X-Frame-Options, X-Content-Type-Options, and Strict-Transport-Security (if you have HTTPS).',
      },
      {
        text: "I don't know what security headers are.",
        score: -1,
        explanation:
          'Indicates a lack of fundamental web security knowledge, suggesting other vulnerabilities may exist.',
        recommendation:
          'High Priority: Research and implement security headers. They are a simple, free, and effective way to protect your users from common attacks.',
      },
      {
        text: 'No, we have not implemented any security headers.',
        score: -2,
        explanation:
          'The website is left open to a wide range of well-known and easily preventable attacks.',
        recommendation:
          'High Priority: Implement security headers immediately, starting with X-Frame-Options to prevent clickjacking. They are a low-effort, high-impact security improvement.',
      },
    ],
  },

  // --- Devices & Network ---
  {
    id: 9,
    category: 'Devices & Network',
    text: 'Do you maintain an up-to-date inventory of all devices connected to your business network?',
    options: [
      {
        text: 'Yes, we have an automated, real-time inventory of all hardware and software assets.',
        score: 2,
        explanation:
          'Best practice for asset management. You know exactly what is on your network at all times.',
        recommendation:
          'Excellent. A real-time, automated inventory is the gold standard for asset management.',
      },
      {
        text: 'Yes, we maintain a manually updated spreadsheet or document of all devices.',
        score: 1,
        explanation: 'A good practice, but prone to human error and becoming outdated quickly.',
        recommendation:
          'Good. This is a solid practice. To improve, try to review and validate the manual inventory on a quarterly basis to ensure accuracy.',
      },
      {
        text: 'We have a partial or outdated inventory.',
        score: 0,
        explanation:
          'Better than nothing, but significant blind spots exist, which are a security risk.',
        recommendation:
          'Recommendation: Dedicate time to complete your asset inventory. You cannot fully protect your network without knowing what is on it.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation:
          'A known unknown. It implies a lack of control and visibility over the network.',
        recommendation:
          'High Priority: Begin creating an asset inventory immediately. Start by listing all known computers, servers, and network devices.',
      },
      {
        text: 'No, we do not have a formal inventory.',
        score: -2,
        explanation:
          "You cannot protect what you don't know you have. This is a foundational security failure.",
        recommendation:
          'Critical: Creating a device inventory is your first step towards security. You must know what you need to protect. Start with a simple spreadsheet listing all office computers.',
      },
    ],
  },
  {
    id: 10,
    category: 'Devices & Network',
    text: 'Is all office Wi-Fi protected with a strong password and modern encryption (e.g., WPA2 or WPA3)?',
    options: [
      {
        text: 'Yes, we use WPA3/WPA2-Enterprise with separate, secure networks for guests and internal staff.',
        score: 2,
        explanation:
          'The highest standard for wireless security, providing robust protection and network segmentation.',
        recommendation:
          'Excellent. This is a very secure wireless configuration that separates trusted and untrusted traffic effectively.',
      },
      {
        text: 'Yes, we use WPA2 or WPA3 with a strong, complex password.',
        score: 1,
        explanation: 'A strong and necessary security control for any modern business network.',
        recommendation:
          'Good. This is a strong baseline for wireless security. Ensure the password is long and complex.',
      },
      {
        text: 'We use WPA2 but with a simple, easily guessable password.',
        score: -1,
        explanation:
          'The password becomes the weak link, making the network vulnerable to brute-force attacks.',
        recommendation:
          'High Priority: Immediately change your Wi-Fi password to a long, complex passphrase that is not easily guessable.',
      },
      {
        text: 'Our Wi-Fi uses outdated WEP encryption or is open (no password).',
        score: -2,
        explanation:
          'A critical vulnerability. WEP is easily cracked, and an open network allows anyone to connect.',
        recommendation:
          'Critical: Immediately reconfigure your Wi-Fi to use WPA2 or WPA3 encryption with a strong password. An open or WEP network is dangerously insecure.',
      },
      {
        text: "I don't know the configuration of our Wi-Fi.",
        score: -1,
        explanation:
          'Lack of knowledge implies lack of control, and the network could be in a highly vulnerable state.',
        recommendation:
          "High Priority: Investigate your Wi-Fi settings immediately. If you don't know how, contact your IT support or service provider. Assume it is insecure until proven otherwise.",
      },
    ],
  },
  {
    id: 11,
    category: 'Devices & Network',
    text: 'Are your network devices, such as routers and firewalls, configured with unique, strong passwords?',
    options: [
      {
        text: 'Yes, all default passwords have been changed, and we use a password manager to store strong, unique credentials.',
        score: 2,
        explanation:
          'Excellent security hygiene that prevents unauthorized access to network infrastructure.',
        recommendation:
          'Excellent. This practice significantly hardens your network infrastructure against unauthorized access.',
      },
      {
        text: 'Yes, all default passwords have been changed to a custom password.',
        score: 1,
        explanation: 'A fundamental and necessary security step for any network device.',
        recommendation:
          'Good. This is a fundamental security requirement. Ensure the custom password used is strong and not reused elsewhere.',
      },
      {
        text: 'Some devices have been updated, but others may still use default passwords.',
        score: -1,
        explanation:
          'An attacker who gains access to the network can easily find and compromise these devices.',
        recommendation:
          'High Priority: Conduct an audit of all network devices (routers, switches, firewalls) and change any default passwords immediately.',
      },
      {
        text: "We are still using the default 'admin/password' on our network devices.",
        score: -2,
        explanation:
          'A critical risk. Default credentials are the first thing an attacker will try.',
        recommendation:
          'Critical: Change the default passwords on your network equipment immediately. This is one of the most common and easily exploited vulnerabilities.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation:
          'Indicates a lack of basic network management and a high probability of vulnerable devices.',
        recommendation:
          'High Priority: Identify all your network devices and verify that their passwords have been changed from the default. Assume they are all at risk until verified.',
      },
    ],
  },
  {
    id: 12,
    category: 'Devices & Network',
    text: 'Do you have a policy for employees connecting personal devices to the company network (BYOD policy)?',
    options: [
      {
        text: 'Yes, we have a strict BYOD policy that requires security checks and management software on personal devices.',
        score: 2,
        explanation: 'A mature approach that manages the risks associated with personal devices.',
        recommendation:
          'Excellent. A managed BYOD policy is the most secure way to allow personal devices on the network.',
      },
      {
        text: 'Yes, we have a policy that outlines acceptable use for personal devices.',
        score: 1,
        explanation: 'A good first step in setting expectations and establishing liability.',
        recommendation:
          'Good. This is a solid foundation. Consider enhancing the policy with minimum security requirements for personal devices (e.g., screen lock, up-to-date OS).',
      },
      {
        text: 'We allow it, but we have no formal policy in place.',
        score: -1,
        explanation:
          'Unmanaged and unknown devices on the network represent a significant security risk.',
        recommendation:
          'High Priority: Establish a formal Bring Your Own Device (BYOD) policy that outlines security expectations and acceptable use for personal devices on the network.',
      },
      {
        text: "We actively discourage it, but we don't enforce it.",
        score: 0,
        explanation:
          "While safer, it may not be practical and doesn't address unauthorized connections.",
        recommendation:
          'Recommendation: If you allow personal devices, you need a formal policy. If you truly ban them, consider technical controls to block unauthorized connections.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation:
          'Lack of a policy indicates a lack of control over what connects to the network.',
        recommendation:
          'High Priority: Decide on a formal stance for personal devices and document it in a policy. A lack of policy creates ambiguity and risk.',
      },
    ],
  },
  {
    id: 13,
    category: 'Devices & Network',
    text: 'Is your internal network segmented to separate critical systems from general user access?',
    options: [
      {
        text: 'Yes, we use VLANs or physical segmentation to create separate zones for servers, users, and guests.',
        score: 2,
        explanation:
          'A core security principle that contains breaches and prevents lateral movement by attackers.',
        recommendation:
          'Excellent. Network segmentation is a powerful control for containing threats and protecting critical assets.',
      },
      {
        text: 'Yes, we have a separate Wi-Fi network for guests.',
        score: 1,
        explanation:
          'A good, basic form of segmentation that protects the internal network from guests.',
        recommendation:
          'Good. This is a great first step. Consider further segmentation, such as creating a separate VLAN for critical servers.',
      },
      {
        text: 'No, all devices are on one single, flat network.',
        score: -2,
        explanation:
          'A high-risk architecture. If one device is compromised, the entire network is at risk.',
        recommendation:
          'Critical: Plan to segment your network as a high-priority project. A flat network means a single compromised device (like a laptop with malware) can potentially infect critical servers.',
      },
      {
        text: 'We are not sure what network segmentation is.',
        score: -1,
        explanation: 'Indicates a lack of understanding of fundamental network security concepts.',
        recommendation:
          'High Priority: Research network segmentation (VLANs). It is a key architectural concept for building a defensible network.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation: 'Lack of awareness suggests the network is likely flat and highly vulnerable.',
        recommendation:
          'High Priority: Investigate your network structure. If all devices can communicate with each other, you should plan to implement network segmentation to reduce risk.',
      },
    ],
  },
  {
    id: 14,
    category: 'Devices & Network',
    text: 'Are all computers and servers protected with reputable and up-to-date anti-malware software?',
    options: [
      {
        text: 'Yes, a centrally managed, enterprise-grade solution is deployed on all endpoints and updated automatically.',
        score: 2,
        explanation:
          'The best practice for endpoint security, providing proactive and manageable protection.',
        recommendation:
          'Excellent. Centrally managed endpoint protection is the most effective and scalable solution.',
      },
      {
        text: 'Yes, individual licensed anti-malware software is installed on all devices.',
        score: 1,
        explanation: 'A good security measure ensuring all devices have a baseline of protection.',
        recommendation:
          'Good. This provides a necessary layer of protection. Ensure all users keep their software up-to-date.',
      },
      {
        text: 'Only on some devices, or we rely on free versions.',
        score: -1,
        explanation:
          'Inconsistent coverage creates unprotected entry points for malware into your network.',
        recommendation:
          'High Priority: Ensure every single company device has a reputable, paid anti-malware solution installed. Inconsistent coverage is a major risk.',
      },
      {
        text: 'We rely only on the default protection built into the operating system.',
        score: -1,
        explanation:
          'OS protection is basic and often insufficient against modern, sophisticated threats.',
        recommendation:
          'High Priority: Install a reputable, third-party anti-malware solution on all computers. While OS protection is improving, it should be supplemented.',
      },
      {
        text: 'No, we do not actively use anti-malware software.',
        score: -2,
        explanation:
          'A critical vulnerability that leaves all endpoints exposed to malware infections.',
        recommendation:
          'Critical: Install reputable anti-malware software on all computers immediately. Operating without it is a near-guarantee for a malware infection.',
      },
    ],
  },
  {
    id: 15,
    category: 'Devices & Network',
    text: 'Do you have a firewall configured to block unsolicited incoming network traffic?',
    options: [
      {
        text: 'Yes, we have a properly configured hardware firewall with specific inbound and outbound rules.',
        score: 2,
        explanation: 'A robust network defense that provides granular control over traffic.',
        recommendation:
          'Excellent. A dedicated, well-configured hardware firewall is a cornerstone of network security.',
      },
      {
        text: 'Yes, we use the software firewalls on our individual computers and servers.',
        score: 1,
        explanation:
          'A good baseline, but offers no centralized control or protection against internal threats.',
        recommendation:
          'Good. Software firewalls provide protection. For better security, consider a dedicated hardware firewall at the network perimeter.',
      },
      {
        text: 'We rely on the default firewall in our internet router.',
        score: 0,
        explanation:
          'Provides basic protection but lacks the advanced features of a dedicated firewall.',
        recommendation:
          'Recommendation: While better than nothing, a basic router firewall offers limited protection. Plan to upgrade to a dedicated hardware firewall for better control and visibility.',
      },
      {
        text: "Our firewall is disabled or has a policy to 'allow all' traffic.",
        score: -2,
        explanation:
          'A critical risk, leaving the network wide open to external scans and attacks.',
        recommendation:
          "Critical: Enable your firewall immediately with a 'deny all by default' policy. An open firewall is like leaving your front door unlocked and wide open.",
      },
      {
        text: "I don't know.",
        score: -1,
        explanation:
          "Indicates a lack of visibility and control over the network's perimeter security.",
        recommendation:
          'High Priority: Locate your primary network firewall (likely your internet router) and ensure it is enabled and configured to block unsolicited incoming traffic.',
      },
    ],
  },

  // --- Compliance Documentation ---
  {
    id: 16,
    category: 'Compliance Documentation',
    text: 'Do you have a formally documented Information Security Policy that is accessible to all employees?',
    options: [
      {
        text: 'Yes, it is reviewed annually, communicated to all staff, and employees are trained on it.',
        score: 2,
        explanation: 'A mature approach that embeds security into the company culture.',
        recommendation:
          'Excellent. This demonstrates a mature security program and a strong security culture.',
      },
      {
        text: 'Yes, we have a documented policy that is available to employees.',
        score: 1,
        explanation: 'A foundational element of any security program.',
        recommendation:
          'Good. This is a foundational governance document. To improve, schedule an annual review and a brief training session for all staff.',
      },
      {
        text: 'We have an informal or outdated policy.',
        score: 0,
        explanation:
          'Better than nothing, but informal policies are inconsistently applied and hard to enforce.',
        recommendation:
          'Recommendation: Formalize your security policy and have it officially approved by management. An informal policy is not enforceable.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation: 'Indicates a lack of governance and a reactive approach to security.',
        recommendation:
          "High Priority: Develop a formal Information Security Policy. It is the central document that outlines your organization's commitment and rules for security.",
      },
      {
        text: 'No, we do not have a documented policy.',
        score: -2,
        explanation:
          'A fundamental failure in governance. There are no defined rules for security.',
        recommendation:
          'Critical: Develop and document an Information Security Policy as a top priority. This is the foundation of a structured security program.',
      },
    ],
  },
  {
    id: 17,
    category: 'Compliance Documentation',
    text: 'Is there a clear Data Protection Policy that outlines how sensitive data is handled?',
    options: [
      {
        text: "Yes, it's aligned with regulations (like GDPR/NDPR), defines data types, and dictates handling procedures.",
        score: 2,
        explanation:
          'Best practice for ensuring both compliance and a clear understanding of data handling responsibilities.',
        recommendation:
          'Excellent. This proactive approach to data protection and compliance is a sign of a mature organization.',
      },
      {
        text: 'Yes, we have a basic document outlining data privacy.',
        score: 1,
        explanation: 'A good first step towards formalizing data protection.',
        recommendation:
          'Good. This is a necessary document. To improve, align it with a specific framework like the NDPR (Nigeria Data Protection Regulation) and communicate it to staff.',
      },
      {
        text: 'We handle it based on common sense but have no formal policy.',
        score: -1,
        explanation:
          'Inconsistent and subjective data handling leads to mistakes and potential breaches.',
        recommendation:
          'High Priority: Formalize your data handling rules into a Data Protection Policy. Unwritten rules lead to inconsistencies and potential breaches.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation: 'A significant governance gap, especially if handling customer data.',
        recommendation:
          'High Priority: If you handle any personal data, you must understand your legal obligations. Research data protection regulations like the NDPR and create a policy.',
      },
      {
        text: 'No, we have no formal policy on data protection.',
        score: -2,
        explanation:
          'A critical compliance and security risk, showing a disregard for data privacy.',
        recommendation:
          'Critical: Create a Data Protection Policy immediately. Handling customer or employee data without a policy is a major legal and security risk.',
      },
    ],
  },
  {
    id: 18,
    category: 'Compliance Documentation',
    text: 'Have you established an Incident Response Plan to guide your actions in the event of a security breach?',
    options: [
      {
        text: 'Yes, it is documented, contains key contacts, and we test it with drills at least annually.',
        score: 2,
        explanation:
          'The gold standard. A tested plan ensures an effective, coordinated response during a crisis.',
        recommendation:
          'Excellent. A tested plan is a plan that will work in a real crisis. This is best practice.',
      },
      {
        text: 'Yes, we have a documented plan outlining the steps to take.',
        score: 1,
        explanation:
          'A necessary component of security management, providing a roadmap for crisis.',
        recommendation:
          'Good. Having a documented plan is a critical piece of preparedness. To improve, schedule a simple tabletop drill to test it.',
      },
      {
        text: 'We have some informal notes or an idea of who to call.',
        score: -1,
        explanation:
          'An informal plan will fail under the pressure of a real incident, leading to chaos and increased damage.',
        recommendation:
          'High Priority: Formalize your notes into a structured Incident Response Plan. An informal plan will fall apart under pressure.',
      },
      {
        text: "I don't know what an Incident Response Plan is.",
        score: -1,
        explanation:
          'Indicates a lack of preparedness for the most basic security inevitabilities.',
        recommendation:
          'Critical: Research and create an Incident Response Plan. It is a simple document outlining who to call and what steps to take when a breach occurs. Not having one turns a problem into a disaster.',
      },
      {
        text: 'No, we have no plan for security incidents.',
        score: -2,
        explanation:
          'A critical failure. The damage from a breach will be significantly worse without a plan.',
        recommendation:
          'Critical: Develop an Incident Response Plan immediately. In the event of a breach, having a plan can significantly reduce the cost, downtime, and reputational damage.',
      },
    ],
  },
  {
    id: 19,
    category: 'Compliance Documentation',
    text: 'Is there a defined policy for employee password complexity and regular updates?',
    options: [
      {
        text: "Yes, it's enforced via system settings and requires MFA, length, complexity, and rotation.",
        score: 2,
        explanation: 'A mature and proactive approach to enforcing strong authentication.',
        recommendation:
          'Excellent. Enforcing strong password policies through technical controls is the most effective method.',
      },
      {
        text: 'Yes, we have a written policy that encourages strong passwords.',
        score: 1,
        explanation: 'A good practice that sets clear expectations for employees.',
        recommendation:
          'Good. This sets a clear expectation. To improve, find ways to technically enforce the policy through your systems (e.g., Active Directory, Google Workspace).',
      },
      {
        text: "We just tell our employees to use 'strong' passwords.",
        score: 0,
        explanation:
          'Offers guidance but no enforcement, resulting in inconsistent password strength.',
        recommendation:
          'High Priority: Create a formal, written password policy that specifies minimum length, complexity, and other requirements. Communicate this policy to all employees.',
      },
      {
        text: 'We have no policy regarding passwords.',
        score: -2,
        explanation:
          'A significant risk, leading to widespread use of weak, easily compromised passwords.',
        recommendation:
          'Critical: Implement a formal password policy immediately. Without one, employees will default to simple, reusable passwords, creating a massive security risk.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation: 'Lack of a policy implies a lack of basic security governance.',
        recommendation:
          "High Priority: Establish and communicate a formal password policy. It's a simple, low-cost way to dramatically improve your security posture.",
      },
    ],
  },
  {
    id: 20,
    category: 'Compliance Documentation',
    text: 'Do you have an Acceptable Use Policy that details the permissible use of company IT resources?',
    options: [
      {
        text: 'Yes, all employees read and sign it as part of their onboarding.',
        score: 2,
        explanation:
          'Ensures that employees are aware of their responsibilities and the organization has legal recourse.',
        recommendation:
          'Excellent. This ensures awareness and accountability across the organization.',
      },
      {
        text: 'Yes, we have one documented and available.',
        score: 1,
        explanation: 'A foundational governance document.',
        recommendation:
          'Good. This is a foundational IT governance document. Ensure new employees are made aware of it.',
      },
      {
        text: "It's an unwritten rule that people generally understand.",
        score: 0,
        explanation: 'Unwritten rules are not enforceable and lead to inconsistent behavior.',
        recommendation:
          'High Priority: Formalize these rules into a written Acceptable Use Policy (AUP). This protects both the company and the employee by setting clear expectations.',
      },
      {
        text: 'No, there are no rules on how employees use company tech.',
        score: -2,
        explanation: 'A significant risk that can lead to misuse of assets and internal threats.',
        recommendation:
          'Critical: Create and implement an Acceptable Use Policy. This is a critical document for protecting company assets and reducing legal liability.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation: 'Indicates a lack of basic IT governance.',
        recommendation:
          'High Priority: Develop an Acceptable Use Policy (AUP). This document defines how employees can use company technology and is a standard business practice.',
      },
    ],
  },
  {
    id: 21,
    category: 'Compliance Documentation',
    text: 'Are your data handling and privacy practices compliant with relevant regulations (e.g., GDPR, NDPR)?',
    options: [
      {
        text: 'Yes, we have had a formal audit or review to ensure full compliance.',
        score: 2,
        explanation: 'Demonstrates due diligence and a proactive stance on compliance.',
        recommendation:
          'Excellent. This demonstrates a proactive and mature approach to managing compliance risk.',
      },
      {
        text: 'Yes, we have reviewed the regulations and believe we are compliant.',
        score: 1,
        explanation: 'A good faith effort, but may contain gaps without a formal review.',
        recommendation:
          'Good. This is a positive step. To improve, consider a third-party gap assessment to get an objective view of your compliance status.',
      },
      {
        text: 'We are aware of the regulations but have not taken formal steps.',
        score: -1,
        explanation: 'Awareness without action is a significant legal and financial risk.',
        recommendation:
          'High Priority: Take formal steps to meet your compliance obligations (e.g., NDPR). This may include appointing a Data Protection Officer (DPO) and creating required documentation.',
      },
      {
        text: 'We are not aware of any regulations that apply to us.',
        score: -2,
        explanation: 'Willful ignorance is not a defense and represents a major compliance risk.',
        recommendation:
          'Critical: You must identify and comply with all relevant data protection and privacy regulations. Ignorance of the law is not a defense and can lead to severe penalties.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation:
          'A significant risk, as non-compliance can lead to heavy fines and reputational damage.',
        recommendation:
          'Critical: Immediately identify the data privacy laws and regulations that apply to your business (e.g., NDPR in Nigeria). Non-compliance can have severe financial consequences.',
      },
    ],
  },

  // --- Cyber Security Implementations ---
  {
    id: 22,
    category: 'Cyber Security Implementations',
    text: 'Do you use an Intrusion Detection System (IDS) or Intrusion Prevention System (IPS)?',
    options: [
      {
        text: 'Yes, we have a managed IDS/IPS that is monitored and alerts our security team.',
        score: 2,
        explanation:
          'A proactive security measure that allows for rapid detection and response to threats.',
        recommendation:
          'Excellent. A monitored IDS/IPS provides powerful, real-time insight into network threats.',
      },
      {
        text: 'Yes, we have an IDS/IPS device or software running.',
        score: 1,
        explanation: 'A good security control that provides visibility into network threats.',
        recommendation:
          'Good. You have the right technology in place. Ensure you have a process for regularly reviewing its logs and alerts.',
      },
      {
        text: 'We are planning to implement one.',
        score: 0,
        explanation: 'Awareness without implementation provides no security benefit.',
        recommendation:
          'Recommendation: Consider implementing an IDS/IPS as your organization matures. Many modern firewalls have this functionality built-in.',
      },
      {
        text: "I don't know what an IDS/IPS is.",
        score: -1,
        explanation: 'Indicates a lack of knowledge about modern network security technologies.',
        recommendation:
          'Recommendation: Research Intrusion Detection/Prevention Systems. They act like a burglar alarm for your network, detecting and/or blocking malicious activity.',
      },
      {
        text: 'No, we do not use IDS or IPS.',
        score: -2,
        explanation: 'The network is blind to active threats and ongoing attacks.',
        recommendation:
          'Recommendation: For improved threat visibility, investigate adding IDS/IPS capabilities, often included in modern Unified Threat Management (UTM) firewalls.',
      },
    ],
  },
  {
    id: 23,
    category: 'Cyber Security Implementations',
    text: 'Have you implemented a Security Information and Event Management (SIEM) system?',
    options: [
      {
        text: 'Yes, we have a SIEM that aggregates logs from all critical systems and has rules for threat detection.',
        score: 2,
        explanation:
          'The best practice for security visibility, enabling rapid threat detection and investigation.',
        recommendation:
          'Excellent. A well-configured SIEM is a sign of a mature security operations program.',
      },
      {
        text: 'Yes, we collect logs from some systems but analysis is manual and infrequent.',
        score: 1,
        explanation:
          'A good start, but manual analysis is not scalable or effective for real-time threat detection.',
        recommendation:
          'Good. Centralizing logs is a great first step. To improve, investigate SIEM tools (some are open source) to automate the analysis of those logs.',
      },
      {
        text: 'We keep logs on individual devices but do not centralize them.',
        score: -1,
        explanation:
          'Useless for incident response, as correlating events across devices is nearly impossible.',
        recommendation:
          'High Priority: Implement a centralized logging solution. Without it, investigating a security incident is nearly impossible. This can be as simple as forwarding logs to a dedicated server.',
      },
      {
        text: 'We do not collect or review security logs.',
        score: -2,
        explanation:
          'A critical visibility gap. You cannot investigate or learn from a breach without logs.',
        recommendation:
          'Critical: Begin collecting security logs from your critical systems (firewalls, servers). Without logs, you are blind to what is happening on your network.',
      },
      {
        text: "I don't know what a SIEM is.",
        score: -1,
        explanation: 'Indicates a lack of knowledge about modern security monitoring.',
        recommendation:
          'Recommendation: Research Security Information and Event Management (SIEM). The core idea is to collect all security logs into one place for easier analysis.',
      },
    ],
  },
  {
    id: 24,
    category: 'Cyber Security Implementations',
    text: 'Is two-factor or multi-factor authentication (2FA/MFA) required for accessing critical systems?',
    options: [
      {
        text: 'Yes, MFA is mandatory for all users on all critical systems, including email and remote access.',
        score: 2,
        explanation:
          'The single most effective control to prevent unauthorized access, even if passwords are stolen.',
        recommendation:
          'Excellent. This is the gold standard and the single most important defense against account takeover attacks.',
      },
      {
        text: 'Yes, but it is only required for administrative or privileged accounts.',
        score: 1,
        explanation: 'A good practice that protects the most powerful accounts.',
        recommendation:
          'Good. Protecting privileged accounts is the highest priority. Plan to expand MFA to all users, especially for email and critical applications.',
      },
      {
        text: 'It is available but optional for users to enable.',
        score: 0,
        explanation:
          'Optional security is rarely used by the majority of users, providing little overall protection.',
        recommendation:
          "High Priority: Change your MFA policy from 'optional' to 'mandatory' for all users, or at the very least, for all administrative and remote access accounts.",
      },
      {
        text: 'We only use it for one or two non-critical applications.',
        score: -1,
        explanation:
          'Provides a false sense of security while leaving all critical systems exposed.',
        recommendation:
          'Recommendation: Re-evaluate your use of MFA. It should be applied to your most critical systems first, such as email, financial applications, and administrator logins.',
      },
      {
        text: 'No, we do not use MFA anywhere.',
        score: -2,
        explanation:
          "A critical vulnerability in today's threat landscape. It makes account takeover trivial.",
        recommendation:
          'Critical: Implement MFA immediately, starting with all administrative accounts and external-facing services like email. Passwords alone are no longer sufficient.',
      },
    ],
  },
  {
    id: 25,
    category: 'Cyber Security Implementations',
    text: 'Is sensitive data encrypted both when it is stored (at rest) and when it is transmitted (in transit)?',
    options: [
      {
        text: 'Yes, all sensitive data is encrypted at rest (e.g., database encryption) and in transit (SSL/TLS).',
        score: 2,
        explanation:
          'A comprehensive data protection strategy that protects data from all forms of unauthorized access.',
        recommendation:
          'Excellent. This comprehensive data protection strategy is aligned with modern best practices.',
      },
      {
        text: 'Data is encrypted in transit, but not while stored on our servers.',
        score: 1,
        explanation:
          'Good security, but leaves data vulnerable if a server or database is compromised.',
        recommendation:
          'High Priority: Implement encryption at rest for your sensitive data. This protects you if a physical server or hard drive is stolen.',
      },
      {
        text: 'Only some of our sensitive data is encrypted.',
        score: -1,
        explanation: 'Inconsistent encryption leaves sensitive data exposed.',
        recommendation:
          'High Priority: Conduct a data audit to identify all locations of sensitive data and ensure it is encrypted both at rest and in transit.',
      },
      {
        text: "I don't know if or how our data is encrypted.",
        score: -1,
        explanation: 'A significant risk, as you cannot confirm that sensitive data is protected.',
        recommendation:
          'Critical: You must determine if and how your sensitive data is encrypted. Assume it is not protected and investigate immediately.',
      },
      {
        text: 'No, we do not use encryption.',
        score: -2,
        explanation:
          'A critical flaw that exposes all sensitive data to interception and direct access.',
        recommendation:
          'Critical: Implement encryption for all sensitive data. Start with SSL/TLS for data in transit and then investigate options like database and full-disk encryption for data at rest.',
      },
    ],
  },
  {
    id: 26,
    category: 'Cyber Security Implementations',
    text: 'Do you conduct regular vulnerability scans or penetration tests of your IT infrastructure?',
    options: [
      {
        text: 'Yes, we conduct regular automated scans and an annual third-party penetration test.',
        score: 2,
        explanation: 'A mature, proactive approach to identifying and remediating vulnerabilities.',
        recommendation:
          'Excellent. This proactive combination of automated scanning and manual testing is the best practice for vulnerability management.',
      },
      {
        text: 'Yes, we perform periodic automated vulnerability scans on our network.',
        score: 1,
        explanation: 'A good practice for proactively identifying security weaknesses.',
        recommendation:
          'Good. This is a great proactive security measure. To mature your program, consider adding an annual third-party penetration test to find more complex vulnerabilities.',
      },
      {
        text: 'We have done a scan once in the past, but not regularly.',
        score: 0,
        explanation:
          'A one-time snapshot that is now outdated and provides a false sense of security.',
        recommendation:
          'Recommendation: Implement a regular, recurring schedule for vulnerability scans (e.g., quarterly). Security is a process, not a one-time event.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation: 'Indicates a lack of awareness of fundamental security assurance practices.',
        recommendation:
          'High Priority: Research and conduct a vulnerability scan of your network and website. There are many affordable and free tools available to get started.',
      },
      {
        text: 'No, we have never performed scans or tests.',
        score: -2,
        explanation:
          'A purely reactive security posture. You will only find vulnerabilities when they are exploited by attackers.',
        recommendation:
          'Critical: Begin a vulnerability management program immediately by running a scan on your external-facing systems. You need to find your security holes before an attacker does.',
      },
    ],
  },
  {
    id: 27,
    category: 'Cyber Security Implementations',
    text: 'Do employees receive regular cybersecurity awareness training?',
    options: [
      {
        text: 'Yes, all employees undergo mandatory annual training with periodic phishing simulations.',
        score: 2,
        explanation:
          'The most effective way to build a human firewall and defend against social engineering.',
        recommendation:
          'Excellent. This is the gold standard for building a security-aware culture and a strong human firewall.',
      },
      {
        text: 'Yes, new employees receive some security training during onboarding.',
        score: 1,
        explanation:
          'A good first step, but security knowledge becomes outdated without regular reinforcement.',
        recommendation:
          'Good. This is a solid foundation. To improve, implement annual refresher training and consider periodic phishing tests.',
      },
      {
        text: 'We occasionally send out an email reminder about security.',
        score: -1,
        explanation: 'Ineffective and insufficient for creating a security-aware culture.',
        recommendation:
          'High Priority: Implement a formal, structured security awareness training program for all employees. Occasional emails are not effective.',
      },
      {
        text: 'No, we believe our employees already know how to be secure.',
        score: -1,
        explanation:
          'A dangerous assumption that ignores the fact that employees are the primary target of attackers.',
        recommendation:
          'Critical: This assumption is incorrect and dangerous. Immediately implement a security awareness training program for all staff. Humans are a primary target for attackers.',
      },
      {
        text: 'No, we do not provide any security training.',
        score: -2,
        explanation:
          'A critical gap that makes the organization highly vulnerable to phishing and other social engineering attacks.',
        recommendation:
          'Critical: Implement a security awareness training program immediately. Your employees are your first line of defense, and they need to be trained to spot and report threats.',
      },
    ],
  },
  {
    id: 28,
    category: 'Cyber Security Implementations',
    text: 'Is there a process for securely disposing of old hardware and data?',
    options: [
      {
        text: 'Yes, we have a strict policy that requires professional data destruction and/or physical destruction of drives.',
        score: 2,
        explanation:
          'A comprehensive process that ensures sensitive data does not leave the organization on old equipment.',
        recommendation:
          'Excellent. Your process ensures that data leakage from disposed assets is highly unlikely.',
      },
      {
        text: 'Yes, we wipe the hard drives before disposing of old computers.',
        score: 1,
        explanation: 'A good practice that prevents casual data recovery from disposed drives.',
        recommendation:
          'Good. This is a solid practice. For higher security, consider using data destruction software that overwrites the data multiple times.',
      },
      {
        text: 'We just delete the files before giving the hardware away.',
        score: -2,
        explanation: 'A significant risk. Deleted files are easily recoverable with free software.',
        recommendation:
          "Critical: Immediately change your process. 'Deleting' files does not remove them. You must use a secure data wiping tool to sanitize hard drives before disposal.",
      },
      {
        text: 'We throw old computers in the trash without any data wiping.',
        score: -2,
        explanation:
          'A critical data leakage risk. This is equivalent to handing your data to strangers.',
        recommendation:
          'Critical: Stop this practice immediately. You are leaking sensitive company and customer data. All storage devices must be securely wiped or physically destroyed before disposal.',
      },
      {
        text: "I don't know what happens to old hardware.",
        score: -1,
        explanation: 'Indicates a lack of control and a high probability of data leakage.',
        recommendation:
          'High Priority: Establish a formal policy and process for asset disposal that includes secure data wiping or physical destruction of storage media.',
      },
    ],
  },
  {
    id: 29,
    category: 'Cyber Security Implementations',
    text: 'Do you have a system in place for managing and applying security patches in a timely manner?',
    options: [
      {
        text: 'Yes, we use an automated patch management system that applies critical patches within days.',
        score: 2,
        explanation:
          'A mature, proactive process that minimizes the window of exploitation for new vulnerabilities.',
        recommendation:
          'Excellent. An automated and rapid patch management process is a sign of a mature security program.',
      },
      {
        text: 'Yes, we have a manual process to check for and apply patches monthly.',
        score: 1,
        explanation: 'A good, disciplined process, though slower than automated systems.',
        recommendation:
          'Good. A disciplined manual process is effective. To improve, look into patch management tools that can automate the deployment and reporting.',
      },
      {
        text: 'We only patch systems when we encounter a problem.',
        score: -1,
        explanation:
          "A reactive 'break-fix' approach that guarantees systems remain vulnerable for long periods.",
        recommendation:
          "High Priority: Move from a reactive 'break-fix' model to a proactive, scheduled patching process. Waiting for a problem means you are already compromised.",
      },
      {
        text: 'We do not have a formal patching process.',
        score: -2,
        explanation:
          'A critical failure in security maintenance, leading to a build-up of easily exploitable vulnerabilities.',
        recommendation:
          'Critical: Implement a formal patch management process immediately. Unpatched systems are the most common way attackers gain entry to a network.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation:
          'A significant operational risk, as unpatched systems are a primary target for attackers.',
        recommendation:
          'Critical: Designate a person or team responsible for applying security patches and task them with creating a monthly schedule. This is a fundamental security task.',
      },
    ],
  },
  {
    id: 30,
    category: 'Cyber Security Implementations',
    text: 'Is access to sensitive data and systems restricted based on the principle of least privilege?',
    options: [
      {
        text: 'Yes, access rights are strictly controlled and regularly reviewed based on job roles.',
        score: 2,
        explanation:
          'The gold standard for access control, minimizing the potential impact of any single account compromise.',
        recommendation:
          'Excellent. This demonstrates a mature and effective access control program.',
      },
      {
        text: 'Yes, we have different levels of access for different groups of employees.',
        score: 1,
        explanation: 'A good, foundational access control model.',
        recommendation:
          'Good. This is a foundational access control practice. To improve, implement a process for periodically reviewing user access rights (e.g., annually).',
      },
      {
        text: 'Access is granted on request, but rarely revoked or reviewed.',
        score: -1,
        explanation:
          "Known as 'privilege creep,' this creates a massive internal attack surface over time.",
        recommendation:
          'High Priority: Implement a regular access review process (e.g., quarterly or annually) to identify and revoke unnecessary permissions from all user accounts.',
      },
      {
        text: 'Most employees have access to most data.',
        score: -2,
        explanation:
          'A critical risk. A compromise of any user account could lead to a full company data breach.',
        recommendation:
          'Critical: Immediately begin a project to implement the Principle of Least Privilege. Start by identifying data types and creating user roles with appropriate, limited access.',
      },
      {
        text: "I don't know.",
        score: -1,
        explanation: 'Indicates a lack of basic access control, a fundamental security principle.',
        recommendation:
          'High Priority: Research and implement the Principle of Least Privilege. This foundational security concept means users should only have access to what they need to do their jobs.',
      },
    ],
  },
]

export const mockRankings = [
  {
    rank: 1,
    name: 'Innovate UK Ltd.',
    score: 89,
    location: 'London',
    type: 'FinTech',
    lat: 51.5074,
    lng: -0.1278,
    report: { overall: 89, ws: 95, dn: 85, cd: 80, cs: 92 },
  },
  {
    rank: 2,
    name: 'Manchester Tech Co.',
    score: 85,
    location: 'Manchester',
    type: 'SaaS',
    lat: 53.4808,
    lng: -2.2426,
    report: { overall: 85, ws: 90, dn: 88, cd: 75, cs: 82 },
  },
  {
    rank: 3,
    name: 'Bristol Digital Agency',
    score: 82,
    location: 'Bristol',
    type: 'Marketing',
    lat: 51.4545,
    lng: -2.5879,
    report: { overall: 82, ws: 85, dn: 80, cd: 88, cs: 79 },
  },
  {
    rank: 4,
    name: 'Cambridge AI Solutions',
    score: 79,
    location: 'Cambridge',
    type: 'AI/ML',
    lat: 52.2053,
    lng: 0.1218,
    report: { overall: 79, ws: 75, dn: 85, cd: 82, cs: 78 },
  },
  {
    rank: 5,
    name: 'Secure Hosting UK',
    score: 78,
    location: 'London',
    type: 'IT Services',
    lat: 51.515,
    lng: -0.09,
    report: { overall: 78, ws: 88, dn: 70, cd: 75, cs: 80 },
  },
  {
    rank: 6,
    name: 'Birmingham Logistics',
    score: 75,
    location: 'Birmingham',
    type: 'Logistics',
    lat: 52.4862,
    lng: -1.8904,
    report: { overall: 75, ws: 70, dn: 78, cd: 80, cs: 72 },
  },
  {
    rank: 7,
    name: 'Leeds E-commerce',
    score: 71,
    location: 'Leeds',
    type: 'E-commerce',
    lat: 53.8008,
    lng: -1.5491,
    report: { overall: 71, ws: 78, dn: 65, cd: 70, cs: 70 },
  },
  {
    rank: 8,
    name: 'Oxford EduTech',
    score: 68,
    location: 'Oxford',
    type: 'Education',
    lat: 51.752,
    lng: -1.2577,
    report: { overall: 68, ws: 65, dn: 72, cd: 60, cs: 75 },
  },
  {
    rank: 9,
    name: 'Glasgow Creative',
    score: 65,
    location: 'Glasgow',
    type: 'Creative',
    lat: 55.8642,
    lng: -4.2518,
    report: { overall: 65, ws: 72, dn: 60, cd: 68, cs: 61 },
  },
  {
    rank: 10,
    name: 'Data Insights London',
    score: 64,
    location: 'London',
    type: 'Data Analytics',
    lat: 51.512,
    lng: -0.13,
    report: { overall: 64, ws: 60, dn: 68, cd: 65, cs: 63 },
  },
  {
    rank: 11,
    name: 'Cardiff Solutions',
    score: 62,
    location: 'Cardiff',
    type: 'IT Services',
    lat: 51.4816,
    lng: -3.1791,
    report: { overall: 62, ws: 68, dn: 65, cd: 55, cs: 60 },
  },
  {
    rank: 12,
    name: 'Edinburgh Consulting',
    score: 60,
    location: 'Edinburgh',
    type: 'Consulting',
    lat: 55.9533,
    lng: -3.1883,
    report: { overall: 60, ws: 55, dn: 62, cd: 65, cs: 58 },
  },
  {
    rank: 13,
    name: 'Liverpool Retail',
    score: 58,
    location: 'Liverpool',
    type: 'Retail',
    lat: 53.4084,
    lng: -2.9916,
    report: { overall: 58, ws: 62, dn: 55, cd: 50, cs: 65 },
  },
  {
    rank: 14,
    name: 'Nottingham Gaming',
    score: 55,
    location: 'Nottingham',
    type: 'Gaming',
    lat: 52.9548,
    lng: -1.1581,
    report: { overall: 55, ws: 50, dn: 60, cd: 58, cs: 52 },
  },
  {
    rank: 15,
    name: 'Sheffield Manufacturing',
    score: 52,
    location: 'Sheffield',
    type: 'Manufacturing',
    lat: 53.3811,
    lng: -1.4701,
    report: { overall: 52, ws: 45, dn: 58, cd: 55, cs: 50 },
  },
  {
    rank: 16,
    name: 'Newcastle Health',
    score: 49,
    location: 'Newcastle',
    type: 'Healthcare',
    lat: 54.9783,
    lng: -1.6178,
    report: { overall: 49, ws: 52, dn: 50, cd: 45, cs: 49 },
  },
  {
    rank: 17,
    name: 'Aberdeen Energy',
    score: 45,
    location: 'Aberdeen',
    type: 'Energy',
    lat: 57.1497,
    lng: -2.0943,
    report: { overall: 45, ws: 40, dn: 55, cd: 40, cs: 45 },
  },
  {
    rank: 18,
    name: 'Belfast Logistics',
    score: 42,
    location: 'Belfast',
    type: 'Logistics',
    lat: 54.5973,
    lng: -5.9301,
    report: { overall: 42, ws: 48, dn: 40, cd: 35, cs: 45 },
  },
  {
    rank: 19,
    name: 'Southampton Marine',
    score: 38,
    location: 'Southampton',
    type: 'Marine',
    lat: 50.9097,
    lng: -1.4044,
    report: { overall: 38, ws: 35, dn: 45, cd: 40, cs: 32 },
  },
  {
    rank: 20,
    name: 'Plymouth Construction',
    score: 35,
    location: 'Plymouth',
    type: 'Construction',
    lat: 50.3755,
    lng: -4.1427,
    report: { overall: 35, ws: 30, dn: 40, cd: 38, cs: 32 },
  },
]
