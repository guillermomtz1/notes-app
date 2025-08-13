import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";

import { Link } from "react-router-dom";
import NoteCard from "../../components/Cards/NoteCard";

import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import WeeklyProgressBar from "../../components/WeeklyProgressBar/WeeklyProgressBar";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    typy: "add",
    data: null,
  });

  // Sample activity data - replace with real data from your database
  const sampleActivityData = [
    { date: "2025-01-06" },
    { date: "2025-01-13" },
    { date: "2025-01-27" },
    { date: "2025-02-03" },
    { date: "2025-02-17" },
    { date: "2025-03-03" },
    { date: "2025-03-10" },
    { date: "2025-03-24" },
    { date: "2025-04-07" },
    { date: "2025-04-14" },
  ];

  return (
    <>
      <Navbar />

      <div className="container mx-auto">
        {/* Grid set-up */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCard
            title="Week of Aug 11"
            date="2025-05-15"
            content="mentored an intern 5 months ago. Did a small-but-important security project &
spent a few weeks helping get an important migration over the line"
            tags="work, debug,"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>

      {/* Weekly Progress Bar - Moves with page */}
      {!openAddEditModal.isShown && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40 w-full flex justify-center">
          <WeeklyProgressBar activityData={sampleActivityData} />
        </div>
      )}

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-primary-dark text-black absolute right-10 bottom-10 transition-colors duration-200 cursor-pointer"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-surface rounded-md mx-auto mt-40 p-5 overflow-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-surface [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {/* Add-Edit Notes */}
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
        />
      </Modal>
    </>
  );
};

export default Home;
