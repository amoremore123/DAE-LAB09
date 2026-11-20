import { useEffect, useState } from "react";
import { createExam, deleteExam, listExams } from "../../services/examService.js";
import { describeError } from "../../services/apiClient.js";
import "./ExamManager.css";

export default function ExamManager() {
  const [page, setPage] = useState("list");
  return (
    <section className="exam-manager" aria-labelledby="exam-heading">
      <h2 id="exam-heading">Exámenes</h2>
      {page === "list"
        ? <ExamList onCreate={() => setPage("form")} />
        : <ExamForm onBack={() => setPage("list")} />}
    </section>
  );
}

function ExamList({ onCreate }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [attempt, setAttempt] = useState(0);

  function reload() {
    setError("");
    setLoading(true);
    setAttempt((current) => current + 1);
  }

  useEffect(() => {
    const controller = new AbortController();
    listExams(controller.signal).then(setExams).catch((failure) => {
      if (!controller.signal.aborted) setError(describeError(failure));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [attempt]);

  async function remove(id) {
    setDeleting(id);
    setDeleteError("");
    try {
      await deleteExam(id);
      reload();
    } catch (failure) {
      setDeleteError(describeError(failure));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <button type="button" onClick={onCreate} disabled={deleting !== null}>Nuevo examen</button>
      {loading && <div role="status" className="exam-skeleton">Cargando exámenes…</div>}
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={reload}>Reintentar</button></div>}
      {deleteError && <p role="alert">{deleteError}</p>}
      {!loading && !error && (
        exams.length ? (
          <table>
            <thead><tr><th scope="col">ID</th><th scope="col">Título</th><th scope="col">Acción</th></tr></thead>
            <tbody>{exams.map(({ id, title }) => (
              <tr key={id}>
                <td>{id}</td><td>{title}</td>
                <td><button type="button" aria-label={`Eliminar ${title}`} disabled={deleting !== null} onClick={() => remove(id)}>Eliminar</button></td>
              </tr>
            ))}</tbody>
          </table>
        ) : <p>Sin exámenes registrados.</p>
      )}
    </>
  );
}

function ExamForm({ onBack }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createExam(title.trim());
      onBack();
    } catch (failure) {
      setError(describeError(failure));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="exam-title">Título del examen</label>
      <input id="exam-title" value={title} onChange={(event) => setTitle(event.target.value)} />
      {error && <p role="alert">{error}</p>}
      <div className="exam-actions">
        <button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
        <button type="button" onClick={onBack} disabled={saving}>Volver al listado</button>
      </div>
    </form>
  );
}
