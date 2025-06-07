import { useEffect, useState } from "react";
import numberService from "./services/Contacts";
import Persons from "./services/Persons";
import "./index.css";
import Notification from "./components/Notification";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");

  const [newNumber, setNewNumber] = useState("");
  const [foundMembers, setFoundMembers] = useState([]);
  const [addedNewContactMessage, setAddedNewContactMessage] = useState("");

  const hook = () => {
    numberService.getAllNumbers().then((initialNumbers) => {
      setPersons(initialNumbers);
    });
  };

  useEffect(hook, []);

  const newPerson = {
    name: newName,
    number: newNumber,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newName.trim() || !newNumber.trim()) {
      alert("Name and number must not be empty.");
      return;
    }

    const nameExists = persons.some((person) => person.name === newName);

    if (nameExists) {
      const confirmchange = window.confirm(
        `${newName} is already added to phonebook`
      );
      setNewName("");
      setNewNumber("");
    } else {
      numberService
        .createContact(newPerson)
        .then((response) => {
          console.log(response);
          setPersons(persons.concat(response));
        })
        .then(() => {
          setAddedNewContactMessage(`Added a new contact ${newName}`);
          setTimeout(() => {
            setAddedNewContactMessage(null);
          }, 5000);
        })
        .then(() => {
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.error("Failed to add contact: ", error);
          alert("Failed to add contact.");
        });
    }
  };

  const deleteName = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (!confirmDelete) {
      return;
    }

    numberService
      .removeContact(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setFoundMembers(foundMembers.filter((person) => person.id !== id));
      })
      .catch((error) => {
        console.log("Error deleting person from contacts", error.message);
        alert("Error deleting person from contacts");
      });
  };

  const handleInputChange = (e) => {
    setNewName(e.target.value);
  };

  // const handleInputChange = (e) => {
  //   for (let i = 0; i < persons.length; i++) {
  //     if (persons[i].content == e.target.value) {
  //       alert(`${e.target.value} is already added to phonebook`);
  //       setNewName("");
  //       break;
  //     } else {
  //       setNewName(e.target.value);
  //     }
  //   }
  // };

  const handleNumberInputChange = (e) => {
    setNewNumber(e.target.value);
  };
  // console.log(typeof(foundMembers));

  // const findingMemberFunction = (e) => {
  //   for (let i = 0; i < persons.length; i++) {
  //     if (
  //       persons[i].name.includes(e.target.value) ||
  //       persons[i].number.includes(e.target.value)
  //     ) {
  //       let result = persons[i].name + " " + persons[i].number;
  //       setFoundMembers(result);
  //       // console.log(typeof(foundMembers));
  //     }
  //   }
  // };
  const findingMemberFunction = (e) => {
    const filtered = persons.filter(
      (p) =>
        p.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        p.number.includes(e.target.value)
    );
    setFoundMembers(filtered);
  };

  // let foundMember;

  return (
    <>
      <div>
        <h2>Phonebook</h2>
        <Notification name={addedNewContactMessage} />
        {foundMembers}
        <p>
          filter shown with{" "}
          <input
            type="text"
            onChange={(e) => {
              findingMemberFunction(e);
            }}
          />
          <br />
          {foundMembers.map((person) => {
            return <p>{person}</p>;
          })}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          name:{" "}
          <input
            value={newName}
            onChange={handleInputChange}
            placeholder="name..."
          />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={handleNumberInputChange}
            placeholder="123..."
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} deleteName={deleteName} />
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete ALL contacts?")) {
            numberService.deleteAllContacts().then(() => {
              setPersons([]);
              setAddedNewContactMessage("All contacts deleted");
              setTimeout(() => {
                setAddedNewContactMessage(null);
              }, 3000);
            });
          }
        }}
        style={{ marginTop: "1rem", backgroundColor: "red", color: "white" }}
      >
        Clear All Contacts (Dev Only)
      </button>
    </>
  );
}

export default App;
