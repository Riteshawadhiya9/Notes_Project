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

// export default App;// youtube wala




import React, { useState, useEffect, useRef } from "react";
import MobileTabs from "./Components/MobileTabs";
import NoteForm from "./Components/NoteForm";
import NotesList from "./Components/NotesList";
import Toast from "./Components/Toast";

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

  // const exportNotes = () => {
  //   const data = JSON.stringify(notes, null, 2);
  //   const blob = new Blob([data], { type: "application/json" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `notes-${new Date().toISOString()}.json`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  //   showToast("Export started");
  // };

  // const importNotes = (file) => {
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     try {
  //       const imported = JSON.parse(e.target.result);
  //       if (!Array.isArray(imported)) throw new Error("Invalid file");
  //       const maxId = notes.reduce((m, n) => Math.max(m, n.id || 0), 0);
  //       const fixed = imported.map((n, i) => ({ ...n, id: (n.id || maxId) + 1 + i }));
  //       setNotes((prev) => [...fixed, ...prev]);
  //       showToast("Import successful");
  //     } catch {
  //       showToast("Import failed: invalid file");
  //     }
  //   };
  //   reader.readAsText(file);
  // };

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
      <MobileTabs
        showNotesList={showNotesList}
        setShowNotesList={setShowNotesList}
        notesCount={notes.length}
      />

      <div className="flex flex-col lg:flex-row w-full min-h-screen lg:overflow-hidden">
        {/* FORM - LEFT SIDE */}
        <div
          className={`w-full lg:w-1/2 h-screen lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-700 ${
            showNotesList ? "hidden lg:flex" : "flex"
          } flex-col`}
        >
          <NoteForm
            onSubmit={handleSubmit}
            title={title}
            setTitle={setTitle}
            detail={detail}
            setDetail={setDetail}
            titleRef={titleRef}
            detailRef={detailRef}
            editId={editId}
            setEditId={setEditId}
            clearAll={clearAll}
            showToast={showToast}
            notes={notes}
            CHAR_LIMIT={CHAR_LIMIT}
          />
        </div>

        {/* LIST - RIGHT SIDE */}
        <NotesList
          filteredNotes={filteredNotes}
          search={search}
          setSearch={setSearch}
          onEdit={editNote}
          onDelete={deleteNote}
          onTogglePin={togglePin}
          showToast={showToast}
          showNotesList={showNotesList}
        />
      </div>

      <Toast toast={toast} />
    </div>
  );
};

export default App;