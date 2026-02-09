import { useEffect, useState } from "react";
import styles from "./FontSizeSlider.module.css";

const FONT_SIZES = [
  { label: "S", value: 12 },
  { label: "XS", value: 14 },
  { label: "M", value: 16 },
  { label: "XM", value: 18 },
  { label: "L", value: 20 },
  { label: "XL", value: 22 }
];

export default function FontSizeSlider() {
  const [activeIndex, setActiveIndex] = useState(() => {
    return Number(localStorage.getItem("fontSizeIndex")) || 0;
  });

  useEffect(() => {
    document.documentElement.style.fontSize =
      FONT_SIZES[activeIndex].value + "px";

    localStorage.setItem("fontSizeIndex", activeIndex);
  }, [activeIndex]);

  return (
    <div className={styles.font_size_btn_container}>
      <div className={styles.font_size_slider_btn}>
        {FONT_SIZES.map((item, index) => (
          <div key={item.label} className={styles.step_wrapper}>
            <div
              className={`${styles.font_size_btn} ${
                index <= activeIndex ? styles.active : ""
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <span>{item.label}</span>
            </div>

            {index < FONT_SIZES.length - 1 && (
              <div
                className={`${styles.font_size_lines} ${
                  index < activeIndex ? styles.active : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
