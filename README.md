# Poll App

A React-based online poll application built with Vite.

## Features

- Yes/No poll with vote counts
- Each user can vote only once per browser session
- Reset button clears only the current session vote
- Leading option display with matching vote-style label
- Local persistence for vote counts across refreshes
- Responsive, polished UI with custom CSS styling

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open the local URL shown by Vite (usually `http://localhost:5173/`)

## Notes

- Votes are stored in browser localStorage, so totals persist across refreshes.
- The reset button removes only the current user's vote, without clearing global totals.
- Active user tracking was removed, so the app now focuses on the poll experience.

## Technologies

- React
- Vite
- CSS