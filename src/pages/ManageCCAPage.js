import { useState } from "react";
import FormField from "../components/FormField";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { getAllCCAs } from "../services/ccaService";
import { trialSessionData } from "../data/trialSessions";
import { formatDate, TODAY } from "../utils/dates";
import "../styles/exco.css";

const emptyTrial = { date: "", time: "", venue: "" };

// Copies only the fields the exco is allowed to edit
function getInfoValues(cca) {
  return {
    description: cca.description,
    trainingSchedule: cca.trainingSchedule,
    venue: cca.venue,
    responseDays: String(cca.responseDays),
  };
}

// Checks the CCA info form. Returns an object of error messages.
function validateInfo(values) {
  const errors = {};
  if (values.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters.";
  }
  if (values.trainingSchedule.trim() === "") {
    errors.trainingSchedule = "Please enter the training schedule.";
  }
  if (values.venue.trim() === "") {
    errors.venue = "Please enter the venue.";
  }
  const days = Number(values.responseDays);
  if (!Number.isInteger(days) || days < 1 || days > 30) {
    errors.responseDays = "Reply time must be a whole number from 1 to 30 days.";
  }
  return errors;
}

// Checks the add-trial form. Returns an object of error messages.
function validateTrial(values) {
  const errors = {};
  if (!values.date) {
    errors.date = "Please choose a date.";
  } else if (values.date < TODAY) {
    errors.date = "The trial date cannot be in the past.";
  }
  if (values.time.trim() === "") {
    errors.time = "Please enter a time, e.g. 6:30pm.";
  }
  if (values.venue.trim() === "") {
    errors.venue = "Please enter a venue.";
  }
  return errors;
}

// Exco page: edit CCA information and manage trial sessions.
// In CA1 changes are kept in this page's state. In CA2 they will be saved with PUT /api/ccas/:id.
function ManageCCAPage() {
  const [ccaList, setCcaList] = useState(getAllCCAs());
  const [selectedId, setSelectedId] = useState("cca-02"); // pretend the exco is from Handball
  const [info, setInfo] = useState(getInfoValues(getAllCCAs().find((c) => c.id === "cca-02")));
  const [infoErrors, setInfoErrors] = useState({});
  const [infoMessage, setInfoMessage] = useState("");

  const [trials, setTrials] = useState(trialSessionData);
  const [newTrial, setNewTrial] = useState(emptyTrial);
  const [trialErrors, setTrialErrors] = useState({});
  const [trialToDelete, setTrialToDelete] = useState(null);

  const selectedCCA = ccaList.find((c) => c.id === selectedId);
  const ccaTrials = trials.filter((t) => t.ccaId === selectedId);

  // When the exco picks a different CCA, fill the form with that CCA's info
  function handleSelectCCA(event) {
    const id = event.target.value;
    setSelectedId(id);
    setInfo(getInfoValues(ccaList.find((c) => c.id === id)));
    setInfoErrors({});
    setInfoMessage("");
    setTrialErrors({});
  }

  // ----- CCA info form -----
  function handleInfoChange(event) {
    const { name, value } = event.target;
    setInfo({ ...info, [name]: value });
    setInfoErrors({ ...infoErrors, [name]: "" });
    setInfoMessage("");
  }

  function handleInfoSubmit(event) {
    event.preventDefault();
    const errors = validateInfo(info);
    setInfoErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCcaList(
      ccaList.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              description: info.description.trim(),
              trainingSchedule: info.trainingSchedule.trim(),
              venue: info.venue.trim(),
              responseDays: Number(info.responseDays),
            }
          : c
      )
    );
    setInfoMessage("CCA information saved.");
  }

  // ----- Trial sessions -----
  function handleTrialChange(event) {
    const { name, value } = event.target;
    setNewTrial({ ...newTrial, [name]: value });
    setTrialErrors({ ...trialErrors, [name]: "" });
  }

  function handleAddTrial(event) {
    event.preventDefault();
    const errors = validateTrial(newTrial);
    setTrialErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const trial = {
      id: "trial-" + (trials.length + 1) + "-" + Date.now(),
      ccaId: selectedId,
      date: newTrial.date,
      time: newTrial.time.trim(),
      venue: newTrial.venue.trim(),
    };
    setTrials([...trials, trial]);
    setNewTrial(emptyTrial);
  }

  function handleDeleteTrial() {
    setTrials(trials.filter((t) => t.id !== trialToDelete.id));
    setTrialToDelete(null);
  }

  return (
    <div className="page">
      <h1>Manage CCA</h1>

      <FormField label="Your CCA" htmlFor="ccaSelect">
        <select id="ccaSelect" value={selectedId} onChange={handleSelectCCA}>
          {ccaList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </FormField>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section">
            <h2>CCA information</h2>
            {infoMessage !== "" && <div className="info-message">✅ {infoMessage}</div>}

            <form onSubmit={handleInfoSubmit} noValidate>
              <FormField label="Short description" htmlFor="description" error={infoErrors.description}>
                <textarea id="description" name="description" rows="3" value={info.description} onChange={handleInfoChange} />
              </FormField>

              <FormField label="Training schedule" htmlFor="trainingSchedule" error={infoErrors.trainingSchedule}>
                <input id="trainingSchedule" name="trainingSchedule" value={info.trainingSchedule} onChange={handleInfoChange} />
              </FormField>

              <FormField label="Venue" htmlFor="venue" error={infoErrors.venue}>
                <input id="venue" name="venue" value={info.venue} onChange={handleInfoChange} />
              </FormField>

              <FormField
                label="Reply time (days)"
                htmlFor="responseDays"
                error={infoErrors.responseDays}
                hint="Students see this as their expected reply date after applying."
              >
                <input type="number" id="responseDays" name="responseDays" value={info.responseDays} onChange={handleInfoChange} />
              </FormField>

              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </form>
          </section>
        </div>

        <aside className="detail-side">
          <h2>Trial sessions</h2>

          {ccaTrials.length === 0 ? (
            <EmptyState icon="🗓️" title="No trial sessions yet" message="Add one below so applicants know when to come." />
          ) : (
            <ul className="trial-list">
              {ccaTrials.map((t) => (
                <li key={t.id} className={t.date < TODAY ? "trial-item past" : "trial-item"}>
                  <div>
                    <strong>{formatDate(t.date)}</strong>, {t.time}
                    <p>{t.venue}</p>
                    {t.date < TODAY && <span className="trial-past-label">Past</span>}
                  </div>
                  <button className="btn btn-small" onClick={() => setTrialToDelete(t)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h3>Add a trial session</h3>
          <form onSubmit={handleAddTrial} noValidate>
            <FormField label="Date" htmlFor="trialDate" error={trialErrors.date}>
              <input type="date" id="trialDate" name="date" value={newTrial.date} onChange={handleTrialChange} />
            </FormField>
            <FormField label="Time" htmlFor="trialTime" error={trialErrors.time}>
              <input id="trialTime" name="time" placeholder="e.g. 6:30pm" value={newTrial.time} onChange={handleTrialChange} />
            </FormField>
            <FormField label="Venue" htmlFor="trialVenue" error={trialErrors.venue}>
              <input id="trialVenue" name="venue" placeholder={selectedCCA.venue} value={newTrial.venue} onChange={handleTrialChange} />
            </FormField>
            <button type="submit" className="btn btn-primary">
              Add trial
            </button>
          </form>
        </aside>
      </div>

      {trialToDelete && (
        <ConfirmDialog
          title="Remove trial session?"
          message={"Remove the trial on " + formatDate(trialToDelete.date) + ", " + trialToDelete.time + "?"}
          confirmText="Remove"
          onConfirm={handleDeleteTrial}
          onCancel={() => setTrialToDelete(null)}
        />
      )}
    </div>
  );
}

export default ManageCCAPage;