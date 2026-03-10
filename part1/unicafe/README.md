# Part 1 – Unicafe

Solutions for exercises 1.6–1.11 of [Full Stack Open](https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14).

A feedback collection app for the Unicafe student restaurant, built incrementally across 6 steps.

## Exercises

### 1.6 – Unicafe, step 1
Built the base app with three feedback buttons (good, neutral, bad) and displayed the running count for each category using separate pieces of state.

### 1.7 – Unicafe, step 2
Added summary statistics: total feedback count, average score (good = 1, neutral = 0, bad = -1), and percentage of positive feedback.

### 1.8 – Unicafe, step 3
Extracted all statistics display into a dedicated `Statistics` component, keeping state in the root `App` component.

### 1.9 – Unicafe, step 4
Added conditional rendering so that statistics are only shown once at least one piece of feedback has been submitted.

### 1.10 – Unicafe, step 5
Refactored further by extracting a reusable `Button` component for feedback buttons and a `StatisticLine` component for rendering a single statistic row.

### 1.11 – Unicafe, step 6
Displayed the statistics inside an HTML `<table>` for a cleaner layout.