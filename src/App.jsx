// import React, { useState } from "react";

// const App = () => {
//   const [title, setTitle] = useState("");
//   const [details, setDetails] = useState("");
//   const [notes, setNotes] = useState([]);

//   // NOTE ADD KARNE KA FUNCTION
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // New note object
//     const newNote = { title, details };

//     // Update notes list
//     setNotes([...notes, newNote]);

//     // Clear input fields
//     setTitle("");
//     setDetails("");
//   };

//   // NOTE DELETE KARNE KA FUNCTION
//   const handleDelete = (index) => {
//     const updatedNotes = notes.filter((_, idx) => idx !== index);
//     setNotes(updatedNotes);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row p-6">
      
//       {/* ------------------- LEFT FORM ------------------- */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-900 p-8 rounded-xl w-full lg:w-1/2 flex flex-col gap-5"
//       >
//         <h1 className="text-3xl font-bold">Add New Note</h1>

//         {/* Note Title */}
//         <input
//           type="text"
//           placeholder="Enter Note Title"
//           className="px-4 py-3 bg-gray-800 border border-gray-600 rounded outline-none"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         {/* Note Details */}
//         <textarea
//           placeholder="Write details here..."
//           className="px-4 py-3 bg-gray-800 border border-gray-600 rounded h-32 outline-none"
//           value={details}
//           onChange={(e) => setDetails(e.target.value)}
//         />

//         {/* Button */}
//         <button
//           className="bg-indigo-500 py-3 rounded font-semibold hover:bg-indigo-400 active:scale-95"
//         >
//           Add Note
//         </button>
//       </form>

//       {/* ------------------- RIGHT NOTES LIST ------------------- */}
//       <div className="lg:w-1/2 lg:border-l-2 p-8">
//         <h1 className="text-3xl font-bold mb-4">Your Notes</h1>

//         <div className="flex flex-wrap gap-6 overflow-auto h-[80vh]">
//           {notes.map((note, index) => (
//             <div
//               key={index}
//               className="h-52 w-40 bg-white text-black rounded-xl shadow-lg p-4 flex flex-col justify-between"
//             >
//               <div>
//                 <h3 className="font-bold text-lg leading-tight">{note.title}</h3>
//                 <p className="text-xs text-gray-700 mt-2 leading-tight">
//                   {note.details}
//                 </p>
//               </div>

//               <button
//                 onClick={() => handleDelete(index)}
//                 className="bg-red-500 text-white py-1 rounded text-sm active:scale-95"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default App;















































import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("my_notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState("");
  const [showNotesList, setShowNotesList] = useState(false);
  const titleRef = useRef(null);
  const detailRef = useRef(null);
  const CHAR_LIMIT = 800;

  const colors = [
    "from-yellow-200 to-yellow-100",
    "from-pink-200 to-pink-100",
    "from-blue-200 to-blue-100",
    "from-green-200 to-green-100",
    "from-purple-200 to-purple-100",
    "from-orange-200 to-orange-100",
  ];

  useEffect(() => {
    localStorage.setItem("my_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg) => setToast(msg);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !detail.trim()) {
      showToast("Please add title or details");
      return;
    }

    if (editId !== null) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editId ? { ...n, title: title.trim(), detail: detail.trim(), time: new Date().toLocaleString() } : n
        )
      );
      setEditId(null);
      showToast("Note updated");
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim() || "Untitled",
        detail: detail.trim(),
        time: new Date().toLocaleString(),
        color: colors[Math.floor(Math.random() * colors.length)],
        pinned: false,
      };
      setNotes((prev) => [newNote, ...prev]);
      showToast("Note added");
    }

    setTitle("");
    setDetail("");
    titleRef.current?.focus();
  };

  const deleteNote = (id) => {
    const ok = window.confirm("Delete this note? This can't be undone.");
    if (!ok) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast("Note deleted");
  };

  const editNote = (note) => {
    setTitle(note.title);
    setDetail(note.detail);
    setEditId(note.id);
    setShowNotesList(false);
    setTimeout(() => titleRef.current?.focus(), 60);
  };

  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const clearAll = () => {
    if (!notes.length) return showToast("No notes to clear");
    const ok = window.confirm("Clear ALL notes?");
    if (!ok) return;
    setNotes([]);
    showToast("All notes cleared");
  };

  const exportNotes = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Export started");
  };

  const importNotes = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error("Invalid file");
        const maxId = notes.reduce((m, n) => Math.max(m, n.id || 0), 0);
        const fixed = imported.map((n, i) => ({ ...n, id: (n.id || maxId) + 1 + i }));
        setNotes((prev) => [...fixed, ...prev]);
        showToast("Import successful");
      } catch {
        showToast("Import failed: invalid file");
      }
    };
    reader.readAsText(file);
  };

  const filteredNotes = notes
    .filter((n) =>
      (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.detail || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned === b.pinned) return b.id - a.id;
      return a.pinned ? -1 : 1;
    });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      
      {/* MOBILE TABS */}
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
          📋 Notes ({notes.length})
        </button>
      </div>

      <div className="flex flex-col lg:flex-row w-full min-h-screen lg:overflow-hidden">
        
        {/* FORM - LEFT SIDE */}
        <div className={`w-full lg:w-1/2 h-screen lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-700 ${showNotesList ? "hidden lg:flex" : "flex"} flex-col`}>
          <form
            onSubmit={handleSubmit}
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

                <button
                  type="button"
                  onClick={exportNotes}
                  className="text-xs px-2 md:px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded transition"
                >
                  Export
                </button>

                <label className="text-xs px-2 md:px-3 py-1 bg-green-600 hover:bg-green-500 rounded transition cursor-pointer">
                  Import
                  <input
                    type="file"
                    accept="application/json"
                    onChange={(e) => importNotes(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
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
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setDetail("");
                    showToast("Edit cancelled");
                  }}
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
        </div>

        {/* LIST - RIGHT SIDE */}
        <div className={`w-full lg:w-1/2 h-screen overflow-y-auto bg-gray-900/50 border-l border-gray-700 ${!showNotesList ? "hidden lg:flex" : "flex"} flex-col`}>
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
                    <div
                      key={note.id}
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
                          onClick={() => togglePin(note.id)}
                          className={`px-2 py-1 rounded text-sm transition ${note.pinned ? "bg-yellow-500" : "bg-white/70 text-black hover:bg-white"} active:scale-95`}
                        >
                          {note.pinned ? "📌" : "📍"}
                        </button>
                        <div className="text-[10px] md:text-[11px] text-gray-700 font-medium">{note.time}</div>
                      </div>

                      <div className="flex items-center justify-between gap-2 w-full">
                        <button
                          onClick={() => editNote(note)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2 md:px-3 py-2 rounded font-medium text-xs md:text-sm active:scale-95 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(`${note.title}\n\n${note.detail}`);
                            showToast("Copied!");
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-2 rounded font-medium text-xs md:text-sm active:scale-95 transition"
                        >
                          📋 Copy
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 md:px-3 py-2 rounded font-medium text-xs md:text-sm active:scale-95 transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed right-4 md:right-6 bottom-4 md:bottom-6 bg-black/80 text-white px-3 md:px-4 py-2 rounded shadow z-50 text-sm md:text-base">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;