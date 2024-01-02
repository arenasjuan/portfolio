import 'lite-youtube-embed/src/lite-yt-embed';
import React, { useState, useRef, useMemo, useEffect, useLayoutEffect, useCallback, useContext, createContext } from 'react';
import { startTransition, preloadImages } from './dissolve.js';
import { ChimneyText, MobText, YoMamaText, NoMoreSheriffsText, NewPartnerText, AshesText, PrisonShipText, PaulMcCartneyText, NewPresidentText } from './writingSampleText';
import imagePaths from './imagePaths.json';
import './App.css';
import * as kampos from 'kampos';

export const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [videoModalIsOpen, setVideoModalIsOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [currentVideoType, setCurrentVideoType] = useState(null);
  const [currentVideoThumbnail, setCurrentVideoThumbnail] = useState(null);

  useEffect(() => {
    window.dataLayer.push({'event': 'youtubeApiReady'});

    const handleYouTubeIframeAPIReady = () => {
      window.dataLayer.push({'event': 'youtubeApiReady'});
    };

    window.onYouTubeIframeAPIReady = handleYouTubeIframeAPIReady;

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  const handleTikTokClick = (link) => {
    setCurrentVideoId(link.videoId);
    setCurrentVideoType(link.type);
    setVideoModalIsOpen(true);
  }

  const handleVideoClick = (videoId, thumbnail) => {
    setCurrentVideoId(videoId);
    setCurrentVideoThumbnail(thumbnail);
    setCurrentVideoType('youtube');
    setVideoModalIsOpen(true);
  }

  const handleCloseModal = () => {
    setVideoModalIsOpen(false);
  };

  return (
    <VideoContext.Provider value={{ videoModalIsOpen, setVideoModalIsOpen, currentVideoId, setCurrentVideoId, currentVideoType, setCurrentVideoType, currentVideoThumbnail, setCurrentVideoThumbnail, handleTikTokClick, handleVideoClick, handleCloseModal }}>
      {children}
    </VideoContext.Provider>
  );
}

function ImageContainer({ link, handleImageClick }) {
  return (
    <div className="imageContainer">
      {link.type === 'image' ? (
        <img onClick={() => handleImageClick(link.url)} src={link.url} alt={link.text} className="thumbnail" />
      ) : (
        <iframe src={link.url} title={link.text} frameBorder="0" allowFullScreen />
      )}
    </div>
  );
}

function ImageModal({ isOpen, urls, currentUrlIndex, onClose, onNext, onPrevious }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        currentUrlIndex < urls.length - 1 ? onNext() : onClose();
      } else if (event.key === 'ArrowLeft') {
        currentUrlIndex > 0 ? onPrevious() : onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onNext, onPrevious, onClose, urls.length, currentUrlIndex]);

  const handleBackdropClick = (event) => {
    if (event.target.className === 'modal-navigation') {
      onClose();
    }
  };

  return isOpen ? (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="modal-navigation">
          {currentUrlIndex > 0 && <button onClick={onPrevious}>←</button>}
          <img src={urls[currentUrlIndex]} alt="" />
          {currentUrlIndex < urls.length - 1 && <button onClick={onNext}>→</button>}
        </div>
      </div>
    </div>
  ) : null;
}

const TikTokEmbed = React.memo(function TikTokEmbed({ videoId }) {
  return (
    <iframe 
      title="TiktokFrame"
      className="tiktok-frame"
      src={`https://www.tiktok.com/embed/v2/${videoId}?lang=en-US`}
      frameBorder="0"
      allow="autoplay; fullscreen" 
      allowFullScreen
    />
  );
});

const VideoComponent = React.memo(({ videoType, videoId, videoThumbnail }) => {
  const [currentVideoType, setCurrentVideoType] = useState(videoType);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);
  const [currentVideoThumbnail, setCurrentVideoThumbnail] = useState(videoThumbnail);

  useEffect(() => {
    setCurrentVideoType(videoType);
    setCurrentVideoId(videoId);
    setCurrentVideoThumbnail(videoThumbnail);
  }, [videoType, videoId, videoThumbnail]);

  return (
    currentVideoType === 'youtube' ? 
      <lite-youtube 
        videoid={currentVideoId} 
        playlabel="Play video" 
        style={{ backgroundImage: `url(${currentVideoThumbnail})` }}
      />
      :
      <TikTokEmbed videoId={currentVideoId} />
  );
});

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    // Ignore resize events caused by fullscreen mode
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      return;
    }
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return size;
}


export function Portfolio() {
  const initialState = {
    text: "AI Art | Writing | Coding",
    links: [],
    backgroundImage: "",
  };
  const { handleTikTokClick, handleVideoClick, videoModalIsOpen, currentVideoId, handleCloseModal } = useContext(VideoContext);
  const [state, setState] = useState(initialState);
  const key = useState(Math.random());
  const stateHistory = useRef([initialState]);
  const appRef = useRef(null);
  const images = useRef({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const currentImageRef = useRef();
  const [isWritingSampleOpen, setIsWritingSampleOpen] = useState(false);
  const widthRef = useRef(null);
  const heightRef = useRef(null);
  const size = useWindowSize();
  const [hoveredThumbnail, setHoveredThumbnail] = useState(null);

  useEffect(() => {
      const handleYouTubeIframeAPIReady = () => {
          window.dataLayer.push({'event': 'youtubeApiReady'});
      };

      window.onYouTubeIframeAPIReady = handleYouTubeIframeAPIReady;

      // Cleanup function to remove the event listener when the component unmounts
      return () => {
          window.onYouTubeIframeAPIReady = null;
      };
  }, []);

  useEffect(() => {
    const initialImages = [
      "/images/canvases/orange.jpg",
      "/images/canvases/pollock.jpg",
      "/images/canvases/monkey.jpg",
      "/images/canvases/bot.jpg",
      "/images/canvases/biker.jpg",
      "/images/canvases/pics.jpg",
      "/images/canvases/camera.jpg",
      "/images/writing/writing_background.jpg",
    ];

    let loadedImages = {};
    let loadedCount = 0;

    initialImages.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedImages[src] = img;
        loadedCount++;
        setLoadProgress((loadedCount / initialImages.length) * 100);

        if (loadedCount === initialImages.length) {
          // All initial images are loaded
          // Update state and hide loading bar here
          images.current = loadedImages;
          const orangeImage = loadedImages["/images/canvases/orange.jpg"];
          setState(prevState => ({...prevState, backgroundImage: orangeImage}));
          currentImageRef.current = orangeImage;
          // Optionally, hide the loading bar if it's a separate UI element
        }
      };
      img.onerror = (error) => {
        // Handle image load error if necessary
        console.error('Error loading image:', src, error);
      };
      img.src = src;
      if (img.complete) {
        img.onload();
      }
    });
  }, []);


  const updateBackgroundSize = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      return;
    }

    const canvas = appRef.current.querySelector('.dissolveCanvas');

    if (!canvas) {
      return;
    }

    let WIDTH, HEIGHT;

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    if (window.innerWidth > window.innerHeight) {
        widthRef.current = WIDTH;
        heightRef.current = WIDTH / 2;
    } else {
        heightRef.current = HEIGHT;
        widthRef.current = HEIGHT * 2;
    }

    const viewportAspectRatio = WIDTH / HEIGHT;
    const canvasAspectRatio = widthRef.current / heightRef.current;

    // Calculate the device pixel ratio
    let ratio = window.devicePixelRatio || 1;

    if (viewportAspectRatio > canvasAspectRatio) {
      canvas.style.width = '100vw';
      canvas.style.height = 'auto';

      // Set logical size with respect to ratio and aspect ratio
      canvas.width = WIDTH * ratio;
      canvas.height = (WIDTH / 2) * ratio;
    } else {
      canvas.style.height = '100vh';
      canvas.style.width = 'auto';

      // Set logical size with respect to ratio and aspect ratio
      canvas.height = HEIGHT * ratio;
      canvas.width = (HEIGHT * 2) * ratio;
    }

    const hippo = new kampos.Kampos({ target: canvas, effects: [] });
    hippo.setSource({ media: currentImageRef.current, width: widthRef.current, height: heightRef.current });
    hippo.draw();
    hippo.stop();
  };


  useLayoutEffect(() => {
    updateBackgroundSize();
  }, [size]);


  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handleImageClick = (url) => {
    setCurrentImage(url);
    setImageUrls(state.links.filter(link => link.type === 'image').map(link => link.url));
    setCurrentImageIndex(state.links.findIndex(link => link.url === url));
    setModalIsOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(currentImageIndex + 1);
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex(currentImageIndex - 1);
  }

  const handleCloseImageModal = () => {
    setModalIsOpen(false);
  };

  const handleClick = (section) => {
    const canvas = appRef.current.getElementsByTagName('canvas')[0];
    let newState;

    switch(section) {
      case "AI Art":
        newState = {
          parent: "",
          name: "AI-Art",
          text: "Videos | Images",
          textColor: "#ffdb84",
          textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000,  -2px -2px 1px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000, -1px -1px 2px #000000",
          links: [],
          backgroundImage: images.current["/images/canvases/bot.jpg"]
        };
        currentImageRef.current = newState.backgroundImage;
        startTransition(canvas, state.backgroundImage, newState.backgroundImage, widthRef.current, heightRef.current);
        break;

      case "Writing":
        preloadImages([
          "/images/writing/shamu.jpg",
          "/images/writing/chimney_sweep.JPG",
          "/images/writing/flesh.jpg",
          "/images/writing/greener.jpg",
          "/images/writing/symphonia.jpg",
          "/images/writing/west.jpg",
          "/images/writing/inauguration.jpg",
          "/images/writing/heyyou.jpg",
          "/images/writing/seasons.jpg",
          "/images/writing/new_partner.jpg",
          "/images/writing/ashes.jpg",
        ]).then(loadedImages => {
          images.current = { ...images.current, ...loadedImages };
        });

        newState = {
          parent: "",
          name: "Writing",
          text: "",
          links: [
            {
              type: 'section',
              title: 'Game of Thrones Parody',
              sectionLinks: [
                { text: 'Lame of Thrones', url: 'https://www.amazon.com/Lame-Thrones-Final-Book-Song/dp/0306873672' },
              ]
            },
            {
              type: 'section',
              title: 'The Harvard Lampoon',
              sectionLinks: [
                { text: 'Chimney Sweep'},
                { text: 'Mob Succession'},
                { text: 'Yo Mama So Fat'},
                { text: 'No More Sheriffs'},
                { text: 'New Partner'},
                { text: 'Ashes'},
                { text: 'Prison Ship'},
                { text: 'Paul McCartney Hyping Himself Up Outside of Ricky’s Pub Before Naming The Beatles – July 14, 1958, Liverpool'},
                { text: 'Meet Your New President'},
                { text: 'Shamu Comic'},
              ]
            },
            {
              type: 'section',
              title: 'My Lampoon Issue',
              sectionLinks: [
                { text: 'Selected pieces from the Symphonia Fantastica #', url: 'https://www.harvardlampoon.com/read/magazines/17/', partiallyHyperlinked: true },
              ]
            }
          ],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        currentImageRef.current = newState.backgroundImage;
        startTransition(canvas, state.backgroundImage, newState.backgroundImage, widthRef.current, heightRef.current);
        break;

      case "Chimney Sweep":
        newState = {
          parent: "Writing",
          name: "Chimney",
          text: "",
          cssTag: "chimney",
          title: "Chimney Sweep",
          paragraphs: ChimneyText,
          links: [],
          image: images.current["/images/writing/flesh.jpg"],
          imageTop: images.current["/images/writing/chimney_sweep.JPG"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      case "Mob Succession":
        newState = {
          parent: "Writing",
          name: "Mob",
          text: "",
          cssTag: "mob",
          title: "Mob Succession",
          paragraphs: MobText,
          links: [],
          image: images.current["/images/writing/west.jpg"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      case "Yo Mama So Fat":
        newState = {
          parent: "Writing",
          name: "YoMama",
          text: "",
          cssTag: "yo-momma",
          title: "Yo Mama So Fat",
          paragraphs: YoMamaText,
          links: [],
          image: images.current["/images/writing/heyyou.jpg"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      case "No More Sheriffs":
        newState = {
          parent: "Writing",
          name: "NoMoreSheriffs",
          text: "",
          cssTag: "nosheriffs",
          title: "No More Sheriffs",
          paragraphs: NoMoreSheriffsText,
          links: [],
          image: images.current["/images/writing/seasons.jpg"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      case "New Partner":
        newState = {
          parent: "Writing",
          name: "NewPartner",
          text: "",
          cssTag: "new-partner",
          title: "New Partner",
          paragraphs: NewPartnerText,
          links: [],
          image: images.current["/images/writing/flesh.jpg"],
          imageTop: images.current["/images/writing/new_partner.jpg"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      case "Ashes":
        newState = {
          parent: "Writing",
          name: "Ashes",
          text: "",
          cssTag: "ashes",
          title: "Ashes",
          paragraphs: AshesText,
          links: [],
          image: images.current["/images/writing/ashes.jpg"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      case "Prison Ship":
        newState = {
          parent: "Writing",
          name: "PrisonShip",
          text: "",
          cssTag: "prison-ship",
          title: "Prison Ship",
          paragraphs: PrisonShipText,
          links: [],
          image: images.current["/images/writing/greener.jpg"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      case "Paul McCartney Hyping Himself Up Outside of Ricky’s Pub Before Naming The Beatles – July 14, 1958, Liverpool":
        newState = {
          parent: "Writing",
          name: "PaulMcCartney",
          text: "",
          cssTag: "mccartney",
          title: "Paul McCartney Hyping Himself Up Outside of Ricky’s Pub Before Naming The Beatles – July 14, 1958, Liverpool",
          paragraphs: PaulMcCartneyText,
          links: [],
          image: images.current["/images/writing/symphonia.jpg"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      case "Meet Your New President":
        newState = {
          parent: "Writing",
          name: "NewPresident",
          text: "",
          cssTag: "newpresident",
          title: "Meet Your New President",
          paragraphs: NewPresidentText,
          links: [],
          image: images.current["/images/writing/inauguration.jpg"],
          backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;

      
      case "Shamu Comic":
          newState = {
            parent: "Writing",
            name: "Shamu",
            text: "",
            cssTag: "shamu",
            title: "",
            links: [],
            image: images.current["/images/writing/shamu.jpg"],
            backgroundImage: images.current["/images/canvases/monkey.jpg"]
        };
        break;


      case "Coding":
        newState = {
          parent: "",
          name: "Coding",
          linkTitle: "My Coding Projects",
          text: "",
          links: [
            {label: 'This Site', url: 'https://github.com/arenasjuan/portfolio', description: ": See how the sausage is made!"},
            {label: 'George Condo LoRA Model', url: 'https://civitai.com/models/244342/condoesque', description: ": Stable Diffusion LoRA model trained on the style of painter George Condo"},
            {label: 'ChatGPT Malware Generation', url: 'https://drive.google.com/file/d/1ohQ8RT1r6USWh-2iKlh11CWzA5g1swoa/view?usp=drive_link', description: ": Personal experiment where I tried to get ChatGPT to generate malware"},
            {label: 'Faces', url: 'https://github.com/arenasjuan/faces', description: ": A unique game for exploring a user's personal taste by generating a composite face from that user's preferred facial images"},
            {label: 'Music Sentiment Analysis', url: 'https://github.com/arenasjuan/music_sentiment', description: ": Transformer model for music sentiment analysis using the Database for Emotional Analysis of Music "},
            {label: 'Autoprint', url: 'https://github.com/arenasjuan/lambda-func-autoprint', description: ": AWS Lambda function for adding ecommerce order data to PostgreSQL database and printing order-related documents if necessary"},
            {label: 'Shipstation Order Processor', url: 'https://github.com/arenasjuan/lambda-func-order_processor', description: ": AWS Lambda function that processes incoming Shipstation orders"},
            {label: 'Bloom Lighting Project', url: 'https://github.com/arenasjuan/bloom', description: ": Final project for computer graphics class "},
            {label: 'Slackbot', url: 'https://github.com/arenasjuan/slackbot', description: ": Slackbot that reprocesses Shipstation orders"},
            {label: 'SikeBot', url: 'https://github.com/arenasjuan/SikeBot', description: ": TwitterBot that generates and posts funny image macros at random intervals"},
          ],
          backgroundImage: images.current["/images/canvases/pollock.jpg"],
          footerTextTop: "The Matrix",
          footerTextBottom: "(Jackson Pollock, 2002)",
        };
        currentImageRef.current = newState.backgroundImage;
        startTransition(canvas, state.backgroundImage, newState.backgroundImage, widthRef.current, heightRef.current);
        break;

      case "Videos":
        preloadImages([
          "/images/canvases/1falling.jpg",
          "/images/canvases/2falling.jpg",
          "/images/thumbnails/1920s.jpg",
          "/images/thumbnails/alley.jpg",
          "/images/thumbnails/studio.jpg",
          "/images/thumbnails/gnome.jpg",
          "/images/thumbnails/flamenco.jpg",
          "/images/thumbnails/graffiti.jpg",
          "/images/thumbnails/colombia.jpg",
          "/images/thumbnails/colosseum_1.jpg",
          "/images/thumbnails/colosseum_2.jpg",
          "/images/thumbnails/jazz_1.jpg",
          '/images/thumbnails/bikematter.jpg',
          '/images/thumbnails/griffith.jpg',
          "/images/thumbnails/grey_button.png",
          "/images/thumbnails/red_button.png",
        ]).then(loadedImages => {
          images.current = { ...images.current, ...loadedImages };
        });

        newState = {
          parent: "AI-Art",
          name: "Videos",
          text: "Long Videos | Tiktoks",
          textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000, 1px -1px 1px #000000, -2px -2px 1px #000000, 0px 2px 6px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000, 1px 1px 2px #000000, -1px -1px 2px #000000",
          links: [],
          textColor: 'white',
          backgroundImage: images.current["/images/canvases/camera.jpg"]
        };
        currentImageRef.current = newState.backgroundImage;
        startTransition(canvas, state.backgroundImage, newState.backgroundImage, widthRef.current, heightRef.current);
        break;

      case "Long Videos":
        newState = {
          parent: "Videos",
          name: "LongVideos",
          text: "",
          links: [
            {text: "'Bike Matter' (Mashup and Animation)", videoId: '6qZA2B3uBtQ', thumbnail: images.current["/images/thumbnails/bikematter.jpg"], type: 'youtube', color: 'white', size: '4vh', textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000,  -2px -2px 1px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000, -1px -1px 2px #000000"},
            {text: "'Griffith' (Griffith Observatory Timelapse)", videoId: 'SJFtzAoD_z4', thumbnail: images.current["/images/thumbnails/griffith.jpg"], type: 'youtube', color: 'white', size: '4vh', textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000,  -2px -2px 1px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000, -1px -1px 2px #000000"},
          ],
          backgroundImage: images.current["/images/canvases/biker.jpg"]
        };
        currentImageRef.current = newState.backgroundImage;
        startTransition(canvas, state.backgroundImage, newState.backgroundImage, widthRef.current, heightRef.current);
        break;


      case "Tiktoks":
        newState = {
          parent: "Videos",
          name: "Tiktoks",
          text: "",
          links: [
            // TikTok videos
            {text: 'Studio Cat', videoId: '7247773989001563435', type: 'tiktok'},
            {text: 'Bike Matter', videoId: '7251275338284551467', type: 'tiktok'},
            // YouTube videos
            {text: '1920s Oil', videoId: 'N2GdL-UDPG4', thumbnail: images.current["/images/thumbnails/1920s.jpg"], type: 'youtube'},
            {text: 'Space Studio', videoId: 'NrWW_ERKx5U', thumbnail: images.current["/images/thumbnails/studio.jpg"], type: 'youtube'},
            {text: 'Alley Scene', videoId: 'pefEXYP_6Bk', thumbnail: images.current["/images/thumbnails/alley.jpg"], type: 'youtube'},
            {text: 'Gnome 1', videoId: '19gnjVwPhOk', thumbnail: images.current["/images/thumbnails/gnome.jpg"], type: 'youtube'},
            {text: 'Flamenco Oil', videoId: 'ieO_DIQZVJs', thumbnail: images.current["/images/thumbnails/flamenco.jpg"], type: 'youtube'},
            {text: 'Graffiti Oil', videoId: 'Pw2cGRHuQR4', thumbnail: images.current["/images/thumbnails/graffiti.jpg"], type: 'youtube'},
            {text: 'Kids of Colombia', videoId: 'AL052n_1_ZQ', thumbnail: images.current["/images/thumbnails/colombia.jpg"], type: 'youtube'},
            {text: 'Colosseum Concert 1', videoId: 'XomIkS_saXQ', thumbnail: images.current["/images/thumbnails/colosseum_1.jpg"], type: 'youtube'},
            {text: 'Colosseum Concert 2', videoId: 'qUyKF1YstFI', thumbnail: images.current["/images/thumbnails/colosseum_2.jpg"], type: 'youtube'},
            {text: 'Jazz Club', videoId: 'HhxlzyPrz2w', thumbnail: images.current["/images/thumbnails/jazz_1.jpg"], type: 'youtube'},
          ],
          backgroundImage: images.current["/images/canvases/2falling.jpg"]
        };
        currentImageRef.current = newState.backgroundImage;
        startTransition(canvas, state.backgroundImage, newState.backgroundImage, widthRef.current, heightRef.current);
        break;

      case "Images":
        preloadImages([
          ...imagePaths.comics,
          ...imagePaths.qr,
          ...imagePaths.concepts,
          ...imagePaths.wallpapers,
          ...imagePaths.products
        ]).then(loadedImages => {
          images.current = { ...images.current, ...loadedImages };
        });

        newState = {
          parent: "AI-Art",
          name: "Images",
          textColor: '#d8bb00',
          textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000,  -2px -2px 1px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000",
          text: "Comics | Hidden QR Codes | Children's Show Concept Art | Wallpapers | Product Images",
          links: [],
          backgroundImage: images.current["/images/canvases/pics.jpg"]
        };
        currentImageRef.current = newState.backgroundImage;
        startTransition(canvas, state.backgroundImage, newState.backgroundImage, widthRef.current, heightRef.current);
        break;


      case "Comics":
        newState = {
          parent: "Images",
          name: "Comics",
          text: "",
          links: imagePaths.comics.map((url, i) => ({ url, type: 'image' })),
          backgroundImage: images.current["/images/canvases/pics.jpg"]
        };
        break;

      case "Hidden QR Codes":
        newState = {
          parent: "Images",
          name: "QR_Codes",
          text: "",
          links: imagePaths.qr.map((url, i) => ({ url, type: 'image' })),
          backgroundImage: images.current["/images/canvases/pics.jpg"]
        };
        break;

      case "Children's Show Concept Art":
        newState = {
          parent: "Images",
          name: "Concept_Art",
          text: "",
          links: imagePaths.concepts.map((url, i) => ({ url, type: 'image' })),
          backgroundImage: images.current["/images/canvases/pics.jpg"]
        };
        break;

      case "Wallpapers":
        newState = {
          parent: "Images",
          name: "Wallpapers",
          text: "",
          links: imagePaths.wallpapers.map((url, i) => ({ url, type: 'image' })),
          backgroundImage: images.current["/images/canvases/pics.jpg"]
        };
        break;

      case "Product Images":
        newState = {
          parent: "Images",
          name: "Products",
          text: "",
          links: imagePaths.products.map((url, i) => ({ url, type: 'image' })),
          backgroundImage: images.current["/images/canvases/pics.jpg"]
        };
        break;

      default:
        break;
    }

    if (newState) {
      if (newState.name === 'Writing') {
        setIsWritingSampleOpen(false);
      } else if (newState.parent === 'Writing') {
        setIsWritingSampleOpen(true);
      }
      
      stateHistory.current.push(state);
      setState(newState);
    }

  }

  const handleBack = () => {
    const previousState = stateHistory.current.pop();
    if (previousState) {
      const canvas = appRef.current.getElementsByTagName('canvas')[0];

      const fromImage = state.backgroundImage; // Save this before calling setState
      setState(previousState);
      currentImageRef.current = previousState.backgroundImage;
      startTransition(canvas, fromImage, previousState.backgroundImage, widthRef.current, heightRef.current);
    }
  };

  return (
    <div key={key} ref={appRef} className="app">
      {loadProgress < 100 ? (
        <div className="loadingScreen">
          Loading...
          <progress value={loadProgress} max="100" />
        </div>
      ) : null}
      {state.text === "AI Art | Writing | Coding" && 
        <div className="contactInfo">
          <div>Juan Arenas</div>
          <div>arenas.juan.f@gmail.com</div>
        </div>
      }
      <canvas className="dissolveCanvas" style={{backgroundColor: state.backgroundColor, backgroundImage: `url(${state.backgroundImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></canvas>
      <div className="text" style={{ color: state.textColor, fontSize: state.textSize, fontWeight: state.textWeight, textShadow: state.textShadow }}>
        {(() => {
          const sections = state.text.split(" | ");
          return sections.map((section, i) => (
            <React.Fragment key={i}>
              <span className="transitionText" onClick={e => handleClick(section)}>{section}</span>
              {i < sections.length - 1 && <span className="divider"> | </span>}
            </React.Fragment>
          ));
        })()}
      </div>
      {state.name === 'Coding' && 
        <div className="footerText">
          <div className="footerTextTop">{state.footerTextTop}</div>
          <div className="footerTextBottom">{state.footerTextBottom}</div>
        </div>
      }
      <div className={`links ${state.name}`}>
      {state.name === 'LongVideos' && 
        <div className="videoContainer">
          {state.links.filter(link => link.type === 'youtube').map((link, i) => (
            <div key={i} className="video-thumbnail-wrapper">
              <p style={{color: link.color, fontSize: link.size, textShadow: link.textShadow}}>{link.text}</p>
              <div className="thumbnail-play-wrapper">
                <div 
                  className="thumbnail-play"
                  onMouseEnter={() => setHoveredThumbnail(i)}
                  onMouseLeave={() => setHoveredThumbnail(null)}
                  onClick={() => handleVideoClick(link.videoId, link.thumbnail.src)}
                  style={{backgroundImage: `url(${link.thumbnail.src})`, cursor: 'pointer'}}
                >
                  <img 
                    className={`play-button ${hoveredThumbnail === i ? 'red-button' : 'grey-button'}`} 
                    src={hoveredThumbnail === i ? images.current['/images/thumbnails/red_button.png'].src : images.current['/images/thumbnails/grey_button.png'].src} 
                    alt={link.text} 
                    style={{pointerEvents: 'none'}} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      {state.name === 'Writing' && 
        <div className={`sectionContainer ${isWritingSampleOpen ? 'no-animation sample-open' : ''}`}
        style={{backgroundImage: `url(${images.current["/images/writing/writing_background.jpg"].src})`}}>
          <div className="unfurl" style={{backgroundImage: `url(${images.current["/images/canvases/monkey.jpg"].src})`}}></div>
          <div className="mask">
            <div className="maskGrid"></div>
          </div>
          <div className="contentWrapper">
            {state.links.map((link, i) => 
              link.type === 'section' && (
                <div key={i} className="section">
                  <div className="sectionTitle">{link.title}</div>
                  <hr className="customHr"/>
                  {link.sectionLinks.map((sectionLink, j) => {
                    if (sectionLink.partiallyHyperlinked) {
                      const [otherText, hyperlinkText] = sectionLink.text.split('Symphonia Fantastica #');
                      return (
                        <div key={j} className="linkWrapper partiallyHyperlinked">
                          <span className="otherText">{otherText}</span>
                          <a className="sectionLink" href={sectionLink.url} target="_blank" rel="noopener noreferrer">
                            {'Symphonia Fantastica #' + (hyperlinkText || '')}
                          </a>
                        </div>
                      );
                    } else {
                      return (
                        <div key={j} className="linkWrapper">
                          {sectionLink.url ?
                            <a className="sectionLink" href={sectionLink.url} target="_blank" rel="noopener noreferrer">
                              {sectionLink.text}
                            </a>
                            :
                            <span className="sectionLink" onClick={() => handleClick(sectionLink.text)}>
                              {sectionLink.text}
                            </span>
                          }
                        </div>
                      );
                    }
                  })}
                </div>
              )
            )}
          </div>
        </div>
      }
      {state.cssTag && 
        <div className={`writingSample ${state.cssTag}-sample`}>
          {state.paragraphs && 
            <div className={`sample-container ${state.cssTag}-container`}>
              {state.title && 
                <div className={`title ${state.cssTag}-title`}>
                  {state.title}
                </div>
              }
              {state.imageTop && 
                <img src={state.imageTop.src} alt={`${state.name} Piece Illustration`} className={`image-top ${state.cssTag}-image-top`} />
              }
              {state.paragraphs.map((paragraph, i) => 
                <div key={i} className={`paragraph ${state.cssTag}-paragraph`} dangerouslySetInnerHTML={{ __html: paragraph }}>
                </div>
              )}
            </div>
          }
          {state.image && 
            <img src={state.image.src} alt={`${state.name} Magazine Cover`} className={`image ${state.cssTag}-image`} />
          }
        </div>
      }
      {state.name === 'Tiktoks' &&
        <div className="tiktokContainer">
          <div className="youtubeThumbnailContainer">
            {state.links.filter(link => link.type === 'youtube').slice(0, 5).map((link, i) => (
              <div 
                key={i} 
                className="youtubeThumbnail"
                style={{backgroundImage: `url(${link.thumbnail.src})`}} 
                onClick={() => handleVideoClick(link.videoId, link.thumbnail.src)}
              >
                <div 
                  className="youtubeThumbnailBefore" 
                  style={{backgroundImage: `url(${images.current["/images/canvases/1falling.jpg"].src})`}} 
                ></div>
                <div className="youtubeThumbnailText">{link.text}</div>
              </div>
            ))}
          </div>
          <div className="tiktoks">
            {state.links.filter(link => link.type === 'tiktok').map((link, i) => (
              <div key={i} className="tiktokWrapper">
                <TikTokEmbed key={link.videoId} videoId={link.videoId} text={link.text} />
                <div className="tiktokOverlayContainer" onClick={() => handleTikTokClick(link)}>
                  <div className="tiktokOverlay" style={{backgroundImage: `url(${images.current["/images/canvases/1falling.jpg"].src})`}}></div>
                  <div className="tiktokText">{link.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="youtubeThumbnailContainer">
              {state.links.filter(link => link.type === 'youtube').slice(5).map((link, i) => (
                  <div 
                      key={i} 
                      className="youtubeThumbnail"
                      style={{backgroundImage: `url(${link.thumbnail.src})`}}
                      onClick={() => handleVideoClick(link.videoId, link.thumbnail.src)}
                  >
                      <div 
                          className="youtubeThumbnailBefore" 
                          style={{backgroundImage: `url(${images.current["/images/canvases/1falling.jpg"].src})`}} 
                      ></div>
                      <div className="youtubeThumbnailText">{link.text}</div>
                  </div>
              ))}
          </div>
        </div>
      }
      {state.parent === 'Images' &&
        <div className={`imageGallery ${state.name}`}>
          {state.links.filter(link => link.type === 'image').map((link, i) => (
            <ImageContainer key={i} link={link} handleImageClick={handleImageClick} />
          ))}
        </div>
      }
      {state.name === 'Coding' &&
        <div className={`linkContainer`}>
          <div className="linksTitle">{state.linkTitle}</div>
          <hr className="codeBar"/>
          {state.links.map((link, i) => (
            <div key={i}>
              <a className="codeLinks" href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
              <span className="codeDescriptions">{link.description}</span>
            </div>
          ))}
        </div>
      }
    </div>
    {state.text !== "AI Art | Writing | Coding" && <span className="back-button" onClick={handleBack}>←Back</span>}
    <ImageModal 
      isOpen={modalIsOpen} 
      urls={imageUrls} 
      currentUrlIndex={currentImageIndex} 
      onClose={handleCloseImageModal} 
      onNext={handleNextImage} 
      onPrevious={handlePreviousImage}
    />
    <VideoModal
      isOpen={videoModalIsOpen}
      videoId={currentVideoId}
      onClose={handleCloseModal}
    />
  </div>
);

}

function VideoModal() {
  const { videoModalIsOpen, handleCloseModal, currentVideoType, currentVideoId, currentVideoThumbnail } = useContext(VideoContext);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };
    if (videoModalIsOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoModalIsOpen, handleCloseModal]);

  const handleBackdropClick = (event) => {
    if (event.target.className === 'modal-content') {
      handleCloseModal();
    }
  };

  return videoModalIsOpen ? (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <div className="modal-video">
          <VideoComponent videoType={currentVideoType} videoId={currentVideoId} videoThumbnail={currentVideoThumbnail} />
        </div>
      </div>
    </div>
  ) : null;
}



export default function App() {
  return (
    <VideoProvider>
      <Portfolio />
      <VideoModal />
    </VideoProvider>
  );
}
