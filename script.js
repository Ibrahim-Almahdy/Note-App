const titleInput = document.getElementById("note-title");
const textInput = document.getElementById("note-text");
const saveBtn = document.getElementById("save-btn");
const notesList = document.getElementById("notes-list");
const newNoteBtn = document.getElementById("new-note-btn");

const emptyMsg = document.getElementById("empty-msg");
const editorSection = document.getElementById("editor-section");
const formTitle = document.getElementById("form-title");

let editIndex = null;

document.addEventListener("DOMContentLoaded", showNotes);

newNoteBtn.addEventListener("click", () => {
  titleInput.value = "";
  textInput.value = "";
  editIndex = null;
  formTitle.innerText = "ملاحظة جديدة";

  emptyMsg.style.display = "none";
  editorSection.style.display = "flex";

  titleInput.focus();
});

saveBtn.addEventListener("click", function () {
  let title = titleInput.value;
  let text = textInput.value;

  if (title.trim() === "") {
    alert("اكتب عنواناً للملاحظة");
    return;
  }

  let notesObj = getNotes();

  if (editIndex === null) {
    notesObj.push({
      title: title,
      text: text,
      completed: false,
    });
  } else {
    notesObj[editIndex].title = title;
    notesObj[editIndex].text = text;
  }

  localStorage.setItem("notes", JSON.stringify(notesObj));

  titleInput.value = "";
  textInput.value = "";
  editIndex = null;

  emptyMsg.style.display = "flex";
  editorSection.style.display = "none";

  showNotes();
});

function getNotes() {
  let notes = localStorage.getItem("notes");
  if (notes == null) return [];
  else return JSON.parse(notes);
}

function showNotes() {
  let notesObj = getNotes();
  let html = "";

  notesObj.forEach(function (element, index) {
    let checked = element.completed ? "checked" : "";
    let lineThrough = element.completed ? "completed-task" : "";

    html += `
            <li onclick="loadNote(${index})">
                <span class="note-info ${lineThrough}">${element.title}</span>
                
                <div class="left-controls">
                    <input type="checkbox" class="custom-checkbox" 
                           onclick="toggleComplete(event, ${index})" ${checked}>
                    
                    <span class="delete-icon" onclick="deleteNote(event, ${index})">&times;</span>
                </div>
            </li>
        `;
  });

  if (notesObj.length === 0) {
    html =
      '<p style="text-align:center; padding:20px; opacity:0.5;">القائمة فارغة</p>';
  }

  notesList.innerHTML = html;
}

function loadNote(index) {
  let notesObj = getNotes();

  titleInput.value = notesObj[index].title;
  textInput.value = notesObj[index].text;
  editIndex = index;

  formTitle.innerText = "تعديل الملاحظة";

  emptyMsg.style.display = "none";
  editorSection.style.display = "flex";
}

function toggleComplete(event, index) {
  event.stopPropagation();

  let notesObj = getNotes();
  notesObj[index].completed = !notesObj[index].completed;

  localStorage.setItem("notes", JSON.stringify(notesObj));
  showNotes();
}

function deleteNote(event, index) {
  event.stopPropagation();
  let confirmDelete = confirm("هل تريد حذف هذه الملاحظة؟");
  if (!confirmDelete) return;

  let notesObj = getNotes();
  notesObj.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notesObj));

  if (editIndex === index) {
    emptyMsg.style.display = "flex";
    editorSection.style.display = "none";
    editIndex = null;
  }

  showNotes();
}
