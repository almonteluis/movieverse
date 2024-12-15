#!/bin/bash

# Create project structure
mkdir -p src/{pages/movies,pages/movie/id,components/{common,features,layout},hooks,store/slices,services,utils,types,providers,assets,styles} .github/workflows public

# Create configuration files
touch package.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json .env .env.example .eslintrc.js .prettierrc .gitignore README.md tailwind.config.ts postcss.config.js

# Create source files
touch src/main.tsx src/App.tsx src/index.css src/vite-env.d.ts

# Create component structure
touch src/pages/index.tsx src/pages/movies/index.tsx src/pages/movie/id/index.tsx
touch src/components/layout/{Navbar,Footer,Layout}.tsx src/components/common/{SearchDialog,MovieCard}.tsx src/components/features/MovieList.tsx

# Create application logic files
touch src/hooks/{useMovies,useSearch,useDebounce,useSearchHistory}.ts
touch src/services/{api.service,tmdb}.ts
touch src/store/index.ts src/store/slices/movieSlice.ts
touch src/utils/{formatters,helpers}.ts
touch src/types/{movie,api}.ts
touch src/providers/theme-provider.tsx
touch src/styles/globals.css

# Create GitHub workflows
touch .github/workflows/ci.yml .github/workflows/cd.yml

# Create public assets
touch public/favicon.ico public/robots.txt

echo "Project structure created successfully!"