// Platform-specific implementations are in:
//   database.native.ts  → expo-sqlite (iOS/Android)
//   database.web.ts     → localStorage (Web)
// Metro bundler selects the correct file automatically.
export * from './database.web';
