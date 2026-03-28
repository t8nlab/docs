# TitanPL Documentation

Official documentation for **TitanPL** v6.0.0 — A native, high-performance backend framework powered by Rust.

## 🌐 Live Documentation

Visit [titanpl.vercel.app](https://titanpl.vercel.app) (or your deployment URL) to view the full documentation.

## 📚 What's Inside

This documentation covers:

### Core Concepts
- **Quick Start** — Get up and running in minutes
- **Runtime Architecture** — Understanding TitanPL's synchronous V8 execution model
- **How Titan Works** — Visual deep dive into request lifecycle and worker pool
- **Project Structure** — Organize your Titan application

### Development
- **Routes** — Define HTTP endpoints
- **Actions** — Build synchronous JavaScript/TypeScript actions
- **Runtime APIs** — Available Titan APIs (`t.fetch`, `t.db`, etc.)
- **Environment Variables** — Configuration management
- **Logs** — Debugging and monitoring

### Advanced
- **Extensions** — Extend Titan with native Rust
- **Titan Core** — Built-in utilities and helpers
- **Orbit System** — Dependency management
- **TitanPL Core Extension** — Client SDK for consuming Titan APIs
- **ESLint Plugin** — Linting rules for Titan code

### Deployment
- **Production** — Deploy your Titan app to production
- **CLI** — Command-line interface reference

## 🏗️ Tech Stack

This documentation site is built with:

- **Next.js** — React framework
- **Fumadocs** — Documentation framework
- **TailwindCSS** — Styling
- **MDX** — Markdown with components

## 🚀 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Contributing

To contribute to the documentation:

1. Fork this repository
2. Create a new branch (`git checkout -b docs/your-improvement`)
3. Make your changes in `content/docs/`
4. Test locally with `npm run dev`
5. Submit a pull request

## 🔧 File Structure

```
titan-docs/
├── app/                 # Next.js app directory
├── content/
│   └── docs/           # Documentation MDX files
│       ├── index.mdx   # Quick Start
│       ├── runtime-architecture.mdx
│       ├── how-titan-works.mdx
│       └── ...
├── public/             # Static assets (images, diagrams)
├── lib/                # Utilities and helpers
└── source.config.ts    # Fumadocs configuration
```

## 📄 License

The TitanPL documentation is open source.

## 🌟 Links

- [TitanPL Repository](https://github.com/t8nlab/titanpl)
- [NPM Package](https://npmjs.com/package/@titanpl/cli)
- [Report Issues](https://github.com/t8nlab/titanpl/issues)

---

**Built with ❤️ for the Titan Planet community**
