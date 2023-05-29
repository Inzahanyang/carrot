import { faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Logo = () => (
  <div className="py-4 text-center text-2xl">
    AI Blog
    <FontAwesomeIcon
      icon={faMagicWandSparkles}
      className="pl-2 text-xl text-yellow-400"
    />
  </div>
);
