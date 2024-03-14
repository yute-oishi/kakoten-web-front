/// <reference types="cypress" />

import { useEffect } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { historyState, obsListState, pageState } from "@/modules/atoms";
import MainPage from "@/Pages/MainPage";

export const RecoilObserver = ({ node, onChange }: any) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};
describe("<Description />", () => {
  it("renders", () => {
    cy.mount(
      <RecoilRoot>
        <RecoilObserver node={obsListState} onChange={() => {}} />
        <RecoilObserver node={historyState} onChange={() => {}} />
        <RecoilObserver node={pageState} onChange={() => {}} />
        <MainPage />
      </RecoilRoot>
    );
    cy.contains("かんたんグラフ化").should("exist").and("be.visible");
    cy.contains("トップページ").should("exist").and("not.be.visible");
    cy.contains("今すぐ始める").should("exist").click();
    cy.contains("トップページ").should("be.visible");
  });
});
