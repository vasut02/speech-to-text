"use client";

import React, { useEffect, useState } from "react";
import Microphone from "../components/Microphone";
import Sidebar from "../components/Sidebar";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { TranscriptionGroup } from "@/Interfaces";
import TranscriptionsView from "@/components/TranscriptionView";
import clsx from "clsx";

const Home: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [transcriptions, setTranscriptions] = useState<TranscriptionGroup[]>(
    []
  );
  const [selectedTranscription, setSelectedTranscription] =
    useState<TranscriptionGroup | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);

  // Toggle the sidebar open/closed state
  const toggleSidebar = (): void => {
    setIsSideBarOpen((value) => !value);
  };

  // creating a new transcription group and set it to selected
  const createNewTranscriptionGroup = (): void => {
    let newTranscription = { id: uuidv4(), transcriptions: [] };
    setTranscriptions((prevTranscriptions) => [
      newTranscription,
      ...prevTranscriptions,
    ]);
    setSelectedTranscription(newTranscription);
  };

  // retrive data from local storage and
  // create new transcription group upon starting
  useEffect(() => {
    const storedTranscriptions = localStorage.getItem("transcriptions");
    if (storedTranscriptions) {
      setTranscriptions(
        JSON.parse(storedTranscriptions).filter(
          // retrive only those transcription groups that have more than zero transcription
          (x: TranscriptionGroup) => x.transcriptions.length > 0
        )
      );
    }
    createNewTranscriptionGroup();
  }, []);

  // Update localStorage whenever transcriptions or selectedTranscription state changes
  useEffect(() => {
    setTranscriptions((prevTranscriptions) => {
      let updatedTranscriptions;

      if (selectedTranscription) {
        // Find the selected transcription group
        updatedTranscriptions = prevTranscriptions.map((group) => {
          if (group.id === selectedTranscription.id) {
            // Update the selected group with the new transcription
            return selectedTranscription;
          }
          return group;
        });

        // Update localStorage whenever transcriptions state changes
        localStorage.setItem(
          "transcriptions",
          JSON.stringify(updatedTranscriptions)
        );
      } else return prevTranscriptions;

      return updatedTranscriptions;
    });
  }, [selectedTranscription]);

  // Handle the selection of a transcription group
  const handleSelectTranscription = (transcription: TranscriptionGroup) => {
    setSelectedTranscription(transcription);
  };

  return (
    <div>
      <Sidebar
        transcriptions={transcriptions}
        selectedTranscription={selectedTranscription}
        onSelect={handleSelectTranscription}
        toggleSidebar={toggleSidebar}
        isSideBarOpen={isSideBarOpen}
        createNewTranscriptionGroup={createNewTranscriptionGroup}
      />

      <div className={clsx(isSideBarOpen && "sm:ml-64")}>
        <div
          className={clsx(
            "bg fixed top-0 w-full border-box p-4 ",
            isSideBarOpen && "sm:w-[calc(100%-16rem)]"
          )}
        >
          {!isSideBarOpen ? (
            <div className="flex items-center justify-between">
              <button type="button" onClick={toggleSidebar}>
                <Image
                  src="/menu.png"
                  width={22}
                  height={22}
                  className=""
                  alt=""
                />
              </button>
              <h1 className="app-name text-lg sm:text-xl font-bold">Speech to Text</h1>
              <button
                type="button"
                onClick={createNewTranscriptionGroup}
                className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500"
              >
                <Image
                  src="/plus.png"
                  width={15}
                  height={15}
                  className="mr-2"
                  alt="+"
                />
                New
              </button>
            </div>
          ) : (
            <h1 className="app-name text-xl font-bold mb-4">Speech to Text</h1>
          )}
        </div>
        <div className="my-20 ">
          {selectedTranscription && (
            <TranscriptionsView selectedTranscription={selectedTranscription} />
          )}
        </div>
        <div
          className={clsx(
            "bg fixed bottom-0 w-full border-box ",
            isSideBarOpen && "sm:w-[calc(100%-16rem)]"
          )}
        >
          <Microphone
            selectedTranscription={selectedTranscription}
            setSelectedTranscription={setSelectedTranscription}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
