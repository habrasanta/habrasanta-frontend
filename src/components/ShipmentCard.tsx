import { h, FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import PostageStamp from "./PostageStamp";
import Button from "./Button";

const ShipmentCard: FunctionComponent<{
  year: number;
  fullName: string;
  postcode: string;
  address: string;
  isOverdue: boolean;
  onSubmit: () => void;
}> = props => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="card-front card-decorated shipping">
      <label for="fullname">Кому</label>
      <input
        id="fullname"
        type="text"
        readonly
        value={props.fullName}
      />
      <PostageStamp year={props.year} />
      <label for="postcode">Куда</label>
      <input
        id="postcode"
        type="text"
        readonly
        value={props.postcode}
      />
      <textarea
        id="address"
        readonly
        value={props.address}
      />
      {props.isOverdue ? (
        <div className="card-closed">
          Вы так и не отправили подарок вовремя :-(
        </div>
      ) : (
        <div className="shipping-confirmation">
          <Button className="shipping-button" disabled={!checked} onClick={props.onSubmit}>
            Далее
          </Button>
          <input type="checkbox" checked={checked} />
          <label onClick={() => setChecked(prevState => !prevState)}>Я отправил подарок</label>
        </div>
      )}
    </div>
  );
};

export default ShipmentCard;
