/// <reference types="cypress" />

describe("e2e tests", () => {
  it("view home page", () => {
    cy.visit("");
    cy.contains("かんたんグラフ化").should("exist");
  });

  it("view copy rights correctly", () => {
    cy.clock(Date.UTC(2030, 0, 1), ["Date"]);
    cy.visit("");
    cy.contains("2023-2030").should("exist");
  });

  it("view side bar", () => {
    cy.visit("");
    cy.contains("トップページ").should("not.be.visible");
    cy.contains("単一地点を見る").should("not.be.visible");
    cy.contains("今すぐ始める").should("exist").click();
    cy.contains("トップページ").should("be.visible");
    cy.contains("単一地点を見る").should("be.visible");
  });

  it("view single select page", () => {
    // 気象庁APIを使った観測所リスト取得をMock化
    cy.intercept("GET", Cypress.env("VITE_AMEDAS_OBSLIST_URL"), {
      fixture: "obs_list.json",
    }).as("getObsList");
    cy.visit("");
    cy.wait("@getObsList");
    cy.contains("今すぐ始める").should("exist").click();
    cy.contains("単一地点を見る").should("be.visible").click();
    cy.contains("テスト観測所1").should("not.exist");
    cy.contains("北海道").should("be.visible").click();
    cy.contains("テスト観測所1").should("be.visible").click();
    cy.contains("降水量").should("exist");
  });

  it("view single select page", () => {
    // 気象庁APIを使った観測所リスト取得をMock化
    cy.intercept("GET", Cypress.env("VITE_AMEDAS_OBSLIST_URL"), {
      fixture: "obs_list.json",
    }).as("getObsList");
    cy.visit("");
    cy.wait("@getObsList");
    cy.contains("今すぐ始める").should("exist").click();
    cy.contains("複数地点を比較").should("be.visible").click();
    cy.contains("テスト観測所1").should("not.exist");
    cy.contains("北海道").should("be.visible").click();
    cy.contains("テスト観測所1").should("be.visible").click();
    cy.contains("降水量").should("not.exist");
    cy.contains("テスト観測所2").should("be.visible").click();
    cy.contains("決定").should("be.visible").click();
    cy.contains("降水量").should("exist");
    cy.contains("テスト観測所1").should("be.visible");
    cy.contains("テスト観測所2").should("be.visible");
  });

  it("view graph page", () => {
    // TodayのDateを固定化
    cy.clock(Date.UTC(2024, 2, 16), ["Date"]);
    cy.intercept("GET", Cypress.env("VITE_AMEDAS_OBSLIST_URL"), {
      fixture: "obs_list.json",
    }).as("getObsList");
    // バックエンドLambdaへのリクエスト、レスポンスをMock化
    cy.intercept("GET", Cypress.env("VITE_BACKEND_BASE_URL") + "/*", {
      fixture: "climate_data.json",
    }).as("fetchClimateData");
    cy.visit("");
    cy.wait("@getObsList");
    cy.contains("今すぐ始める").should("exist").click();
    cy.contains("単一地点を見る").should("be.visible").click();
    cy.contains("北海道").should("be.visible").click();
    cy.contains("テスト観測所1").should("be.visible").click();
    cy.wait("@fetchClimateData");
    cy.contains("2024 03 15").should("be.visible");
  });

  it("graph page date change", () => {
    // 日付を変更してデータに反映されることを確認
    cy.clock(Date.UTC(2024, 2, 16), ["Date"]);
    cy.intercept("GET", Cypress.env("VITE_AMEDAS_OBSLIST_URL"), {
      fixture: "obs_list.json",
    }).as("getObsList");
    cy.intercept("GET", Cypress.env("VITE_BACKEND_BASE_URL") + "/*", {
      fixture: "climate_data.json",
    }).as("fetchClimateData");
    cy.visit("");
    cy.wait("@getObsList");
    cy.contains("今すぐ始める").should("exist").click();
    cy.contains("単一地点を見る").should("be.visible").click();
    cy.contains("北海道").should("be.visible").click();
    cy.contains("テスト観測所1").should("be.visible").click();
    cy.wait("@fetchClimateData");
    cy.contains("2024 03 15").should("be.visible");
    cy.contains("2024 03 14").should("not.exist");
    cy.get(".recharts-rectangle").should("be.visible");
    cy.get('[data-testid="date-control-left-arrow"] > img').click();
    cy.contains("2024 03 15").should("not.exist");
    cy.contains("2024 03 14").should("be.visible");
    cy.get(".recharts-rectangle").should("not.exist");
  });

  it("graph page visibility change", () => {
    // 凡例ボタンを押すことで可視・不可視を切替可能なことを確認
    cy.clock(Date.UTC(2024, 2, 16), ["Date"]);
    cy.intercept("GET", Cypress.env("VITE_AMEDAS_OBSLIST_URL"), {
      fixture: "obs_list.json",
    }).as("getObsList");
    cy.intercept("GET", Cypress.env("VITE_BACKEND_BASE_URL") + "/*", {
      fixture: "climate_data.json",
    }).as("fetchClimateData");
    cy.visit("");
    cy.wait("@getObsList");
    cy.contains("今すぐ始める").should("exist").click();
    cy.contains("単一地点を見る").should("be.visible").click();
    cy.contains("北海道").should("be.visible").click();
    cy.contains("テスト観測所1").should("be.visible").click();
    cy.wait("@fetchClimateData");
    cy.get(".recharts-rectangle").should("be.visible");
    cy.contains("2024 03 15 降水量").click();
    cy.get(".recharts-rectangle").should("not.exist");
  });
});
