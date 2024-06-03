import { LogsReaderEvents } from '../../events';
import { TTileName } from '../../types';

export const tileName = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogPersistence: tile_name: (.*)/,
  );

  if (matches) {
    const data: TTileName = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      name: matches[3],
      event: LogsReaderEvents.TILE_NAME,
    };

    return data;
  }

  return null;
};
