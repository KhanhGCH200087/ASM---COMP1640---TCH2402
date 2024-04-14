import Card from "../card/card";
import styles from "./content_event.module.css";

const CardData = [
  {
    name: "Event Name 1",
    image_source:
      "https://www.shutterstock.com/shutterstock/photos/1972527140/display_1500/stock-vector-gg-logo-unique-for-different-projects-1972527140.jpg",
  },
  {
    name: "Event Name 2",
    image_source:
      "https://www.shutterstock.com/shutterstock/photos/1972527140/display_1500/stock-vector-gg-logo-unique-for-different-projects-1972527140.jpg",
  },
  {
    name: "Event Name 3",
    image_source:
      "https://www.shutterstock.com/shutterstock/photos/1972527140/display_1500/stock-vector-gg-logo-unique-for-different-projects-1972527140.jpg",
  },
  {
    name: "Event Name 4",
    image_source:
      "https://www.shutterstock.com/shutterstock/photos/1972527140/display_1500/stock-vector-gg-logo-unique-for-different-projects-1972527140.jpg",
  },
  {
    name: "Event Name 5 ",
    image_source:
      "https://www.shutterstock.com/shutterstock/photos/1972527140/display_1500/stock-vector-gg-logo-unique-for-different-projects-1972527140.jpg",
  }
];

const ContentEvent = () => {
  return (
    <div className={styles.content_event}>
      <h1 className={styles.my_event}>My Event</h1>
      <div className={styles.list_artical}>
        {CardData &&
          CardData.map((item) => {
            return <Card cardData={item} />;
          })}
      </div>
    </div>
  );
};
export default ContentEvent;
