import styles from "./Button.module.scss";

export default function Button({ children, disabled, onClick }) {
  return (
    <button
      className={`${styles.button} ${disabled && styles.disabled}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
