import { images } from "~/utils/images";

const Footer = () => (
  <div className="footer">
    <div />
    <div className="contact">
      <a href="https://github.com/valuecodes/Neural-Birds">
        <img alt="Link to github" className="infosvg" src={images.github} />
      </a>
    </div>
    <div className="copyright">
      <p>
        &copy;2020 <span className="cspan">Neural Birds</span> by{" "}
        <span className="cspan">Juha Kangas</span>{" "}
      </p>
    </div>
  </div>
);

export { Footer };
