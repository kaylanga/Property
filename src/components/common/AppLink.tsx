import React, { ComponentProps, forwardRef } from "react";
import NextLink from "next/link";

type AppLinkProps = ComponentProps<typeof NextLink> & {
  className?: string;
  children: React.ReactNode;
};

/**
 * AppLink - A standardized wrapper around Next.js Link component
 *
 * This component ensures consistent usage of the Link component throughout the app
 * and helps prevent import-related issues.
 */
export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <NextLink ref={ref} {...props} className={className}>
        {children}
      </NextLink>
    );
  },
);

AppLink.displayName = "AppLink";

export default AppLink;
