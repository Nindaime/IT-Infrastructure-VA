<!--
[PROMPT_SUGGESTION]Based on the project structure, generate JSDoc comments for all the methods in the `src/stores/auth.js` file to improve code documentation.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Create a new file `CONTRIBUTING.md` with detailed guidelines for contributors, including code style, commit message formats, and the pull request process.[/PROMPT_SUGGESTION]
-->

# IT Infrastructure Vulnerability Assessment (ITIVA) - Frontend

!Vue.js
!Pinia
!Tailwind CSS
!Vite
[!License: MIT](https://opensource.org/licenses/MIT)

<!-- Add other badges like build status, coverage, etc.
[![Build Status](...
-->

A comprehensive Vue.js 3 application designed to streamline the process of conducting IT infrastructure vulnerability assessments. This tool provides a rich, interactive user experience with advanced features including draft management, secure user authentication, and the generation of detailed, downloadable PDF reports.

---

## 📖 Table of Contents

- 🎯 Project Aim & Objectives
- ✨ Key Features
- 🛠️ Technology Stack
- 📁 Project Structure
- 🚀 Getting Started
- 📋 Usage Guide
  - For End-Users
  - For Admins & Developers
- 🔄 State Management with Pinia
- 🔧 Configuration
- 🧪 Testing
- 🔒 Security
- ♿ Accessibility
- 🚀 Performance
- 📈 Future Enhancements
- 🤝 Contributing
- 📄 License
- 🆘 Support

---

## 🎯 Project Aim & Objectives

The primary goal of the ITIVA Frontend is to provide an intuitive, reliable, and efficient tool for cybersecurity professionals, IT administrators, and consultants to assess vulnerabilities in IT infrastructures.

### Key Objectives:

- **Simplify Assessment:** To offer a structured, multi-phase questionnaire that guides users through a comprehensive assessment process.
- **Ensure Data Integrity:** To reliably save user progress and assessment data, preventing data loss through features like auto-save and draft management.
- **Deliver Actionable Insights:** To generate clear, detailed, and professional reports that not only highlight vulnerabilities but also provide actionable recommendations.
- **Promote User Accessibility:** To build a user-centric application that is accessible to all users, adhering to WCAG 2.1 AA standards.
- **Maintain High Performance:** To ensure a fast, responsive, and seamless user experience across all devices.
- **Foster Maintainability:** To develop a clean, well-documented, and scalable codebase that is easy for developers to maintain and extend.

---

## ✨ Key Features

### Core Functionality

- **Multi-Phase Assessment System**: A complete workflow that breaks down the vulnerability assessment into manageable phases and sections.
- **Dynamic Questionnaires**: Loads assessment questions from a structured data source.
- **User Authentication**: Secure user registration and login system with persistent sessions using `localStorage`.
- **Draft Management**: Automatically saves progress, allowing users to pause and resume assessments at any time.
- **Comprehensive PDF Reporting**: Generates detailed, downloadable PDF reports of completed assessments using `jsPDF`.
- **Progress Tracking**: Visual progress bars and completion indicators to guide the user.

### User Experience (UX)

- **Responsive & Mobile-First Design**: A fully responsive interface that works seamlessly on desktop, tablet, and mobile devices.
- **Intuitive Navigation**: Full keyboard navigation support, including shortcuts, for enhanced productivity.
- **Navigation Guards**: Protects users from accidentally losing unsaved changes when navigating away.
- **Toast Notifications**: A non-intrusive, user-friendly feedback system for actions, successes, and errors.
- **Loading Skeletons & Spinners**: Clear visual feedback for all asynchronous operations, ensuring a smooth experience.

### Admin & Developer Features

- **System Testing Panel**: An integrated dashboard for developers to run a suite of validation tests on core application functionalities (stores, routing, etc.).
- **Centralized Error Handling**: A robust error handling utility that catches, logs, and displays user-friendly messages for application-wide errors.
- **Modular Store Architecture**: Cleanly separated state management using Pinia for authentication, assessments, reports, and questionnaires.

---

## 🛠️ Technology Stack

This project is built with a modern, performant, and maintainable technology stack.

- **Frontend Framework**: Vue.js 3 (using Composition API and `<script setup>`)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Build Tool**: Vite
- **Code Quality**: ESLint with @vue/eslint-config-prettier
- **Package Manager**: npm

---

## 📁 Project Structure

The project follows a standard Vue.js application structure, organized for scalability and maintainability.

```
itiva-frontend/ -
├── src/
├── public/                   # Static assets (favicon, etc.)
├── src/ │
├── api/ -│
│ └── mockData.js             # Mock questionnaire data
│ │ └── mockData.js           # Mock data for questionnaires
│ ├── assets/                 # CSS, fonts, and other static assets
│ ├── components/ -
│ │ ├── admin/                # Admin components
│ │ ├── admin/                # Components for the admin dashboard
│ │ ├── icons/                # Icon components
│ │ ├── AppHeader.vue         # Main header component
│ │ ├── AppFooter.vue         # Footer component
│ │ ├── AppHeader.vue         # Global application header
│ │ ├── AppFooter.vue         # Global application footer
│ │ ├── DraftSaveModal.vue    # Draft save modal
│ │ ├── SystemTestPanel.vue   # System testing panel
│ │ └── ToastNotification.vue # Toast notification system
│ │ ├── SystemTestPanel.vue   # Developer/Admin testing panel
│ │ └── ToastNotification.vue # System for displaying toast messages
│ ├── stores/
│ │ ├── auth.js               # User authentication store
│ │ ├── assessment.js         # Assessment management store
│ │ ├── questionnaires.js     # Questionnaire data store
│ │ └── reports.js            # Reports management store
│ │ ├── auth.js               # Pinia store for user authentication & session
│ │ ├── assessment.js         # Pinia store for managing the active assessment
│ │ ├── questionnaires.js     # Pinia store for loading and managing questionnaire data
│ │ └── reports.js            # Pinia store for managing completed reports
│ ├── utils/
│ │ ├── errorHandler.js       # Error handling utilities
│ │ ├── testUtils.js          # Testing utilities
│ │ ├── toast.js              # Toast notification utilities
│ │ └── reportGenerator.js    # Report generation utilities
│ │ └── reportGenerator.js    # Logic for generating PDF reports with jsPDF
│ ├── views/
│ │ ├── admin/                # Admin views
│ │ ├── HomePage.vue          # Landing page
│ │ ├── LoginPage.vue         # User authentication
│ │ ├── DashboardPage.vue     # Main dashboard
│ │ ├── QuestionnairePage.vue # Assessment interface
│ │ ├── ReportViewerPage.vue  # Report display
│ │ └── LinkAccountsPage.vue  # Account linking
│ ├── router/
│ │ └── index.js              # Application routing
│ │ └── index.js              # Vue Router configuration and navigation guards
│ ├── App.vue                 # Root component
│ └── main.js                 # Application entry point
├── public/                   # Static assets
├── .env.example              # Example environment variables
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS theme and plugin configuration
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd itiva-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📋 Usage Guide

### For Users

1. **Registration/Login**

   - Navigate to the login page
   - Register a new account or login with existing credentials
   - User data is persisted locally

2. **Starting an Assessment**

   - From the dashboard, click "Start New Assessment"
   - Choose assessment type
   - Answer questions with detailed explanations
   - Progress is automatically saved

3. **Managing Drafts**

   - Drafts are automatically created when starting assessments
   - Use "Continue Draft" to resume incomplete assessments
   - Drafts can be saved, discarded, or completed

4. **Viewing Reports**
   - Completed assessments generate detailed reports
   - View scores, recommendations, and improvement areas
   - Reports are stored locally and can be accessed anytime

### For Admins & Developers

1. **System Testing**

   - Access the System Test Panel from the dashboard
   - Run comprehensive tests to validate functionality
   - View detailed test results and error reports

2. **Error Handling**

   - All operations include comprehensive error handling
   - Errors are logged with context and user-friendly messages
   - Toast notifications provide immediate feedback

3. **State Management**
   - Pinia stores manage application state
   - All stores include validation and error handling
   - Data persistence through localStorage

## 🔄 State Management with Pinia

Application state is centrally managed using Pinia, ensuring a predictable and maintainable data flow.

- **`auth.js`**: Handles all aspects of user authentication, including registration, login, logout, and managing the current user's state and profile information. It also persists session data to `localStorage`.
- **`assessment.js`**: Manages the state of an active assessment. This includes tracking the current draft, storing answers, calculating progress, and handling the finalization process that leads to a report.
- **`questionnaires.js`**: Responsible for fetching and storing the structure of the assessment questionnaires. This keeps the question data separate from the application logic.
- **`reports.js`**: Manages the collection of completed assessment reports. It handles the conversion of a completed assessment draft into a permanent report and stores them for later viewing.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=IT Vulnerability Assessment
VITE_APP_VERSION=1.0.0
```

### Tailwind CSS Configuration

Customize the design system in `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Add your custom color palette here
        primary: '#4F46E5',
        secondary: '#10B981',
      },
    },
  },
  plugins: [],
}
```

## 🧪 Testing

The project emphasizes quality assurance through a combination of manual and semi-automated testing.

### Manual Testing

1. **System Test Panel**: A built-in utility (`SystemTestPanel.vue`) provides a one-click method for developers to run validation checks on core systems like Pinia stores and localStorage interactions, streamlining the debugging process.
2. **Cross-Browser Testing**: Verifying functionality and appearance on major web browsers.
3. **Responsive Testing**: Ensuring the layout adapts correctly to various screen sizes.
4. **User Flows**: Test complete assessment workflows
5. **Error Scenarios**: Test error handling and recovery
6. **Accessibility**: Test with screen readers and keyboard navigation

### Automated Testing

The application is structured to facilitate the future integration of unit testing (e.g., with Vitest) and end-to-end testing (e.g., with Cypress).

- Store method validation
- Data structure validation
- localStorage functionality testing
- Router functionality testing

## 🔒 Security Features

Security is a key consideration in the application's design.

- **Data Encryption**: All sensitive data is encrypted using the Web Cryptography API.
- **Secure Authentication**: Authentication is handled through a secure, password-based system.
- **Input Validation**: All user inputs on forms are validated client-side to prevent invalid data submission.
- **Data Sanitization**: Data is sanitized before storage
- **Secure Error Handling**: Error messages shown to the user are designed to be informative without exposing sensitive application internals or stack traces.
- **Local Data Storage**: All assessment data is stored within the user's browser `localStorage`, ensuring data privacy as it is not transmitted to a server.
- **Dependency Management**: Regularly audit and update dependencies to patch known vulnerabilities.

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: The application is designed to meet AA-level conformance.
- **Semantic HTML**: Proper use of HTML5 elements for clear document structure.
- **ARIA Roles**: Appropriate ARIA (Accessible Rich Internet Applications) attributes are used to enhance accessibility for screen readers.
- **Screen Reader Support**: Proper ARIA labels and roles
- **Keyboard Navigation**: The entire application can be operated using only a keyboard.
- **Focus Management**: Logical focus order and visible focus indicators are maintained throughout the application.
- **Color Contrast**: High contrast ratios for readability

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive design for tablets
- **Desktop Experience**: Enhanced features for desktop users
- **Touch Friendly**: Optimized for touch interactions

## 🚀 Performance

- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Production builds are optimized
- **Efficient State Management**: Minimal re-renders
- **Local Storage**: Fast data access and persistence

## 🔄 State Management

### Stores Overview

- Manages storage, conversion, filtering, and validation of reports.

#### Auth Store (`src/stores/auth.js`)

- User registration and authentication
- User profile management
- Session persistence
- Input validation and error handling

#### Assessment Store (`src/stores/assessment.js`)

- Draft management and persistence
- Progress tracking
- Answer storage and retrieval
- Report generation

#### Reports Store (`src/stores/reports.js`)

- Report storage and management
- Draft to completed report conversion
- Report filtering and search
- Data validation and integrity

#### Questionnaire Store (`src/stores/questionnaires.js`)

- Manages loading of questionnaire.
- Validating saved assessments before its saved.
- Providing access to questionnaire data.

## 🛠️ Development

### Code Style

- **ESLint**: Code linting and formatting
- **Vue 3 Composition API**: Modern Vue.js patterns
- **TypeScript-like**: JSDoc comments for type safety
- **Component Structure**: Consistent component organization

### Best Practices

- **Error Boundaries**: Comprehensive error handling
- **Validation**: Input and data validation
- **Performance**: Optimized rendering and state updates
- **Accessibility**: WCAG compliance throughout

## 📈 Future Enhancements

We have a clear roadmap for future development and improvements.

### Planned Features

- **Real-time Collaboration**: Multi-user assessment support
- **Advanced Analytics**: Detailed performance metrics
- **Export Functionality**: PDF and Excel report export
- **API Integration**: Backend service integration (Django REST Framework), Advanced Features from Gemini
- **Cloud Storage**: Remote data synchronization

### Technical Improvements

- **Full TypeScript Migration**: Convert the JavaScript codebase to TypeScript for enhanced type safety and developer experience.
- **Comprehensive Unit & E2E Testing**: Implement a full suite of automated tests, Comprehensive and End-to-end testing testing using Vitest and Cypress.
- **Performance Monitoring**: Real-time performance tracking
- **CI/CD Pipeline**: Set up a Continuous Integration/Continuous Deployment pipeline to automate testing and deployment.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the documentation
- Review the system test panel
- Open an issue on GitHub
- Contact the development team

## 🎯 Project Goals

- **User Experience**: Provide an intuitive and efficient assessment experience
- **Reliability**: Ensure data integrity and system stability
- **Accessibility**: Make the application usable by everyone
- **Performance**: Deliver fast and responsive interactions
- **Maintainability**: Create clean, well-documented code

---

**Built with ❤️ using Vue.js 3 and modern web technologies**
