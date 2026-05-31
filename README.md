# 🎨 RJ | Full Stack Developer Portfolio

```
 ____      _   
|  _ \    | |  
| |_) |   | |  
|  _ < _  | |  
|_| \_(_) \_/  
              
>> SYSTEM_STATUS: ONLINE
>> THEME: RJ_DESIGN_V2
>> MODE: ADAPTIVE (LIGHT/DARK)
```

> **A bold, raw, and interactive portfolio experience.**  
> Designed with the **RJ Design** philosophy—high contrast, raw aesthetics, and unapologetic functionality. This project isn't just a showcase; it's a statement.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Design Philosophy](#-design-philosophy)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Customization](#-customization)
- [Performance](#-performance)
- [Connect](#-connect)

---

## 🎯 Overview

This portfolio serves as a digital headquarters for a Full Stack Developer. It moves away from standard corporate templates, embracing a **RJ Design** aesthetic that prioritizes content visibility, interaction, and performance.

### Design Philosophy

**RJ Design** is about:
- ⚡ **Maximum Contrast** - Sharp borders, distinct sections.
- 🔤 **Raw Typography** - Monospace and Grotesk fonts for a technical feel.
- 🌓 **Adaptive Theming** - A meticulously crafted Dark/Light mode.
- 📐 **Structured Chaos** - Asymmetrical layouts that guide the eye.

---

## ✨ Key Features

### 🎨 Visual & Interactive
- **Adaptive Dark Mode**: Seamless toggle with OS preference detection and `localStorage` persistence.
- **Custom Cursor**: Interactive cursor that reacts to hover states (desktop only).
- **Parallax Effects**: subtle depth animations on hero elements.
- **Staggered Animations**: Content reveals with distinct slide, scale, and fade effects.
- **Marquee Scrolling**: Infinite, CSS-driven text loops.
- **Typewriter Effect**: Dynamic text typing simulation.

### 🛠 Functional
- **Live Coding Stats**:
  - Real-time **GitHub** data (Repositories, Followers, Commits).
  - **LeetCode** problem-solving heatmap.
- **Functional Contact Form**:
  - Client-side validation.
  - **Formspree** integration (no backend code required).
  - Instant success/error feedback mechanisms.
- **Project Showcase**:
  - "**LIVE**" and "**IN_DEV**" status badges.
  - Dual action buttons (Source Code + Live Demo).
  - Hover zoom effects.

### ⚡ Performance & Access
- **Lightning Fast**: Pure Vanilla JS, no heavy frameworks.
- **SEO Optimized**: Semantic HTML, meta tags, and structured data (JSON-LD).
- **Accessible**: WCAG compliant, proper contrast ratios, and keyboard navigation.

---

## 🛠 Tech Stack

| Component | Technology | Description |
|-----------|-----------|-------------|
| **Core** | HTML5 | Semantic structure & SEO. |
| **Styling** | TailwindCSS | Utility-first architecture with custom config. |
| **Logic** | Vanilla JavaScript | UI interactions, API fetching, Form handling. |
| **Icons** | Remix Icon | consistent, crisp iconography. |
| **Fonts** | JetBrains Mono | Coding/Terminal aesthetic. |
| **Fonts** | Space Grotesk | Headings and Display text. |
| **Backbone** | Formspree | Form submission handling. |

---

## 📁 Project Structure

```bash
RJ_PORTFOLIO/
├── Assets/
│   ├── images/           # Optimized project assets & avatar
│   └── Resume/           # Downloadable CV
├── dist/
│   └── tailwind.css      # Compiled Tailwind output
├── src/
│   └── input.css         # Tailwind source directives
├── index.html            # Main entry point
├── script.js             # Logic (Theme, API, Scroll, Form)
├── styles.css            # Custom animations & overrides
├── tailwind.config.js    # Theme configuration
└── README.md             # Documentation
```

---

## 🚀 Installation

### Prerequisites
- A modern web browser.
- Git (optional).
- Node.js (only if you want to rebuild Tailwind CSS).

### Quick Start

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/rj-portfolio.git
    cd rj-portfolio
    ```

2.  **Open in Browser**
    Simply double-click `index.html` or run a local server:
    ```bash
    # Python
    python3 -m http.server 8000
    
    # Node.js
    npx http-server
    ```

### Rebuilding CSS (Optional)
If you modify `src/input.css` or `tailwind.config.js`:
```bash
npm install
npm run build:css
```

---

## 🎮 Usage

### Setup Contact Form
1. Create a form at [Formspree.io](https://formspree.io).
2. Open `script.js`.
3. Locate `const FORMSPREE_ENDPOINT` (line ~11).
4. Replace `YOUR_FORM_ID` with your actual form ID.

### Update GitHub Stats
1. Open `script.js`.
2. Locate `const GITHUB_USERNAME`.
3. Change `'R-Jhere'` to your GitHub username.

---

## 🎨 Customization

### Changing the Theme
Edit `tailwind.config.js` to modify the **RJ color palette**:
```javascript
colors: {
    'neo-yellow': '#FBFF48', // Primary Accent
    'neo-pink': '#FF70A6',   // Secondary Accent
    'neo-black': '#0a0a0a',  // Dark Mode Background
    // ...
}
```

### Adding Projects
Copy the `<article>` block in the `#projects` section of `index.html` and update:
- Image source
- Status badge (`project-badge-live` or `project-badge-dev`)
- Links (GitHub / Demo)

---

## ⚡ Performance Metrics

| Metric | Status |
|--------|--------|
| **LCP (Largest Contentful Paint)** | 🟢 < 1.0s |
| **CLS (Cumulative Layout Shift)** | 🟢 0.00 |
| **SEO Score** | 🟢 100/100 |
| **Accessibility** | 🟢 100/100 |

---

## 📬 Connect

**Rahul**  
*Full Stack Developer*

- 🐙 **GitHub**: [@R-Jhere](https://github.com/R-Jhere)
- 💼 **LinkedIn**: [Rahul Joshi](https://linkedin.com/in/rjhere)
- 📧 **Email**: [rahuljoshi.uk02@gmail.com](mailto:rahuljoshi.uk02@gmail.com)

---

<div align="center">
  
  **Built with 💻 and ☕ by RJ**  
⭐ Star this repo if you found it helpful!

</div>
 
