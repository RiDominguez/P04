# Pokédex Web

## Description
This project is a web application that allows users to scan and register their Pokémon cards to maintain a personal inventory. Users can interact with their collection of cards, get market information, and make trades with other users.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Deno.js
- **Database**: PostgreSQL
- **Other**: Vite for frontend compilation

## Project Structure
```
Pokedex
├─ client
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  ├─ components
│  │  │  ├─ card.tsx
│  │  │  ├─ pages
│  │  │  │  └─ Home.tsx
│  │  │  ├─ Pagination.tsx
│  │  │  └─ SearchBar.tsx
│  │  ├─ hooks
│  │  │  └─ UseCards.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  └─ vite-env.d.ts
│  └─ vite.config.ts
├─ package-lock.json
├─ README.md
└─ server
   ├─ deno.json
   ├─ deno.lock
   └─ src
      ├─ controllers
      ├─ db
      ├─ deps.ts
      ├─ models
      ├─ routes.ts
      ├─ server.ts
      └─ services
         └─ pokemon.ts
```

## Database Schema

The application uses a relational database (PostgreSQL) to store information about Pokémon cards, users, their collections, and related statistics.

### Tables:

1. **pokemon_cards**
   - Stores information about the Pokémon cards.
   - **Fields**:
     - `id`: Unique identifier for the card.
     - `name`: Name of the card.
     - `rarity`: Rarity of the card.
     - `type`: Type of Pokémon (e.g., Fire, Water).
     - `expansion`: Expansion set the card belongs to.
     - `official_id`: The official ID of the card.

2. **card_images**
   - Stores image data for each Pokémon card.
   - **Fields**:
     - `id`: Unique identifier for the image.
     - `card_id`: Foreign key referencing the `pokemon_cards` table.
     - `image_url`: URL for the card's image.

3. **market_prices**
   - Stores the market prices for each Pokémon card.
   - **Fields**:
     - `id`: Unique identifier for the price entry.
     - `card_id`: Foreign key referencing the `pokemon_cards` table.
     - `price`: Current market price for the card.
     - `last_updated`: Timestamp of when the price was last updated.

4. **users**
   - Stores user information for the application.
   - **Fields**:
     - `id`: Unique identifier for the user.
     - `username`: User's username.
     - `email`: User's email address.
     - `password_hash`: Hash of the user's password.

5. **card_statistics**
   - Stores statistics related to each user's collection.
   - **Fields**:
     - `id`: Unique identifier for the statistics entry.
     - `user_id`: Foreign key referencing the `users` table.
     - `total_cards`: Total number of cards the user owns.
     - `unique_cards`: Number of unique cards.
     - `predominant_type`: Most common type of Pokémon in the user's collection.
     - `completeness_percentage`: Percentage of collection completed.

6. **user_cards**
   - Stores which cards belong to which user.
   - **Fields**:
     - `id`: Unique identifier for the user's card.
     - `user_id`: Foreign key referencing the `users` table.
     - `card_id`: Foreign key referencing the `pokemon_cards` table.
     - `is_for_trade`: Boolean indicating if the card is available for trade.
     - `condition`: Condition of the card (e.g., Mint, Near Mint).
     - `collection_name`: Name of the collection if the card belongs to one.

7. **collections**
   - Stores information about each user's card collection.
   - **Fields**:
     - `id`: Unique identifier for the collection.
     - `user_id`: Foreign key referencing the `users` table.
     - `name`: Name of the collection.

8. **collection_cards**
   - Stores the relationship between collections and cards.
   - **Fields**:
     - `id`: Unique identifier for the collection-card relationship.
     - `collection_id`: Foreign key referencing the `collections` table.
     - `card_id`: Foreign key referencing the `pokemon_cards` table.
## Features

1. **Card Scanning and Recognition**
   - Upload images of cards for automatic identification.
   - Association with a database of official cards to retrieve details.
   
2. **Personal Inventory**
   - Register cards with details such as rarity, type, and expansion.
   - Organize and tag cards in collections/decks.

3. **Trading and Valuation**
   - Query estimated prices in the market.
   - Options to mark cards available for trade.
   
4. **Advanced Search and Statistics**
   - Filters by type, rarity, and card condition.
   - Statistics on the user’s collection (completeness, predominant types, etc.).

## Installation Instructions

### Prerequisites
- Install **Deno** on your machine (see [Deno Installation](https://deno.land/)).
- Install **Node.js** and **npm** (or **yarn**) for the frontend part.

### Frontend Installation
1. Navigate to the `client/` directory and run the following commands:
   ```bash
   npm install
   npm run dev
   ```
This will install the dependencies and start the Vite development server on http://localhost:3000.

Backend Installation
Navigate to the server/ directory and run the Deno server:

```bash
deno run --allow-net --allow-read server.ts
```
This will start the backend server, which will be available on the configured port.
