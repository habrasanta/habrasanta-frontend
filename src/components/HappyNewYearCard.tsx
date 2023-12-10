import { h, FunctionComponent } from "preact";

const HappyNewYearCard: FunctionComponent<{
  galleryUrl?: string;
}> = props => (
  <div className="card-front card-happy">
    <h3>С Новым Годом!</h3>
    {props.galleryUrl && (
      <p>
        <a href={props.galleryUrl}>Пост хвастовства подарками</a>
      </p>
    )}
  </div>
);

export default HappyNewYearCard;
