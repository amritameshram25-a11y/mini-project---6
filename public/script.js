
async function sendData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
}

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not load data.");
  }

  return data;
}

function showStatus(id, message) {
  document.getElementById(id).textContent = message;
}

function createItem(containerId, titleText, details, dateText) {
  const container = document.getElementById(containerId);
  const card = document.createElement("div");
  card.className = "item";

  const title = document.createElement("h4");
  title.textContent = titleText;
  card.appendChild(title);

  details.forEach(function(text) {
    const p = document.createElement("p");
    p.textContent = text;
    card.appendChild(p);
  });

  if (dateText) {
    const small = document.createElement("small");
    small.textContent = dateText;
    card.appendChild(small);
  }

  container.appendChild(card);
}

// CONTACT FORM
document.getElementById("contactForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  try {
    const result = await sendData("/submit-contact", {
      name: document.getElementById("contactName").value.trim(),
      email: document.getElementById("contactEmail").value.trim(),
      message: document.getElementById("contactMessage").value.trim()
    });

    showStatus("contactStatus", result.message);
    this.reset();
    await loadContacts();
  } catch (error) {
    showStatus("contactStatus", error.message);
  }
});

async function loadContacts() {
  try {
    const contacts = await getData("/contacts");
    const container = document.getElementById("contacts");
    container.innerHTML = "";

    contacts.forEach(function(contact) {
      createItem(
        "contacts",
        contact.name,
        ["Email: " + contact.email, contact.message],
        new Date(contact.submissionDate).toLocaleString()
      );
    });
  } catch (error) {
    showStatus("contactStatus", error.message);
  }
}

// STUDENT PROGRESS FORM
document.getElementById("progressForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  try {
    const result = await sendData("/progress", {
      studentName: document.getElementById("studentName").value.trim(),
      courseName: document.getElementById("courseName").value.trim(),
      completionPercentage: document.getElementById("percentage").value
    });

    showStatus("progressStatus", result.message);
    this.reset();
    await loadProgress();
  } catch (error) {
    showStatus("progressStatus", error.message);
  }
});

async function loadProgress() {
  try {
    const entries = await getData("/progress");
    const container = document.getElementById("progressList");
    container.innerHTML = "";

    entries.forEach(function(item) {
      createItem(
        "progressList",
        item.studentName,
        [
          "Course: " + item.courseName,
          "Completion: " + item.completionPercentage + "%"
        ],
        new Date(item.lastUpdated).toLocaleString()
      );
    });
  } catch (error) {
    showStatus("progressStatus", error.message);
  }
}

// QUICK NOTES FORM
document.getElementById("noteForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  try {
    const result = await sendData("/notes", {
      title: document.getElementById("noteTitle").value.trim(),
      content: document.getElementById("noteContent").value.trim()
    });

    showStatus("noteStatus", result.message);
    this.reset();
    await loadNotes();
  } catch (error) {
    showStatus("noteStatus", error.message);
  }
});

async function loadNotes() {
  try {
    const notes = await getData("/notes");
    const container = document.getElementById("notes");
    container.innerHTML = "";

    notes.forEach(function(note) {
      createItem(
        "notes",
        note.title,
        [note.content],
        new Date(note.createdAt).toLocaleString()
      );
    });
  } catch (error) {
    showStatus("noteStatus", error.message);
  }
}

// Load saved data when website opens
loadContacts();
loadProgress();
loadNotes();
