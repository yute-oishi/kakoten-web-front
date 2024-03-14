import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi, describe, beforeEach } from "vitest";
import { RecoilRoot, snapshot_UNSTABLE } from "recoil";
import { historyState, obsListState } from "@/modules/atoms";
import SelectObsModal from "@/Pages/SelectObsModal";
import { RecoilObserver } from "@/../vitest.setup";

const onChange = vi.fn();

describe("SelectObsModal Page", () => {
  beforeEach(() => {
    render(
      <RecoilRoot>
        <RecoilObserver node={historyState} onChange={onChange} />
        <RecoilObserver node={obsListState} onChange={onChange} />
        <SelectObsModal open={true} setOpen={vi.fn()} setObs={vi.fn()} />
      </RecoilRoot>
    );
  });

  test("Display buttons for 47 prefectures", async () => {
    const iconButtonElements = screen.getAllByRole("button");
    expect(iconButtonElements.length).toBe(47);
    fireEvent.click(iconButtonElements[0]);
    console.log("単一観測所選択画面で47個のボタンある");
  });

  test("Move page by pressing button", async () => {
    expect(screen.getByText("東京都")).toBeInTheDocument();
    expect(screen.getByText("大阪府")).toBeInTheDocument();
    console.log(
      "単一観測所選択画面で初期表示は東京都、大阪府のボタンが表示される"
    );

    const iconButtonElements = screen.getAllByRole("button");
    let TokyoButton = iconButtonElements.find((b) =>
      b.textContent?.includes("東京都")
    );
    fireEvent.click(TokyoButton as HTMLElement);

    expect(screen.getByText("東京都")).toBeInTheDocument();
    expect(screen.queryByText("大阪府")).toBeNull;
    console.log(
      "東京都ボタンを押下後、東京都ボタンは残り、大阪府ボタンは無くなっている"
    );
  });
});
