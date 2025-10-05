import React, { FC, HTMLAttributes } from "react";
import clsx from "clsx";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

const Container: FC<ContainerProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx("mx-auto w-full max-w-7xl px-4", className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
