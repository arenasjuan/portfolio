import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { startTransition, preloadImages } from './dissolve.js';
import './App.css';
import './fonts/Futura Book font.ttf'


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

  return isOpen ? (
    <div className="modal">
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


function Portfolio() {
  const initialState = {
    text: "AI Art | Writing | Coding",
    links: [],
    backgroundImage: "/images/orange.png",
  };
  const [state, setState] = useState(initialState);
  const [key, setKey] = useState(Math.random());
  const stateHistory = useRef([initialState]);
  const appRef = useRef(null);
  const images = useRef({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoModalIsOpen, setVideoModalIsOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  useEffect(() => {
    preloadImages([
      "/images/orange.png",
      "/images/pollock.png",
      "/images/monkey.png",
      "/images/bot.png",
      "/images/biker.png",
      "/images/pics.png",
      "/images/kids.png",
      "/images/camera.png",
      "/images/writing_background.png",
      "/images/shamu.png",
      "/images/chimney_sweep.JPG",
      "/images/flesh.png",
      "/images/greener.png",
      "/images/symphonia.png",
      "/images/west.png",
      "/images/inauguration.png",
      "/images/heyyou.png",
      "/images/seasons.png",
    ]).then(preloadedImages => {
      images.current = preloadedImages;
      setState({...state, backgroundImage: preloadedImages["/images/orange.png"]});
    });
  }, []);

  // Function definition inside your component
  const updateBackgroundSize = () => {
    const canvas = appRef.current.querySelector('.dissolveCanvas');

    if (!canvas) {
      return;
    }

    const viewportAspectRatio = window.innerWidth / window.innerHeight;
    const canvasAspectRatio = canvas.width / canvas.height;

    if (viewportAspectRatio > canvasAspectRatio) {
      canvas.style.width = '100vw';
      canvas.style.height = 'auto';
    } else {
      canvas.style.height = '100vh';
      canvas.style.width = 'auto';
    }

    if ((canvas.style.width === '100vw' && canvas.offsetHeight < window.innerHeight) ||
        (canvas.style.height === '100vh' && canvas.offsetWidth < window.innerWidth)) {
      [canvas.style.width, canvas.style.height] = [canvas.style.height, canvas.style.width];
    }


  };

  useEffect(() => {
    const handleResize = () => {
      updateBackgroundSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateBackgroundSize]);


  useLayoutEffect(() => {
    updateBackgroundSize();

    window.addEventListener('resize', updateBackgroundSize);

    return () => {
      window.removeEventListener('resize', updateBackgroundSize);
    };
  }, []);  // empty dependency array to only run at the initial render


  const handleImageClick = (url) => {
    setCurrentImage(url);
    setImageUrls(state.links.filter(link => link.type === 'image').map(link => link.url));
    setCurrentImageIndex(state.links.findIndex(link => link.url === url));
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(currentImageIndex + 1);
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex(currentImageIndex - 1);
  }

  function handleVideoModalClose() {
    setVideoModalIsOpen(false);
  }


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
          backgroundImage: images.current["/images/bot.png"]
        };
        startTransition(canvas, state.backgroundImage, newState.backgroundImage);
        break;

      case "Writing":
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
                { text: 'Meet Your New President'},
                { text: 'Mob Succession'},
                { text: 'Yo Mama So Fat'},
                { text: 'No More Sheriffs'},
                { text: 'New Partner'},
                { text: 'Prison Ship'},
                { text: 'Paul McCartney Hyping Himself Up Outside of Ricky’s Pub Before Naming The Beatles – July 14, 1958, Liverpool'},
                { text: 'Shamu Comic'},
              ]
            },
            {
              type: 'section',
              title: 'My Lampoon  Issue',
              sectionLinks: [
                { text: 'Selected pieces from the Symphonia Fantastica #', url: 'https://www.harvardlampoon.com/read/magazines/17/', partiallyHyperlinked: true },
              ]
            }
          ],
          backgroundImage: images.current["/images/monkey.png"]
        };
        startTransition(canvas, state.backgroundImage, newState.backgroundImage);
        break;

      case "Chimney Sweep":
        newState = {
          parent: "Writing",
          name: "Chimney",
          text: "",
          cssTag: "chimney",
          title: "Chimney Sweep",
          paragraphs: [
            "Chimney sweeping is what I was born to do since I have no arms or legs. Doctors called my missing limbs a pity or a travesty, but my parents called them chimney brush slots. I was put to work immediately.",
            "All the other kids have to use both hands to brush, the suckers. I brush everywhere that I walk or climb or exist. I’m the most popular chimney sweep in London – not only do I have the most brushes, but I do it for free. Partly because of a love of the trade, but mostly because they refuse to pay orphans.",
            "Good sweeping starts with the uniform. I wear only a dirty cap, marking me as a grade-A sweeper and a quadriplegic. Once in the chimney, other kids waste time with two-handed brushing or suffocation. Instead I wriggle upwards while waving my arms and legs and convulsing. I got better than the older kids by studying the inchworm, nature’s chimney sweep. I may have the mind of a 9 year old, but I have the lungs of a much unhealthier 9 year old.",
            "My least favorite days are when the constable is about. He’s always after us street kids – not to grope us or anything. That was the last constable. This constable just wants to see us rot in prison. I always rely on my brush-feet to carry me to safety; I don’t need to be faster than the constable, I just have to brush faster than the other kids. While I am always the fastest brusher, the other kids can actually run, so I always spend the night in prison. The fluttering of my brushes in my escape attempts leave the cell impeccably clean – every time.",
            "My brushing skills come from my training. I was dropped into my first chimney as a baby, and whatever chimney-cleaning secrets didn’t come naturally to me were very quickly learned as I tumbled down that chimney. This was a rite of passage. What fell into that chimney was a baby, but what emerged was a man, covered in soot. We don’t know who that guy was, but I emerged right after him, a limbless baby covered in soot – and a damn-good sweeper.",
          ],
          links: [],
          image: images.current["/images/chimney_sweep.JPG"],
          backgroundImage: images.current["/images/monkey.png"]
        };
        break;

      case "Meet Your New President":
        newState = {
          parent: "Writing",
          name: "NewPresident",
          text: "",
          cssTag: "newpresident",
          title: "Meet Your New President",
          paragraphs: [
            "(This piece served as the intro to a parody inauguration pamphlet that I distributed with the Lampoon at Trump’s inauguration in Washington, DC)",
            "Donald Hussein Trump was hatched December 7, 1941 in Jamaica, Queens, the Caribbean. Contrary to popular belief, Donald “the Donald” Trump was not born with his trademark hairstyle, though it was immediately grafted onto him by his father, Fred “the Donald” Trump, who had a phobia of bald people, or “the balds” (we no longer refer to baldos like this).",
            "Donald Rodham Trump was bullied severely as a child (these bullies will be discussed in the “Meet the Cabinet” section). It’s hard to imagine a world where someone would be ridiculed for having a dumb shitty name, or an ugly face, or stupid orange hair, or lips that look like the puckering of a sphincter, or eyes that look like the puckering of a sphincter, or oily off-white skin, or a fat ugly dead shit-breathed dad, or a puckered sphincter. Despite all this, Trump managed to abstain from alcohol and cigarettes, which made him also a pussy.",
            "As a young adult, Donald Arial Trump attended Fordham University and the University of Pennsylvania, both now known as Trump University. He created his own major in what he called “No More Ethnic Studies”, now known as urban city planning. He also managed to dodge the draft by posing as a deformed poodle — you know the kind. He did this for the next 50 years.",
            "After college, Trump worked for his father’s company, doing the hard job of kicking minorities out of Trump apartment complexes and converting them into the gleaming, white-only drug dens you see today. This continued either until his father died or he ran out of minorities, but let’s not dwell on that. In either case he got a lot of money and his dad died.",
            "Trump inherited the Trump Organization and its holding company, Freddie Mo’ Bucks LLC, a Trump Company, and he turned his eye to his next get-rich-quick-at-the-expense-of-millions​​​​-of-significantly-less-affluent-Americans scheme: starting a family. He met his exotic, high-school educated wife, Kanye West, and they had five beautiful botched abortions: Jerry, Don Jr., Mungo, Barron, and Black Jerry. These are the faces that accompanied him on his historic, successful, slightly rape-y presidential campaign, delivering Donald “Get It Right — I’m Unfit for Service Only Because I’m a Poodle, Not a Goddamn Pacifist” Trump to the Oval Office.",
            "So give it up for your 45th President of the USA: Donlad “©” Tromp"
          ],
          links: [],
          image: images.current["/images/inauguration.png"],
          backgroundImage: images.current["/images/monkey.png"]
        };
        break;


      case "Mob Succession":
        newState = {
          parent: "Writing",
          name: "Mob",
          text: "",
          cssTag: "mob",
          title: "Mob Succession",
          paragraphs: [
            "— Tony, I assume you’re here to ask who will take over my position as mob boss.",
            "— Actually Dad I was here to tell you–",
            "— Ishmael the beggar is now boss.",
            "— Wait what? The hobo who sleeps outside the restaurant?",
            "— He has exactly the old-country ideals this organization needs.",
            "— Dad, he’s not even related to you. And I helped you murder 35 people.",
            "— Ishmael is the son of a weaver, can you believe it?",
            "— But I took out the Marino family for you. One 35-way intersection, one accident, no survivors.",
            "— Well Ishmael would never kill 35 people.",
            "— But Dad, you told me to. “Scour the city and spill the blood of the Marino pigs,” you said that.",
            "— What a nasty quote. Nothing like Don Ishmael’s many folksy quips and parables.",
            "— You can’t let Ishmael sit in your chair. He’s filthy – I think his nails are entirely made of mold.",
            "— Those nails let him weave 7 baskets in 3 hours. Crazy, right? It’s crazy he can weave that fast?",
            "— Well I don’t see how baskets will help him peddle drugs or wipe out families.",
            "— Oh, did I not mention each basket holds 1 gallon? Do you know how much that is, Tony?",
            "— Yes Dad that’s 7 gallons.",
            "— Every 3 hours! Ishmael, he is so humble about it. We could run the world with that kind of output.",
            "— No Dad. And I originally came to tell you that the police are here for us.",
            "— In the middle of Ishmael’s inauguration? Why?",
            "— The killing of 35 people and resulting traffic disruption.",
            "— What about Ishmael? Is he safe?",
            "— He isn’t complicit in mass-murder.",
            "— Then the Familia is safe.",
            "— We’re going to prison for life.",
            "— All the world will fear the Morettí Basket-Weavers."
          ],
          links: [],
          image: images.current["/images/west.png"],
          backgroundImage: images.current["/images/monkey.png"]
        };
        break;


      case "Yo Mama So Fat":
        newState = {
          parent: "Writing",
          name: "YoMama",
          text: "",
          cssTag: "yo-momma",
          title: "Yo Mama So Fat",
          paragraphs: [
            "— ...is the best way I thought I could begin breaking this news, Timmy. I’m so sorry. She’s dead.",
            "— Oh my God… what happened, Doc?",
            "— She came in complaining of something, but the ER receptionist didn’t understand since he doesn’t speak whale. We tried doing some preliminary x-rays on her but we couldn’t because they don’t make satellites that big. We managed to do an MRI, but when we hung the images up they fell off the wall and through the floor. She had a terrible fever but we couldn’t get her into a cold bath since SeaWorld was closed. She then fell into a coma, and broke it.",
            "— Jesus, Doc, I can’t believe how much she suffer-",
            "— Her left hand started developing some very troubling hives, so I told the nurse to walk around and check the right hand, and she’s still walking. She eventually snapped out of the coma but didn’t regain full control of her body for some time since she she has to wake up in sections. We found a swimming pool to bathe her in and added just a drop of water, but she overflowed it and took out the cancer wing. This freaked her out and she escaped towards the city, where the police and military fired at her -- though it was ineffective since they don’t shoot in panoramic. I chased her in my car and she charged at me, but when I tried to swerve around her I ran out of gas. I leapt out of my car and climbed up to her head to try and tell her to stop but when I got to the top my ears popped so hard I forgot where I was. What finally did her in was when she tripped on a dent in the ground that her shadow made and she fell and bonked her head on a plant. We thought it appropriate to give her a last meal, but when we asked what her favorite food was she said “seconds”. She then gasped her last breath and accelerated global warming by 175 years. I’m sorry you’re finding out about this so late -- we had trouble finding her address to notify next of kin, since both her asscheeks are in different zip codes.",
            "— Doc… that’s horrible, Doc. But you did all you could. At least she’s in heaven now.",
            "— Timmy, not even God’s arms are strong enough to lift that ass. Your mother is most certainly in Hell."
          ],
          links: [],
          image: images.current["/images/heyyou.png"],
          backgroundImage: images.current["/images/monkey.png"]
        };
        break;

    case "No More Sheriffs":
      newState = {
        parent: "Writing",
        name: "NoMoreSheriffs",
        text: "",
        cssTag: "nosheriffs",
        title: "No More Sheriffs",
        paragraphs: [
          "Happy Saturday everyone – good to see you at the town meeting. All our sheriffs died last night.",
          "Let me start by acknowledging the empty podium next to mine. As you all know, this child-sized plastic podium belongs to Sheriff Sharif, my second in command. Sadly Sheriff Sharif is not with us today – he is observing the Islamic sabbath after all. This is very unlike all the other sheriffs who were torn apart by a train last night.",
          "This train entered the town at approximately twenty-two hundred – and that’s pretty heavy for a train if you ask me. I’m not sure how it made it past the anti-train security we installed last year. Somehow it plowed through all 20,053 damsels tied up on the tracks, 1,085,768,231 damsels dressed as scarecrows, 9,999,999,999,999.97 damsels armed with water bottles to spray at the train’s whiskers, and the 3 Old Man Damsel’s Damsel Emporium franchises that we erected on the train tracks. At this point I should say that all the town’s women are also dead.",
          "After the six days it took for this evil train to sneak past our security, the sheriffs wasted no time getting to work – after all somebody had to enforce our Jim Crow laws. Once the sheriffs were back on the street all seemed at peace, what with the women gone. They couldn’t have possibly imagined the event that would rock our town and destroy the rule of law: the passing of the Civil Rights Act. Thank God that turned out to be a big prank and the sheriffs quickly caught the high schoolers responsible for it.",
          "Little did they know that those high schoolers were actually little train cars, which assembled into a larger train car, which called up a few train car friends and combined into a larger train, which was part of an even LARGER prank by the rival high school. The sheriffs arrested these hoodlums too, and it’s comforting to know how dedicated they were to the law before being plowed over, internally decapitated, dismembered, re-membered, dismembered again, and having their skin and sinew be twisted and ripped off by a hellish train at the conclusion of a large battle, metaphorically speaking.",
          "The sheriffs decided to visit a bar in our neighboring town to celebrate the imprisonment of all those children. The next train there was fiery, gnarled, and covered in the blood of millions of women, as a result of our town’s poor train maintenance. They instead boarded the train after that which was the evil one. This was the last time they were seen alive, as shortly after their trip began they were struck by another unrelated train and quietly passed away. Sheriff Williams was the only survivor, but this morning, after a long battle with cancer, he was shot to death.",
          "Things may seem dire, but know that we will get through this tough time, and the law will always live on in our town. That being said I have just been informed that Sheriff Sharif is dead. Thank you all for coming. God bless. USA USA USA."
        ],
        links: [],
        image: images.current["/images/seasons.png"],
        backgroundImage: images.current["/images/monkey.png"]
      };
      break;


      case "New Partner":
        newState = {
          parent: "Writing",
          name: "NewPartner",
          text: "",
          cssTag: "new-partner",
          title: "New Partner",
          paragraphs: [
            "A cop’s #1 belief: I’m not gonna be the jerkoff that shoots his own partner. I live and breathe this mantra, and I repeated it before, during, and after shooting my five partners. Accidents happen, but the Chief isn’t so understanding, so for my next assignment he gave me Joe, a partner made of wood.",
            "What bothered me about Joe was not that he was made of wood, but that he was a newbie, fresh out of the academy. The academy doesn’t teach anything worth a damn these days, especially not how to evade bullets, as my five pardoned felonies have shown me. Also Joe was made of spruce, the meekest of woods.",
            "Our first night on the job we got an easy call: routine gang shooting. I got one hand on the wheel, one hand on my radio, one hand on my gun, bada-bing bada-boom before you know it I’ve shot Joe 36 times. And what did this maverick do but survive all of that and then flop out of the cruiser, his spruce frame knocking out every gang member as he fell. That’s when I knew that we’d make a good pair and that the municipality shouldn’t let me still have a gun.",
            "The crimewave goes down and concussions go up. I get a custom ejector seat installed in our cruiser, so Joe can smack into ne’er-do-wells and enforce the law. It’s basically a baby seat covered in sawdust with a big spring under it – my design. Joe’s wooden torso gets covered in all sorts of medals – they really detract from his gunshot wounds. He’s gonna make a great wooden detective, maybe even chief.",
            "So pretty soon the Mrs. wants to meet Joe. He comes over, brings us a lovely casserole, but the wife isn’t expecting him to be made of wood. She loses it, screaming and running around everywhere. I shoot a look at her and some bullets at Joe. We take our meal outside, without her. Nobody disrespects him while I’m around and under federal scrutiny.",
            "I ask to meet Joe’s family – turns out he’s got none. He doesn’t even have a home, just spends his nights alternating between a security guard and a mannequin at this one clothing store. I try to comfort him, show him that his partner is all the family he needs. “It’s alright that you don’t have a family,” I tell him. “I probably would’ve shot them anyway.”"
          ],
          links: [],
          image: images.current["/images/flesh.png"],
          backgroundImage: images.current["/images/monkey.png"]
        };
        break;

      case "Prison Ship":
        newState = {
          parent: "Writing",
          name: "PrisonShip",
          text: "",
          cssTag: "prison-ship",
          title: "Prison Ship",
          paragraphs: [
            "Running a prison ship isn’t as glamorous as TV shows like “Glamorous Prison Ship” make it out to be. People need to see that first and foremost it’s a business, and like any other good business I need to keep my employees close and my patrons sequestered. This is why I evade all my taxes and burn all my lifeboats.",
            "As a child, my father saw my genius one day when I put my prison toys on top of my boat toys. He encouraged me to follow this passion, and his encouragement increased when he saw how well I could suppress sea-based toy riots.",
            "We like to keep our inmates entertained. Tuesday is “Bingo” night, where we give the inmates Bingo sheets filled in with crimes, and they fill in the ones they’re in for. The winner gets a lovely fruit basket and 5 years added to his sentence. Losers get the same. Wednesday night is “Tuesday” night, where we pretend it’s Tuesday and play the game some more.",
            "It was tough finding a good chef who I didn’t immediately imprison. I met Raoul at a charity event. His father introduced himself and went in for a handshake, but I went in for a handcuff. Raoul saw where I was coming from, and agreed to be my chef. Meat lovers enjoy our fine selection of fish and sea fowl, and vegetarians enjoy a night in solitary. This is a prison ship, not a prison cruise.",
            "All of the inmates live below deck, and each of their rooms is just a smaller prison ship. Every room is labeled “The Brig”. We thought this was funny.",
            "Despite the accommodations, we still get some escapees. Surrounding the ship are 76 large walls, each on a dinghy. I suspect that the escapees somehow fashioned sophisticated climbing devices from seagulls and lard, but Raoul thinks they just swam under the walls. Whatever the explanation, I like to imagine that those prisoners tasted freedom and then went off to make their own prison ships.",
            "Owning a prison ship is at least as enjoyable as owning a prison or a ship, but it’s definitely way less federally regulated. Could you imagine the Feds taxing an ocean-based prison? Raoul and I would be ruined."
          ],
          links: [],
          image: images.current["/images/greener.png"],
          backgroundImage: images.current["/images/monkey.png"]
        };
        break;

      case "Paul McCartney Hyping Himself Up Outside of Ricky’s Pub Before Naming The Beatles – July 14, 1958, Liverpool":
          newState = {
            parent: "Writing",
            name: "PaulMcCartney",
            text: "",
            cssTag: "mccartney",
            title: "Paul McCartney Hyping Himself Up Outside of Ricky’s Pub Before Naming The Beatles – July 14, 1958, Liverpool",
            paragraphs: [
              "Okay Paul. You’ve got this mate. You’re gonna go in there, you’re gonna march right up to George, and Mr. John “the Lennon”, and whoever else is in the band at this point, and you’re gonna ask them politely to- no, no, too polite Paul. Too polite.",
              "Okay. Okay Paul. You’re gonna step in there, you’re gonna puff out your chest and stand on your tippy toes, you’re gonna march up to Mr. John, you’re gonna stare him down, stare him right in the eyes, you’re gonna back down, you are going to back so far down, you’re gonna make him tea and bake him some lovely tortes- no, no, wrong wrong wrong! Dammit Paul! Damn you!",
              "Think, Paul. Think. Okay. You’re gonna step in there, you’re gonna step right back out- fuck. Okay. This is okay. Just remember your training Paul. You haven’t taken a breath in minutes for Christ’s sake. Breathe. Breathe. There we are. You’re going into cardiac arrest Paul.",
              "Oy mate — you there. Can I bum a cig? Cheers. Trouble you for a light? Absolute cheers. Oops, that’s the wrong end. Let me just tear that pesky filter off- there we are. Light her up. Ah fuck — is this a cocaine cigarette? Cheeky mate. Veeeery cheeky. I’ll see you again in 15 minutes.",
              "Okay Paul. This is it. You’re gonna enter the pub, you’re gonna walk up to the band, you’re gonna say “hey lads, I came up with a new name for the band, I’m really proud of it, I think this is the one…” and so on, you’re gonna shake hands, and then you’re gonna go out there and play the set. Just like that. Like a normal person. You’re a normal person Paul. Alright, let’s go.",
              "Paul enters the pub.",
              "John Lennon: ...and I was thinking “The Beatles”-",
              "Paul sucker punches John in the temple. He grabs the nearest glass and whips it at George’s head, taking out the young guitarist’s nose. Paul grabs John, still stunned from the punch, and throws him toward Colin Hanton. Colin dodges John’s body, but Paul rushes him and slams his head through the snare drum. John Lowe tries to hide behind his piano; Paul lunges from across the room and rips through the piano’s body, emerging from the cloud of splinters with Lowe’s neck in his hand. Paul grabs George and ties him and Lowe into a knot. Some other pub patrons notice the commotion and run at Paul. Paul dodges every punch, bottle, and knife in a blur of hair and smoke from his cigarette, at this point barely a stub. Paul takes the cigarette stump out of his mouth and flicks it at one of his attackers, fracturing the man’s C2, C3, C4, and C5 vertebrae. With a spinning whirlwind kick, Paul immobilizes all the pub patrons at once. The owner of the pub pulls a shotgun — an old Winchester, an antique — from its perch above the bar, loads it, takes aim at Paul. The pub owner asks Paul to surrender. Please. His voice cracks. Tears stream from his eyes. Paul doesn’t move, his expression vacant. The pub owner pulls the trigger — Paul takes the shot in the chest. Paul rips off his bloody dress shirt and whips it at the shotgun, pulling it from the grasp of the pub owner. Paul throws the shotgun at the pub owner with all his might, sending him flying back into a wall and pinning him to it. John, somewhat recovered at this point, throws a feeble punch at Paul — too slow. Paul catches the punch and forces John to his knees.",
              "Paul: No. No. Shut up. The band is going to be called the “Wittle Baby Buggies”. I came up with it as I was entering the pub. John. Mate. We’re going to be stars, mate."
            ],
            links: [],
            image: images.current["/images/symphonia.png"],
            backgroundImage: images.current["/images/monkey.png"]
          };
          break;


      case "Shamu Comic":
          newState = {
            parent: "Writing",
            name: "Shamu",
            text: "",
            cssTag: "shamu",
            title: "",
            paragraphs: [],
            links: [],
            image: images.current["/images/shamu.png"],
            backgroundImage: images.current["/images/monkey.png"]
        };
        break;


      case "Coding":
        newState = {
          parent: "",
          name: "Coding",
          linkTitle: "My Coding Projects",
          text: "",
          links: [
            {label: 'Faces', url: 'https://github.com/arenasjuan/faces', description: ": A unique tool for exploring a user's personal taste by generating a composite face from that user's preferred facial images"},
            {label: 'Autoprint', url: 'https://github.com/arenasjuan/lambda-func-autoprint', description: ": AWS Lambda function that detects upon Shipstation shipment whether a customer has a document associated with their order, then searches for and prints that document from Dropbox"},
            {label: 'Shipstation Order Processor', url: 'https://github.com/arenasjuan/lambda-func-order_processor', description: ": AWS Lambda function that processes incoming Shipstation orders"},
            {label: 'Bloom Lighting Project', url: 'https://github.com/arenasjuan/bloom', description: ": Final project for computer graphics class "},
            {label: 'Chemical Neural Network Project', url: 'https://github.com/arenasjuan/chemical-neural-networks', description: ": Project in which I decoded raw chemical data from a binary file and trained neural networks to transform the data to match a given solution file "},
            {label: 'Slackbot', url: 'https://github.com/arenasjuan/slackbot', description: ": Slackbot that reprocesses Shipstation orders"},
            {label: 'SikeBot', url: 'https://github.com/arenasjuan/SikeBot', description: ": TwitterBot that generates and posts funny image macros at random intervals"},
          ],
          backgroundImage: images.current["/images/pollock.png"],
          footerTextTop: "The Matrix",
          footerTextBottom: "(Jackson Pollock, 2002)",
        };
        startTransition(canvas, state.backgroundImage, newState.backgroundImage);
        break;

      case "Videos":
        newState = {
          parent: "AI-Art",
          name: "Videos",
          text: "Long Videos | Tiktoks",
          textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000, 1px -1px 1px #000000, -2px -2px 1px #000000, 0px 2px 6px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000, 1px 1px 2px #000000, -1px -1px 2px #000000",
          links: [],
          textColor: 'white',
          backgroundImage: images.current["/images/camera.png"]
        };
        startTransition(canvas, state.backgroundImage, newState.backgroundImage);
        break;

      case "Long Videos":
        newState = {
          parent: "Videos",
          name: "LongVideos",
          text: "",
          links: [
            {text: "'Bike Matter' (Mashup and Animation)", url: 'https://www.youtube.com/embed/6qZA2B3uBtQ', type: 'video', color: 'white', size: '4vh', textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000,  -2px -2px 1px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000, -1px -1px 2px #000000"},
            {text: "'Griffith' (Griffith Observatory Timelapse)", url: 'https://www.youtube.com/embed/SJFtzAoD_z4', type: 'video', color: 'white', size: '4vh', textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000,  -2px -2px 1px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000, -1px -1px 2px #000000"},
          ],
          backgroundImage: images.current["/images/biker.png"]
        };
        startTransition(canvas, state.backgroundImage, newState.backgroundImage);
        break;

      case "Tiktoks":
        newState = {
          parent: "Videos",
          name: "Tiktoks",
          text: "",
          links: [
            {text: 'Studio Cat', url: 'https://www.youtube.com/embed/obxHhlhcuHk', thumbnail: 'https://img.youtube.com/vi/obxHhlhcuHk/0.jpg', type: 'tiktok'},
            {text: '1920s Oil', url: 'https://youtube.com/embed/dDGBdUvkybA?feature=share', thumbnail: 'https://img.youtube.com/vi/dDGBdUvkybA/0.jpg', type: 'tiktok'},
            {text: 'Space Studio', url: 'https://youtube.com/embed/JPsjcZMWZ1Q?feature=share', thumbnail: 'https://img.youtube.com/vi/JPsjcZMWZ1Q/0.jpg', type: 'tiktok'},
            {text: 'Alley Scene', url: 'https://youtube.com/embed/ctxUODexaH0?feature=share', thumbnail: 'https://img.youtube.com/vi/ctxUODexaH0/0.jpg', type: 'tiktok'},
            {text: 'Gnome 1', url: 'https://youtube.com/embed/19gnjVwPhOk?feature=share', thumbnail: 'https://img.youtube.com/vi/19gnjVwPhOk/0.jpg', type: 'tiktok'},
            {text: 'Flamenco Oil', url: 'https://youtube.com/embed/W2PTDCu1Avw?feature=share', thumbnail: 'https://img.youtube.com/vi/W2PTDCu1Avw/0.jpg', type: 'tiktok'},
            {text: 'Graffiti Oil', url: 'https://youtube.com/embed/Pw2cGRHuQR4?feature=share', thumbnail: 'https://img.youtube.com/vi/Pw2cGRHuQR4/0.jpg', type: 'tiktok'},
            {text: 'Franktok', url: 'https://www.youtube.com/embed/ahEJi6-LxD0', thumbnail: 'https://img.youtube.com/vi/ahEJi6-LxD0/0.jpg', type: 'tiktok'},
            {text: 'Colosseum Concert 1', url: 'https://youtube.com/embed/XomIkS_saXQ?feature=share', thumbnail: 'https://img.youtube.com/vi/XomIkS_saXQ/0.jpg', type: 'tiktok'},
            {text: 'Colosseum Concert 2', url: 'https://youtube.com/embed/qUyKF1YstFI?feature=share', thumbnail: 'https://img.youtube.com/vi/qUyKF1YstFI/0.jpg', type: 'tiktok'},
            {text: 'Jazz 1', url: 'https://youtube.com/embed/eQ4AcQJPnE4?feature=share', thumbnail: 'https://img.youtube.com/vi/eQ4AcQJPnE4/0.jpg', type: 'tiktok'},
            {text: 'Jazz 2', url: 'https://youtube.com/embed/2-YvCTA2zg8?feature=share', thumbnail: 'https://img.youtube.com/vi/2-YvCTA2zg8/0.jpg', type: 'tiktok'},
          ],
          backgroundImage: images.current["/images/kids.png"]
        };
        startTransition(canvas, state.backgroundImage, newState.backgroundImage);
        break;


      case "Images":
        newState = {
          parent: "AI-Art",
          name: "Images",
          textColor: '#d8bb00',
          textShadow: "0px 0px 1px #000000, 0px 0px 2px #000000, -2px 0px 3px #000000, 0px -3px 5px #000000,  -2px -2px 1px #000000, 1px 0px 2px #000000, 0px 0px 4px #000000, 0px 0px 7px #000000, -1px -1px 2px #000000",
          text: "Comics | Hidden QR Codes | Children's Show Concept Art | Wallpapers | Product Images",
          links: [],
          backgroundImage: images.current["/images/pics.png"]
        };
        startTransition(canvas, state.backgroundImage, newState.backgroundImage);
        break;

      case "Comics":
          const comics = Array.from({ length: 3 }, (_, i) => `/images/comics/Comic ${i+1}.png`);

          // Convert the list of wallpapers to the required format for the links array
          const comic_links = comics.map((url, i) => ({
            url,
            type: 'image',
          }));

          newState = {
            parent: "Images",
            name: "Comics",
            text: "",
            links: comic_links,
            backgroundImage: images.current["/images/pics.png"]
          };
        break;

      case "Hidden QR Codes":
          const qr_codes = Array.from({ length: 14 }, (_, i) => `/images/qr/qr ${i+1}.png`);

          // Convert the list of wallpapers to the required format for the links array
          const qr_links = qr_codes.map((url, i) => ({
            url,
            type: 'image',
          }));

          newState = {
            parent: "Images",
            name: "QR_Codes",
            text: "",
            links: qr_links,
            backgroundImage: images.current["/images/pics.png"]
          };
        break;

      case "Children's Show Concept Art":
          const concepts = Array.from({ length: 11 }, (_, i) => `/images/concepts/concept ${i+1}.png`);

          // Convert the list of wallpapers to the required format for the links array
          const concept_links = concepts.map((url, i) => ({
            url,
            type: 'image',
          }));

          newState = {
            parent: "Images",
            name: "Concept_Art",
            text: "",
            links: concept_links,
            backgroundImage: images.current["/images/pics.png"]
          };
        break;

        case "Wallpapers":
          // Generate a list of file paths for the wallpapers
          const wallpapers = Array.from({ length: 40 }, (_, i) => `/images/wallpapers/${i+1}.jpg`);

          // Convert the list of wallpapers to the required format for the links array
          const links = wallpapers.map((url, i) => ({
            url,
            type: 'image',
          }));

          newState = {
            parent: "Images",
            name: "Wallpapers",
            text: "",
            links,
            backgroundImage: images.current["/images/pics.png"]
          };
          break;

      case "Product Images":
          const products = Array.from({ length: 9 }, (_, i) => `/images/products/product 0${i+1}.png`);

          // Convert the list of wallpapers to the required format for the links array
          const product_links = products.map((url, i) => ({
            url,
            type: 'image'
          }));

          newState = {
            parent: "Images",
            name: "Products",
            text: "",
            links: product_links,
            backgroundImage: images.current["/images/pics.png"]
          };
        break;

      default:
        break;
    }

    if (newState) {
      stateHistory.current.push(state);
      setState(newState);
    }
  }

  const handleBack = () => {
    const previousState = stateHistory.current.pop();
    if (previousState) {
      const canvas = appRef.current.getElementsByTagName('canvas')[0];
      startTransition(canvas, state.backgroundImage, previousState.backgroundImage);
      setState(previousState);
    }
  }

  function handleVideoClick(url) {
    // format url if needed
    let formattedUrl = url;
    if (!url.includes("embed")) {
      formattedUrl = url.replace("watch?v=", "embed/");
    }
    setCurrentVideoUrl(formattedUrl);
    setVideoModalIsOpen(true);
  }


  function VideoModal({ isOpen, url, onClose }) {
    return isOpen ? (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <div className="modal-video">
            <iframe src={url} title="Video Player" frameBorder="0" allowFullScreen />
          </div>
        </div>
      </div>
    ) : null;
  }

  return (
    <div key={key} ref={appRef} className="app">
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
            {state.links.filter(link => link.type === 'video').map((link, i) => (
              <div key={i}>
                <p style={{color: link.color, fontSize: link.size, textShadow: link.textShadow}}>{link.text}</p>
                <iframe src={link.url} title={link.text} frameBorder="0" allowFullScreen />
              </div>
            ))}
          </div>
        }
        {state.name === 'Writing' && 
          <div className="sectionContainer" style={{backgroundImage: `url(${images.current["/images/writing_background.png"].src})`}}>
            <div className="unfurl" style={{backgroundImage: `url(${images.current["/images/monkey.png"].src})`}}></div>
            <div className="mask">
              <div className="maskGrid"></div>
            </div>
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
        }
        {state.cssTag && 
          <div className={`writingSample ${state.cssTag}-sample`}>
            <div className={`sample-container ${state.cssTag}-container`}>
              {state.title && 
                <div className={`title ${state.cssTag}-title`}>
                  {state.title}
                </div>
              }
              {state.image && 
                <img src={state.image.src} alt={state.name} className={`image ${state.cssTag}-image`} />
              }
              {state.paragraphs && state.paragraphs.map((paragraph, i) => 
                <div key={i} className={`paragraph ${state.cssTag}-paragraph`}>
                  {paragraph}
                </div>
              )}
            </div>
          </div>
        }
        {state.name === 'Tiktoks' &&
          <div className="tiktokContainer">
            {state.links.filter(link => link.type === 'tiktok').map((link, i) => (
              <div key={i} 
                className="tiktokThumbnail" 
                onClick={() => handleVideoClick(link.url)} 
                style={{backgroundImage: `url(${link.thumbnail})`}}>
                <div className="tiktokThumbnailText">{link.text}</div>
              </div>
            ))}
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
        onClose={handleCloseModal} 
        onNext={handleNextImage} 
        onPrevious={handlePreviousImage}
      />
      <VideoModal
        isOpen={videoModalIsOpen}
        url={currentVideoUrl}
        onClose={() => setVideoModalIsOpen(false)}
      />
    </div>
  );


}

export default Portfolio;