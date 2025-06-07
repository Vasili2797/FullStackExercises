import React from "react";
import Names from "./Names";

const Persons = (prop) => {
  return (
    <div>
      {prop.persons.map((elem) => {
        return (
          <Names key={elem.id} person={elem} deleteName={prop.deleteName} />
        );
      })}
    </div>
  );
};

export default Persons;
