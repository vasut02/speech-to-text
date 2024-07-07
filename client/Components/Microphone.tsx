import Image from "next/image";
import React from "react";
import { TranscriptionGroup } from "@/Interfaces";
import useDeepgramTranscription from "@/hooks/useDeepgramTranscription";

interface MicrophoneProps {
  selectedTranscription: TranscriptionGroup | null;
  setSelectedTranscription: (value: TranscriptionGroup) => void;
}

const Microphone: React.FC<MicrophoneProps> = ({
  selectedTranscription,
  setSelectedTranscription,
}) => {
  // Use the custom hook to manage transcription state and events
  const { isRecording, seconds, startRecording, stopRecording } = useDeepgramTranscription({
    selectedTranscription,
    setSelectedTranscription,
  });

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-4 w-full">
      <div className="flex items-center w-full justify-center">
        {isRecording ? (
          <>
            <p className="mr-4 text-red-700 text-lg">{formatTime(seconds)}</p>
            <button
              onClick={stopRecording}
              type="button"
              className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-full p-3 inline-flex items-center dark:focus:ring-gray-500"
            >
              <Image src={"/stop.png"} height={20} width={20} alt="Stop Recording" />
            </button>
          </>
        ) : (
          <>
            <p className="mr-4 text-gray-400">Start Recording</p>
            <button
              onClick={startRecording}
              type="button"
              className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-full p-3 inline-flex items-center dark:focus:ring-gray-500"
            >
              <Image src={"/mic.png"} height={20} width={20} alt="Start Recording" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Microphone;
