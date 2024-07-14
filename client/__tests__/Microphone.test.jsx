// Import necessary dependencies and setup for testing
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Microphone from '../Components/Microphone'; // Adjust the import path based on your project structure

// Mock the useDeepgramTranscription hook
jest.mock('@/hooks/useDeepgramTranscription', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isRecording: false,
    seconds: 0,
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
  })),
}));

describe('Microphone component', () => {
  // Test case for rendering the Microphone component
  it('should render Microphone component correctly', () => {
    const { getByText } = render(
      <Microphone selectedTranscription={null} setSelectedTranscription={() => {}} />
    );

    expect(getByText('Start Recording')).toBeInTheDocument();
  });

  // Test case for clicking on start recording button
//   it('should call startRecording function when Start Recording button is clicked', () => {
//     const { getByAltText } = render(
//       <Microphone selectedTranscription={null} setSelectedTranscription={() => {}} />
//     );

//     // Find the button with alt text "Start Recording" and simulate click event
//     fireEvent.click(getByAltText('Start Recording'));

//     const { startRecording } = require('@/hooks/useDeepgramTranscription').default;
//     expect(startRecording).toHaveBeenCalled();
//   });

//   // Test case for clicking on stop recording button
//   it('should call stopRecording function when Stop Recording button is clicked', () => {
//     const stopRecordingMock = jest.fn();
//     // Mocking the hook to return isRecording as true
//     jest.mock('@/hooks/useDeepgramTranscription', () => ({
//       __esModule: true,
//       default: jest.fn(() => ({
//         isRecording: true,
//         seconds: 30,
//         startRecording: jest.fn(),
//         stopRecording: stopRecordingMock,
//       })),
//     }));

//     const { getByAltText } = render(
//       <Microphone selectedTranscription={null} setSelectedTranscription={() => {}} />
//     );

//     fireEvent.click(getByAltText('Stop Recording'));

//     expect(stopRecordingMock).toHaveBeenCalled();
//   });

  // Additional tests can be added to cover more scenarios like formatting time, etc.
});
