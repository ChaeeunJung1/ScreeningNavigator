-- Persists the age, household size, and income the user enters in the
-- questionnaire. Previously only state_code/insurance_status/program_name
-- were saved; age/household/income were passed through the URL to the
-- results page and then discarded, so Settings had nothing to read back.
alter table public.screening_results
  add column if not exists age integer,
  add column if not exists household_size integer,
  add column if not exists income numeric;

alter table public.screening_results
  add constraint screening_results_age_check
    check (age is null or (age >= 0 and age <= 120)),
  add constraint screening_results_household_size_check
    check (household_size is null or household_size >= 1),
  add constraint screening_results_income_check
    check (income is null or income >= 0);
