# 🛒 OrderSathi - Shopkeeper Order Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios">
  <img src="https://img.shields.io/badge/React_Icons-E10098?style=for-the-badge&logo=react-icons&logoColor=white" alt="React Icons">
</div>

---

**OrderSathi** is a comprehensive full-stack web application designed for shopkeepers and small businesses to streamline their operations. The app now features a highly optimized, modern user interface with professional-grade form designs, enhanced icons, and typography that reflects a large-scale professional solution.

## ✨ Key Features

### 🔐 **Authentication & Security**

- **OTP-based Registration/Login** with secure verification
- **JWT Authentication** with cookie-based sessions
- **User Profile Management** with account settings
- **Secure logout** and session management

### 👥 **Supplier Management**

- ➕ Add new suppliers with contact details
- 📝 Update supplier information and profiles
- 🗑️ Delete suppliers with confirmation dialogs
- 📋 Organized list views featuring smooth, animated dropdowns
- 🔍 Advanced search and filter capabilities

### 📦 **Product Management**

- 🆕 Add or edit products linked to suppliers with real-time validations
- 📊 Maintain product details including dynamic weight conversion, rate, and MRP fields
- ✏️ Modern editing interface using optimized form components with intuitive icons and professional fonts
- 🗂️ Categorize products by type with custom dropdown animations
- 🔍 Robust search and filtering system
- 📱 Detailed product profiles with visually appealing layouts

### 📋 **Order Management**

- 🛒 Create detailed orders with multiple products using a newly optimized, professional-looking form interface
- 💰 Automatic calculation of total amount and weight with real-time feedback
- 📄 Generate PDF invoices instantly (shopkeeper & supplier versions)
- 📈 View comprehensive order history and detailed summaries
- 📱 Fully responsive order creation interface

### 📊 **Stock Reports & Analytics**

- 📝 Create comprehensive stock reports with a professional presentation
- 📄 Generate and download detailed PDF stock reports
- 📈 Interactive dashboard with business insights, order summaries, and trend analysis
- 💾 Offline report downloads for flexible inventory management

### 🎨 **User Experience & Design**

- 🌙 **Dark/Light Mode** toggle with smooth animated transitions
- 📱 **Fully Responsive Design** optimized for mobile, tablet, and desktop
- ⚡ **Fast Performance** using Vite and React optimizations
- 🎯 **Intuitive Navigation** featuring minimalistic icons, improved typography, and state-of-the-art form components
- 🔄 **Real-time Feedback & Validation** with modern loaders and error displays

## 🛠️ Tech Stack

### **Frontend Technologies**

| Technology                                                                                                     | Purpose             | Version |
| -------------------------------------------------------------------------------------------------------------- | ------------------- | ------- |
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)                     | UI Framework        | ^19.1.0 |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                         | Build Tool          | ^7.0.4  |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Styling Framework   | ^3.4.17 |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) | Client-side Routing | ^7.6.3  |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)                      | HTTP Client         | ^1.10.0 |
| ![React Icons](https://img.shields.io/badge/React_Icons-E10098?style=flat&logo=react-icons&logoColor=white)    | Icon Library        | ^5.5.0  |

### **Development Tools**

- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS pre-processing
- **Autoprefixer** - Automatic vendor prefixing

## 📁 Frontend Project Structure

```
ordersathi/
├── public/                     # Static assets
├── src/
│   ├── api/                    # API configuration
│   │   └── axiosInstance.js    # Axios setup with interceptors
│   ├── assets/                 # Images and static files
│   │   └── logo.png            # App logo
│   ├── components/             # Reusable components
│   │   ├── Layout.jsx          # Main app layout
│   │   ├── NavHeader.jsx       # Navigation header
│   │   ├── Orders.jsx          # Order history component
│   │   ├── ProtectedRoute.jsx  # Route protection
│   │   ├── SideNav.jsx         # Side navigation
│   │   ├── StatsTable.jsx      # Statistics table
│   │   └── Stocks.jsx          # Stock management
│   ├── context/                # React Context providers
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── OrderContext.jsx    # Order state management
│   │   ├── ProductContext.jsx  # Product state management
│   │   ├── Stats.jsx           # Statistics context
│   │   ├── StockReport.jsx     # Stock report context
│   │   ├── SupplierContext.jsx # Supplier state management
│   │   └── ThemeContext.jsx    # Dark/Light mode context
│   ├── pages/                  # Application pages
│   │   ├── About.jsx           # Application information
│   │   ├── CreateOrder.jsx     # Order creation form
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── EditProduct.jsx     # Product editing page
│   │   ├── EditProfile.jsx     # User profile editing page
│   │   ├── EditSupplier.jsx    # Supplier editing page
│   │   ├── History.jsx         # Order history page
│   │   ├── Login.jsx           # User login page
│   │   ├── ProductProfile.jsx  # Product details page
│   │   ├── Products.jsx        # Product management page
│   │   ├── Register.jsx        # User registration page
│   │   ├── StockReport.jsx     # Stock reporting page
│   │   ├── SupplierProfile.jsx # Supplier details page
│   │   ├── Suppliers.jsx       # Supplier management page
│   │   ├── UserProfile.jsx     # User profile page
│   │   └── WrongRoute.jsx      # 404 page
│   ├── utils/                  # Utility functions
│   │   └── darkModeGuide.js    # Theme implementation guide
│   ├── App.jsx                 # Main app component with routing
│   ├── index.css               # Global styles
│   └── main.jsx                # App entry point
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── vercel.json                 # Vercel deployment config
```

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js (v16 or higher)** – [Download here](https://nodejs.org/)
- **npm** or **yarn** – Comes with Node.js
- **Git** – [Download here](https://git-scm.com/)

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
   # For local development, you can use:
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

### 1. **Onboarding**

- Seamless registration with OTP verification
- Quick profile setup with modern form designs that convey a professional look

### 2. **Supplier & Product Management**

- Easily add, update, and delete supplier information using contemporary, animated dropdowns and button icons
- Manage products with detailed, dynamic fields and real-time validations

### 3. **Order Creation**

- Create multiple product orders effortlessly with a smooth, optimized form interface
- Enjoy instant feedback on totals and weights with automatic calculations and modern loaders

### 4. **Reports & Analytics**

- Generate professional PDF reports for stock and orders
- Access interactive, data-rich dashboards with company-grade insights

### 5. **Customization & UX**

- Toggle between dark and light modes with smooth transitions
- Experience a fully polished interface featuring enhanced icons, font improvements, and intuitive navigation

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

### **Production Build & Deployment**

```bash
# Create an optimized production build
npm run build

# The build files will be in the 'dist' folder
# Deploy the 'dist' folder to your hosting service
```

## 🌟 Key UI & Design Updates

- **Optimized Forms:** Enhanced layouts, professional font choices, and intuitive component spacing.
- **Iconography:** Updated icons (e.g., discard and save actions now use meaningful icons) for a clear visual hierarchy.
- **Animations:** Smooth transitions and animated dropdowns for a modern, corporate look.
- **Theming:** Robust dark/light mode support with consistent styling across the app.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Taposh Debnath (igtaposh)**

- GitHub: [@igtaposh](https://github.com/igtaposh)
- Email: debnathtaposh58@gmail.com
- Phone: +91 9593197988

## 🙏 Acknowledgments

- Thanks to the open-source libraries—including React, Vite, and Tailwind CSS—that made this project possible.
- Special recognition goes to the communities driving innovation in web development.

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/igtaposh/ordersathi/issues) page.
2. Open a new issue with detailed information.
3. Contact the developer at debnathtaposh58@gmail.com.

---

<div align="center">
  <p>Made with ❤️ for shopkeepers and small businesses everywhere</p>
  <p>⭐ Star this repo if you find it helpful!</p>
  <p><strong>Live Demo:</strong> <a href="https://ordersathi.vercel.app">OrderSathi App</a></p>
</div>
