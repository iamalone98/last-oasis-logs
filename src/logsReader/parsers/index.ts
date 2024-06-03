import { LogsReaderEvents } from '../../events';
import { LogsReader } from '../logsReader';
import { chatMessage } from './chatMessage';
import { tileName } from './tileName';

const parsers = [chatMessage, tileName];

export const parseLine = (line: string, self: LogsReader) => {
  for (let i = 0; i < parsers.length; i++) {
    const result = parsers[i](line);

    if (result) {
      if (result.event === LogsReaderEvents.TILE_NAME) {
        self.tileName = result.name;
      }

      self.emit(result.event, result);
      self.logger.log(`Event: ${result.event}`);

      break;
    }
  }
};
