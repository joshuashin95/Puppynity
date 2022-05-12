import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { uploadContent } from '../Redux/contentSlice';
/* eslint-disable */

// export interface IImageProps {
//   handleImgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   uploadFile: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
// }

const InputStyle = styled.input`
  // padding: 10px;
  width: auto;
  height: auto;
  //align-items: center;
  margin: auto;
`;

const ImgContainer = styled.div`
  width: 430px;
  height: 330px;
  // position: center;
  margin: auto;
  display: center;
  border-width: '10px';
  border-color: orange;
`;

const ImageFill = styled.img`
  width: 400px;
  height: 300px;
  object-fit: fill;
  margin: 5px;
  border-radius: 10%;
  padding: 10px;
`;

const Textarea = styled.textarea`
  width: 400px;
  height: 200px;
  border: solid 5px;
  border-color: peachpuff;
  border-radius: 5%;
`;

const Button = styled.button`
  width: 60px;
  height: 30px;
  border-radius: 5%;
  background-color: orange;
  color: white;
  border: none;
  &:hover {
    transition: all 0.2s ease-in-out;
    color: orange;
    background-color: white;
  }
  &:disabled {
    background-color: lightgray;
  }
`;

const Selector = styled.select`
  height: 35px;
  background: white;
  color: gray;
  padding: 5px;
  border: solid;
  border-radius: 30px;
  width: 400px;
  margin: 20px;
  option {
    color: black;
    background: white;
    display: flex;
  }
`;

// 컨텐츠를 업로드하려면 필요한 건?
// title, image content, text content
// TODO: 이미지와 그 외 데이터 분기해서 서버에 보내줘야한다.
// 그 외 필요한 거: 여기서 로그인된 유저정보를 받아와야한다.

type Content = {
  id: number;
  title: string;
  nickname?: string;
  content: string;
  imgRef: string;
  category: string;
};

function EditContent(): JSX.Element {
  const contentId = useSelector((state: any) => state.auth.contentId);
  console.log(contentId); // 잘 찍혀온다;
  const [content, setContent] = React.useState<Content | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [title, setTitle] = useState<string | undefined>(''); // 여기에 내려받은 기존 게시글 정보가 담겨있어야한다
  const [text, setText] = useState<string | undefined>('');
  const [imgRef, setImgRef] = useState<string>('');
  const [editImgRef, setEditImgRef] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${contentId}`).then((res) => {
      console.log(res.data);
      console.log('-------------------');
      console.log(res.data.post);
      setContent(res.data.post);
      // console.log(content);
      // content === undefined
      //   ? undefined
      //   : (setTitle(content.title), setText(content.content), setImgRef(content.imgRef), setCategory(content.category));
      //console.log(content.title);
      setTitle(res.data.post.title);
      setText(res.data.post.content);
      setImgRef(res.data.post.imgRef);
      setCategory(res.data.post.category);
    });
  }, []);

  //======== redux에 담아준 content id의 값으로 원하는 상세 게시물 불러오기 성공 ========

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // console.log('title change' + e.target.value);
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setCategory(e.target.value);
    console.log('현재 선택된 카테고리: ' + e.target.value);
  };

  const formData: any = new FormData();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const fileList = e.target.files;

    const reader = new FileReader();
    if (!e.target.files) {
      return;
    }

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      console.log('---------------------');
      console.log(e.target.files[0]);
    }

    reader.onloadend = () => {
      const previewImg: string = reader.result as string;
      if (previewImg) {
        setFileUrl(previewImg);
      }
    };
    formData.append('img', e.target.files[0]);

    //! 정태영: 파일 첨부와 동시에 서버로 이미지 파일 전송
    axios
      .post('http://localhost:4000/posts/upload', formData, {
        // formData
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, //undefined
          'content-type': 'multipart/form-data',
          loginType: localStorage.getItem('loginType'),
        },
      })
      .then((res) => {
        console.log(res.data);
        setImgRef(res.data.imgRef);
        console.log(imgRef);
      });
  };

  const handleContentChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(imgRef);
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${contentId}`,
        {
          title,
          //! 정태영: 사진 업로드 요청 후 받은 응답(파일이름)
          imgRef,
          category,
          content: text,
        },
        {
          // formData
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, //undefined
            'Content-Type': 'application/json',

          },
          withCredentials: true,
        },
      )
      .then((res) => {
        console.log('컨텐츠 수정 완료');
        console.log(formData.get('img'));
        console.log(res.data);
      });
    setTitle(''); //로컬 상태들은 다시 빈 값으로 돌려준다.
    setText('');
    //setFile();
    formData.delete('img'); // formdata 초기화
    // navigate('/community');
  };
  // console.log(content.title);

  const canUpload = Boolean(title) && Boolean(text); // title과 게시물 내용이 있는경우 T를 반환해준다. 이걸로 버튼에 삼항연산자를 걸어준다.

  return (
    <div>
      <h2> 게시물을 올려보세요! </h2>
      <form onSubmit={handleContentChange} encType="multipart/form-data">
        {/* <InputStyle
          onChange={handleTitleChange}
          type="input"
          className="title-input"
          placeholder="제목을 입력해주세요"
        ></InputStyle>
        <br /> */}
        <label htmlFor="image"></label>
        <br />
        <InputStyle onChange={handleFileChange} accept="image/*" id="upload-img" type="file" multiple />

        <ImgContainer>
          <ImageFill
            src={fileUrl || 'https://vernixgroup.com/wp-content/themes/consultix/images/no-image-found-360x250.png'}
            alt="conditional"
          />
        </ImgContainer>
        <InputStyle onChange={handleTitleChange} className="title" value={title}></InputStyle>
        <br />
        <Selector onChange={handleCategoryChange}>
          <option value="" hidden>
            카테고리를 선택해주세요
          </option>
          <option value="informational">팁/노하우</option>
          <option value="Q&A">질문</option>
          <option value="dailyLog">일상공유&수다</option>
        </Selector>
        <br />
        <textarea onChange={handleTextChange} className="text-content" value={text}></textarea>
        <br />
        <Button type="submit" disabled={!canUpload}>
          게시물 수정하기
        </Button>
      </form>
    </div>
  );
}

export default EditContent;
