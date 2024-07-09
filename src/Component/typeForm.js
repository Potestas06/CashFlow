import React from "react";
import { addDoc, collection, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { toggleModal } from "../Component/modal";

const TypeForm = ({ newType, setNewType, types, setTypes }) => {
  const addNewType = async () => {
    try {
      if (newType && !types.includes(newType)) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await addDoc(collection(userDocRef, "types"), { name: newType });
        setTypes([...types, newType]);
        setNewType("");
        toggleModal({
          currentTarget: { getAttribute: () => "addTypeModal" },
          preventDefault: () => {},
        });
      }
    } catch (error) {
      console.error("Error adding new type: ", error);
    }
  };

  return (
    <dialog id="addTypeModal">
      <article>
        <a
          href="#close"
          aria-label="Close"
          className="close"
          data-target="addTypeModal"
          onClick={toggleModal}
        ></a>
        <h5>Add New Type</h5>
        <form id="typeForm">
          <label htmlFor="newType">New Type</label>
          <input
            type="text"
            id="newType"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            required
          />
          <footer>
            <button
              type="button"
              className="secondary"
              data-target="addTypeModal"
              onClick={toggleModal}
            >
              Close
            </button>
            <button type="button" className="primary" onClick={addNewType}>
              Add Type
            </button>
          </footer>
        </form>
      </article>
    </dialog>
  );
};

export default TypeForm;
