# Time Capsule 2.0 (MemoVault)

A modern digital time capsule platform for preserving and sharing memories, built with Next.js and enhanced with AI capabilities.

## 🌟 Features

### Core Features
- **Digital Memory Preservation**
  - Create and store digital "capsules" containing text, images, and memories
  - Lock capsules until a specified future date
  - Support for personal and communal memory preservation

- **Smart Organization**
  - AI-powered sentiment analysis for emotional context
  - Automatic categorization and tagging of memories
  - Timeline view for chronological memory exploration

- **User Experience**
  - Modern, responsive UI with smooth animations
  - Intuitive navigation and memory creation
  - Real-time updates and interactions
  - Frosted glass design elements and fluid transitions

### Technical Features
- **Frontend Architecture**
  - Built with Next.js 13 (App Router)
  - Tailwind CSS for styling
  - Framer Motion for animations
  - TypeScript for type safety
  - React Hot Toast for notifications

- **Backend Infrastructure**
  - Next.js API Routes
  - MongoDB Atlas for data persistence
  - Supabase Storage for media files
  - AWS S3 for production storage
  - Server-side caching with Redis

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- MongoDB Atlas account
- Supabase account
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/time-capsule-2.0.git
cd time-capsule-2.0
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
# MongoDB
MONGODB_URI=your_mongodb_uri
MONGODB_DB=memovault

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AWS S3 (Production)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

4. Run the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
memovault/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── capsule-vault/
│   │   │   └── api/
│   │   ├── components/
│   │   └── lib/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── capsuleController.ts   # Capsule CRUD operations
│   │   │   ├── userController.ts      # User management
│   │   │   └── authController.ts      # Authentication
│   │   ├── models/
│   │   │   ├── Capsule.ts            # Capsule schema
│   │   │   └── User.ts               # User schema
│   │   ├── routes/
│   │   │   ├── capsuleRoutes.ts      # Capsule endpoints
│   │   │   ├── userRoutes.ts         # User endpoints
│   │   │   └── authRoutes.ts         # Auth endpoints
│   │   ├── services/
│   │   │   ├── storageService.ts     # Supabase/S3 integration
│   │   │   ├── aiService.ts          # AI analysis
│   │   │   └── cacheService.ts       # Redis caching
│   │   ├── config/
│   │   │   ├── mongodb.ts            # Database config
│   │   │   ├── supabase.ts           # Storage config
│   │   │   └── redis.ts              # Cache config
│   │   └── utils/
│   │       ├── validators.ts         # Input validation
│   │       └── errorHandlers.ts      # Error handling
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   └── package.json
└── package.json
```

## 📦 Backend Implementation

### Installation & Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Set up environment variables in `.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_uri
MONGODB_DB=memovault

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# AWS S3 (Production)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name

# Redis
REDIS_URL=your_redis_url

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

3. Start the backend server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### API Routes

```typescript
// Capsule Routes
POST   /api/capsules          # Create new capsule
GET    /api/capsules          # List capsules
GET    /api/capsules/:id      # Get capsule
PUT    /api/capsules/:id      # Update capsule
DELETE /api/capsules/:id      # Delete capsule

// User Routes
POST   /api/users             # Create user
GET    /api/users/profile     # Get user profile
PUT    /api/users/profile     # Update profile
GET    /api/users/capsules    # Get user's capsules

// Auth Routes
POST   /api/auth/register     # Register
POST   /api/auth/login        # Login
POST   /api/auth/logout       # Logout
GET    /api/auth/verify       # Verify token
```

### Database Models

```typescript
// User Model
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  profile: {
    bio: string;
    avatar: string;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
      privacy: 'public' | 'private';
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Capsule Model
interface ICapsule {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  content: string;
  mediaUrls: string[];
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    keywords: string[];
  };
  unlockDate: Date;
  status: 'locked' | 'unlocked';
  privacy: 'private' | 'public' | 'shared';
  collaborators: ObjectId[];
  metadata: {
    location?: string;
    tags: string[];
    category: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Storage Integration

```typescript
// Storage Service
class StorageService {
  private supabase: SupabaseClient;
  private s3: AWS.S3;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
  }

  async uploadMedia(file: Buffer, userId: string): Promise<string> {
    if (process.env.NODE_ENV === 'production') {
      return this.uploadToS3(file, userId);
    }
    return this.uploadToSupabase(file, userId);
  }
}
```

## 🎯 Evaluation Metrics Achievement

1. **Impact & Relevance**
   - Personal memory preservation
   - Community story sharing
   - Cultural heritage documentation
   - Emotional context tracking

2. **Innovation & Creativity**
   - AI-powered sentiment analysis
   - Interactive timeline visualization
   - Smart categorization
   - Emotional context preservation

3. **User Experience & Design**
   - Modern, responsive interface
   - Intuitive navigation
   - Smooth animations
   - Accessible design

4. **Security & Privacy**
   - Secure authentication
   - Data encryption
   - Privacy controls
   - User data protection

5. **Scalability**
   - MongoDB sharding and indexing
   - Efficient media storage with Supabase/S3
   - Redis caching for performance
   - Load balancing and CDN integration

## 🛠️ Technical Stack

- **Frontend**
  - Next.js 13
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - TipTap Editor

- **Backend**
  - Next.js API Routes
  - MongoDB Atlas
  - Supabase Storage
  - AWS S3 (Production)
  - Redis Cache

- **AI/ML**
  - Sentiment Analysis API
  - Natural Language Processing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB Atlas for database hosting
- Supabase for storage solutions
- AWS for production infrastructure
- TipTap for the rich text editor
- Framer Motion for smooth animations
- Tailwind CSS for the utility-first CSS framework
