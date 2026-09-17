\# Architecture Decision Records (ADR)



\## ADR-001: NextAuth.js v5 Beta Selection



\*\*Date:\*\* 2026-09-13  

\*\*Status:\*\* Accepted  

\*\*Decision Maker:\*\* Product Owner



\### Context

The project uses Next.js 16 with App Router. NextAuth.js has two major versions:

\- \*\*v4\*\*: Stable, designed for Pages Router

\- \*\*v5 (beta)\*\*: Designed for App Router and Server Components



\### Decision

Use `next-auth@beta` (v5) instead of stable v4.



\### Rationale

1\. \*\*App Router Compatibility\*\*: NextAuth v5 is built specifically for Next.js App Router and Server Components, which this project uses exclusively.

2\. \*\*Server Actions Support\*\*: v5 has native support for Server Actions, aligning with our API strategy.

3\. \*\*Future-Proofing\*\*: v4 will eventually be deprecated; starting with v5 avoids a future migration.

4\. \*\*Beta Stability\*\*: As of September 2026, v5 beta has been widely adopted in production Next.js 16 projects and is considered stable enough for development.



\### Consequences

\- \*\*Positive\*\*: Native App Router integration, better Server Components support, no future migration needed.

\- \*\*Negative\*\*: Beta status means potential breaking changes before v5 stable release; less community documentation compared to v4.



\### Mitigation

\- Pin to specific beta version (`^5.0.0-beta.32`) to avoid unexpected breaking changes.

\- Monitor NextAuth.js GitHub releases for v5 stable announcement.

\- If critical issues arise, fallback to v4 with Pages Router API routes is possible but would require significant refactoring.



\---



\## ADR-002: bcryptjs over bcrypt



\*\*Date:\*\* 2026-09-13  

\*\*Status:\*\* Accepted



\### Context

Password hashing requires a bcrypt implementation. Two options:

\- \*\*bcrypt\*\*: Native C++ bindings, requires node-gyp and build tools

\- \*\*bcryptjs\*\*: Pure JavaScript implementation, no native dependencies



\### Decision

Use `bcryptjs` instead of `bcrypt`.



\### Rationale

1\. \*\*Windows Compatibility\*\*: `bcrypt` requires node-gyp and C++ build tools, which frequently cause compilation errors on Windows development environments.

2\. \*\*Zero Dependencies\*\*: `bcryptjs` is pure JavaScript, eliminating native module compilation issues entirely.

3\. \*\*Performance Acceptable\*\*: For password hashing (low frequency operation), the performance difference between native and JS implementations is negligible.

4\. \*\*Identical API\*\*: `bcryptjs` provides the same API as `bcrypt`, making it a drop-in replacement.



\### Consequences

\- \*\*Positive\*\*: No compilation issues on Windows, simpler deployment, fewer dependencies.

\- \*\*Negative\*\*: Slightly slower hashing (imperceptible for user authentication flows).



\---



\## ADR-003: Prisma 6 over Prisma 7



\*\*Date:\*\* 2026-09-13  

\*\*Status:\*\* Accepted



\### Context

Prisma 7 was initially installed but introduced breaking changes incompatible with the proposed schema design.



\### Decision

Downgrade to Prisma 6.12 (latest stable v6).



\### Rationale

1\. \*\*Schema Compatibility\*\*: The proposed schema uses Prisma 5/6 syntax; Prisma 7 requires migration to new config format (`prisma7.config.ts`).

2\. \*\*Stability\*\*: Prisma 6 is battle-tested with extensive community documentation.

3\. \*\*Network Issues\*\*: Prisma 7's dynamic subcommand loading failed due to network restrictions (ECONNRESET), while Prisma 6 works offline after initial install.



\### Consequences

\- \*\*Positive\*\*: Stable, well-documented, compatible with existing schema design.

\- \*\*Negative\*\*: Will need to migrate to Prisma 7+ eventually when ecosystem stabilizes.



\---



\*Last updated: 2026-09-13\*

