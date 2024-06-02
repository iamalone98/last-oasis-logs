# LastOasisLogs

This library is designed for the game LastOasis, it will give you the ability to easily parse game logs. It is possible to read the file locally. I hope this will be useful to you!

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the

```console
$ npm install last-oasis-logs
```

or

```console
$ yarn add last-oasis-logs
```

## Quick Start

### LOCAL

```typescript
import { LogsReader } from 'last-oasis-logs';

(async () => {
  const logsReader = LogsReader({
    id: 1,
    autoReconnect: true,
    filePath: '/Mist/Saved/Logs/Mist.log',
  });

  await logsReader.init();

  logsReader.on('CHAT_MESSAGE', (data) => {
    console.log(data);
  });
})();
```

`LogsReader` return some pre-defined functions:

### Functions

| Function        | Return      | Type                  | Emitter |
| --------------- | ----------- | --------------------- | ------- |
| **init**        | **Promise** | `Promise`             |         |
| **close**       | **Promise** | `Promise`             |         |
| **getTileName** | **String?** | `String or Undefined` |         |

### Events

| Event            | Return       | Type           |
| ---------------- | ------------ | -------------- |
| **CHAT_MESSAGE** | **response** | `TChatMessage` |
| **connected**    | null         | null           |
| **close**        | null         | null           |
