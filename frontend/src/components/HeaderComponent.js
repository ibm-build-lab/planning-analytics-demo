import React from "react";
import { HeaderName, Header } from "@carbon/react";

const HeaderComponent = () => {
  return (
    <Header aria-label="IBM Planning Analytic Demo">
      <HeaderName href="#" prefix="IBM">
        Planning Analytic API Demo
      </HeaderName>
    </Header>
  );
};

export default HeaderComponent;