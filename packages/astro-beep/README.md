# Astro Beep

Trigger a system notification when your Astro build is complete

## Options

### `mode?: "normal" | "blastoff = "normal"`

The `mode` option lets you choose between normal mode and _blastoff_ mode.

```js
import beep from 'astro-beep';

export default {
  integrations: [beep({ mode: 'blastoff' })],
};
```
