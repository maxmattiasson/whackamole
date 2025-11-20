# Whack-a-Mole – README

## Hur spelar man?

- Klicka på mullvaden när den dyker upp. Klickar du rätt → **poäng**
- Missar du (eller hinner du inte klicka) → **miss**.
- Spelet varar i **60 sekunder**.

## Kör spelet

1. Öppna projektet.
2. Starta Live Server.
3. Öppna `index.html`.
4. Klicka på **Starta**.

## ⚙️ Ändra svårighetsgrad

I `Game.js` → `spawnHandler()`:

```js
const spawnFloor = 300; // Minsta hastighet (ms)
const spawnIncrement = 40; // Högre värde = långsammare spel
```
