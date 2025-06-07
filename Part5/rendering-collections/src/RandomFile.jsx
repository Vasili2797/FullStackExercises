import { useState, useEffect } from "react";
import noteService from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  const Note = ({ note, toggleImportance }) => {
    const label = note.important ? "make not important" : "make important";

    return (
      <li>
        {" "}
        {note.content}
        <button onClick={toggleImportance}>{label}</button>
      </li>
    );
  };

  const hook = () => {
    noteService.getAll().then((response) => {
      console.log("promise fulfilled");
      setNotes(response.data);
    });
  };

  useEffect(hook, []);

  console.log("render", notes.length, "notes");

  const addNote = (e) => {
    e.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      // id: notes.length + 1,
    };

    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response.data));
      console.log(response);
      setNewNote("");
    });

    // axios.post("http://localhost:3001/notes", noteObject).then((response) => {
    //   setNotes(notes.concat(response.data));
    //   console.log(response);
    //   setNewNote("");
    // });

    // setNotes(notes.concat(noteObject));
    // console.log(notes);
    // setNewNote("");
  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService.update(id, changedNote).then((response) => {
      setNotes(notes.map((note = note.id !== id ? note : response.data)));
    });

    // axios.put(url, changedNote).then((response) => {
    //   setNotes(notes.map((n) => (n.id !== id ? n : response.data)));
    // });
  };

  return (
    <div>
      <h1>Notes</h1>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>

      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="a new note..."
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
