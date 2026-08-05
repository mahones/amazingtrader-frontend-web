import type { User } from "./user";

export type BotAssignmentStatus = "active" | "paused" | "stopped";
export type TradeDirection = "buy" | "sell";

export interface TradingBot {
  id: number;
  name: string;
  slug: string;
  description: string;
  strategy_summary: string | null;
  pairs_traded: string[];
  yield_percent: number | null;
  drawdown_percent: number | null;
  win_rate_percent: number | null;
  is_active: boolean;
}

export interface BotAssignment {
  id: number;
  status: BotAssignmentStatus;
  assigned_at: string | null;
  trading_bot: TradingBot;
  user?: User;
}

export interface BotTrade {
  id: number;
  pair: string;
  direction: TradeDirection;
  entry_price: number;
  exit_price: number | null;
  profit_loss: number | null;
  opened_at: string;
  closed_at: string | null;
}
