# Pokédex Web

## Description
This project is a web application that allows users to scan and register their Pokémon cards to maintain a personal inventory. Users can interact with their collection of cards, get market information, and make trades with other users.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Deno.js
- **Database**: PostgreSQL
- **Other**: Vite for frontend compilation

## Project Structure


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
This will install the dependencies and start the Vite development server on http://localhost:3000.

Backend Installation
Navigate to the server/ directory and run the Deno server:

bash
Copiar
Editar
deno run --allow-net --allow-read server.ts
This will start the backend server, which will be available on the configured port.
