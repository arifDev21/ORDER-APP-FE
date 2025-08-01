# Simple Orders App - Frontend

A modern Next.js frontend application for managing orders and products with authentication.

## 🚀 Features

- **Authentication System**
  - Login with email and password
  - Token-based authentication
  - Protected routes
  - Automatic token management

- **Product Management**
  - View all available products
  - Display product details (name, price, stock)
  - Responsive product grid layout

- **Order Management**
  - Create new orders with multiple products
  - Dynamic order form with add/remove items
  - Real-time order total calculation
  - Order history with detailed view

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Loading states and error handling
  - Form validation with Zod
  - Beautiful icons with Lucide React

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Containerization**: Docker

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── login/             # Login page
│   ├── products/          # Products listing page
│   └── orders/            # Orders pages
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── store/                # Zustand stores
├── services/             # API services
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── hooks/                # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simple-order-app-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:3001](http://localhost:3001)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔐 Authentication

The application uses token-based authentication:

1. Users login with email and password
2. JWT token is stored in localStorage
3. Token is automatically included in API requests
4. Protected routes redirect to login if not authenticated
5. Token is cleared on logout or expiration

## 🎨 UI Components

### Reusable Components
- `Button` - Versatile button with loading states
- `Input` - Form input with validation support
- `Card` - Content container with optional title
- `Header` - Navigation header with user menu

### Form Components
- `LoginForm` - Authentication form with validation
- `OrderForm` - Dynamic order creation form

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` |

### API Endpoints

The frontend expects the following API endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `GET /api/products` - Get all products
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

## 🐛 Error Handling

The application includes comprehensive error handling:

- Form validation errors
- API request errors
- Network connectivity issues
- Authentication errors
- Loading states for better UX

## 🧪 Testing

To run tests (when implemented):
```bash
npm run test
```

## 📦 Build for Production

```bash
npm run build
npm run start
```

## 🐳 Docker

### Build Image
```bash
docker build -t simple-orders-frontend .
```

### Run Container
```bash
docker run -p 3000:3000 simple-orders-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
