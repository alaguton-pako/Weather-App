import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Card from "./Card";
import { nanoid } from "nanoid";

const Notes = () => {
  const [noteInput, setNoteInput] = useState("");
  const [noteInputId, setNoteInputId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [notes, setNotes] = useState(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    return savedNotes;
  });

  const saveNotesToLocalStorage = useCallback((notes) => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, []);

  const memoizedSaveNotesToLocalStorage = useMemo(
    () => saveNotesToLocalStorage,
    [saveNotesToLocalStorage]
  );

  const handleNoteInputChange = (event) => {
    setNoteInput(event.target.value);
  };

  const handleNoteAdd = () => {
    if (isEditing) {
      const updatedNotes = notes.map((note) =>
        note.id === noteInputId ? { ...note, content: noteInput } : note
      );
      setNotes(updatedNotes);
      setIsEditing(false);
    } else {
      if (noteInput.trim() !== "") {
        // only add a new note if the input is not empty
        const newNote = { id: notes.length + 1, content: noteInput };
        setNotes([...notes, newNote]);
      }
    }
    setNoteInput("");
  };

  const handleNoteEdit = (id, content) => {
    setNoteInput(content);
    setNoteInputId(id);
    setIsEditing(true);
  };

  const handleNoteDelete = (id) => {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
  };

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    memoizedSaveNotesToLocalStorage(notes);
  }, [notes, memoizedSaveNotesToLocalStorage]);

  return (
    <Card className="w-full">
      <h1 className="text-center font-semibold text-xl text-[#15242d]">
        Keep Tabs of Your Key Note Here
      </h1>
      <div className="p-4">
        <textarea
          value={noteInput}
          onChange={handleNoteInputChange}
          placeholder="Enter note..."
          className="w-full p-2 rounded-lg border border-gray-300 mb-4"
          required
        />
        <button
          onClick={handleNoteAdd}
          className="px-4 py-2 rounded-lg bg-green-500 text-white"
        >
          {isEditing ? "Save" : "Add"}
        </button>
        {notes.map((note) => (
          <div key={nanoid()} className="flex items-center mt-4">
            <textarea
              value={note.content}
              onChange={(e) => handleNoteEdit(note.id, e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300"
              placeholder="Enter your note here"
              disabled={isEditing && noteInputId !== note.id}
              required
            />
            <button
              onClick={() => handleNoteDelete(note.id)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white mx-2"
            >
              <AiFillDelete />
            </button>
            <button
              onClick={() => handleNoteEdit(note.id, note.content)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white"
            >
              <AiFillEdit />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Notes;
