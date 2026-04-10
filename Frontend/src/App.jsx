import { useState,useEffect } from 'react'
import axios from 'axios'


function App() {
  const [theme, setTheme] = useState('dark')

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateNoteData, setUpdateNoteData] = useState({ id: null, title: "", description: "" })

  const [notes, setNotes] = useState([
    {
    title:"test title 1",
    description:"test description 1",
    },
    {
    title:"test title 2",
    description:"test description 2",
    },
    {
    title:"test title 3",
    description:"test description 3",
    },
    {
    title:"test title 4",
    description:"test description 4",
    }
])

  function fetchNotes(){
      axios.get("https://backendlearn-doxd.onrender.com/api/notes").then(res=>{
      setNotes(res.data.notes)
    })
  }

  useEffect(()=>{
    fetchNotes()
  },[])

  function handleAddNote(e){
    e.preventDefault()
    const {title,description} = e.target.elements
    axios.post("https://backendlearn-doxd.onrender.com/api/notes",{
      title:title.value,
      description:description.value
    }).then(res=>{
      console.log(res.data)

      fetchNotes()
    })
  }

  function handleDeleteNote(noteId){
    axios.delete(`https://backendlearn-doxd.onrender.com//api/notes/${noteId}`).then(res=>{
      console.log(res.data)
      fetchNotes()
    })
  }

  function handleUpdateClick(note){
    setUpdateNoteData({ id: note._id, title: note.title, description: note.description })
    setIsUpdateModalOpen(true)
  }

  function submitUpdateNote(e){
    e.preventDefault()
    axios.patch(`https://backendlearn-doxd.onrender.com//api/notes/${updateNoteData.id}`, {
      title: updateNoteData.title,
      description: updateNoteData.description
    }).then(res=>{
      console.log(res.data)
      setIsUpdateModalOpen(false)
      fetchNotes()
    })
  }

  function closeUpdateModal(){
    setIsUpdateModalOpen(false)
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <h1>My Notes ✨</h1>
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

    <form className='note-create-form glass-panel' onSubmit={handleAddNote}>
      <input name="title" type="text" placeholder="Enter Title" />
      <input name="description" type="text" placeholder="Enter Description" />
      <button type="submit">Add Note</button>
    </form>

    {isUpdateModalOpen && (
      <div className="modal-overlay" onClick={closeUpdateModal}>
        <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
          <h2>Update Note</h2>
          <form className="modal-form" onSubmit={submitUpdateNote}>
            <input 
              name="title" 
              type="text" 
              value={updateNoteData.title}
              onChange={e => setUpdateNoteData({...updateNoteData, title: e.target.value})}
              placeholder="Enter Title" 
            />
            <input 
              name="description" 
              type="text" 
              value={updateNoteData.description}
              onChange={e => setUpdateNoteData({...updateNoteData, description: e.target.value})}
              placeholder="Enter Description" 
            />
            <div className="modal-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={closeUpdateModal}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="notes">
      {
        notes.map((note, index) => {
        return <div key={index} className="note glass-panel">
          <h2>{note.title}</h2>
          <p>{note.description}</p>
          <div className="note-actions">
            <button className="btn-delete" onClick={()=>handleDeleteNote(note._id)}>Delete</button>
            <button className="btn-update" onClick={()=>handleUpdateClick(note)}>Update</button>
          </div>
        </div>
      })}
    </div>
    </div>
  )
}

export default App
