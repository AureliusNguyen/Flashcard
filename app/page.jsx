"use client"
import { useRef, useState } from "react";

export default function Home() {
  const [flashcards, setFlashcards] = useState([]);
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableFlashcards, setEditableFlashcards] = useState([]);
  const index = useRef({ start: -1, end: 1 });

  function parse(content) {
    let { start, end } = index.current;

    if (start === -1) {
      const found = content.indexOf("{");
      if (found !== -1) start = found;
    } else {
      const i = content.indexOf("}", end);
      if (i !== -1) {
        end = i + 1;
        const str = content.slice(start, end);
        start = end + 1;

        try {
          const flashcard = JSON.parse(str);
          if (flashcard && flashcards.length < 10)
            setFlashcards((prev) => [...prev, { ...flashcard, flipped: false }]);
        } catch (err) {}
      }
    }

    index.current = { start, end };
  }

  async function generate(e) {
    e.preventDefault();

    if (flashcards.length >= 10) {
      setMessage("Maximum limit of 10 flashcards reached. Please delete some to generate more.");
      return;
    }

    index.current = { start: -1, end: 1 };
    setMessage("");
    setFlashcards([]);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: value,
    });

    if (response.ok) {
      const decoder = new TextDecoder();
      const completion = response.body;

      let content = "";
      for await (let chunk of completion) {
        const text = decoder.decode(chunk);
        content = content + text;
        parse(content);
      }
      setMessage(content);
    }
  }

  const handleFlip = (index) => {
    setFlashcards(flashcards.map((card, i) => 
      i === index ? { ...card, flipped: !card.flipped } : card
    ));
  };

  const handleDelete = (index) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const openEditModal = () => {
    setEditableFlashcards(flashcards);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (index, field, value) => {
    setEditableFlashcards(editableFlashcards.map((card, i) => 
      i === index ? { ...card, [field]: value } : card
    ));
  };

  const saveEdits = () => {
    setFlashcards(editableFlashcards);
    setIsEditModalOpen(false);
  };
  const addNewFlashcard = () => {
    if (editableFlashcards.length < 10) {
      setEditableFlashcards([...editableFlashcards, { front: "", back: "", flipped: false }]);
    } else {
      alert("Maximum limit of 10 flashcards reached.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Flashcard Generator</h1>
        <form
          className="flex flex-col items-center w-full gap-y-4 mb-12"
          onSubmit={generate}
        >
          <textarea
            className="textarea textarea-primary w-full max-w-2xl h-36 text-sm shadow-lg focus:textarea-accent transition-all duration-300"
            placeholder={`Example:\nPlanets\n\nQ: Is the sun hot?\nQ: What is the temperature of the sun?`}
            value={value}
            minLength={2}
            required
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className="btn btn-primary btn-md w-full max-w-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            type="submit"
          >
            Generate Flashcards
          </button>
        </form>
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {flashcards.map((card, index) => (
              <div key={index} className="flex justify-center perspective-1000">
                <div 
                  className={`card w-full h-64 shadow-xl cursor-pointer transition-all duration-500 preserve-3d hover:shadow-2xl ${card.flipped ? 'rotate-y-180' : ''}`}
                  onClick={() => handleFlip(index)}
                >
                  <div className="absolute w-full h-full backface-hidden">
                    <div className="card-body flex flex-col justify-between h-full bg-base-100 rounded-xl p-6">
                      <h2 className="card-title text-lg font-semibold mb-2">Question</h2>
                      <p className="text-sm overflow-auto flex-grow">{card.front}</p>
                      <div className="card-actions justify-between mt-4">
                        <button 
                          className="btn btn-xs btn-error" 
                          onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                        >
                          Delete
                        </button>
                        <span className="badge badge-ghost">Click to flip</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute w-full h-full backface-hidden rotate-y-180">
                    <div className="card-body flex flex-col justify-between h-full bg-secondary text-secondary-content rounded-xl p-6">
                      <h2 className="card-title text-lg font-semibold mb-2">Answer</h2>
                      <p className="text-sm overflow-auto flex-grow">{card.back}</p>
                      <div className="card-actions justify-end mt-4">
                        <span className="badge border-black text-white bg-black">Click to flip back</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
		  {flashcards.length > 0 && (
            <div className="text-center mb-4 mt-8">
              <button onClick={openEditModal} className="btn btn-secondary">
                Edit  Flashcards
              </button>
            </div>
          )}
          {flashcards.length === 0 && message && (
            <div className="alert alert-info shadow-lg mt-8">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Flashcards</h2>
            {editableFlashcards.map((card, index) => (
              <div key={index} className="mb-4 p-4 border border-base-300 rounded-lg">
                <div className="mb-2">
                  <label className="font-semibold">Question:</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={card.front}
                    onChange={(e) => handleEditChange(index, 'front', e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold">Answer:</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={card.back}
                    onChange={(e) => handleEditChange(index, 'back', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={addNewFlashcard} 
                className="btn btn-secondary"
                disabled={editableFlashcards.length >= 10}
              >
                Add New Flashcard
              </button>
              <div>
                <button onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost mr-2">Cancel</button>
                <button onClick={saveEdits} className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}