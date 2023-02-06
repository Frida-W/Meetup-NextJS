import getDataSource from "db";
import { Article } from "db/entity/article";
import ListItem from "components/ListItem/ListItem";
import { IArticle } from "./api";
import { Divider } from "antd";

interface IProps {
  articles: IArticle[];
}

export async function getServerSideProps() {
  const db = await getDataSource();
  const articles = await db.getRepository(Article).find({
    relations: ["user"],
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    }, //将要给组件传递的props
  };
}
const Home = (props: IProps) => {
  const { articles } = props;
  return (
    <div>
      <div className="content-layout">
        {articles?.map((article) => (
          <>
            <ListItem article={article} key={article.id} />
            <Divider />
          </>
        ))}
      </div>
    </div>
  );
};

export default Home;
