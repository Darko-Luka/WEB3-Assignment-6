"use client";

import { score } from "../../../models/src/model/yahtzee.slots";
import {
  die_values,
  DieValue,
  isDieValue,
} from "../../../models/src/model/dice";
import {
  lower_section_keys,
  lower_section_slots,
  LowerSectionKey,
  sum_upper,
  total_upper,
  upper_section_slots,
} from "../../../models/src/model/yahtzee.score";
import * as api from "../model/api";
import { IndexedYahtzee } from "@/model/game";
import { Fragment } from "react/jsx-runtime";
import { scores } from "../../../models/src/model/yahtzee.game";

function ScoreCard({
  game,
  player,
  enabled,
}: {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
}) {
  const register = (key: DieValue | LowerSectionKey) => {
    if (enabled) api.register(game, key, player);
  };

  const isActive = (p: string) => {
    return game.players[game.playerInTurn] === player && player === p;
  };

  const playerScores = (
    key: DieValue | LowerSectionKey
  ): { player: string; score: number | undefined }[] => {
    if (isDieValue(key)) {
      return game.players.map((p, i) => ({
        player: p,
        score: game.upper_sections[i].scores[key],
      }));
    } else {
      return game.players.map((p, i) => ({
        player: p,
        score: game.lower_sections[i].scores[key],
      }));
    }
  };

  const potentialScore = (key: DieValue | LowerSectionKey) => {
    if (isDieValue(key)) {
      return score(upper_section_slots[key], game.roll);
    } else {
      return score(lower_section_slots[key], game.roll);
    }
  };

  const displayScore = (score: number | undefined): string => {
    if (score === undefined) return "";
    else if (score === 0) return "---";
    else return score.toString();
  };

  const activeClass = (p: string) =>
    p === player ? "activeplayer" : undefined;

  return (
    <div>
      <table className="table-auto border-collapse border border-slate-500 table-class">
        <tbody>
          <tr>
            <td>Upper Section</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>Target</td>
            {game.players.map((player) => {
              return (
                <td key={player} className={activeClass(player)}>
                  {player}
                </td>
              );
            })}
          </tr>
          {die_values.map((val) => {
            return (
              <tr key={val}>
                <td>{val}s</td>
                <td>{3 * val}</td>
                {playerScores(val).map(({ player, score }) => {
                  return (
                    <Fragment key={player}>
                      {isActive(player) && score === undefined ? (
                        <td
                          onClick={() => register(val)}
                          className="cursor-pointer text-transparent hover:text-black"
                        >
                          {displayScore(potentialScore(val))}
                        </td>
                      ) : isActive(player) ? (
                        <td className="activeplayer">{displayScore(score)}</td>
                      ) : (
                        <td>{displayScore(score)}</td>
                      )}
                    </Fragment>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <td>Sum</td>
            <td>63</td>
            {game.players.map((player, index) => {
              return (
                <td key={player} className={activeClass(player)}>
                  {sum_upper(game.upper_sections[index].scores)}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>Bonus</td>
            <td>50</td>
            {game.players.map((player, index) => {
              return (
                <td key={player} className={activeClass(player)}>
                  {displayScore(game.upper_sections[index].bonus)}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>Total</td>
            <td></td>
            {game.players.map((player, index) => {
              return (
                <td key={player} className={activeClass(player)}>
                  {total_upper(game.upper_sections[index])}
                </td>
              );
            })}
          </tr>
          <tr>
            <td colSpan={2}>Lower Section</td>
          </tr>
          {lower_section_keys.map((key) => {
            return (
              <tr key={key}>
                <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                <td></td>
                {playerScores(key).map(({ player, score }) => {
                  return (
                    <Fragment key={player}>
                      {isActive(player) && score === undefined ? (
                        <td
                          className="cursor-pointer text-transparent hover:text-black"
                          onClick={() => register(key)}
                        >
                          {displayScore(potentialScore(key))}
                        </td>
                      ) : isActive(player) ? (
                        <td
                          className="activeplayer"
                          onClick={() => register(key)}
                        >
                          {displayScore(score)}
                        </td>
                      ) : (
                        <td>{displayScore(score)}</td>
                      )}
                    </Fragment>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <td>Total</td>
            <td></td>
            {game.players.map((player, index) => {
              return (
                <td key={player} className={activeClass(player)}>
                  {scores(game)[index]}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ScoreCard;
