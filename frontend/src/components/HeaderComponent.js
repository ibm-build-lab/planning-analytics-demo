import React from "react";
import { HeaderName, Header, Link, HeaderNavigation, HeaderMenuItem } from "@carbon/react";

const HeaderComponent = () => {
  return (
    <Header aria-label="IBM Planning Analytic Demo">
      <HeaderName href="#" prefix="IBM">
        Planning Analytic API Demo
      </HeaderName>
      <HeaderNavigation aria-label="IBM [Platform]">
        <HeaderMenuItem href="/">Single Date Query</HeaderMenuItem>
        <HeaderMenuItem href="/multiDateComponent">Multi Date Query</HeaderMenuItem>
      </HeaderNavigation>
    </Header>
  );
};

export default HeaderComponent;