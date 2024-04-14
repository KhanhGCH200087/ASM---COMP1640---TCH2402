import { useEffect } from "react";
import ArticleCard from "../components/card/card";
import styles from "./../app.module.css";
const checkRole = () => {};
const HomePageMarketingManager = () => {
  // const getAll = async () => {
  //   const response = (await fetch("http://localhost:5000/marketingmanager")).json();
  //   // console.log(await response.json());
  // };
  // useEffect(() => {
  //   getAll();
  // },[]);
  return (
    <>
      <div className={styles.carousel}></div>
      <hr />
      <h1 className={styles.content_welcome}>
        Welcome to system as Marketing Manager role
      </h1>
      {/* <div className={styles.list_artical}>
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </div> */}
    </>
  );
};

export default HomePageMarketingManager;
