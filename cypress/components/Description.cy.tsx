/// <reference types="cypress" />

import { useEffect } from "react";
import Description from "@/Pages/Description";
import { RecoilRoot, useRecoilValue } from "recoil";
import { isSidebarOpenState } from "@/modules/atoms";

export const RecoilObserver = ({ node, onChange }: any) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};
describe("<Description />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <RecoilRoot>
        <RecoilObserver node={isSidebarOpenState} onChange={() => {}} />
        <Description />
      </RecoilRoot>
    );
    cy.contains("かんたんグラフ化");
  });
});
