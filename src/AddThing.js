import React, { useState, useEffect } from "react";
import firebase from "firebase";
// https://github.com/CSFrequency/react-firebase-hooks
import { useDocument } from "react-firebase-hooks/firestore";

/**
 *
 * @param {*} param0
 */
function AddThing({ initialValue, clear }) {
  // keep track of the input value
  const [thing, setThing] = useState("");

  // get a document if there is an initial value
  const [value, loading, error] = useDocument(
    firebase.firestore().doc("things/" + initialValue),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );

  // if there is an initial value then load it and setThing with the
  // value so it can be in the input field
  useEffect(() => {
    !loading && initialValue && value.exists && setThing(value.data().name);
  }, [loading, initialValue, value]);

  /**
   * on save determine if it is a new object or an existing object
   * by check to see if there was an initial value provided
   */
  const onSave = async () => {
    let collectionRef = firebase.firestore().collection("things");

    if (initialValue) {
      await collectionRef
        .doc(initialValue)
        .set({ name: thing, updatedOn: new Date().getTime() }, { merge: true });
      setThing("");
      clear();
    } else {
      await collectionRef.add({ name: thing, createdOn: new Date().getTime() });
      setThing("");
      clear();
    }
  };

  return (
    <div style={{ backgroundColor: "lightGrey", padding: 10 }}>
      <h4>Add A Thing</h4>
      <input
        value={thing}
        onChange={e => setThing(e.target.value)}
        style={{
          fontSize: 14,
          backgroundColor: "lightGrey",
          padding: 4,
          width: "94%"
        }}
      />
      <button style={{ fontSize: 14, marginTop: 8 }} onClick={onSave}>
        SAVE
      </button>
      <button
        style={{ fontSize: 14, marginTop: 8 }}
        onClick={() => {
          setThing("");
          clear();
        }}
      >
        RESET
      </button>
    </div>
  );
}

export default AddThing;
