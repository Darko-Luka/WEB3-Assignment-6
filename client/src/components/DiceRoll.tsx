import { Button } from "./ui/button";
import one from "../assets/1.png";
import two from "../assets/2.png";
import three from "../assets/3.png";
import four from "../assets/4.png";
import five from "../assets/5.png";
import six from "../assets/6.png";
import { IndexedYahtzee } from "@/model/game";
import { useCallback, useEffect, useState } from "react";
import * as api from "../model/api";

function DiceRoll({
  game,
  player,
  enabled,
}: {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
}) {
  const imageMap = {
    1: one,
    2: two,
    3: three,
    4: four,
    5: five,
    6: six,
  };

  const [held, setHeld] = useState([false, false, false, false, false, false]);

  const rerollEnabled = useCallback(
    () => game && game.rolls_left > 0 && enabled,
    [enabled, game]
  );

  useEffect(() => {
    if (!rerollEnabled) {
      for (const i in held) {
        const _held = [...held];
        _held[i] = false;
        setHeld(_held);
      }
    }
  }, [rerollEnabled]);

  async function reroll() {
    const heldIndices = held
      .map((b, i) => (b ? i : undefined))
      .filter((i) => i !== undefined);
    api.reroll(game, heldIndices, player);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const _held = [...held];
    _held[i] = e.target.checked;
    setHeld(_held);
  }

  return (
    <div>
      {!enabled && (
        <h1 className="text-xl">
          {game.players[game.playerInTurn]} is playing
        </h1>
      )}
      <div className="flex flex-row gap-5 ml-[64px] size-10 mt-4">
        {game.roll.map((d, index) => {
          return <img key={index} src={imageMap[d]}></img>;
        })}
      </div>

      {enabled && rerollEnabled() && (
        <div className="flex flex-row gap-12 size-6 mt-4 ">
          <p>Hold: </p>
          {game.roll.map((_, i) => {
            return (
              <input
                key={i}
                type="checkbox"
                checked={held[i]}
                onChange={(e) => handleChange(e, i)}
              />
            );
          })}
        </div>
      )}
      {enabled && rerollEnabled() && (
        <Button onClick={() => reroll()} className="mt-4 ml-28">
          Re-roll
        </Button>
      )}
    </div>
  );
}

export default DiceRoll;
