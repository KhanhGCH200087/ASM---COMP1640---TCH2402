import { useEffect } from "react";
import ArticleCard from "../components/card/card";
import styles from "./../app.module.css";
const HomePageMarketingCoordinator = () => {
  const getAll = async () => {
    const response = (
      await fetch("http://localhost:5000/marketingmanager")
    ).json();
    // console.log(await response.json());
  };
  useEffect(() => {
    getAll();
  }, []);
  return (
    <>
      <div className={styles.header}>
        <h1>Faculty name:</h1>
      </div>
      <div className={styles.list_mc}>
        <table className={styles.table_list}>
          <colgroup>
            <col style={{width: '60px'}} />
            <col style={{width: '80px'}}/>
            <col />
          </colgroup>
          <thead>
            <tr className={styles.table_rows}>
              <th>Index</th>
              <th>Image</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.table_rows}>
              <td>1</td>
              <td><img src="https://w.ladicdn.com/s550x400/616a4856fd53e600396580f1/2022-greenwich-eng-20220525041319.png" alt="" className={styles.img_mc} /></td>
              <td>Khue Pham</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HomePageMarketingCoordinator;
