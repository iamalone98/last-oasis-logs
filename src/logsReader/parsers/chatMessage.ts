import { LogsReaderEvents } from '../../events';
import { TChatMessage } from '../../types';

export const chatMessage = (line: string) => {
  const matches = line.match(
    /^\[([0-9.:-]+)]\[([ 0-9]*)]LogGame: Chat message from (.+): (.*)/,
  );

  if (matches) {
    const data: TChatMessage = {
      raw: matches[0],
      time: matches[1],
      chainID: matches[2],
      name: matches[3],
      message: matches[4],
      event: LogsReaderEvents.CHAT_MESSAGE,
    };

    return data;
  }

  return null;
};
