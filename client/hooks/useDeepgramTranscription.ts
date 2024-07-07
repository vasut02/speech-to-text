import { useState, useRef, useEffect } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { TranscriptionGroup } from "@/Interfaces";
import { v4 as uuidv4 } from "uuid";

interface UseDeepgramTranscriptionProps {
  selectedTranscription: TranscriptionGroup | null;
  setSelectedTranscription: (value: TranscriptionGroup) => void;
}

interface CaptionData {
  channel: {
    alternatives: { transcript: string }[];
  };
}

const useDeepgramTranscription = ({
  selectedTranscription,
  setSelectedTranscription,
}: UseDeepgramTranscriptionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const deepgram = useRef<any>(null);

  useEffect(() => {
    let keepAlive: string | number | NodeJS.Timeout | undefined;
    const initializeDeepgram = async () => {
      const deepgramApiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

      if (!deepgramApiKey) {
        console.error("Deepgram API key is not defined");
        return;
      }

      // Initialize Deepgram client and setup event listeners
      const dgClient = createClient(deepgramApiKey);

      deepgram.current = dgClient.listen.live({
        smart_format: true,
        model: "nova-2",
      });

      // Keep the connection alive by sending periodic keep-alive messages
      if (keepAlive) clearInterval(keepAlive);
      keepAlive = setInterval(() => {
        console.log("deepgram: keepalive");
        deepgram.current.keepAlive();
      }, 10 * 1000);

      // Event listener for connection open
      deepgram.current.addListener(LiveTranscriptionEvents.Open, () => {
        console.log("deepgram: connected");
      });

      // Event listener for receiving transcriptions
      deepgram.current.addListener(
        LiveTranscriptionEvents.Transcript,
        (data: CaptionData) => {
          if (
            data &&
            data.channel &&
            data.channel.alternatives[0].transcript !== ""
          ) {
            setSelectedTranscription((prevSelected) => {
              if (!prevSelected || prevSelected.transcriptions.length === 0)
                return prevSelected;

              const lastIndex = prevSelected.transcriptions.length - 1;
              const lastTranscription = prevSelected.transcriptions[lastIndex];
              const updatedText = `${lastTranscription.text} ${data.channel.alternatives[0].transcript}`;

              const updatedTranscriptions = [
                ...prevSelected.transcriptions.slice(0, lastIndex),
                { ...lastTranscription, text: updatedText },
              ];

              return {
                ...prevSelected,
                transcriptions: updatedTranscriptions,
              };
            });
          }
        }
      );

      deepgram.current.addListener(LiveTranscriptionEvents.Close, () => {
        console.log("deepgram: disconnected");
        clearInterval(keepAlive);
      });

      deepgram.current.addListener(
        LiveTranscriptionEvents.Error,
        (error: any) => {
          console.error("deepgram: error received", error);
        }
      );

      deepgram.current.addListener(
        LiveTranscriptionEvents.Unhandled,
        (warning: any) => {
          console.warn("deepgram: warning received", warning);
        }
      );

      deepgram.current.addListener(
        LiveTranscriptionEvents.Metadata,
        (data: any) => {
          console.log(
            "deepgram: metadata received",
            JSON.stringify({ metadata: data })
          );
        }
      );
    };

    initializeDeepgram();

    // Cleanup function to finish Deepgram connection on unmount
    return () => {
      if (deepgram.current && deepgram.current.getReadyState() === 1) {
        deepgram.current.finish();
      }
    };
  }, []);

  useEffect(() => {
    let timer: any;
    // Timer to keep track of recording duration
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isRecording && seconds !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording, seconds]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    // send data to deepgram API
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0 && deepgram.current.getReadyState() === 1) {
        console.log("listening...");
        deepgram.current.send(event.data);
      }
    };

    mediaRecorderRef.current.onstart = () => {
      setIsRecording(true);
      setSeconds(0);

      const newId: string = uuidv4();
      setSelectedTranscription((prev) => {
        if (prev) {
          return {
            ...prev,
            transcriptions: [...prev.transcriptions, { id: newId, text: "" }],
          };
        }
        return null;
      });
    };

    mediaRecorderRef.current.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    };

    mediaRecorderRef.current.start(100);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return {
    isRecording,
    seconds,
    startRecording,
    stopRecording,
  };
};

export default useDeepgramTranscription;
