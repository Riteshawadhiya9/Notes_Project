import React from "react";

const NoteForm = ({
  onSubmit,
  title,
  setTitle,
  detail,
  setDetail,
  titleRef,
  detailRef,
  editId,
  setEditId,
  clearAll,
  showToast,
  notes,
  CHAR_LIMIT,
}) => {
  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setDetail("");
    showToast("Edit cancelled");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-900/60 backdrop-blur-sm p-4 md:p-8 flex flex-col gap-4 h-full"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold">📝 Notes</h1>
        <div className="flex gap-2 items-center flex-wrap">
          <button
            type="button"
            onClick={clearAll}
            className="text-xs px-2 md:px-3 py-1 bg-red-600/80 hover:bg-red-500 rounded transition"
          >
            Clear
          </button>
        </div>
      </div>

      <input
        ref={titleRef}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-3 md:px-4 py-2 md:py-3 rounded bg-gray-800 border border-gray-700 focus:border-indigo-400 outline-none text-base md:text-lg"
      />

      <div className="relative flex-1 min-h-40">
        <textarea
          ref={detailRef}
          placeholder="Write details..."
          value={detail}
          onChange={(e) => {
            if (e.target.value.length <= CHAR_LIMIT) setDetail(e.target.value);
          }}
          className="px-3 md:px-4 py-2 md:py-3 rounded bg-gray-800 border border-gray-700 focus:border-indigo-400 outline-none resize-none w-full h-full"
        />
        <div className="text-[10px] md:text-[11px] text-gray-400 absolute right-2 md:right-3 bottom-2">
          {detail.length}/{CHAR_LIMIT}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 flex-wrap">
        <button
          type="submit"
          className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 py-2 px-4 md:px-6 rounded font-semibold hover:opacity-95 active:scale-95 transition text-base md:text-lg"
        >
          {editId !== null ? "Save Changes" : "Add Note"}
        </button>

        {editId !== null && (
          <button
            type="button"
            onClick={handleCancel}
            className="w-full md:w-auto text-xs px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          >
            Cancel Edit
          </button>
        )}

        <div className="text-xs md:text-sm text-gray-300">
          Total: {notes.length} • Pinned: {notes.filter((n) => n.pinned).length}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Pro tip: Pin to keep at top. Use export/import to backup.
      </p>
    </form>
  );
};

export default NoteForm;
