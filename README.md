# OrderSathi Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios">
</div>

OrderSathi is a frontend web app for shopkeepers and small businesses to manage suppliers, products, orders, and stock reports from one dashboard. It is built with React + Vite and connects to the OrderSathi backend API.

## Features

- OTP-based login and registration flow
- Dashboard with business metrics and chart-based insights
- Supplier management with create, update, view, and delete workflows
- Product management with supplier linking and profile pages
- Order creation with automatic totals and history tracking
- Stock report generation and downloadable PDF workflows
- Dark/light theme support and responsive UI across devices

## Tech Stack

| Technology       | Version   | Use                    |
| ---------------- | --------- | ---------------------- |
| React            | ^19.1.0   | UI framework           |
| Vite             | ^7.0.4    | Build and dev server   |
| Tailwind CSS     | ^3.4.17   | Utility-first styling  |
| React Router DOM | ^7.6.3    | Routing                |
| Axios            | ^1.10.0   | API client             |
| Recharts         | ^3.1.2    | Charts and analytics   |
| Framer Motion    | ^12.23.12 | Motion and transitions |

## Project Structure

```text
ordersathi/
|-- public/
|-- src/
|   |-- api/
|   |   `-- axiosInstance.js
|   |-- assets/
|   |-- components/
|   |   |-- CustomAlert.jsx
|   |   |-- Layout.jsx
|   |   |-- NavHeader.jsx
|   |   |-- Popup.jsx
|   |   |-- ProductCard.jsx
|   |   |-- ProtectedRoute.jsx
|   |   |-- Search.jsx
|   |   `-- SupplierCard.jsx
|   |-- context/
|   |   |-- AuthContext.jsx
|   |   |-- OrderContext.jsx
|   |   |-- ProductContext.jsx
|   |   |-- StatsContext.jsx
|   |   |-- StockReport.jsx
|   |   |-- SupplierContext.jsx
|   |   `-- ThemeContext.jsx
|   |-- pages/
|   |   |-- Charts.jsx
|   |   |-- CreateOrder.jsx
|   |   |-- CreateProduct.jsx
|   |   |-- CreateSupplier.jsx
|   |   |-- Dashboard.jsx
|   |   |-- EditProduct.jsx
|   |   |-- EditProfile.jsx
|   |   |-- EditSupplier.jsx
|   |   |-- HIstory.jsx
|   |   |-- HistoryDetail.jsx
|   |   |-- Login.jsx
|   |   |-- NavBar.jsx
|   |   |-- ProductProfile.jsx
|   |   |-- Products.jsx
|   |   |-- Register.jsx
|   |   |-- StockReport.jsx
|   |   |-- SupplierProfile.jsx
|   |   |-- Suppliers.jsx
|   |   |-- UserProfile.jsx
|   |   `-- WrongRoute.jsx
|   |-- utils/
|   |   `-- darkModeGuide.js
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- eslint.config.js
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vercel.json
`-- vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm or yarn

### Install

```bash
git clone https://github.com/igtaposh/ordersathi.git
cd ordersathi/ordersathi
npm install
```

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=https://ordersathi.onrender.com/api
# Local backend example:
# VITE_API_BASE_URL=http://localhost:4000/api
```

### Run Locally

```bash
npm run dev
```

Frontend will run at `http://localhost:5173` by default.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Deployment

The app is configured for Vercel via `vercel.json`.

```bash
npm run build
```

Deploy the generated `dist` folder, or connect the repository directly to Vercel.

## Backend Pairing

This repository folder contains the frontend only. It expects a running OrderSathi backend API for authentication, orders, products, suppliers, and stock reports.

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push your branch and open a pull request.

## License

MIT License.

## Author

Taposh Debnath (igtaposh)

- GitHub: https://github.com/igtaposh
- Email: debnathtaposh58@gmail.com

## Support

- Open an issue: https://github.com/igtaposh/ordersathi/issues
- Live app: https://ordersathi.vercel.app
