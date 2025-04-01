import CreateTournamentForm from "./CreateTournamentForm";
import styles from "@/styles/page.module.css";
/**
 * A component to create the view of the page where the user can create a tournament
 * @returns The view of the page where the user can create a tournament
 */
export default function CreateTournamentView() {
  return (
    <div
      style={{
        padding: "16px",
        minHeight: "100vh",
        color: "var(--text-color)",
        gap: "16px",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
      }}
    >
      <div className={styles.container}>
        <h1>Create a Tournament</h1>
        <CreateTournamentForm />
      </div>
    </div>
  );
}
