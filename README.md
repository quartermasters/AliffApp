# 🚀 Aliff Services App v2.0

Modern Next.js rebuild of the Aliff Services platform - AI-powered government contracting solution.

## 📊 Project Overview

Aliff Services is a comprehensive marketplace platform connecting government contractors and businesses with pre-vetted service providers. The platform features complete anonymity between clients and providers, with Aliff acting as an intelligent intermediary.

### 🎯 Four Service Categories

1. **GOVCON** - Federal government contracting services (8 services)
   - Certification, Market Intelligence, Relationship Building, Proposal Development
   - Pricing Strategy, Compliance, Subcontracting & Teaming, Website & Mobile Development

2. **SLED** - State, Local, and Education contracting services (8 services)
   - Same comprehensive services tailored for state/local markets

3. **Writing Services** - Professional writing for all businesses (6 categories)
   - Copywriting, Content Writing, Long-Form Content
   - Ghostwriting, Business Writing, Specialized Services

4. **IT Services** - Website and mobile app development for all businesses
   - Website Development (Corporate, E-commerce, Landing Pages, Web Apps, CMS)
   - Mobile App Development (iOS, Android, React Native, PWA, Enterprise)

### 🤖 Platform Features

- **AI Chatbot "Aliff"** - Lead qualification, assessment, and pricing discovery
- **Complete Anonymity** - Fake identity generation between clients and providers
- **AI-Powered Matching** - Automated service provider selection via competency tests
- **Document Sanitization** - AI scrubs identifying information
- **Slack Integration** - Quote routing and team notifications
- **Multi-Tenant Architecture** - Client, Provider, Vendor, and Admin portals

### Key Metrics
- 💰 **$47M+** in contracts won
- 📈 **22% win rate** vs 4% industry average
- ⚡ **5-7 day** turnaround
- 🎯 **5.5x** better than competitors

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (planned)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod (planned)
- **State**: Zustand (planned)

### Backend
- **Runtime**: Node.js 20 LTS
- **API**: Next.js API Routes + tRPC (planned)
- **Database**: PostgreSQL 16 (planned)
- **ORM**: Prisma 5 (planned)
- **Cache**: Redis 7 (planned)
- **File Storage**: MinIO (planned)
- **Queue**: BullMQ (planned)

### AI & Integrations
- **AI**: OpenAI GPT-4o / GPT-4o-mini
- **Email**: Resend
- **Authentication**: NextAuth.js v5 (planned)
- **2FA**: speakeasy (planned)

### DevOps
- **Containerization**: Docker + Docker Compose
- **Deployment**: Hostinger VPS (Ubuntu 22.04 LTS)
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm 10+
- PostgreSQL 16 (or Docker)
- Redis 7 (or Docker)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/aliff-services-app.git
cd aliff-services-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 📁 Project Structure

```
aliff-services-app/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── prisma/               # Database schema and migrations (planned)
├── docker/               # Docker configuration (planned)
└── docs/                 # Documentation (planned)
```

## 🎨 Design System

### Brand Colors
- **Gold**: `#C89D5C` - Primary brand color
- **Victory Green**: `#10B981` - Success states
- **Navy**: `#0A0F1E` - Dark backgrounds

### Typography
- **Font**: Inter (sans-serif)
- **Weights**: 400 (regular), 600 (semibold), 900 (black)

### Design Philosophy
- **Mobile-First**: Responsive design starting from 320px
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: < 1.8s FCP, > 90 Lighthouse score
- **Dark Mode**: System preference detection

## 🗺️ Development Roadmap

### Phase 1: Foundation (Weeks 1-3) ✅
- [x] Project setup with Next.js 14
- [x] Design system and Tailwind config
- [x] Basic homepage
- [ ] Authentication setup
- [ ] Database setup (Prisma + PostgreSQL)

### Phase 2: Core Features (Weeks 4-8)
- [ ] Job postings & applications
- [ ] AI resume screening
- [ ] CV Bank
- [ ] Interview management

### Phase 3: Advanced Features (Weeks 9-12)
- [ ] CRM & Leads pipeline
- [ ] AI Chatbot
- [ ] Email automation
- [ ] Analytics dashboard

### Phase 4: Polish & Launch (Weeks 13-16)
- [ ] LinkedIn automation
- [ ] Third-party integrations
- [ ] Performance optimization
- [ ] Production deployment

## 🔒 Security

- **Authentication**: NextAuth.js with session management
- **Authorization**: Role-Based Access Control (RBAC)
- **Data Protection**: PostgreSQL with encrypted connections
- **API Security**: Rate limiting, CORS, validation
- **File Uploads**: Type validation, size limits, malware scanning
- **Environment Variables**: Never committed to git

## 📝 Contributing

This is a private project. For contributions, please contact the Aliff Services team.

## 📄 License

UNLICENSED - Proprietary software of Aliff Services

---

## 🆘 Support

For technical support or questions:
- **Email**: dev@aliffservices.com
- **Documentation**: Coming soon

---

**Built with ❤️ by Claude Code for Aliff Services**

**Version**: 2.0.0 (Alpha)
**Last Updated**: 2025-01-07
