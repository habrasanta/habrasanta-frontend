import { h, Fragment, FunctionComponent } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import clsx from "clsx";

import { AddressForm, AddressFormError, Country, Participation, Season, Mail } from "../models";

import Footer from "../components/Footer";
import Chat from "../components/Chat";
import BannedCard from "../components/BannedCard";
import GiftReceivedCard from "../components/GiftReceivedCard";
import GiftSentCard from "../components/GiftSentCard";
import ShipmentCard from "../components/ShipmentCard";
import CountdownCard from "../components/CountdownCard";
import EnrollmentCard from "../components/EnrollmentCard";
import HappyNewYearCard from "../components/HappyNewYearCard";
import NothingSentCard from "../components/NothingSentCard";
import WaitingCard from "../components/WaitingCard";
import Header from "../components/Header";
import CardHeader from "../components/CardHeader";

import { getCountries } from "../xhr/countries";
import {
  deleteSeasonParticipation, 
  getSeasonGifteeChat,
  getSeasonParticipation,
  getSeasonSantaChat,
  postGifteeChat,
  postMarkDelivered,
  postMarkShipped,
  postSantaChat,
  postSeasonParticipation
} from "../xhr/seasons";
import { useCurrentSeason } from "../contexts/CurrentSeason";
import { useUser } from "../contexts/UserContext";

import "../css/alert.css";
import "../css/counters.css";
import "../css/usercontrols.css";
import "../css/timetable.css";
import "../css/content.css";
import "../css/card.css";

import "./Profile.css";
import { postMarkRead } from "../xhr/messages";

const Profile: FunctionComponent<{
  year: string;
}> = props => {
  const user = useUser();
  const currentSeason = useCurrentSeason();

  const [leftCardFlipped, setLeftCardFlipped] = useState(false);
  const [rightCardFlipped, setRightCardFlipped] = useState(false);
  const [addressFormError, setAddressFormError] = useState<AddressFormError>({});
  const [participation, setParticipation] = useState<Participation | undefined>();
  const [santaChat, setSantaChat] = useState<Mail[]>([]);
  const [gifteeChat, setGifteeChat] = useState<Mail[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [seasonCounters, setSeasonCounters] = useState({
    member: currentSeason.member_count,
    shipped: currentSeason.shipped_count,
    delivered: currentSeason.delivered_count,
  })

  useEffect(() => {
    getCountries().then(data => setCountries(data));
  }, []);

  useEffect(() => {
    getSeasonParticipation(props.year).then(data => setParticipation(data)).catch(() => {});
    if (participation?.santa) {
      getSeasonSantaChat(props.year).then(data => setSantaChat(data));
    }
    if (participation?.giftee) {
      getSeasonGifteeChat(props.year).then(data => setGifteeChat(data));
    }
  }, [props.year]);

  const unreadSanta = useMemo(() => santaChat.filter(mail => !mail.read_date && !mail.is_author), [santaChat]);
  const unreadGiftee = useMemo(() => gifteeChat.filter(mail => !mail.read_date && !mail.is_author), [gifteeChat]);

  const enroll = async (form: AddressForm) => {
    const { season, participation, errors } = await postSeasonParticipation(props.year, user, form);
    if (errors) {
      setAddressFormError(errors);
    } else {
      setSeasonCounters(prev => ({
        ...prev,
        member: season.member_count,
      }));
      setParticipation(participation);
      setAddressFormError({});
    }
  };

  const unenroll = async () => {
    const { season, participation } = await deleteSeasonParticipation(props.year, user);
    setSeasonCounters(prev => ({
      ...prev,
      member: season.member_count,
    }));
    setParticipation(participation);
  };

  const mailSanta = async (text: string) => {
    const { mail } = await postSantaChat(props.year, user, { text });
    setSantaChat([...santaChat, mail]);
  };

  const mailGiftee = async (text: string) => {
    const { mail } = await postGifteeChat(props.year, user, { text });
    setGifteeChat([...santaChat, mail]);
  };

  const flipSantaCard = () => {
    setLeftCardFlipped(oldState => {
      const newState = !oldState;
      if (newState && unreadSanta.length > 0) {
        postMarkRead(user, {
          ids: unreadSanta.map(msg => msg.id),
        });
      }
      return newState;
    });
  };

  const flipGifteeCard = () => {
    setRightCardFlipped(oldState => {
      const newState = !oldState;
      if (newState && unreadSanta.length > 0) {
        postMarkRead(user, {
          ids: unreadGiftee.map(msg => msg.id),
        });
      }
      return newState;
    });
  };

  const markShipped = async () => {
    const { season, participation } = await postMarkShipped(props.year, user);
    setSeasonCounters(prev => ({
      ...prev,
      shipped: season.shipped_count,
    }));
    setParticipation(participation);
    setRightCardFlipped(true);
    setTimeout(() => setRightCardFlipped(false), 400);
  };

  const markDelivered = async () => {
    const { season, participation } = await postMarkDelivered(props.year, user);
    setSeasonCounters(prev => ({
      ...prev,
      delivered: season.delivered_count,
    }));
    setParticipation(participation);
    setLeftCardFlipped(true);
    setTimeout(() => setLeftCardFlipped(false), 400);
  };

  const today = new Date();
  const match = new Date(currentSeason.registration_close);
  const timeleft = match > today ? Math.ceil((match.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="profile">
      {currentSeason.is_closed && (
        <div className="alert">
          Внимание! АДМ-{currentSeason.id} уже завершен, вы смотрите архивную версию!
        </div>
      )}
      <Header
        year={currentSeason.id}
        memberCount={seasonCounters.member}
        shippedCount={seasonCounters.shipped}
        deliveredCount={seasonCounters.delivered}
        signupsStart={currentSeason.registration_open}
        signupsEnd={currentSeason.registration_close}
        shipBy={currentSeason.season_close}
        debug={user.is_debug}
      />
      <main className="content" role="main">
        <div className={clsx("card", "card-santa", { "card-flipped": leftCardFlipped })}>
          <CardHeader
            showChatButton={participation && !!participation.santa}
            unreadMessageCount={unreadSanta.length}
            onChatButton={flipSantaCard}
          >
            <img className="card-avatar" src={user.avatar_url} />
            {user.username}
          </CardHeader>
          {participation && participation.santa ? (
            <div className="card-body">
              {participation.gift_delivered_at ? (
                <HappyNewYearCard galleryUrl={currentSeason.gallery_url} />
              ) : participation.santa.gift_shipped_at ? (
                <WaitingCard isClosed={currentSeason.is_closed} onSubmit={markDelivered} />
              ) : (
                <NothingSentCard />
              )}
              {participation.santa && (
                <Chat
                  mails={santaChat}
                  isClosed={currentSeason.is_closed}
                  closedAt={currentSeason.season_close}
                  onSubmit={mailSanta}
                />
              )}
            </div>
          ) : (
            <div className="card-body">
              {user.is_active ? (
                <EnrollmentCard
                  year={currentSeason.id}
                  signupsEnd={currentSeason.registration_close}
                  isParticipatable={currentSeason.is_registration_open}
                  canParticipate={user.can_participate}
                  participation={participation}
                  countries={countries}
                  addressFormError={addressFormError}
                  onEnroll={enroll}
                  onUnenroll={unenroll}
                />
              ) : (
                <BannedCard username={user.username} />
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
                    year={currentSeason.id}
                    fullName={participation.giftee.fullname}
                    postcode={participation.giftee.postcode}
                    address={participation.giftee.address}
                    country={participation.giftee.country}
                    isOverdue={currentSeason.is_closed}
                    countries={countries}
                    onSubmit={markShipped}
                  />
                )}
                <Chat
                  mails={gifteeChat}
                  isClosed={currentSeason.is_closed}
                  closedAt={currentSeason.season_close}
                  onSubmit={mailGiftee}
                />
              </Fragment>
            ) : (
              <CountdownCard
                timeleft={timeleft}
                matched={currentSeason.is_matched}
                signupsEnd={currentSeason.registration_close}
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
