// src/data/personal.ts

export const personal = {
  fullName: 'Ricardo Rey Crisanto V. Lopez II',
  nickname: 'RJ',
  title: 'Senior Full Stack Software Engineer',
  yearsExperience: 7,

  location: {
    municipality: 'Bayombong',
    city: 'Nueva Vizcaya',
    country: 'Philippines',
    display: 'Bayombong, Nueva Vizcaya, Philippines',
  },

  bio: "I build software that lasts. I enjoy turning complex business requirements into reliable systems with clean architecture, modern TypeScript, and a strong focus on developer experience. Whether it's a React frontend, a backend service, or an offline-first application, I care about writing software that's easy to understand, evolve, and maintain.",

  tagline: 'Building systems that developers enjoy working on.',

  availability: 'Open to senior roles & consulting',

  avatarUrl: '/images/avatar.jpg',

  contact: {
    email: 'ricardoreylopez06@gmail.com',
    phone: {
      display: '+63 939 273 7849',
      href: '+639392737849',
    },
  },

  social: {
    linkedin: {
      label: 'LinkedIn',
      url: 'https://linkedin.com',
      display: 'linkedin.com/in/rrlopez',
    },
    github: {
      label: 'github',
      url: 'https://github.com/rrlopez',
      display: 'github.com/rrlopez',
    },
    portfolio: {
      label: 'Portfolio',
      url: 'https://rrlopez.github.io',
      display: 'rrlopez.github.io',
    },
  },

  stats: [
    { value: '7+', label: 'Years Experience' },
    { value: '5', label: 'Companies & Clients' },
    { value: '1', label: 'OSS Package Shipped' },
  ],
} as const;
