import { images } from "~/utils/images";

const Description = ({ desc }: { desc: string }) => (
  <div className="description">
    <img alt="description" className="infosvg" src={images.info} />
    <p className="descriptionText">{desc}</p>
  </div>
);

export { Description };
