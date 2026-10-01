# Homezee

Hyperlocal mobile app that helps newcomers save brokerage and daily costs, and find local services, daily helpers (bai, doodh wala, sabji wala, laundry wala) and city specialities, so nobody feels like a stranger in a new area.

## Docs
- [Brief](docs/brief.md)
- [Solution statement](docs/solution-statement.md)
- [UX/UI research](docs/ux-research.md)
- [MVP plan](docs/mvp-plan.md)

## App (`app/`)
Expo + React Native + TypeScript, React Navigation (bottom tabs + stack).

```
cd app
npm install
npx expo start      # scan the QR with the Expo Go app, or press "a" for Android emulator
```

Screens: Home, Explore (search + filters), Daily Helpers, Saved, Profile, Detail (call / WhatsApp).
Sample data is in `app/src/data.ts`.

## Status
MVP UI built with sample data. Next: Supabase backend, phone OTP login, provider self-signup, reviews.
