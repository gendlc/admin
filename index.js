// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "2302-acc-et-web-pt-b"; // ✅ Make sure this is your real cohort
const API = `${BASE}/${COHORT}`;

// === State ===
let parties = [];
let selectedParty = null;

// === API Calls ===
async function getParties() {
  try {
    const res = await fetch(`${API}/events`);
    const json = await res.json();
    parties = json.data;
    render();
  } catch (err) {
    console.error("Error fetching parties:", err);
  }
}

async function getParty(id) {
  try {
    const res = await fetch(`${API}/events/${id}`);
    const json = await res.json();
    selectedParty = json.data;
    render();
  } catch (err) {
    console.error("Error fetching party:", err);
  }
}

async function deleteParty(id) {
  try {
    await fetch(`${API}/events/${id}`, { method: "DELETE" });
    selectedParty = null;
    getParties();
  } catch (err) {
    console.error("Error deleting party:", err);
  }
}

async function addParty(partyObj) {
  try {
    await fetch(`${API}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partyObj),
    });
    getParties();
  } catch (err) {
    console.error("Error adding party:", err);
  }
}

// === Components ===
function PartyListItem(party) {
  const li = document.createElement("li");
  if (party.id === selectedParty?.id) li.classList.add("selected");

  const a = document.createElement("a");
  a.href = "#selected";
  a.textContent = party.name;
  a.addEventListener("click", () => getParty(party.id));

  li.appendChild(a);
  return li;
}

function PartyList() {
  const ul = document.createElement("ul");
  ul.classList.add("parties");
  ul.append(...parties.map(PartyListItem));
  return ul;
}

function SelectedParty() {
  const section = document.createElement("section");
  if (!selectedParty) {
    section.textContent = "Please select a party to learn more.";
    return section;
  }

  const h3 = document.createElement("h3");
  h3.textContent = `${selectedParty.name} #${selectedParty.id}`;

  const date = document.createElement("time");
  date.dateTime = selectedParty.date;
  date.textContent = selectedParty.date.slice(0, 10);

  const location = document.createElement("address");
  location.textContent = selectedParty.location;

  const desc = document.createElement("p");
  desc.textContent = selectedParty.description;

  const btn = document.createElement("button");
  btn.textContent = "Delete party";
  btn.addEventListener("click", () => deleteParty(selectedParty.id));

  section.append(h3, date, location, desc, btn);
  return section;
}

function AddPartyForm() {
  const form = document.createElement("form");

  form.innerHTML = `
    <h3>Add a new party</h3>
    <label>Name<input name="name" required /></label>
    <label>Description<input name="description" required /></label>
    <label>Date<input type="date" name="date" required /></label>
    <label>Location<input name="location" required /></label>
    <button>Add party</button>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newParty = {
      name: formData.get("name"),
      description: formData.get("description"),
      date: new Date(formData.get("date")).toISOString(),
      location: formData.get("location"),
    };
    await addParty(newParty);
    form.reset();
  });

  return form;
}

// === Render ===
function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <h1>Party Planner Admin</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
      </section>
    </main>
  `;

  const left = app.querySelector("main section:nth-of-type(1)");
  const right = app.querySelector("#selected");

  left.append(PartyList(), AddPartyForm());
  right.append(SelectedParty());
}

// === Init ===
getParties();
