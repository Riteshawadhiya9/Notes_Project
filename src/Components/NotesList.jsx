import React from "react";
import NoteCard from "./NoteCard";

const NotesList = ({
  filteredNotes,
  search,
  setSearch,
  onEdit,
  onDelete,
  onTogglePin,
  showToast,
  showNotesList,
}) => {
  return (
    <div
      className={`w-full lg:w-1/2 h-screen overflow-y-auto bg-gray-900/50 border-l border-gray-700 ${
        !showNotesList ? "hidden lg:flex" : "flex"
      } flex-col`}
    >
      <div className="p-4 md:p-8 h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-3 mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">Your Notes</h2>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:ml-auto md:w-48 px-3 py-2 rounded bg-gray-800 border border-gray-700 outline-none text-sm"
          />
        </div>

        <div className="flex-1 overflow-auto py-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-gray-400 mt-12 md:mt-20">
              <p className="text-lg md:text-xl">No notes found. Try adding one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-max">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                  showToast={showToast}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesList;
