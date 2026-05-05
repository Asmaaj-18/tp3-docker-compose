import { useEffect, useState } from "react";

type Item = {
  _id: string;
  name: string;
  status: "todo" | "doing" | "done";
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = "http://localhost:5000/api";

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/items`);
    const data = await res.json();
    setItems(data);
  };

  const addItem = async () => {
    if (!name.trim()) return;

    await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const updateStatus = async (item: Item) => {
    const next =
      item.status === "todo"
        ? "doing"
        : item.status === "doing"
        ? "done"
        : "todo";

    await fetch(`${API_URL}/items/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    fetchItems();
  };

  const updateName = async (id: string) => {
    await fetch(`${API_URL}/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setEditingId(null);
    setName("");
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const getStatusStyle = (status: string) => {
    if (status === "todo") return { background: "#ff9800" };
    if (status === "doing") return { background: "#2196f3" };
    return { background: "#4caf50" };
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚀 Smart To-Do App</h2>

        <div style={styles.inputBox}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ajouter une tâche..."
            style={styles.input}
          />
          <button onClick={addItem} style={styles.addBtn}>
            ➕ Ajouter
          </button>
        </div>

        <ul style={styles.list}>
          {items.map((item) => (
            <li key={item._id} style={styles.item}>
              {editingId === item._id ? (
                <>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                  />
                  <button onClick={() => updateName(item._id)}>💾</button>
                </>
              ) : (
                <>
                  <span style={styles.text}>{item.name}</span>

                  <span
                    style={{
                      ...styles.badge,
                      ...getStatusStyle(item.status),
                    }}
                    onClick={() => updateStatus(item)}
                  >
                    {item.status === "todo"
                      ? "🕒 À faire"
                      : item.status === "doing"
                      ? "⚡ En cours"
                      : "✅ Fait"}
                  </span>

                  <div>
                    <button
                      onClick={() => {
                        setEditingId(item._id);
                        setName(item.name);
                      }}
                      style={styles.editBtn}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => deleteItem(item._id)}
                      style={styles.deleteBtn}
                    >
                      🗑
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#eef2f7",
    minHeight: "100vh",
    paddingTop: "40px",
  },
  card: {
    maxWidth: "550px",
    margin: "auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center" as const,
    fontSize: "22px",
    marginBottom: "20px",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  addBtn: {
    background: "#4caf50",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9f9f9",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
  text: {
    flex: 1,
  },
  badge: {
    color: "white",
    padding: "5px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
  },
  editBtn: {
    marginRight: "5px",
  },
  deleteBtn: {
    background: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "5px 8px",
    cursor: "pointer",
  },
};

export default App;