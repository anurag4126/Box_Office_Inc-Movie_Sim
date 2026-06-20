import { processDirectorAwards } from "../../director/directorAwardsService.js";
import { processDirectorAging } from "./directorEngine.js";
import { processDirectingProjects } from "./directingProjectEngine.js";
import { processProduction } from "./productionEngine.js";
import { processWriterPayroll } from "./payrollEngine.js";
import { processWritingProjects } from "./writerEngine.js";
import { processMarketTrends } from "./trendEngine.js";
import { processRandomEvents } from "./eventEngine.js";
import { generateNewsFromTrend, generateNewsFromEvent } from "./newsEngine.js";

import { addNotification } from "../helpers/notificationHelper.js";
import { processWriterAging } from "../helpers/agingHelper.js";

export const processWeeklyTick = async (gameState, studio) => {
  // Advance the market climate first so any releases this tick reflect the
  // current week's active trends.
  const trendMessages = processMarketTrends(gameState);
  trendMessages.forEach((msg) => addNotification(gameState, msg));

  // Generate news items for newly spawned trends
  if (gameState.marketTrends && gameState.marketTrends.activeTrends) {
    for (const trend of gameState.marketTrends.activeTrends) {
      if (trend.startWeek === gameState.currentWeek) {
        await generateNewsFromTrend(trend, gameState.currentWeek);
      }
    }
  }

  processWriterPayroll(gameState, studio);

  await processWritingProjects(gameState, studio);

  processDirectingProjects(gameState, studio);

  await processProduction(gameState, studio);

  processWriterAging(gameState);

  processDirectorAging(gameState);

  processDirectorAwards(gameState, studio);

  // Roll for global random industry events last, so they react to the week's
  // activity and can adjust studio money/fans/prestige before persistence.
  const firedEvents = processRandomEvents(gameState, studio);
  if (firedEvents && firedEvents.length > 0) {
    for (const ev of firedEvents) {
      await generateNewsFromEvent(ev.label, ev.message, gameState.currentWeek);
    }
  }

  return gameState;
};

export default processWeeklyTick;
