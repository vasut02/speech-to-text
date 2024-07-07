# Audio Transcription Web UI

## Description
A web application that allows users to record audio and transcribe it using the Deepgram transcription service.

## Features
- Record audio using a microphone
- Transcribe audio in real-time using Deepgram API
- Display transcription on the UI
- Save and display past transcriptions
- Responsive design for different screen sizes

## Live Demo
Check out the live demo [here](https://speech-to-text-ruddy.vercel.app/).

## Screenshots
![New Transcription](https://github.com/vasut02/speech-to-text/assets/70652567/e61bda20-24eb-4353-9649-768a96b59be1)
![image](https://github.com/vasut02/speech-to-text/assets/70652567/8cdfcb2b-8020-404e-b7e3-a4276d3412dd)
![image](https://github.com/vasut02/speech-to-text/assets/70652567/6853c9ab-4ad1-4c7e-aa16-4b11b8711681)


## Getting Started

### Prerequisites
- Node.js (>=14.x)
- npm (>=6.x)

### Installation
1. Clone the repository
   ```sh
   git clone https://github.com/vasut02/speech-to-text.git
   cd speech-to-text/client
   ```
2. Install dependencies
    ```sh
      npm install
    ```
4. Running the Project
   ```sh
      npm run dev
    ```
### API Integration

This project uses the Deepgram API for audio transcription. To use the API, you need to sign up for a free account on Deepgram and obtain an API key.

1. Sign up at Deepgram.
2. Create a .env.local file in the root directory and add your API key:
```sh
  NEXT_PUBLIC_DEEPGRAM_API_KEY=your_api_key_here
```

## Directory Structure

- `public/`: Public assets (e.g., images, icons)
- `pages/`: Next.js pages
  - `index.tsx`: Home page that includes the main application components
- `components/`: React components
  - `Microphone.tsx`: Microphone component for recording audio
  - `Transcription.tsx`: Component for displaying transcriptions
  - `Sidebar.tsx`: Component for side bar and displaying previous transcriptions
- `hooks/`: API service functions
  - `useDeepgramTranscription.ts`: custom hook to handle deepgram API and microphone logic.
- `tests/`: Unit tests
- `.env.local`: Environment variables (not included in the repository)
