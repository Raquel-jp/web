import React, { useEffect, useState, useRef } from 'react';

import Layout from '../Layout';
import Profile from '../../components/Profile';
import { useAuth } from '../../hooks/auth';
import Spinner from '../../components/Spinner';
import EmptyMessage from '../../components/EmptyMessage';

import { Container, Aside, ContainerOwner, ContainerFollows, ContainerFooter, ContainerFeeds } from "./styles";
import { useFollow } from '../../hooks/follow';
import { useFeed } from '../../hooks/feed';
import CardFeed from '../../components/CardFeed';


const Main = () => {
  const[page, setPage] = useState(0);
  
  const { user } = useAuth();
  const { follows, loading, getFollows } = useFollow();
  const { feeds, totalFeeds, getFeeds, setFeeds } = useFeed();

  useEffect(() => {
    getFollows();
    getFeeds(page);

    return () => {
      setFeeds([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    if(page > 0 && feeds.length < totalFeeds) {
      getFeeds(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[getFeeds, page])

  

  const observer = useRef(
    new IntersectionObserver(
      async entries => {
        const first = entries[0];
        if(first.isIntersecting){
            setPage((state) => state + 1);
        }
      },
      {
        threshold: 0.2
      }
    )
  )

  const [element, setElement] = useState(null);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if(currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if(currentElement) {
        currentObserver.unobserve(currentElement);
      }
    }
  },[element])

  return (
    <Layout>
      <Container>

        <Aside>
          <ContainerOwner>
            <Profile 
              img={user && user.avatar_url}
              username={user && user.username}
              isOwner
              name={user && user.name}
            />
          </ContainerOwner>

          <ContainerFollows>
            {follows && 
              follows.map(follow => (
                <Profile 
                  key={follow.id}
                  direction="column"
                  img={follow.avatar_url}
                  usidebar
                  username={follow.username}
                  name={follow.name}
                />
              ))
            }

            {follows && follows.length === 0 && loading === false && (
              <EmptyMessage message="No sigues nadie, empiexa a seguir a tus amigos" />
            )}

            {loading && <Spinner />}
          </ContainerFollows>

          <ContainerFooter>
            Información - AyudaPrensa - API - Empleo - Privacidad - Condiciones -
            Directorio - Perfiles - Hashtags - Idioma
          </ContainerFooter>
        </Aside>

        <ContainerFeeds>
          {feeds && feeds.map(feed => (
            <CardFeed key={feed.photo.id} feed={feed} />
          ))}

          {!!feeds  && feeds.length > 0 &&(
            <button 
              ref={setElement}
              style={{
                width: "100%",
                height: "100px",
                marginBottom: "10px",
                display: "block",
                background: "transparent",
                border: "none"
              }}  
            />
          )}
        </ContainerFeeds>

      </Container>
    </Layout>
  )
}

export default Main;