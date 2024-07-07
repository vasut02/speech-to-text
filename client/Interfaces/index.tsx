export interface Transcription {
  id: string;
  text: string;
}

export interface TranscriptionGroup {
  id: string;
  transcriptions: Transcription[];
}
