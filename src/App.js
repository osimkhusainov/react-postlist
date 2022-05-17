import { useState, useEffect } from "react";
import "./styles/App.css";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import PostFilter from "./components/PostFilter";
import MyModal from "./components/UI/modal/MyModal";
import MyButton from "./components/UI/button/MyButton";
import { usePosts } from "./components/UI/hooks/usePosts";
import PostService from "./API/PostService";
import Loader from "./components/UI/loader/Loader";
import { useFetching } from "./components/UI/hooks/useFetching";
import { getPageCount, getPagesArray } from "./utils/pages";

function App() {
  const [posts, setPosts] = useState([
    { id: 1, title: "JavaScript", body: "Bc" },
    { id: 2, title: "Python", body: "A" },
  ]);
  const [filter, setFilter] = useState({ sort: "", query: "" });
  const [modal, setModal] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  let pagesArray = getPagesArray(totalPage);
  const [fetchPosts, isPostsLoading, postError] = useFetching(
    async (limit, page) => {
      const response = await PostService.getAll(limit, page);
      console.log(response.headers["x-total-count"]);
      setPosts(response.data);
      const totalCount = response.headers["x-total-count"];
      setTotalPage(getPageCount(totalCount, limit));
    }
  );

  useEffect(() => fetchPosts(limit, page), []);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  const changePage = (page) => {
    setPage(page);
    fetchPosts(limit, page);
  };

  const removePost = (post) => {
    setPosts(posts.filter((el) => el.id !== post.id));
  };

  return (
    <div className="App">
      <MyButton onClick={() => setModal(true)}>Create post</MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: "15px 0" }} />
      <PostFilter filter={filter} setFilter={setFilter} />
      {postError && <h1>Error with message {postError}</h1>}
      {isPostsLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loader />
        </div>
      ) : (
        <PostList
          remove={removePost}
          posts={sortedAndSearchedPosts}
          title={`Post list ${page}`}
        />
      )}
      <div className="page__wrapper">
        {pagesArray.map((p) => (
          <span
            onClick={() => changePage(p)}
            className={page === p ? "page page__current" : "page"}
            key={p}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
