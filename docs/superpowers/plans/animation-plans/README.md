# Animation Fix Plans — nexCommerce

**Audit commit**: `81596ea` | **Audit date**: 2026-08-21

Plans generated from the comprehensive animation & motion audit. All 10 plans have been fully executed, tested, and verified with 100% test passing rate.

## Plans

| # | Plan | Severity | Effort | Status | Dependency |
|---|---|---|---|---|---|
| 001 | [Fix Easing Tokens](./001-fix-easing-tokens.md) | HIGH | Trivial (2 lines) | DONE | None |
| 002 | [Fix Toast Exit `ease-in`](./002-fix-toast-exit-easing.md) | HIGH | Trivial (1 line) | DONE | None |
| 003 | [Replace `transition: all`](./003-replace-transition-all.md) | HIGH | Large (systematic) | DONE | Run 001 first |
| 004 | [Unify Scroll Dispatchers](./004-unify-scroll-dispatchers.md) | HIGH | Low | DONE | None |
| 005 | [Remove Dead Parallax Fns](./005-remove-dead-parallax-fns.md) | HIGH | Trivial | DONE | None |
| 006 | [Fix `will-change: bottom, right`](./006-fix-will-change-hotspot.md) | MEDIUM | Trivial (1 line) | DONE | None |
| 007 | [Fix Countdown Digit Flip](./007-fix-countdown-digit-flip.md) | MEDIUM | Trivial (1 line) | DONE | None |
| 008 | [About Page Spring-Back](./008-about-card-spring-back.md) | MEDIUM | Low | DONE | None |
| 009 | [Standardize Curtain Easing](./009-standardize-curtain-easing.md) | MEDIUM | Low | DONE | None |
| 010 | [Fix Reduced-Motion Blanket](./010-fix-reduced-motion-blanket.md) | MEDIUM | Trivial (1 line) | DONE | None |

## Execution Summary

**Batch A — Trivial wins (DONE)**
1. Plan 001 — easing tokens (2 lines, max leverage) - DONE
2. Plan 002 — toast exit (1 line) - DONE
3. Plan 006 — will-change hotspot (1 line) - DONE
4. Plan 007 — countdown digit flip (1 line) - DONE
5. Plan 010 — reduced-motion blanket (1 line removed) - DONE

**Batch B — Architecture (DONE)**
6. Plan 004 — unify scroll dispatchers - DONE
7. Plan 005 — remove dead parallax fns - DONE
8. Plan 009 — standardize curtain easing - DONE

**Batch C — Final Polish & Performance (DONE)**
9. Plan 008 — about page spring-back - DONE
10. Plan 003 — replace transition: all (140+ instances replaced with explicit properties across CSS and HTML files) - DONE

## Out of Scope (Missed Opportunities — for future exploration)
- Filter panel open/close slide animation
- Cart item removal exit animation
- Search overlay chip stagger entrance
- Order confirmation checkmark spring pop
