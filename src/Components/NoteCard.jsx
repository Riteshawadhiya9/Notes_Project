import React from "react";

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  // onCopy,
  showToast,
}) => {
  const handleCopy = () => {
    navigator.clipboard?.writeText(`${note.title}\n\n${note.detail}`);
    showToast("Copied!");
  };

  return (
    <div
      className={`p-4 md:p-5 rounded-xl shadow-md transform hover:scale-105 transition bg-gradient-to-br ${note.color} relative min-h-64 md:min-h-72 flex flex-col`}
    >
      <div className="flex-1 mb-3 md:mb-4">
        <h3 className="font-bold text-base md:text-lg text-gray-900 leading-tight line-clamp-2">
          {note.title}
        </h3>
        <p className="text-xs md:text-sm text-gray-800 mt-2 md:mt-3 break-words whitespace-pre-wrap max-h-32 md:max-h-40 overflow-auto">
          {note.detail || <span className="text-gray-700/70 italic">— no details —</span>}
        </p>
      </div>

      <div className="flex justify-between items-end w-full mb-3 md:mb-4">
        <button
          title={note.pinned ? "Unpin" : "Pin"}
          onClick={() => onTogglePin(note.id)}
          className={`px-2 py-1 rounded text-sm transition ${
            note.pinned ? "bg-yellow-500" : "bg-white/70 text-black hover:bg-white"
          } active:scale-95`}
        >
          {note.pinned ? "📌" : "📍"}
        </button>
        <div className="text-[10px] md:text-[11px] text-gray-700 font-medium">{note.time}</div>
      </div>

      <div className="flex items-center justify-between gap-2 w-full">
        <button
          onClick={() => onEdit(note)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2 md:px-3 py-2 rounded font-medium text-xs md:text-sm active:scale-95 transition"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-2 rounded font-medium text-xs md:text-sm active:scale-95 transition"
        >
          📋 Copy
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 md:px-3 py-2 rounded font-medium text-xs md:text-sm active:scale-95 transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
