/**
 * Dark Mode Implementation Guide
 * Complete instructions for adding dark mode to remaining components
 */

// 1. IMPORT THEME CONTEXT (Add to all component files)
import { useTheme } from '../context/ThemeContext';

// 2. USE THEME HOOK (Add inside component function)
const { theme } = useTheme();

// 3. COMMON STYLING PATTERNS

// Background Patterns
const backgroundStyles = {
   main: `${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`,
   secondary: `${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`,
   card: `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`,
   input: `${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`,
   sidebar: `${theme === 'dark' ? 'bg-gray-900' : 'bg-zinc-100'}`,
};

// Text Patterns
const textStyles = {
   primary: `${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`,
   secondary: `${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`,
   muted: `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`,
   accent: `${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`,
   danger: `${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`,
   success: `${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`,
};

// Border Patterns
const borderStyles = {
   default: `${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`,
   light: `${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`,
   strong: `${theme === 'dark' ? 'border-gray-500' : 'border-gray-400'}`,
};

// Interactive Elements
const interactiveStyles = {
   hover: `${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`,
   button: `${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}`,
   focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500',
};

// Message Styles
const messageStyles = {
   success: `${theme === 'dark' ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200'}`,
   error: `${theme === 'dark' ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200'}`,
   info: `${theme === 'dark' ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200'}`,
};

// 4. COMPONENTS TO UPDATE (Priority Order)

const componentsToUpdate = [
   // High Priority (User-facing)
   'CreateOrder.jsx',
   'Products.jsx',
   'Suppliers.jsx',
   'StockReport.jsx',
   'UserProfile.jsx',

   // Medium Priority (Forms & Profiles)
   'EditProfile.jsx',
   'EditProduct.jsx',
   'EditSupplier.jsx',
   'ProductProfile.jsx',
   'SupplierProfile.jsx',

   // Low Priority (Auth & Misc)
   'Login.jsx',
   'Register.jsx',
   'WrongRoute.jsx'
];

// 5. IMPLEMENTATION STEPS FOR EACH COMPONENT

/**
 * Step 1: Add theme import and hook
 * Step 2: Update main container background
 * Step 3: Update card/section backgrounds  
 * Step 4: Update text colors
 * Step 5: Update borders and interactive elements
 * Step 6: Update form elements (inputs, buttons)
 * Step 7: Update message/feedback elements
 * Step 8: Test theme switching
 */

// 6. EXAMPLE IMPLEMENTATIONS

// Form Container Example
const formContainer = `
<div className={\`max-w-[500px] w-screen min-h-screen mx-auto p-4 transition-colors duration-200 \${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}\`}>
`;

// Card Section Example  
const cardSection = `
<section className={\`rounded-lg shadow-md p-4 mb-4 transition-colors duration-200 \${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}\`}>
`;

// Input Field Example
const inputField = `
<input className={\`w-full p-3 rounded-lg border transition-colors duration-200 \${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}\`} />
`;

// Button Example
const button = `
<button className={\`px-4 py-2 rounded-lg transition-colors duration-200 \${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white\`}>
`;

export {
   backgroundStyles,
   textStyles,
   borderStyles,
   interactiveStyles,
   messageStyles,
   componentsToUpdate
};
