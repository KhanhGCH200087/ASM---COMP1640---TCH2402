import styles from "./card.module.css";

const Card = (props) => {
    // console.log(props.cardData.name);
    return (
        <a href="/marketing-coordinator/eventDetail/1" className={styles.artical_item}>
            <img
                className={styles.img_artical}
                src={props.cardData.image_source}
                alt=""
            />
            <p className={styles.artical_name}> {props.cardData.name}</p>
        </a>
    );
};

export default Card;
