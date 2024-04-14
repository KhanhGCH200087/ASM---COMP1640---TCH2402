import ArticleCard from "../components/article/article";
import styles from "./../app.module.css";
const HomePage = () => {
  return (
    <>
      <div className={styles.carousel}></div>
      <hr />
      <div className={styles.list_artical}>
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </div>
    </>
  );
};

export default HomePage;
