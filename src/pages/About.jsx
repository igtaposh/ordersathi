import React from 'react'
import { useTheme } from '../context/ThemeContext';

/**
 * About Component - Application Information Page
 * Displays comprehensive information about OrderSathi including features, usage, and contact details
 * Serves as a help and information center for users
 * @returns {JSX.Element} About component
 */
function About() {
  const { theme } = useTheme();

  /**
   * Application metadata and information
   */
  const appInfo = {
    name: 'OrderSathi',
    version: '1.0.0',
    releaseDate: 'July 2025',
    developer: {
      email: 'debnathtaposh58@gmail.com',
      phone: '+91 9593197988'
    }
  };

  /**
   * Feature sections data for better maintainability
   */
  const sections = [
    {
      id: 'why',
      title: 'Why this app?',
      icon: '🎯',
      items: [
        'To make order creation and management easy for shopkeepers and suppliers.',
        'To reduce manual paperwork and calculation errors.',
        'To generate professional PDF reports instantly.',
        'To keep your order and stock data organized and accessible from anywhere.'
      ]
    },
    {
      id: 'uses',
      title: 'Main Uses',
      icon: '📋',
      items: [
        'Create and manage orders for your shop or business.',
        'Download order and stock reports as PDF.',
        'Track suppliers and products easily.',
        'Maintain digital records of your transactions.'
      ]
    },
    {
      id: 'tips',
      title: 'Tips for Best Use',
      icon: '💡',
      items: [
        'Keep your supplier and product list updated for smooth order creation.',
        'Use the PDF download feature to share orders and stock reports with others.',
        'Regularly update your stock for accurate reporting.',
        'Use the app on desktop or mobile for flexibility.'
      ]
    }
  ];

  /**
   * Step-by-step workflow for new users
   */
  const workflowSteps = [
    'Register and log in to your account.',
    'Add your suppliers and products.',
    'Create orders by selecting products and quantities.',
    'Download or share PDF reports instantly.',
    'Manage your stock and view reports anytime.'
  ];

  return (
    <div className={`max-w-[500px] w-screen min-h-screen mx-auto p-4 flex flex-col items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-neutral-200'}`}>
      {/* Application Header */}
      <header className='text-center mb-6 mt-4'>
        <h1 className={`text-3xl font-bold mb-4 flex items-center justify-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-900'}`}>
          📦 About {appInfo.name}
        </h1>
        <p className={`mb-4 text-center leading-relaxed px-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <span className={`font-semibold ${theme === 'dark' ? 'text-orange-300' : 'text-orange-800'}`}>{appInfo.name}</span> is a simple, fast, and free order & stock management app designed for shopkeepers, suppliers, and small businesses.
        </p>
      </header>

      {/* Feature Sections */}
      {sections.map((section) => (
        <section
          key={section.id}
          className={`w-full rounded-xl shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          aria-labelledby={`${section.id}-heading`}
        >
          <h2
            id={`${section.id}-heading`}
            className={`text-lg font-semibold mb-3 flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-800'}`}
          >
            <span role="img" aria-label={section.title}>{section.icon}</span>
            {section.title}
          </h2>
          <ul className={`list-disc ml-6 text-sm space-y-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} role="list">
            {section.items.map((item, index) => (
              <li key={index} className='leading-relaxed'>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      {/* How It Works Section */}
      <section
        className={`w-full rounded-xl shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        aria-labelledby="workflow-heading"
      >
        <h2
          id="workflow-heading"
          className={`text-lg font-semibold mb-3 flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-800'}`}
        >
          <span role="img" aria-label="How it works">⚙️</span>
          How does it work?
        </h2>
        <ol className={`list-decimal ml-6 text-sm space-y-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} role="list">
          {workflowSteps.map((step, index) => (
            <li key={index} className='leading-relaxed'>
              <span className='font-medium'>Step {index + 1}:</span> {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Pricing Section */}
      <section
        className={`w-full rounded-xl shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg border ${theme === 'dark'
          ? 'bg-gradient-to-r from-green-900 to-blue-900 border-green-700'
          : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
          }`}
        aria-labelledby="pricing-heading"
      >
        <h2
          id="pricing-heading"
          className={`text-lg font-semibold mb-3 flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-800'}`}
        >
          <span role="img" aria-label="Free">💰</span>
          Is it free?
        </h2>
        <div className={`rounded-lg p-4 border transition-colors duration-200 ${theme === 'dark'
          ? 'bg-gray-800 border-green-600'
          : 'bg-white border-green-300'
          }`}>
          <p className={`text-sm leading-relaxed transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className={`font-bold text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Yes!</span> {appInfo.name} is completely free to use for all users. There are no hidden charges, subscriptions, or premium features. We believe in providing accessible tools for small businesses.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className={`w-full rounded-xl shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        aria-labelledby="contact-heading"
      >
        <h2
          id="contact-heading"
          className={`text-lg font-semibold mb-3 flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-800'}`}
        >
          <span role="img" aria-label="Contact">📞</span>
          Developer Contact
        </h2>
        <p className={`text-sm mb-3 leading-relaxed transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          For any feedback, support, or suggestions, feel free to contact:
        </p>
        <div className={`rounded-lg p-4 border transition-colors duration-200 ${theme === 'dark'
          ? 'bg-gray-700 border-gray-600'
          : 'bg-gray-50 border-gray-200'
          }`}>
          <ul className={`text-sm space-y-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} role="list">
            <li className='flex items-center gap-2'>
              <span role="img" aria-label="Email">📧</span>
              <span className='font-medium'>Email:</span>
              <a
                href={`mailto:${appInfo.developer.email}`}
                className={`underline transition-colors duration-200 ${theme === 'dark'
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-800'
                  }`}
                aria-label={`Send email to ${appInfo.developer.email}`}
              >
                {appInfo.developer.email}
              </a>
            </li>
            <li className='flex items-center gap-2'>
              <span role="img" aria-label="Phone">📱</span>
              <span className='font-medium'>Phone:</span>
              <a
                href={`tel:${appInfo.developer.phone}`}
                className={`underline transition-colors duration-200 ${theme === 'dark'
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-800'
                  }`}
                aria-label={`Call ${appInfo.developer.phone}`}
              >
                {appInfo.developer.phone}
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Version Information */}
      <section
        className={`w-full rounded-xl shadow-md p-6 mb-10 transition-all duration-200 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        aria-labelledby="version-heading"
      >
        <h2
          id="version-heading"
          className={`text-lg font-semibold mb-3 flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-800'}`}
        >
          <span role="img" aria-label="Version">🏷️</span>
          App Version
        </h2>
        <div className={`rounded-lg p-4 border transition-colors duration-200 ${theme === 'dark'
          ? 'bg-orange-900 border-orange-700'
          : 'bg-orange-50 border-orange-200'
          }`}>
          <p className={`text-sm font-medium transition-colors duration-200 ${theme === 'dark' ? 'text-orange-200' : 'text-gray-700'}`}>
            {appInfo.name} v{appInfo.version} ({appInfo.releaseDate})
          </p>
          <p className={`text-xs mt-1 transition-colors duration-200 ${theme === 'dark' ? 'text-orange-300' : 'text-gray-600'}`}>
            Latest stable release with all features optimized for production use.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className='text-center pb-4'>
        <p className={`text-xs transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          © 2025 {appInfo.name}. Made with ❤️ for small businesses.
        </p>
      </footer>
    </div>
  )
}

export default About