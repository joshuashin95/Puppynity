import axios from 'axios';
import React, { useEffect, useState, useCallback, SetStateAction, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Category from './Category';
import IContentType from '../Redux/contentSlice';
// import RootState, { selectAllContents } from '../Redux/contentSlice';

// TODO: 각 게시물에 좋아요 하트 갯수 + 댓글 갯수 띄어주기.
// TODO: Pagenation

/* eslint-disable */
const ContentContainer = styled.div`
  width: 200px;
  height: 300px;
  margin: 5px;
  padding: 10px;
  border: solid;
  border-radius: 20px;
  border-color: orange;
  /* display: flex;
  flex-wrap: wrap;
  flex-direction: row; */
  // overflow-y: auto;
`;

const TitleContainer = styled.div`
  width: auto;
  height: 70px;
  font-size: 20px;
`;

const UserinfoContainer = styled.div`
  width: auto;
  height: auto;
  font-size: 10px;
  // align-items: center;
  border: #a1dffb solid 2px;
  bottom: 20px;
  position: relative;
  text-align: left;
  //margin-top: 20px;
  // display: flex;
`;

//! 정태영: 무한스크롤 container,

const Container = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  /* flex-wrap: wrap;
  display: flex; */
  // position: absolute;
  > .content-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: 1rem auto;
    justify-content: center;
    align-items: center;
  }
`;

//! 정태영: 검색창 style

const SearchSection = styled.div`
  /* border: 1px solid pink; */
  width: 100%;
  display: flex;
  flex: 2;
  justify-content: center;
  align-items: center;
  > .search-wrapper {
    /* border: 1px solid red; */
    margin-left: 40px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    width: 35%;
    padding: 0 0.8rem;
    height: 3rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    > input {
      border: none;
      width: 85%;
      height: 85%;
      margin-right: 1rem;
      &:focus {
        outline: none;
      }
    }

    > div {
      font-size: 1.5rem;
      color: #a3cca3;
    }
  }
`;
// ========category========
const CategoryList = styled.li`
  display: inline;
  font-size: 10px;
`;
const CategoryBtn = styled.button`
  background-color: #f9de59;
  width: 80px;
  height: 50px;
  font-size: 10px;
  margin: 10px;
  padding: 10px;
  border: #f9de59;
  border-radius: 5%;
  color: white;
  cursor: pointer;
  :focus {
    background-color: #a1dffb;
  }
`;
// =======category ==========

const LikeBtn = styled.button`
  border-radius: 100%;
`;

function ContentList(): JSX.Element {
  // const [contentList, setContentList] = useState<Array<string>>([...dummyContents]);
  // type of img = HTMLImageElement or File.
  const navigate = useNavigate();
  const erorImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Error.svg/1200px-Error.svg.png';
  const contents = useSelector((state: any) => state.content); // redux에 저장된 상태를 참조한다.
  const [dbContents, setDbContents] = useState<any[]>([]);
  const [filteredDatas, setFilteredDatas] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const data: any[] = dbContents;
  //! 정태영: 검색 & 무한 스크롤 관련 훅
  const searchInput = useRef<HTMLInputElement>(null);
  //* 검색창 인풋 상태
  const [searchKeyword, setSearchKeyword] = useState('');

  const [like, setLike] = useState<boolean>(false);
  const loginState = useSelector((state: any) => state);
  const { commentNum } = loginState.auth;
  // 요청할 페이지 번호 변수
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/posts?search=${searchKeyword}&page=1&limit=9`)
      .then((resp) => {
        setDbContents(resp.data.posts);
        setFilteredDatas(resp.data.posts);
        setPage(2);
      })
      .catch(console.error);
  }, [searchKeyword]);

  const handleScroll = useCallback((): void => {
    // 브라우저창 내용의 크기 (스크롤을 포함하지 않음)
    const { innerHeight } = window;

    // 브라우저 총 내용의 크기 (스크롤을 포함한다)
    const { scrollHeight } = document.body;

    // 현재 스크롤바의 위치
    const { scrollTop } = document.documentElement;

    // scrollTop과 innerHeight를 더한 값이 scrollHeight보다 크다면, 가장 아래에 도달했다는 의미이다.
    if (Math.round(scrollTop + innerHeight) >= scrollHeight) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/posts?search=${searchKeyword}&page=${page}&limit=9`)
        .then(async (resp) => {
          const { posts } = resp.data;
          await setDbContents([...dbContents, ...posts]);
          const filtered = dbContents.filter((post) => post.category === category);
          await setFilteredDatas([...filteredDatas, ...posts]);
          // 페이지 state 변수의 값도 1씩 늘려줍니다.
          await setPage((prevPage: number) => prevPage + 1);
        });
    }
  }, [searchKeyword, page, dbContents, filteredDatas]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    // 스크롤이 발생할때마다 handleScroll 함수를 호출하도록 추가합니다.

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      // 해당 컴포넌트가 언마운트 될때, 스크롤 이벤트를 제거합니다.
    };
  }, [handleScroll]);
  //! --------------

  //! 정태영: 검색 핸들러

  // 클릭 이벤트 리스너
  const searchClickHandler = () => {
    if (searchInput.current?.value) {
      setSearchKeyword(searchInput.current.value);
    }
  };
  // 엔터 키 이벤트 리스너
  const KeyPressHandler = (event: { type: string; code: string }) => {
    if (event.type === 'keypress' && event.code === 'Enter' && searchInput.current?.value) {
      setSearchKeyword(searchInput.current.value);
    }
  };
  //! --------------

  const handleDetail = () => {
    console.log(contents.id);
    //navigate(`/posts/${contents.id}`);
  };

  const redirectToContentDetail = (e: React.MouseEvent<HTMLInputElement>) => {
    // onClick event로 해당 게시물의 원래 주소(페이지)를 띄어준다.
    const click_id = e.currentTarget.id;
    console.log(click_id);
    navigate(`/posts/${click_id}`);
  }; // 게시글 클릭 시 게시물의 디테일을 보여준다.
  // console.log('contents 상태 ------------>', dbContents);

  const handleCategory = (key: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    setCategory(key);
    if (key === 'all') {
      setFilteredDatas(dbContents);
      return;
    }
    const filtered = dbContents.filter((post) => post.category === key);
    setFilteredDatas(filtered);
  };

  return (
    <Container>
      <div className="category">
        <CategoryList>
          <CategoryBtn onClick={handleCategory('all')} autoFocus>
            전체 게시글
          </CategoryBtn>
          <CategoryBtn onClick={handleCategory('informational')}>팁/노하우</CategoryBtn>
          <CategoryBtn onClick={handleCategory('Q&A')}>질문</CategoryBtn>
          <CategoryBtn onClick={handleCategory('dailyLog')}>일상공유</CategoryBtn>
        </CategoryList>
      </div>
      <SearchSection>
        <div className="search-wrapper">
          <div onClick={searchClickHandler}>🔍</div>
          <input placeholder="검색어를 입력하세요" type="text" onKeyPress={KeyPressHandler} ref={searchInput}></input>
        </div>
      </SearchSection>
      <div className="content-wrapper">
        {filteredDatas.length === 0
          ? '검색 결과가 없습니다.'
          : filteredDatas.map((post) => (
              <div key={post.id} id={post.id} onClick={redirectToContentDetail}>
                <ContentContainer>
                  <div className="img-box">
                    <img
                      src={post.imgRef ? `${process.env.REACT_APP_BASE_URL}/uploads/${post.imgRef}` : erorImg}
                      alt="fromServer"
                      className="img"
                      height="200px"
                      width="200px"
                    />
                    <span> {`[${post.category}]`}</span>
                    {/* <span id={post.id} onClick={handleLike}>
                      {!like ? '♡' : '❤️'}
                    </span> */}
                  </div>
                  <TitleContainer>{post.title}</TitleContainer>

                  <UserinfoContainer>
                    <span>{'작성자: '}</span> <br />
                    {'게시 날짜:' + post.createdAt}
                  </UserinfoContainer>
                </ContentContainer>
              </div>
            ))}
      </div>
    </Container>
  );
}

export default ContentList;
