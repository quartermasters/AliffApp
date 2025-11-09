# 🚀 Aliff Capital App v2.0

Modern Next.js rebuild of the Aliff Capital platform - AI-powered government contracting solution.

## 📊 Project Overview

Aliff Capital is a comprehensive platform for government contractors featuring:
- **AI-Powered Application Screening** - Resume parsing and candidate evaluation
- **Full ATS (Applicant Tracking System)** - Manage job postings, applications, interviews
- **CRM & Lead Management** - Track audits, leads, and conversions
- **LinkedIn Automation** - Prospect management and content generation
- **AI Chatbot** - Lead qualification and customer support
- **Business Development Tools** - Project tracking and analytics

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
git clone https://github.com/YOUR_USERNAME/aliff-capital-app.git
cd aliff-capital-app
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
aliff-capital-app/
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

This is a private project. For contributions, please contact the Aliff Capital team.

## 📄 License

UNLICENSED - Proprietary software of Aliff Capital

---

## 🆘 Support

For technical support or questions:
- **Email**: dev@aliffcapital.com
- **Documentation**: Coming soon

---

**Built with ❤️ by Claude Code for Aliff Capital**

**Version**: 2.0.0 (Alpha)
**Last Updated**: 2025-01-07
