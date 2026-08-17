-- Persists the insured-path plan-type question (employer / marketplace /
-- Medicare Advantage / not sure, plus the employer self-funded vs
-- fully-insured follow-up). Used to route a billing dispute to the regulator
-- that actually has jurisdiction: self-funded employer plans are federal
-- ERISA plans (DOL-EBSA), not the state Dept. of Insurance, and Medicare
-- Advantage complaints go through the plan and then Medicare directly, not
-- the state DOI either. Previously every insured user was pointed at the
-- state DOI regardless of plan type.
alter table public.screening_results
  add column if not exists plan_type text,
  add column if not exists plan_funding text;

alter table public.screening_results
  add constraint screening_results_plan_type_check
    check (
      plan_type is null
      or plan_type in ('employer', 'marketplace', 'medicare_advantage', 'not_sure')
    ),
  add constraint screening_results_plan_funding_check
    check (
      plan_funding is null
      or plan_funding in ('self_funded', 'fully_insured', 'not_sure')
    );
