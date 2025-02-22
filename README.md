# GitHub Graph Visualizer

A web application that visualizes GitHub repositories and contributors as an interactive network graph. Explore repository data, view contributors’ details, and navigate through related nodes.

## Features

- **Interactive Network Graph:** Visualize repositories and contributors using a dynamic network graph built with [Nivo Network](https://nivo.rocks/network/).
- **Search Functionality:** Enter a repository (e.g., `facebook/react`) or a GitHub username (e.g., `torvalds`) to fetch and display the relevant graph.
- **Display Settings:** Adjust network parameters like link distance, repulsivity, and centering strength.
- **Graph Exploration:** Click on nodes to view detailed information and expand the graph from selected entities.
- **Autocomplete & History:** Get search suggestions and revisit previous queries with an integrated search history.

## Technologies Used

- **React & Vite**
- **Tailwind CSS**
- **GraphQL & GitHub API**
- **Nivo Network:** to render network graphs.

## Project Structure

```plaintext
src
├── App.tsx
├── main.tsx
├── utils.ts
├── index.css
├── types.ts
├── components
│   ├── ExploreList
│   │   ├── index.tsx
│   │   ├── ExploreRepoItem.tsx
│   │   └── ExploreContributorItem.tsx
│   ├── NodeModal.tsx
│   ├── RepoInfo.tsx
│   ├── DisplaySettings.tsx
│   ├── JsonDisplay.tsx
│   ├── NetworkWithZoom.tsx
│   ├── LoadingSpinner.tsx
│   ├── SearchInput.tsx
│   ├── Network.tsx
│   └── ContributorInfo.tsx
├── vite-env.d.ts
├── hooks
│   ├── useDisplaySettings.ts
│   ├── useActiveContributors.ts
│   ├── useSearchInputReducer.ts
│   ├── useOnClickOutside.ts
│   ├── useFreshRepos.ts
│   ├── useNavHistoryReducer.ts
│   ├── useAutocomplete.ts
│   ├── useDebounce.ts
│   ├── useSearchHistory.ts
│   └── useGraph.ts
├── assets
└── services
    ├── github.ts
    └── cache.ts
```

## Setup & Installation
1.	Clone the Repository:
```bash
git clone https://github.com/isserge/github-graph-visualizer.git
cd github-graph-visualizer
```

2.	Install Dependencies:
```bash
yarn install
```

3.	Configure Environment Variables:
Create a .env file in the root of the project and add your GitHub personal access token:
```bash
VITE_GITHUB_TOKEN=your_github_token_here
```
Note: Ensure your token has the necessary permissions to access repository and user data.

4.	Run the Development Server:
```bash
yarn dev
```
The application will be available at http://localhost:5173.
