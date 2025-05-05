This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🔬 Atomic Design Overview

- **Atoms**: Basic building blocks – e.g. `Button`, `Input`, `Label`
- **Molecules**: Combinations of atoms – e.g. `SearchBar`, `FormRow`
- **Organisms**: Complex UI sections – e.g. `Header`, `Sidebar`, `CardList`
- **Templates**: Page layouts without real data – e.g. `DashboardTemplate`
- **Pages**: Actual pages with real data – e.g. `Home`, `ProfilePage`

📁 Folder structure example:

src/
├── components/
│ ├── atoms/
│ ├── molecules/
│ ├── organisms/
│ ├── templates/
│ └── pages/
├── app/
│ └── page.tsx

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

This project is a [Next.js](https://nextjs.org) application structured using the [Atomic Design](https://medium.com/@g.m.hislop93/atomic-design-principles-4b393450270f) methodology. It promotes a scalable and maintainable UI system by organizing components into five clear categories: **Atoms**, **Molecules**, **Organisms**, **Templates**, and **Pages**.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
