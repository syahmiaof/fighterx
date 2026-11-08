"use client";

import { useEffect, useState } from "react";
import type { AthleteHomeLoadResult } from "@/lib/athlete/athlete-home-contract";
import { demoAthleteHomeAdapter, getInitialDemoAthleteHome } from "@/lib/athlete/demo-athlete-home-adapter";
import { AthleteHomeDashboard } from "@/components/athlete/athlete-home-dashboard";

type AthleteHomeUiState = { status: "loading" } | AthleteHomeLoadResult;

export function AthleteHomeExperience() {
  const [state, setState] = useState<AthleteHomeUiState>(() => getInitialDemoAthleteHome());

  useEffect(() => {
    let active = true;

    demoAthleteHomeAdapter.loadHome()
      .then((result) => {
        if (active) setState(result);
      })
      .catch(() => {
        if (active) setState({ status: "error", message: "Paparan dashboard tidak dapat dimuatkan sekarang." });
      });

    return () => {
      active = false;
    };
  }, []);

  return <AthleteHomeDashboard state={state} />;
}
