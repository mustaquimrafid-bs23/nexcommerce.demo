'use client';

import React from 'react';
import { TrackingOrder, STAGES, STATUS_TO_STAGE } from './types';

interface RouteMapSVGProps {
  order: TrackingOrder;
}

function getBezierPoint(t: number) {
  const W = [
    { x: 90, y: 115 },
    { x: 360, y: 55 },
    { x: 630, y: 115 },
  ];
  const cp = [
    { x: 215, y: 25 },
    { x: 205, y: 25 },
    { x: 500, y: 25 },
    { x: 505, y: 25 },
  ];

  if (t <= 0.5) {
    const tt = t * 2,
      mt = 1 - tt;
    return {
      x:
        mt * mt * mt * W[0].x +
        3 * mt * mt * tt * cp[0].x +
        3 * mt * tt * tt * cp[1].x +
        tt * tt * tt * W[1].x,
      y:
        mt * mt * mt * W[0].y +
        3 * mt * mt * tt * cp[0].y +
        3 * mt * tt * tt * cp[1].y +
        tt * tt * tt * W[1].y,
    };
  } else {
    const tt = (t - 0.5) * 2,
      mt = 1 - tt;
    return {
      x:
        mt * mt * mt * W[1].x +
        3 * mt * mt * tt * cp[2].x +
        3 * mt * tt * tt * cp[3].x +
        tt * tt * tt * W[2].x,
      y:
        mt * mt * mt * W[1].y +
        3 * mt * mt * tt * cp[2].y +
        3 * mt * tt * tt * cp[3].y +
        tt * tt * tt * W[2].y,
    };
  }
}

export default function RouteMapSVG({ order }: RouteMapSVGProps) {
  const stageIdx = STATUS_TO_STAGE[order.statusKey || order.status] ?? 4;
  const stage = STAGES[stageIdx] || STAGES[4];
  const bp = getBezierPoint(stage.beaconPos);
  const pct = Math.min(100, Math.max(0, stage.beaconPos * 100));
  const isDelivered = stageIdx >= 5;

  const pathD = 'M 90 115 C 215 25 205 25 360 55 S 500 25 630 115';
  const waypoints = [
    { x: 90, y: 115, label: 'MILAN WORKSHOP', sub: 'Origin Hub', done: stageIdx >= 2 },
    { x: 360, y: 55, label: 'FRANKFURT AIR HUB', sub: 'Central Gateway', done: stageIdx >= 3 },
    { x: 630, y: 115, label: 'LONDON HUB', sub: 'Final Destination', done: stageIdx >= 5 },
  ];

  return (
    <div className="rounded-2xl overflow-hidden bg-[#08254c]/80 border border-white/15 shadow-xl backdrop-blur-md">
      <div id="routeMapContainer" className="w-full">
        <svg
          viewBox="0 0 720 180"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block select-none"
          aria-label="Delivery route map"
        >
          <defs>
            <radialGradient id="bGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3DE0FF" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#3DE0FF" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="dGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
            </radialGradient>
            <filter id="gf" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3DE0FF" stopOpacity="0.95" />
              <stop offset={`${pct}%`} stopColor="#3DE0FF" stopOpacity="0.95" />
              <stop
                offset={`${Math.min(pct + 0.01, 100)}%`}
                stopColor="rgba(255,255,255,0.18)"
                stopOpacity="1"
              />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" stopOpacity="1" />
            </linearGradient>
          </defs>

          <rect width="720" height="180" fill="rgba(8,37,76,0.75)" rx="14" />
          <line
            x1="0"
            y1="90"
            x2="720"
            y2="90"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* Dashed Background Path */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2.5"
            strokeDasharray="5 5"
          />

          {/* Active Colored Progress Path */}
          <path d={pathD} fill="none" stroke="url(#rg)" strokeWidth="3.5" strokeLinecap="round" />

          {/* Waypoints */}
          {waypoints.map((wp, i) => {
            const clr = wp.done ? (i === 2 ? '#34D399' : '#3DE0FF') : 'rgba(255,255,255,0.3)';
            const glowId = i === 2 ? 'dGlow' : 'bGlow';

            return (
              <g key={wp.label}>
                {wp.done && <circle cx={wp.x} cy={wp.y} r="22" fill={`url(#${glowId})`} />}
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r="9"
                  fill="rgba(6,29,60,0.95)"
                  stroke={clr}
                  strokeWidth="2"
                />
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r="4"
                  fill={clr}
                  filter={wp.done ? 'url(#gf)' : undefined}
                />
                <text
                  x={wp.x}
                  y={wp.y + 22}
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize="8.5"
                  fontWeight="700"
                  letterSpacing="0.09em"
                  fill={wp.done ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)'}
                >
                  {wp.label}
                </text>
                <text
                  x={wp.x}
                  y={wp.y + 33}
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize="7.5"
                  fill="rgba(255,255,255,0.5)"
                >
                  {wp.sub}
                </text>
              </g>
            );
          })}

          {/* Live Traveling Courier Beacon (when in transit) */}
          {!isDelivered && stage.beaconPos > 0 && stage.beaconPos < 1 && (
            <g className="transition-transform duration-500 ease-out">
              <circle cx={bp.x} cy={bp.y} r="24" fill="url(#bGlow)" className="animate-pulse" />
              <circle
                cx={bp.x}
                cy={bp.y}
                r="11"
                fill="rgba(6,29,60,0.95)"
                stroke="rgba(61,224,255,0.5)"
                strokeWidth="1.5"
              />
              <circle cx={bp.x} cy={bp.y} r="5.5" fill="#3DE0FF" filter="url(#gf)" />
              <text
                x={bp.x}
                y={bp.y + 3.5}
                textAnchor="middle"
                fontSize="8.5"
                fill="#fff"
                fontFamily="sans-serif"
              >
                ▸
              </text>
            </g>
          )}

          {/* Delivered Checkmark Pin */}
          {isDelivered && (
            <g>
              <circle
                cx={waypoints[2].x}
                cy={waypoints[2].y}
                r="22"
                fill="url(#dGlow)"
                className="animate-pulse"
              />
              <text
                x={waypoints[2].x}
                y={waypoints[2].y + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill="#34D399"
              >
                ✓
              </text>
            </g>
          )}

          {/* Top Right Live Stage Status */}
          <text
            x="706"
            y="22"
            textAnchor="end"
            fontFamily="Inter, sans-serif"
            fontSize="9.5"
            fontWeight="700"
            letterSpacing="0.1em"
            fill="rgba(61,224,255,0.95)"
          >
            {stage.label.toUpperCase()}
          </text>
          <text
            x="706"
            y="34"
            textAnchor="end"
            fontFamily="Inter, sans-serif"
            fontSize="8"
            fill="rgba(255,255,255,0.5)"
          >
            {stage.location}
          </text>

          {/* Bottom Left Timestamp */}
          <text
            x="14"
            y="22"
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            fontSize="8.5"
            fill="rgba(255,255,255,0.5)"
          >
            DHL EXPRESS LOGISTICS &middot; {stage.ts}
          </text>
        </svg>
      </div>
    </div>
  );
}
