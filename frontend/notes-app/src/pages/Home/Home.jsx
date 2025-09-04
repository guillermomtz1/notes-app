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
      console.log("createNote called with:", noteData);
      const token = await getToken();
      const method = noteData.id ? "PUT" : "POST";
      const endpoint = noteData.id
        ? API_ENDPOINTS.NOTE_BY_ID(noteData.id)
        : API_ENDPOINTS.NOTES;

      console.log("Method:", method);
      console.log("Endpoint:", endpoint);
      console.log("Token:", token ? "Present" : "Missing");

      await apiRequest(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });
      console.log("API request successful");
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
                    data: {
                      ...note,
                      id: note._id, // Map _id to id for the edit modal
                    },
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
      {!openAddEditModal.isShown &&
        !openViewModal.isShown &&
        !openDeleteModal.isShown && (
          <div className="md:absolute md:bottom-20 md:left-1/2 md:transform md:-translate-x-1/2 md:z-40 md:w-full md:flex md:justify-center">
            <div className="mt-8 md:mt-0 flex flex-col items-center gap-4">
              <WeeklyProgressBar activityData={activityData} />
              <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-primary-dark text-black transition-all duration-200 cursor-pointer hover:glow-effect-green z-50 md:hidden"
                onClick={() => {
                  setOpenAddEditModal({
                    isShown: true,
                    type: "add",
                    data: null,
                  });
                }}
              >
                <MdAdd className="text-[32px] text-white" />
              </button>
            </div>
          </div>
        )}

      {/* Desktop Add Button */}
      {!openAddEditModal.isShown &&
        !openViewModal.isShown &&
        !openDeleteModal.isShown && (
          <button
            className="hidden md:flex w-16 h-16 items-center justify-center rounded-2xl bg-primary hover:bg-primary-dark text-black absolute right-10 bottom-20 transition-all duration-200 cursor-pointer hover:glow-effect-green z-50"
            onClick={() => {
              setOpenAddEditModal({ isShown: true, type: "add", data: null });
            }}
          >
            <MdAdd className="text-[32px] text-white" />
          </button>
        )}

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        contentLabel=""
        className="w-[80%] max-w-xl mx-auto p-3 md:p-6 bg-surface rounded-lg overflow-hidden h-[500px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-surface [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        contentLabel=""
        className="w-[85%] max-w-3xl mx-auto p-3 md:p-6 bg-surface rounded-lg overflow-y-auto max-h-[80vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-surface [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {openViewModal.data && (
          <div className="relative">
            <button
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-surface border border-border hover:bg-surface-light hover:border-primary transition-colors cursor-pointer z-10"
              onClick={() => {
                setOpenViewModal({ isShown: false, data: null });
              }}
            >
              <MdClose className="text-lg md:text-xl text-text-muted hover:text-primary transition-colors" />
            </button>

            <div className="mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-text mb-2 leading-tight">
                {openViewModal.data.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-text-light text-xs md:text-sm">
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

            <div className="mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold text-text mb-2 md:mb-3">
                Content
              </h2>
              <div className="bg-surface-light border border-border rounded-lg p-3 md:p-4 text-text leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {openViewModal.data.content}
              </div>
            </div>

            {openViewModal.data.tags && openViewModal.data.tags.length > 0 && (
              <div className="mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-semibold text-text mb-2 md:mb-3">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {openViewModal.data.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/20 text-primary border border-primary/30 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center pt-3 md:pt-4 border-t border-border">
              <button
                className="bg-primary hover:bg-primary-dark text-black font-medium py-2 md:py-3 px-6 md:px-8 rounded-lg transition-colors cursor-pointer text-sm md:text-base"
                onClick={() => {
                  setOpenViewModal({ isShown: false, data: null });
                  setOpenAddEditModal({
                    isShown: true,
                    type: "edit",
                    data: {
                      ...openViewModal.data,
                      id: openViewModal.data._id, // Map _id to id for the edit modal
                    },
                  });
                }}
              >
                Edit Note
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
