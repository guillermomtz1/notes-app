import React, { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd, MdClose, MdDelete } from "react-icons/md";
import AddEditModal from "../../components/Modals/AddEditModal";
import ViewModal from "../../components/Modals/ViewModal";
import Modal from "react-modal";
import { FloatingActionButton } from "../../components/FloatingActionButton";
import { API_ENDPOINTS, apiRequest } from "../../utils/api";

const Home = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check if user has premium subscription (check both fields like backend)
  const hasPremiumFromMetadata = user?.publicMetadata?.subscription === "premium";
  const hasPremiumFromPla = user?.pla === "u:premium";
  const hasPremium = hasPremiumFromMetadata || hasPremiumFromPla;

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

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          // Note limit reached - show upgrade modal (only for free users)
          if (!hasPremium) {
            setShowUpgradeModal(true);
          }
          return false;
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      await response.json();
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

  // Filter and sort notes based on search query and date
  const filteredNotes = notes
    .filter((note) => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, latest first

  // Generate activity data from notes
  const activityData = notes.map((note) => ({
    date: new Date(note.date).toISOString().split("T")[0],
  }));

  return (
    <>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Floating Action Button with Progress Bar */}
      <FloatingActionButton
        isVisible={
          !openAddEditModal.isShown &&
          !openViewModal.isShown &&
          !openDeleteModal.isShown
        }
        onAddClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
        activityData={activityData}
      />

      <div className="container mx-auto px-4 md:px-6 pb-16">
        {/* Note Counter - Only show for free users */}
        {!hasPremium && (
          <div className="mt-8 mb-4">
            <div className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text">
                    Your Notes
                  </h3>
                  <p className="text-sm text-text-light">
                    {notes.length} of 10 (Free Plan) notes used
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-32 bg-surface-light rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        notes.length >= 10 ? "bg-red-500" : "bg-primary"
                      }`}
                      style={{
                        width: `${Math.min((notes.length / 10) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  {!hasPremium && (
                    <button
                      onClick={() => navigate("/subscription")}
                      className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer bg-transparent border border-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white transition-all duration-200"
                    >
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium User Note Count - Simple display */}
        {hasPremium && (
          <div className="mt-8 mb-4">
            <div className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text">
                    Your Notes
                  </h3>
                  <p className="text-sm text-text-light">
                    {notes.length} notes • Premium Plan
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      Unlimited
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid set-up */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Add/Edit Note Modal */}
      <AddEditModal
        isOpen={openAddEditModal.isShown}
        onClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        onSubmit={createNote}
        type={openAddEditModal.type}
        noteData={openAddEditModal.data}
      />

      {/* View Note Modal */}
      <ViewModal
        isOpen={openViewModal.isShown}
        onClose={() => {
          setOpenViewModal({ isShown: false, data: null });
        }}
        noteData={openViewModal.data}
        onEdit={() => {
          if (openViewModal.data) {
            setOpenViewModal({ isShown: false, data: null });
            setOpenAddEditModal({
              isShown: true,
              type: "edit",
              data: {
                ...openViewModal.data,
                id: openViewModal.data._id, // Map _id to id for the edit modal
              },
            });
          }
        }}
      />

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
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
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
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
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

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onRequestClose={() => setShowUpgradeModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
        contentLabel="Upgrade to Premium"
        className="w-[500px] bg-surface rounded-md mx-auto mt-40 p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <MdAdd className="text-2xl text-white" />
          </div>

          <h2 className="text-2xl font-bold text-text mb-2">
            Upgrade to Premium
          </h2>
          <p className="text-text-light mb-6">
            You've reached the limit of 10 notes on the free plan. Upgrade to
            Premium for unlimited notes and premium features!
          </p>

          <div className="bg-surface-light rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text mb-2">Premium Features:</h3>
            <ul className="text-sm text-text-light space-y-1">
              <li>• Unlimited notes</li>
              <li>• Priority support</li>
              <li>• Export features (Coming Soon)</li>
              <li>• AI Summary (Coming Soon)</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
              onClick={() => setShowUpgradeModal(false)}
            >
              Maybe Later
            </button>
            <button
              className="flex-1 btn-primary py-3"
              onClick={() => {
                setShowUpgradeModal(false);
                navigate("/subscription");
              }}
              autoFocus
            >
              Upgrade Now - $1.99/month
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Home;
