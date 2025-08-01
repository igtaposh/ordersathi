# 🛒 OrderSathi - Shopkeeper Order Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios">
</div>

---

**OrderSathi** is a comprehensive full-stack web application designed specifically for shopkeepers and small businesses to streamline their operations. It provides an intuitive platform for managing suppliers, products, orders, and generating detailed reports with ease.

## ✨ Key Features

### 🔐 **Authentication & Security**
- **OTP-based Registration/Login** with secure verification
- **JWT Authentication** with cookie-based sessions
- **User Profile Management** with account settings
- **Secure logout** and session management

### 👥 **Supplier Management**
- ➕ Add new suppliers with contact details
- 📝 Update supplier information and profiles
- 🗑️ Delete suppliers with confirmation
- 📋 View all suppliers in organized lists
- 🔍 Search and filter suppliers

### 📦 **Product Management**
- 🆕 Add products linked to specific suppliers
- 📊 Track product details (weight, rate, MRP, type)
- ✏️ Edit product information and profiles
- 🗂️ Categorize products by type
- 🔍 Search and filter products
- 📱 Product profiles with detailed information

### 📋 **Order Management**
- 🛒 Create detailed orders with multiple products
- 💰 Automatic calculation of total amount and weight
- 📄 Generate PDF documents for orders (shopkeeper & supplier versions)
- 📈 View order history and details
- 📱 Mobile-responsive order creation interface

### 📊 **Stock Reports**
- 📝 Create comprehensive stock reports
- 📄 Generate professional PDF stock reports
- 📅 Track stock report history
- 📊 View recent stock reports
- 💾 Download reports for offline access

### 📈 **Analytics & Dashboard**
- 📊 Monthly order summaries and statistics
- 🏆 Top-selling products analysis
- 🥇 Top suppliers by order volume
- 📅 Recent orders tracking
- 📈 Business insights and trends
- 📱 Interactive dashboard with stats

### 🎨 **User Experience**
- 🌙 **Dark/Light Mode** toggle for comfortable viewing
- 📱 **Fully Responsive** design for all devices
- ⚡ **Fast Performance** with Vite and React optimization
- 🎯 **Intuitive Navigation** with clean UI/UX
- 🔄 **Real-time Updates** and loading states
- 📋 **Form Validation** and error handling

## 🛠️ Tech Stack

### **Frontend Technologies**
| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | UI Framework | ^19.1.0 |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool | ^7.0.4 |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Styling Framework | ^3.4.17 |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) | Client-side Routing | ^7.6.3 |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | HTTP Client | ^1.10.0 |
| ![React Icons](https://img.shields.io/badge/React_Icons-E10098?style=flat&logo=react&logoColor=white) | Icon Library | ^5.5.0 |

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Frontend Project Structure

```
ordersathi/
├── public/                    # Static assets
├── src/
│   ├── api/                  # API configuration
│   │   └── axiosInstance.js       # Axios setup with interceptors
│   ├── assets/               # Images and static files
│   │   └── logo.png              # App logo
│   ├── components/           # Reusable components
│   │   ├── Layout.jsx            # Main app layout
│   │   ├── NavHeader.jsx         # Navigation header
│   │   ├── Orders.jsx            # Order history component
│   │   ├── ProtectedRoute.jsx    # Route protection
│   │   ├── SideNave.jsx          # Side navigation
│   │   ├── StatsTable.jsx        # Statistics table
│   │   └── Stocks.jsx            # Stock management
│   ├── context/              # React Context providers
│   │   ├── AuthContext.jsx       # Authentication state
│   │   ├── OrderContext.jsx      # Order state management
│   │   ├── ProductContext.jsx    # Product state management
│   │   ├── Stats.jsx             # Statistics context
│   │   ├── StockReport.jsx       # Stock report context
│   │   ├── SupplierContext.jsx   # Supplier state management
│   │   └── ThemeContext.jsx      # Dark/Light mode context
│   ├── pages/                # Application pages
│   │   ├── About.jsx             # Application information
│   │   ├── CreateOrder.jsx       # Order creation form
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── EditProduct.jsx       # Product editing
│   │   ├── EditProfile.jsx       # User profile editing
│   │   ├── EditSupplier.jsx      # Supplier editing
│   │   ├── HIstory.jsx           # Order history page
│   │   ├── Login.jsx             # User login
│   │   ├── ProductProfile.jsx    # Product details
│   │   ├── Products.jsx          # Product management
│   │   ├── Register.jsx          # User registration
│   │   ├── StockReport.jsx       # Stock reporting
│   │   ├── SupplierProfile.jsx   # Supplier details
│   │   ├── Suppliers.jsx         # Supplier management
│   │   ├── UserProfile.jsx       # User profile
│   │   └── WrongRoute.jsx        # 404 page
│   ├── utils/                # Utility functions
│   │   └── darkModeGuide.js      # Theme implementation guide
│   ├── App.jsx               # Main app component with routing
│   ├── index.css             # Global styles
│   └── main.jsx              # App entry point
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── vite.config.js            # Vite configuration
└── vercel.json               # Vercel deployment config
```

## 🚀 Getting Started

### 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/igtaposh/ordersathi.git
   cd ordersathi/ordersathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_BASE_URL=https://ordersathi.onrender.com/api
   # or for local development
   # VITE_API_BASE_URL=http://localhost:4000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - The app will automatically open in your default browser

## 📱 Usage Guide

### 1. **Getting Started**
- Register with your phone number
- Verify OTP sent to your mobile
- Complete your shop profile setup

### 2. **Managing Suppliers**
- Navigate to Suppliers page
- Add suppliers with contact information
- Edit or delete supplier details
- View supplier profiles and associated products

### 3. **Product Management**
- Go to Products page
- Add products linked to specific suppliers
- Set pricing (rate, MRP) and product details
- Categorize products by type
- Search and filter products

### 4. **Creating Orders**
- Use "Create Order" feature
- Select supplier and products
- Specify quantities for each product
- Review total amount and weight
- Generate PDF invoices instantly

### 5. **Stock Reports**
- Create detailed stock reports
- Generate professional PDF reports
- Track inventory levels
- Download reports for offline access

### 6. **Dashboard & Analytics**
- View monthly business summaries
- Monitor top-performing products
- Track supplier performance
- Access recent orders and reports

### 7. **Customization**
- Toggle between dark and light modes
- Update your profile information
- Manage account settings

## 🔧 Development

### **Available Scripts**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### **Building for Production**

```bash
# Create optimized production build
npm run build

# The build files will be in the 'dist' folder
# Deploy the 'dist' folder to your hosting service
```

## 🌟 Key Features in Detail

### **Responsive Design**
- Optimized for mobile, tablet, and desktop
- Touch-friendly interface for mobile users
- Consistent experience across all devices

### **Dark/Light Mode**
- System preference detection
- Manual toggle option
- Persistent theme selection
- Smooth transitions between modes

### **Performance Optimizations**
- Lazy loading for non-critical components
- Optimized images and assets
- Fast loading with Vite's HMR
- Efficient state management with Context API

### **User Experience**
- Intuitive navigation and workflows
- Real-time feedback and loading states
- Error handling with user-friendly messages
- Form validation and data integrity

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Taposh Debnath (igtaposh)**
- GitHub: [@igtaposh](https://github.com/igtaposh)
- Email: debnathtaposh58@gmail.com
- Phone: +91 9593197988

## 🙏 Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the React, Vite, and Tailwind CSS communities
- Inspired by the needs of small business owners and shopkeepers

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/igtaposh/ordersathi/issues) page
2. Create a new issue with detailed information
3. Contact the developer at debnathtaposh58@gmail.com

---

<div align="center">
  <p>Made with ❤️ for shopkeepers and small businesses everywhere</p>
  <p>⭐ Star this repo if you find it helpful!</p>
  <p><strong>Live Demo:</strong> <a href="https://ordersathi.vercel.app">OrderSathi App</a></p>
</div>
