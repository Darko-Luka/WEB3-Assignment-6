"use client";

import DiceRoll from "@/components/DiceRoll";
import ScoreCard from "@/components/ScoreCard";
import { RootState } from "@/stores/store";
import {
  is_finished,
  scores,
} from "../../../../../../models/src/model/yahtzee.game";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

function Game() {
  const router = useRouter();

  const params = useParams();

  const id: string = params.id;
  const gameId = parseInt(id ?? "0", 10);

  const selectGameById = (gameId: number) => (state: RootState) =>
    state.ongoingGames.gameList.find((g) => g.id === gameId);
  const selectPlayer = (state: RootState) => state.player.player;
  const player = useSelector(selectPlayer);

  const game = useSelector(selectGameById(gameId ?? -1));

  const enabled = () =>
    game !== undefined && player === game.players[game.playerInTurn];
  const finished = () => game === undefined || is_finished(game);
  const standings = () => {
    if (game === undefined) return [];
    const standings: [string, number][] = scores(game).map((s, i) => [
      game.players[i],
      s,
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    standings.sort(([x1, score1], [x2, score2]) => score2 - score1);
    return standings;
  };

  useEffect(() => {
    if (player === undefined) router.push(`/login?game=${gameId}`);
    else if (game === undefined) router.push("/");
  }, []);

  return (
    <>
      {game && player && (
        <div className="w-full h-full">
          <div>
            <h1 className="text-2xl bold ml-16 mt-4">Game #{gameId}</h1>
          </div>
          <div className="flex flex-row justify-center gap-24 h-full mt-4">
            <ScoreCard game={game} player={player} enabled={enabled()} />
            {!finished() ? (
              <>
                <div className=" w-80 h-80">
                  <div>
                    <DiceRoll game={game} player={player} enabled={enabled()} />
                  </div>
                </div>
              </>
            ) : (
              <div className="scoreboard">
                <table>
                  <thead>
                    <tr>
                      <td>Player</td>
                      <td>Score</td>
                    </tr>
                  </thead>
                  <tbody>
                    {standings().map((row, index) => {
                      return (
                        <tr
                          key={index}
                          className={row[0] == player ? "current" : undefined}
                        >
                          <td>{row[0]}</td>
                          <td>{row[1]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Game;
