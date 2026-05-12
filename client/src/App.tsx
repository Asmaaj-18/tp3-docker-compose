import { useEffect, useMemo, useState } from "react";

type Item = {
  _id: string;
  name: string;
  status: "todo" | "doing" | "done";
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await fetch(`${API_URL}/items/${id}`, {
      method: "DELETE",
    });

    fetchItems();
  };

  const updateStatus = async (
    id: string,
    status: "todo" | "doing" | "done"
  ) => {
    await fetch(`${API_URL}/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    fetchItems();
  };

  const updateName = async (id: string) => {
    await fetch(`${API_URL}/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setEditingId(null);
    setName("");
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.status === filter);
  }, [items, filter]);

  const stats = {
    total: items.length,
    todo: items.filter((i) => i.status === "todo").length,
    doing: items.filter((i) => i.status === "doing").length,
    done: items.filter((i) => i.status === "done").length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>✨ Smart Task Manager</h1>
          <p style={styles.subtitle}>
            Organisez vos tâches efficacement
          </p>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3>{stats.total}</h3>
            <p>Total</p>
          </div>

          <div style={styles.statCard}>
            <h3>{stats.todo}</h3>
            <p>À faire</p>
          </div>

          <div style={styles.statCard}>
            <h3>{stats.doing}</h3>
            <p>En cours</p>
          </div>

          <div style={styles.statCard}>
            <h3>{stats.done}</h3>
            <p>Terminées</p>
          </div>
        </div>

        <div style={styles.inputContainer}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            style={styles.input}
          />

          <button onClick={addItem} style={styles.addButton}>
            ➕ Ajouter
          </button>
        </div>

        <div style={styles.filters}>
          <button
            style={filter === "all" ? styles.activeFilter : styles.filterBtn}
            onClick={() => setFilter("all")}
          >
            Toutes
          </button>

          <button
            style={filter === "todo" ? styles.activeFilter : styles.filterBtn}
            onClick={() => setFilter("todo")}
          >
            🕒 À faire
          </button>

          <button
            style={filter === "doing" ? styles.activeFilter : styles.filterBtn}
            onClick={() => setFilter("doing")}
          >
            ⚡ En cours
          </button>

          <button
            style={filter === "done" ? styles.activeFilter : styles.filterBtn}
            onClick={() => setFilter("done")}
          >
            ✅ Fait
          </button>
        </div>

        <div style={styles.tasksContainer}>
          {filteredItems.map((item) => (
            <div key={item._id} style={styles.taskCard}>
              <div style={styles.taskContent}>
                {editingId === item._id ? (
                  <div style={styles.editContainer}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={styles.editInput}
                    />

                    <button
                      style={styles.saveBtn}
                      onClick={() => updateName(item._id)}
                    >
                      💾
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={styles.taskTitle}>{item.name}</h3>

                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(
                          item._id,
                          e.target.value as "todo" | "doing" | "done"
                        )
                      }
                      style={{
                        ...styles.select,
                        background:
                          item.status === "todo"
                            ? "#fff3cd"
                            : item.status === "doing"
                            ? "#dbeafe"
                            : "#dcfce7",
                      }}
                    >
                      <option value="todo">🕒 À faire</option>
                      <option value="doing">⚡ En cours</option>
                      <option value="done">✅ Fait</option>
                    </select>
                  </>
                )}
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    setEditingId(item._id);
                    setName(item.name);
                  }}
                >
                  ✏️
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteItem(item._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "850px",
    margin: "auto",
  },

  header: {
    textAlign: "center" as const,
    color: "white",
    marginBottom: "30px",
  },

  title: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  subtitle: {
    opacity: 0.9,
    fontSize: "18px",
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center" as const,
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },

  inputContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
  },

  input: {
    flex: 1,
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    fontSize: "16px",
  },

  addButton: {
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "16px 22px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },

  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap" as const,
  },

  filterBtn: {
    background: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  activeFilter: {
    background: "#111827",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  tasksContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },

  taskCard: {
    background: "white",
    borderRadius: "16px",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    marginBottom: "10px",
  },

  select: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    gap: "8px",
  },

  editBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
  },

  editContainer: {
    display: "flex",
    gap: "10px",
  },

  editInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  saveBtn: {
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default App;