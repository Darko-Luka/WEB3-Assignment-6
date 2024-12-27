"use client";

import { Button } from "@/components/ui/button";
import * as api from "../../../../model/api";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { useRouter, useParams } from "next/navigation";

const Pending = () => {
  const router = useRouter();
  const params = useParams();

  const id: string = params.id;
  const gameId = parseInt(id ?? "0", 10);

  const selectPendingGames = (state: RootState) => state.pendingGames.gameList;
  const selectOngoingGames = (state: RootState) => state.ongoingGames.gameList;
  const selectPlayer = (state: RootState) => state.player.player;

  const pendingGames = useSelector(selectPendingGames);
  const ongoingGames = useSelector(selectOngoingGames);
  const player = useSelector(selectPlayer);

  const selectedPendingGame = pendingGames.find((g) => g.id === gameId);
  const selectedOngoingGame = ongoingGames.find((g) => g.id === gameId);

  const canJoin = useCallback(() => {
    return (
      selectedPendingGame &&
      player &&
      !selectedPendingGame.players.includes(player)
    );
  }, [player, selectedPendingGame]);

  const join = useCallback(() => {
    if (selectedPendingGame && player && canJoin()) {
      console.log("freza");
      api.join(selectedPendingGame, player);
    }
  }, [selectedPendingGame, player, canJoin]);

  useEffect(() => {
    if (!selectedPendingGame) {
      console.log("boske");
      if (selectedOngoingGame) {
        router.push(`/game/${gameId}`);
      } else {
        router.push("/");
      }
    }
  }, [selectedPendingGame, selectedOngoingGame, gameId, router]);

  useEffect(() => {
    if (!player) {
      router.push(`/login?pending=${gameId}`);
    } else if (!selectedPendingGame) {
      if (selectedOngoingGame) {
        router.push(`/game/${gameId}`);
      } else {
        router.push("/");
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      <h1>Game #{gameId}</h1>
      <p>
        Created by: <span>{selectedPendingGame?.creator}</span>
      </p>
      <p>
        Players: <span>{selectedPendingGame?.players.join(", ")}</span>
      </p>
      <p>
        Available Seats:{" "}
        <span>
          {(selectedPendingGame?.number_of_players ?? 2) -
            (selectedPendingGame?.players.length ?? 0)}
        </span>
      </p>
      {canJoin() && <Button onClick={join}>join</Button>}
    </div>
  );
};

export default Pending;
