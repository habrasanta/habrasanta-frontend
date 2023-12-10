import { h, Fragment, FunctionComponent } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import clsx from "clsx";

import { AddressForm, AddressFormError, BackendInfo, Country, Participation, Season, Mail } from "../models";

import Footer from "./Footer";
import Chat from "./Chat";
import BannedCard from "./BannedCard";
import GiftReceivedCard from "./GiftReceivedCard";
import GiftSentCard from "./GiftSentCard";
import ShipmentCard from "./ShipmentCard";
import CountdownCard from "./CountdownCard";
import EnrollmentCard from "./EnrollmentCard";
import HappyNewYearCard from "./HappyNewYearCard";
import NothingSentCard from "./NothingSentCard";
import WaitingCard from "./WaitingCard";
import Header from "./Header";
import CardHeader from "./CardHeader";

import "../css/alert.css";
import "../css/counters.css";
import "../css/usercontrols.css";
import "../css/timetable.css";
import "../css/content.css";
import "../css/card.css";

import "./Profile.css";

const Profile: FunctionComponent<{
  year: string;
  info: BackendInfo;
}> = props => {
  const [leftCardFlipped, setLeftCardFlipped] = useState(false);
  const [rightCardFlipped, setRightCardFlipped] = useState(false);
  const [addressFormError, setAddressFormError] = useState<AddressFormError>({ });
  const [season, setSeason] = useState<Season | undefined>();
  const [participation, setParticipation] = useState<Participation | undefined>();
  const [santaChat, setSantaChat] = useState<Mail[]>([]);
  const [gifteeChat, setGifteeChat] = useState<Mail[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetch("/api/v1/countries")
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setCountries(data));
  }, []);

  useEffect(() => {
    fetch("/api/v1/seasons/" + props.year)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setSeason(data));
    fetch("/api/v1/seasons/" + props.year + "/participation")
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setParticipation(data))
      .catch(() => {}); // ignore
    fetch("/api/v1/seasons/" + props.year + "/santa_chat")
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setSantaChat(data))
      .catch(() => {}); // ignore
    fetch("/api/v1/seasons/" + props.year + "/giftee_chat")
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setGifteeChat(data))
      .catch(() => {}); // ignore
  }, [props.year]);

  if (!props.info.is_authenticated) {
    route("/" + props.year + "/", true);
    return null;
  }

  if (!season)
    return null;

  const unreadSanta = santaChat.filter(mail => !mail.read_date && !mail.is_author);
  const unreadGiftee = santaChat.filter(mail => !mail.read_date && !mail.is_author);

  const enroll = (form: AddressForm) => {
    fetch("/api/v1/seasons/" + props.year + "/participation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": props.info.csrf_token,
      },
      body: JSON.stringify(form),
    }).then(res => res.ok ? res.json() : Promise.reject(res)).then(data => {
      setSeason(data.season);
      setParticipation(data.participation);
      setAddressFormError({ });
    }).catch(res => res.json().then((errors: AddressFormError) => {
      setAddressFormError(errors);
    }));
  };

  const unenroll = () => {
    fetch("/api/v1/seasons/" + props.year + "/participation", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": props.info.csrf_token,
      },
    }).then(res => res.ok ? res.json() : Promise.reject(res)).then(data => {
      setSeason(data.season);
      setParticipation(data.participation);
    }).catch(res => res.json().then(error => {
      alert(error.detail);
    }));
  };

  const mailSanta = (text: string) => {
    fetch("/api/v1/seasons/" + props.year + "/santa_chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": props.info.csrf_token,
      },
      body: JSON.stringify({ text }),
    }).then(res => res.json()).then((res: Mail) => setSantaChat([...santaChat, res]));
  };

  const mailGiftee = (text: string) => {
    fetch("/api/v1/seasons/" + props.year + "/giftee_chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": props.info.csrf_token,
      },
      body: JSON.stringify({ text }),
    }).then(res => res.json()).then((res: Mail) => setGifteeChat([...gifteeChat, res]));
  };

  const flipSantaCard = () => {
    setLeftCardFlipped(oldState => {
      const newState = !oldState;
      if (newState && unreadSanta.length > 0) {
        fetch("/api/v1/messages/mark_read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": props.info.csrf_token,
          },
          body: JSON.stringify({
            ids: unreadSanta.map(msg => msg.id),
          }),
        });
      }
      return newState;
    });
  };

  const flipGifteeCard = () => {
    setRightCardFlipped(oldState => {
      const newState = !oldState;
      if (newState && unreadSanta.length > 0) {
        fetch("/api/v1/messages/mark_read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": props.info.csrf_token,
          },
          body: JSON.stringify({
            ids: unreadGiftee.map(msg => msg.id),
          }),
        });
      }
      return newState;
    });
  };

  const markShipped = () => {
    fetch("/api/v1/seasons/" + props.year + "/mark_shipped", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": props.info.csrf_token,
      },
    }).then(res => res.json()).then(data => {
      setSeason(data.season);
      setParticipation(data.participation);
      setRightCardFlipped(true);
      setTimeout(() => setRightCardFlipped(false), 400);
    });
  };

  const markDelivered = () => {
    fetch("/api/v1/seasons/" + props.year + "/mark_delivered", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": props.info.csrf_token,
      },
    }).then(res => res.json()).then(data => {
      setSeason(data.season);
      setParticipation(data.participation);
      setLeftCardFlipped(true);
      setTimeout(() => setLeftCardFlipped(false), 400);
    });
  };

  const today = new Date();
  const match = new Date(season.registration_close);
  const timeleft = match > today ? Math.ceil((match.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="profile">
      {season.is_closed && (
        <div className="alert">
          Внимание! АДМ-{season.id} уже завершен, вы смотрите архивную версию!
        </div>
      )}
      <Header
        year={season.id}
        memberCount={season.member_count}
        shippedCount={season.shipped_count}
        deliveredCount={season.delivered_count}
        signupsStart={season.registration_open}
        signupsEnd={season.registration_close}
        shipBy={season.season_close}
        debug={props.info.is_debug}
      />
      <main className="content" role="main">
        <div className={clsx("card", "card-santa", { "card-flipped": leftCardFlipped })}>
          <CardHeader
            showChatButton={participation && !!participation.santa}
            unreadMessageCount={unreadSanta.length}
            onChatButton={flipSantaCard}
          >
            <img className="card-avatar" src={props.info.avatar_url} />
            {props.info.username}
          </CardHeader>
          {participation && participation.santa ? (
            <div className="card-body">
              {participation.gift_delivered_at ? (
                <HappyNewYearCard galleryUrl={season.gallery_url} />
              ) : participation.santa.gift_shipped_at ? (
                <WaitingCard isClosed={season.is_closed} onSubmit={markDelivered} />
              ) : (
                <NothingSentCard />
              )}
              {participation.santa && (
                <Chat
                  mails={santaChat}
                  isClosed={season.is_closed}
                  closedAt={season.season_close}
                  onSubmit={mailSanta}
                />
              )}
            </div>
          ) : (
            <div className="card-body">
              {props.info.is_active ? (
                <EnrollmentCard
                  year={season.id}
                  signupsEnd={season.registration_close}
                  isParticipatable={season.is_registration_open}
                  canParticipate={props.info.can_participate}
                  participation={participation}
                  countries={countries}
                  addressFormError={addressFormError}
                  onEnroll={enroll}
                  onUnenroll={unenroll}
                />
              ) : (
                <BannedCard username={props.info.username} />
              )}
            </div>
          )}
        </div>
        <div className={clsx("card", "card-giftee", {
          "card-flipped": rightCardFlipped,
          "card-danger": !(participation && participation.giftee),
        })}>
          <CardHeader
            showChatButton={participation && !!participation.giftee}
            unreadMessageCount={unreadGiftee.length}
            onChatButton={flipGifteeCard}
          >
            Ваш получатель
          </CardHeader>
          <div className="card-body">
            {participation && participation.giftee ? (
              <Fragment>
                {participation.giftee.gift_delivered_at ? (
                  <GiftReceivedCard />
                ) : participation.gift_shipped_at && !participation.giftee.gift_delivered_at ? (
                  <GiftSentCard />
                ) : (
                  <ShipmentCard
                    year={season.id}
                    fullName={participation.giftee.fullname}
                    postcode={participation.giftee.postcode}
                    address={participation.giftee.address}
                    isOverdue={season.is_closed}
                    onSubmit={markShipped}
                  />
                )}
                <Chat
                  mails={gifteeChat}
                  isClosed={season.is_closed}
                  closedAt={season.season_close}
                  onSubmit={mailGiftee}
                />
              </Fragment>
            ) : (
              <CountdownCard
                timeleft={timeleft}
                matched={season.is_matched}
                signupsEnd={season.registration_close}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
