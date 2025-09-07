import React from "react";

type FlagIconProps = {
  src: string;
  alt?: string;
  className?: string;
};

const FlagIcon: React.FC<FlagIconProps> = ({
  src,
  alt = "Flag",
  className,
}) => (
  <img
    src={`https://flagcdn.com/w40/${src}.png`}
    alt={alt}
    style={{ boxShadow: "1px 1px 1px black" }}
  />
);

export default FlagIcon;
