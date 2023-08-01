import styles from "./Spinner.module.scss";

const Spinner = ({ bgColor = "#fafafa", width = "35px", height = "35px" }) => {
  return (
    <div
      className={styles.spinner}
      style={{ "--bg-color": bgColor, "--height": height, "--width": width }}
    ></div>
  );
};

export default Spinner;
