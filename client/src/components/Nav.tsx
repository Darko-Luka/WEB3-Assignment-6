import { Link } from "react-router-dom";
import {
  upsertPendingGame,
  removePendingGame,
} from "../stores/pendingGamesSlice";
import { upsertOnGoingGame } from "../stores/ongoingGamesSlice";
import { useCallback, useEffect } from "react";
import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../model/api";
import { is_finished } from "../../../models/src/model/yahtzee.game";
import { createWebSocketObservable } from "@/lib/utils";

function Nav({ children }: { children: React.ReactNode }) {
  const selectPlayer = (state: RootState) => state.player.player;
  const selectOngoingGames = (state: RootState) => state.ongoingGames.gameList;
  const selectPendingGames = (state: RootState) => state.pendingGames.gameList;

  const ongoingGames = useSelector(selectOngoingGames);
  const pendingGames = useSelector(selectPendingGames);
  const player = useSelector(selectPlayer);

  const isParticipant = (
    game: { players: string[] },
    player: string | undefined
  ) => (player ? game.players.includes(player) : false);

  const myOngoingGames = useCallback(
    () =>
      ongoingGames.filter(
        (game) => isParticipant(game, player) && !is_finished(game)
      ),
    [ongoingGames, player]
  );

  const myPendingGames = useCallback(
    () => pendingGames.filter((game) => isParticipant(game, player)),
    [pendingGames, player]
  );

  const otherPendingGames = useCallback(
    () => pendingGames.filter((game) => !isParticipant(game, player)),
    [pendingGames, player]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const wsObservable = createWebSocketObservable(
      "ws://localhost:9090/publish"
    );

    const wsSubscription = wsObservable.subscribe({
      next: (message: any) => {
        const game = JSON.parse(message.data);
        if (game.pending) {
          dispatch(upsertPendingGame(game));
        } else {
          dispatch(upsertOnGoingGame(game));
          dispatch(removePendingGame(game.id));
        }
      },
    });

    const fetchData = async () => {
      const games = await api.games();
      games.forEach((game) => dispatch(upsertOnGoingGame(game)));

      const pending_games = await api.pending_games();
      pending_games.forEach((game) => dispatch(upsertPendingGame(game)));
    };

    fetchData();

    return () => {
      if (wsSubscription) {
        wsSubscription.unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <div className="bg-white max-w-screen-lg mx-auto flex justify-between p-4">
        <div className="space-y-6">
          <h1 className="text-3xl">Yahtzee!</h1>
          <h2 className="text-2xl">Welcome player: {player}</h2>

          {children}
        </div>
        <nav className="space-y-4">
          <Link className="text-blue-500 underline" to="/">
            Lobby
          </Link>
          <h2 className="text-2xl">My Games</h2>
          <h3 className="text-xl">Ongoing</h3>
          {myOngoingGames().map((game) => {
            return (
              <Link
                key={game.id}
                className="text-blue-500 underline"
                to={`/game/${game.id}`}
              >
                Game #{game.id}
              </Link>
            );
          })}

          <h3 className=" text-xl">Waiting for players</h3>
          {myPendingGames().map((game) => {
            return (
              <Link
                key={game.id}
                className="text-blue-500 underline"
                to={`/pending/${game.id}`}
              >
                Game #{game.id}
              </Link>
            );
          })}
          <h2 className="text-xl">Available Games</h2>
          {otherPendingGames().map((game) => {
            return (
              <Link
                key={game.id}
                className="text-blue-500 underline"
                to={`/pending/${game.id}`}
              >
                Game #{game.id}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Nav;
