import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi, describe, beforeEach } from "vitest";
import Description from "@/Pages/Description";
import { RecoilRoot, snapshot_UNSTABLE } from "recoil";
import { isSidebarOpenState } from "@/modules/atoms";
import { RecoilObserver } from "@/../vitest.setup";

const onChange = vi.fn();

describe("Description Page", () => {
  beforeEach(() => {
    render(
      <RecoilRoot>
        <RecoilObserver node={isSidebarOpenState} onChange={onChange} />
        <Description />
      </RecoilRoot>
    );
  });

  test("Recoil state management is enabled", async () => {
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(false);
    let snapShot = snapshot_UNSTABLE();
    expect(snapShot.getLoadable(isSidebarOpenState).getValue()).toBe(false);
    const iconButtonElements = screen.getAllByRole("button");
    const startButton = iconButtonElements.find((b) =>
      b.textContent?.includes("今すぐ始める")
    );
    expect(startButton as HTMLElement).toBeInTheDocument();
    expect(startButton as HTMLElement).toBeInTheDocument();
    fireEvent.click(startButton as HTMLElement);
    snapShot = snapshot_UNSTABLE();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(true);

    console.log("サイト説明画面のRecoilが正常動作する");
  });

  test("Display main description page with text", async () => {
    expect(screen.getByText("かんたんグラフ化")).toBeInTheDocument();
    console.log("サイト説明画面のテキストが正常に表示される");
  });

  test("Display main description page with start button", async () => {
    const iconButtonElements = screen.getAllByRole("button");
    expect(iconButtonElements.length).greaterThan(0);
    const startButton = iconButtonElements.find((b) =>
      b.textContent?.includes("今すぐ始める")
    );
    expect(startButton as HTMLElement).toBeInTheDocument();
    console.log("サイト説明画面に「今すぐ始める」ボタンがある");
  });
});
