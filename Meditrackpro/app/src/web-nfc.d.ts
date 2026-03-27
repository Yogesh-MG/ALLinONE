// Declare the Web NFC API interfaces
interface NDEFRecord {
  recordType: string;
  data?: DataView;
  encoding?: string;
}

interface NDEFMessage {
  records: NDEFRecord[];
}

interface NDEFReadingEvent extends Event {
  message: NDEFMessage;
}

interface NDEFReader {
  scan(): Promise<void>;
  onreading: ((event: NDEFReadingEvent) => void) | null;
  onreadingerror: ((event: Event) => void) | null;
}

interface Window {
  NDEFReader: typeof NDEFReader;
}