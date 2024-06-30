import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal, { ModalContent } from '../modal/Modal';

import SwiperCore from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import './hero-slide.scss';
import 'swiper/css/bundle';
import 'swiper/swiper-bundle.css';

import Button, { OutlineButton } from '../button/Button';

import tmdbApi, { category, movieType } from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';


SwiperCore.use([Autoplay]);

const HeroSlide = () => {


    const [movieItems, setMovieItems] = useState([]);

    useEffect(() => {
        const getMovies = async () => {
            const params = { page: 1 };
            try {
                const response = await tmdbApi.getMoviesList(movieType.popular, { params });
                setMovieItems(response.results.slice(1, 4));
                console.log(response);
            } catch (error) {
                console.log('error', error);
            }
        };
        getMovies();
    }, []);

  return (
    <div className="hero-slide">

             <Swiper
                 modules={[Autoplay,Navigation, Pagination, Scrollbar, A11y]}
                 grabCursor={true}
                 spaceBetween={0}
                 slidesPerView={1}
                 navigation
                 pagination={{ clickable: true }}
                 scrollbar={{ draggable: true }}
                //  autoplay={{ delay: 3000 }}
             >
                 {movieItems.map((item, i) => (
                     <SwiperSlide key={i}>
                         {({ isActive }) => (
                             <HeroSlideItem item={item} className={`${isActive ? 'active' : ''}`} />
                         )}
                     </SwiperSlide>
                 ))}
             </Swiper>
            {movieItems.map((item, i) => (
                <TrailerModal key={i} item={item} />
            ))}
        
        </div>
  )
}


const HeroSlideItem = (props) => {
    const navigate = useNavigate();
    const item = props.item;

    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);


        const setModalActive = async () => {
        const modal = document.querySelector(`#modal_${item.id}`);
        const videos = await tmdbApi.getVideos(category.movie, item.id);

        if (videos.results.length > 0) {
            const videoSrc = 'https://www.youtube.com/embed/' + videos.results[0].key;
            modal.querySelector('.modal__content > iframe').setAttribute('src', videoSrc);
        } else {
            modal.querySelector('.modal__content').innerHTML = 'No trailer';
        }

        modal.classList.add('active');

    }



    return (
        <div
            className={`hero-slide__item ${props.className}`}
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="hero-slide__item__content container">
                <div className="hero-slide__item__content__info">
                    <h2 className="title">{item.title}</h2>
                    <div className="overview">{item.overview}</div>
                    <div className="btns">
                        <Button onClick={() => navigate('/movie/' + item.id)}>Watch now</Button>
                        <OutlineButton onClick={setModalActive}>Watch trailer</OutlineButton>
                    </div>
                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.poster_path)} alt={item.title} />
                </div>
            </div>
        </div>
    );
};

const TrailerModal = (props) => {
    const item = props.item;
    const iframeRef = useRef(null);

    const onClose = () => iframeRef.current.setAttribute('src', '');

    return (
        <Modal active={false} id={`modal_${item.id}`}>
            <ModalContent onClose={onClose}>
                <iframe ref={iframeRef} width="100%" height="500px" title="trailer"></iframe>
            </ModalContent>
        </Modal>
    );
};


export default HeroSlide