import React, { useCallback } from "react";
import Image from "next/image";
import { TranscriptionGroup } from "@/Interfaces";
import { clsx } from "clsx";

interface SidebarProps {
  transcriptions: TranscriptionGroup[];
  onSelect: (transcription: TranscriptionGroup) => void;
  isSideBarOpen: boolean;
  selectedTranscription: TranscriptionGroup | null;
  toggleSidebar: () => void;
  createNewTranscriptionGroup: ()=>void;
}

const Sidebar: React.FC<SidebarProps> = ({
  transcriptions,
  onSelect,
  toggleSidebar,
  isSideBarOpen,
  selectedTranscription,
  createNewTranscriptionGroup
}) => {

  // Memoize the handleSelect function to prevent unnecessary re-renders
  const handleSelect = useCallback((transcription: TranscriptionGroup) => {
    onSelect(transcription);
  }, [onSelect]);

  return (
    <aside
      id="default-sidebar"
      // Apply CSS classes conditionally to show/hide the sidebar
      className={clsx(
        "fixed top-0 left-0 z-40 w-64 h-screen transition-transform ",
        isSideBarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto side-bar">
        <div className="flex justify-between mb-4 items-start">
          <button type="button" className="mt-2" onClick={toggleSidebar}>
            <Image src="/menu.png" width={22} height={22} className="" alt="" />
          </button>
          <button
            type="button"
            onClick={createNewTranscriptionGroup}
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2"
          >
            <Image
              src="/plus.png"
              width={15}
              height={15}
              className="mr-2"
              alt="Add new transcription"
            />
            New
          </button>
        </div>
        <ul className="space-y-2 font-medium">
          {transcriptions.map((transcription) => (
            <li key={transcription.id}>
              {/* Button to select a transcription group */}
              <button
                onClick={() => handleSelect(transcription)}
                aria-label={`Select transcription ${transcription.id}`}
                className={clsx("flex w-full items-center justify-start p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group", transcription.id === selectedTranscription?.id && 'bg-gray-100 dark:bg-gray-700')}
              >
                <span className="">
                  {/* Display the first 25 characters of the first transcription or "New" if empty */}
                  {transcription.transcriptions.length > 0
                    ? transcription.transcriptions[0].text.substring(0, 25) +
                      "..."
                    : "New"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );

};

export default Sidebar;
