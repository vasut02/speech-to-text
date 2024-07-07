import React from "react";
import { TranscriptionGroup } from "@/Interfaces";

interface TranscriptionsViewProps {
  selectedTranscription: TranscriptionGroup;
}

const TranscriptionsView: React.FC<TranscriptionsViewProps> = ({
  selectedTranscription,
}) => {
  return (
    <div className="">
      {/* Populate the transcriptions of selected transcription group */}
      {selectedTranscription?.transcriptions?.length > 0 ? (
        selectedTranscription?.transcriptions.map((transcription, index) => {

          return (
            <div key={index} className="mt-8 w-9/12 sm:w-8/12 mx-auto">
              <p className="bg-neutral-700 p-4 my-8 rounded-md">
                {/* Display transcription text or prompt to start speaking */}
                {transcription.text.length> 0
                  ? transcription.text
                  : <span className="text-slate-400">Start speaking ...</span>}
              </p>
            </div>
          );
        })
      ) : (
        <div className="flex w-full h-80 sm:h-44  px-4 border-box justify-center items-center"><p className="text-xl md:text-2xl text-center text-slate-400">Your Transcriptions will be shown here</p></div>
      )}
    </div>
  );
};

export default TranscriptionsView;
