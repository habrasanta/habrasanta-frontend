import { h, FunctionComponent } from "preact";
import clsx from "clsx";
import { useEffect, useState } from "preact/hooks";

import { AddressForm, AddressFormError, Country, Participation } from "../models";

import PostageStamp from "./PostageStamp";
import Button from "./Button";
import Milestone from "./Milestone";

import "./EnrollmentCard.css";

const EnrollmentCard: FunctionComponent<{
  year: number;
  signupsEnd: string;
  canParticipate: boolean;
  isParticipatable: boolean;
  participation?: Participation;
  addressFormError: AddressFormError;
  countries: Country[];
  onEnroll: (form: AddressForm) => void;
  onUnenroll: () => void;
}> = props => {
  const [addressForm, setAddressForm] = useState<AddressForm>({
    fullname: "",
    postcode: "",
    address: "",
    country: "select",
  });
  console.log(props.participation);

  useEffect(() => {
    if (props.participation) {
      setAddressForm({
        fullname: props.participation.fullname,
        postcode: props.participation.postcode,
        address: props.participation.address,
        country: props.participation.country || "select",
      });
    }
  }, [props.participation]);

  const onAddressForm = (e: Event) => {
    const input = e.target as HTMLInputElement;
    setAddressForm(form => ({
      ...form,
      [input.id]: input.value,
    }));
  };

  return (
    <div className={clsx("card-front", "card-address", { "card-decorated": props.participation })}>
      <form noValidate>
        <label for="fullname">Кому</label>
        <input
          id="fullname"
          className={clsx({ "error": props.addressFormError.fullname })}
          type="text"
          name="fullName"
          value={addressForm.fullname}
          onInput={onAddressForm}
          placeholder="Полное имя"
          readonly={!!props.participation}
        />
        <PostageStamp year={props.year} />
        <label for="postcode">Куда</label>
        <input
          id="postcode"
          className={clsx({ "error": props.addressFormError.postcode })}
          type="text"
          name="postCode"
          value={addressForm.postcode}
          onInput={onAddressForm}
          placeholder="Индекс"
          readonly={!!props.participation}
        />
        <textarea
          id="address"
          className={clsx({ "error": props.addressFormError.address })}
          name="address"
          value={addressForm.address}
          onInput={onAddressForm}
          placeholder="Адрес"
          readonly={!!props.participation}
        />
        <select
          id="country"
          value={addressForm.country}
          onChange={onAddressForm}
          disabled={!!props.participation}
        >
          <option disabled value="select">Страна</option>
          {props.countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </form>
      {props.participation ? (
        <Button className="card-button" primary onClick={props.onUnenroll} disabled={!props.isParticipatable}>
          Я передумал участвовать
        </Button>
      ) : props.isParticipatable ? props.canParticipate ? (
        <Button className="card-button" primary onClick={() => props.onEnroll(addressForm)}>
          Зарегистрировать участника
        </Button>
      ) : (
        <div className="card-closed card-banned">
          Нужен <a href="https://habr.com/ru/docs/help/registration/#standard" target="_blank">полноправный аккаунт</a> с кармой от +10
        </div>
      ) : (
        <div className="card-closed">
          Регистрация закрыта <Milestone date={props.signupsEnd} />.
        </div>
      )}
    </div>
  );
};

export default EnrollmentCard;
