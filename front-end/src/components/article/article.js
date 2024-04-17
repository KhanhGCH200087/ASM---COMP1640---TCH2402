import styles from "./article.module.css";

const ArticleCard = () => {
    return (
        <div className={styles.artical_item}>
            <img
                className={styles.img_artical}
                src="https://w.ladicdn.com/s550x400/616a4856fd53e600396580f1/2022-greenwich-eng-20220525041319.png"
                alt=""
            />
            <p className={styles.artical_name}>Artical name</p>
        </div>
    );
};

export default ArticleCard;