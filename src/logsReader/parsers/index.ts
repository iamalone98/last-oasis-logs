import { LogsReader } from '../logsReader';
import { chatMessage } from './chatMessage';

const parsers = [chatMessage];

export const parseLine = (line: string, emitter: LogsReader) => {
  for (let i = 0; i < parsers.length; i++) {
    const result = parsers[i](line);

    if (result) {
      emitter.emit(result.event, result);
      emitter.logger.log(`Event: ${result.event}`);

      break;
    }
  }
};
