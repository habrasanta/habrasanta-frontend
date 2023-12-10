import { h, Fragment, FunctionComponent } from "preact";

const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const Milestone: FunctionComponent<{
  date: string;
}> = ({ date }) => {
  const d = new Date(date);
  return d.getDate() + " " + months[d.getMonth()];
};

export default Milestone;