import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd, MdClose, MdDelete } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import WeeklyProgressBar from "../../components/WeeklyProgressBar/WeeklyProgressBar";
import { API_ENDPOINTS, apiRequest } from "../../utils/api";

const Home = () => {
  const { getToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });
  const [openDeleteModal, setOpenDeleteModal] = useState({
    isShown: false,
    noteId: null,
    noteTitle: "",
  });

  // Fetch notes from API
  const fetchNotes = useCallback(async () => {
    try {
      const token = await getToken();
      const data = await apiRequest(API_ENDPOINTS.NOTES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Create new note
  const createNote = async (noteData) => {
    try {
      const token = await getToken();
      await apiRequest(API_ENDPOINTS.NOTES, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });
      await fetchNotes(); // Refresh notes
      return true;
    } catch (error) {
      console.error("Error creating note:", error);
      return false;
    }
  };

  // Delete note
  const deleteNote = async (noteId) => {
    try {
      const token = await getToken();
      await apiRequest(API_ENDPOINTS.NOTE_BY_ID(noteId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchNotes();
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // Generate activity data from notes
  const activityData = notes.map((note) => ({
    date: new Date(note.date).toISOString().split("T")[0],
  }));

  return (
    <>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="container mx-auto px-4 md:px-6">
        {/* Grid set-up */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {loading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-text-light">
              Loading notes...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-text-light">
              {searchQuery
                ? `No notes found for "${searchQuery}"`
                : "No notes yet. Create your first note!"}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={new Date(note.date).toLocaleDateString()}
                content={note.content}
                tags={note.tags.join(", ")}
                onClick={() => {
                  setOpenViewModal({
                    isShown: true,
                    data: note,
                  });
                }}
                onEdit={() => {
                  setOpenAddEditModal({
                    isShown: true,
                    type: "edit",
                    data: note,
                  });
                }}
                onDelete={() => {
                  setOpenDeleteModal({
                    isShown: true,
                    noteId: note._id,
                    noteTitle: note.title,
                  });
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Weekly Progress Bar and Add Button - Responsive Layout */}
      {!openAddEditModal.isShown && (
        <div className="md:absolute md:bottom-20 md:left-1/2 md:transform md:-translate-x-1/2 md:z-40 md:w-full md:flex md:justify-center">
          <div className="mt-8 md:mt-0 flex flex-col items-center gap-4">
            <WeeklyProgressBar activityData={activityData} />
            <button
              className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-primary-dark text-black transition-all duration-200 cursor-pointer hover:glow-effect-green z-50 md:hidden"
              onClick={() => {
                setOpenAddEditModal({ isShown: true, type: "add", data: null });
              }}
            >
              <MdAdd className="text-[32px] text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Add Button */}
      <button
        className="hidden md:flex w-16 h-16 items-center justify-center rounded-2xl bg-primary hover:bg-primary-dark text-black absolute right-10 bottom-20 transition-all duration-200 cursor-pointer hover:glow-effect-green z-50"
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
          onSubmit={async (noteData) => {
            const success = await createNote(noteData);
            if (success) {
              setOpenAddEditModal({ isShown: false, type: "add", data: null });
            }
          }}
        />
      </Modal>

      {/* View Note Modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {
          setOpenViewModal({ isShown: false, data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
        contentLabel=""
        className="w-[25%] max-h-3/4 bg-surface rounded-md mx-auto mt-40 p-5 overflow-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-surface [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {openViewModal.data && (
          <div className="relative">
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center absolute -top-2 -right-3 bg-surface border border-border hover:bg-surface-light hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                setOpenViewModal({ isShown: false, data: null });
              }}
            >
              <MdClose className="text-xl text-text-muted hover:text-primary transition-colors" />
            </button>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-text mb-2">
                {openViewModal.data.title}
              </h1>
              <div className="flex items-center gap-4 text-text-light text-sm">
                <span>
                  {new Date(openViewModal.data.date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
                <span>
                  Created:{" "}
                  {new Date(openViewModal.data.createdOn).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text mb-3">Content</h2>
              <div className="bg-surface-light border border-border rounded-lg p-4 text-text leading-relaxed whitespace-pre-wrap">
                {openViewModal.data.content}
              </div>
            </div>

            {openViewModal.data.tags && openViewModal.data.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-text mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {openViewModal.data.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                className="flex-1 bg-primary hover:bg-primary-dark text-black font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  setOpenViewModal({ isShown: false, data: null });
                  setOpenAddEditModal({
                    isShown: true,
                    type: "edit",
                    data: openViewModal.data,
                  });
                }}
              >
                Edit Note
              </button>
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  setOpenViewModal({ isShown: false, data: null });
                  setOpenDeleteModal({
                    isShown: true,
                    noteId: openViewModal.data._id,
                    noteTitle: openViewModal.data.title,
                  });
                }}
              >
                Delete Note
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openDeleteModal.isShown}
        onRequestClose={() => {
          setOpenDeleteModal({ isShown: false, noteId: null, noteTitle: "" });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
        contentLabel=""
        className="w-[400px] bg-surface rounded-md mx-auto mt-40 p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdDelete className="text-2xl text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-text mb-2">Delete Note</h2>
          <p className="text-text-light mb-6">
            Are you sure you want to delete "{openDeleteModal.noteTitle}"? This
            action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={() => {
                setOpenDeleteModal({
                  isShown: false,
                  noteId: null,
                  noteTitle: "",
                });
              }}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={async () => {
                if (openDeleteModal.noteId) {
                  await deleteNote(openDeleteModal.noteId);
                }
                setOpenDeleteModal({
                  isShown: false,
                  noteId: null,
                  noteTitle: "",
                });
              }}
              autoFocus
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Home;
