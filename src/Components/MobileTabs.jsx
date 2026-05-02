import React from "react";

const MobileTabs = ({ showNotesList, setShowNotesList, notesCount }) => {
  return (
    <div className="lg:hidden flex gap-2 p-4 bg-gray-950 border-b border-gray-700">
      <button
        onClick={() => setShowNotesList(false)}
        className={`flex-1 py-2 px-4 rounded font-semibold transition ${
          !showNotesList ? "bg-indigo-600" : "bg-gray-800"
        }`}
      >
        ✏️ Editor
      </button>
      <button
        onClick={() => setShowNotesList(true)}
        className={`flex-1 py-2 px-4 rounded font-semibold transition ${
          showNotesList ? "bg-indigo-600" : "bg-gray-800"
        }`}
      >
        📋 Notes ({notesCount})
      </button>
    </div>
  );
};

export default MobileTabs;
