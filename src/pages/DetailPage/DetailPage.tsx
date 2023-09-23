import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCharacterDetail } from '../../api/api';
import styled from 'styled-components'
import { MotionStyled} from '../../styles/styles';
import { useQuery } from 'react-query';
import {motion} from 'framer-motion'
import Loader from '../../utils/Loader';

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2em;
  color: ${(props) => props.theme.text};
`;


const FilmList = styled.ul`
  margin-top: 1em;
  list-style-type: disc;
  padding-left: 1em;
  
`;

const DetailImg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 100%;
  object-fit: cover;
`

const ModalDiv = styled.div`
  &:hover {
    cursor: pointer;
  }
`

const DisneyModal = styled(motion.div)`
  width: 80%;
  height: 80vh;
  position: fixed;
  display: flex;
  top: 10vh;
  left: 10%;
`

const CloseBtn = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: white;
  color: black;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  z-index: 3;
`

function DetailPage() {
    const { id } = useParams<{ id: string }>();
    // const [isloadingtemp, setIsLoadingTemp] = useState(true);
    // const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWait, setisWait] = useState(true); 


    const { data: character, isError, isLoading } = useQuery(
      ['character', id], 
      () => {       
        if (id === undefined) throw new Error("Character ID is undefined");
        setTimeout(()=>{ setisWait(false) }, 2000);
        return fetchCharacterDetail(id);
      },
      { enabled: !!id }

      
    );

    const handleModalTriggerClick = () => {
      setIsModalOpen(!isModalOpen);
    };

    console.log(character)

    if (isLoading) {
      return <Loader />
    }

    if (isWait) {
      return <Loader />
    }



    if (isError) {
      const tempCharacter = {
        id: "404",
        name: "해당 데이터가 없습니다.",
        imageUrl: "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png",
        films: ["해당 데이터가 없습니다."],
        sourceUrl: "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png"
      }

      return (
        <DetailContainer>
        <MotionStyled to="/"  style={{fontSize : '25px'}}>back</MotionStyled>
        <DetailImg src={tempCharacter.imageUrl} alt={tempCharacter.name} />
        <h1>{tempCharacter.name}</h1>
        
        <MotionStyled to={tempCharacter.sourceUrl} target="_blank" style={{fontSize : '25px'}}>
          Source URL
        </MotionStyled>
  
        <FilmList>
          {tempCharacter.films.map((film: string, index: number) => (
            <li key={index}>{film}</li>
          ))}
        </FilmList>
        </DetailContainer>
      )
    }

    return (
      <DetailContainer>
        <MotionStyled to="/"  style={{fontSize : '25px'}}>back</MotionStyled>
        <DetailImg src={character?.imageUrl} alt={character?.name} />
        <h1>{character.name}</h1>

        <ModalDiv onClick={handleModalTriggerClick} style={{fontSize : '25px'}}>
          Source URL
        </ModalDiv>
  
        <FilmList>
          {character?.films.map((film: string, index: number) => (
            <li key={index} style={{fontSize: '19px'}}>{film}</li>
          ))}
        </FilmList>

        {
          isModalOpen && (
            <DisneyModal
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}>
              <iframe src={character?.sourceUrl} title={character?.name} style={{width: '100%', height: '100%', borderRadius: "8px" }}></iframe>
              <CloseBtn onClick={handleModalTriggerClick}>X</CloseBtn>
            </DisneyModal>
          )
        }
      </DetailContainer>
    );
}

export default DetailPage;
