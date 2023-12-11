import { h, FunctionComponent } from "preact";

import "./Footer.css";

const Footer: FunctionComponent = () => (
  <footer className="footer" role="contentinfo">
    <a className="footer-designer" href="https://novosylov.livejournal.com/">
      Валя Новоселов<br/>дизайнер
    </a>
    <div className="footer-feedback">
      В любой непонятной ситуации<br/>пишите <a href="mailto:support@habra-adm.ru">support@habra-adm.ru</a>
    </div>
  </footer>
);

export default Footer;
