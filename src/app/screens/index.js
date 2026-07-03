/* Screen Registry — single source of truth for Demo, Library, Journey, and AllScreens */

import { WelcomeScreen } from './Welcome'
import { GoalInputScreen, GoalContractScreen } from './GoalSetting'
import { TDEEScreen, TDEECompareScreen } from './TDEE'
import { MacroTargetsScreen, MacroMealsScreen, ShoppingListScreen } from './Macros'
import { FridgeScreen } from './Fridge'
import { MealPrepMergeScreen, MealPrepTimelineScreen, MealPrepCookModeScreen } from './MealPrep'
import { PlanCalendarMonthScreen, PlanCalendarWeekScreen, PlanCalendarDayScreen } from './PlanCalendar'
import { TrainingSessionScreen } from './Training'
import { WorkoutSummaryScreen } from './WorkoutSummary'
import { ProgramOverviewScreen } from './ProgramOverview'
import { GoalDetailScreen } from './GoalDetail'
import { ExerciseBrowserScreen } from './ExerciseBrowser'
import { ExerciseDetailScreen } from './ExerciseDetail'
import { WorkoutTemplateScreen } from './WorkoutTemplateDetail'
import { ProfileScreen } from './Profile'
import { CheckInScreen } from './CheckInScreen'
import { FeatureCardMorphScreen } from './FeatureCardMorph'
import { BatchPrepScreen } from './BatchPrep'
import { CookSummaryScreen } from './CookSummary'
import { DashboardScreen, DashboardNutritionScreen, DashboardTrainingScreen } from './Dashboard'
import { MacroHeatmapScreen } from './MacroHeatmap'
import { FoodLogScreen } from './FoodLog'
import { WaterTrackingScreen } from './WaterTracking'

export const SCREENS = [
  { id: 'dash-bal',   feature: 'Dashboard',    flow: '00', label: 'Balanced',            C: DashboardScreen },
  { id: 'dash-nut',   feature: 'Dashboard',    flow: '00', label: 'Nutrition focus',     C: DashboardNutritionScreen },
  { id: 'dash-trn',   feature: 'Dashboard',    flow: '00', label: 'Training focus',      C: DashboardTrainingScreen },
  { id: 'welcome',    feature: 'Welcome',      flow: '01', label: 'Begin',               C: WelcomeScreen },
  { id: 'goal-a',     feature: 'Goal Setting', flow: '02', label: 'Set the goal',        C: GoalInputScreen },
  { id: 'goal-b',     feature: 'Goal Setting', flow: '02', label: 'The brief',           C: GoalContractScreen },
  { id: 'tdee-a',     feature: 'TDEE Model',   flow: '03', label: 'Today',               C: TDEEScreen },
  { id: 'tdee-b',     feature: 'TDEE Model',   flow: '03', label: 'Trust over time',     C: TDEECompareScreen },
  { id: 'plan-m',     feature: 'Plan',         flow: '04', label: 'Calendar \u00b7 month', C: PlanCalendarMonthScreen },
  { id: 'plan-w',     feature: 'Plan',         flow: '04', label: 'Calendar \u00b7 week',  C: PlanCalendarWeekScreen },
  { id: 'plan-d',     feature: 'Plan',         flow: '04', label: 'Calendar \u00b7 day',   C: PlanCalendarDayScreen },
  { id: 'train-prog', feature: 'Training',     flow: '05', label: 'Program overview',      C: ProgramOverviewScreen },
  { id: 'goal-det',   feature: 'Training',     flow: '05', label: 'Goal detail',          C: GoalDetailScreen },
  { id: 'ex-browse',  feature: 'Training',     flow: '05', label: 'Exercise browser',     C: ExerciseBrowserScreen },
  { id: 'ex-detail',  feature: 'Training',     flow: '05', label: 'Exercise detail',      C: ExerciseDetailScreen },
  { id: 'wk-template',feature: 'Training',     flow: '05', label: 'Workout template',     C: WorkoutTemplateScreen },
  { id: 'train-a',    feature: 'Training',     flow: '05', label: 'Active session',       C: TrainingSessionScreen },
  { id: 'train-sum',  feature: 'Training',     flow: '05', label: 'Workout summary',     C: WorkoutSummaryScreen },
  { id: 'macro-a',    feature: 'Macros',       flow: '06', label: 'Weekly targets',      C: MacroTargetsScreen },
  { id: 'macro-b',    feature: 'Macros',       flow: '06', label: 'Meal queue',          C: MacroMealsScreen },
  { id: 'batch-a',    feature: 'Macros',       flow: '06', label: 'Batch strategy',      C: BatchPrepScreen },
  { id: 'macro-c',    feature: 'Macros',       flow: '06', label: 'Shopping',            C: ShoppingListScreen },
  { id: 'fridge-a',   feature: 'Fridge',       flow: '07', label: 'Pantry \u00b7 delta', C: FridgeScreen },
  { id: 'prep-a',     feature: 'Meal Prep',    flow: '08', label: 'Pre-cook merge',      C: MealPrepMergeScreen },
  { id: 'morph',      feature: 'Meal Prep',    flow: '08', label: 'Card \u2192 cook morph', C: FeatureCardMorphScreen },
  { id: 'prep-b',     feature: 'Meal Prep',    flow: '08', label: 'Parallel timeline',   C: MealPrepTimelineScreen },
  { id: 'prep-c',     feature: 'Meal Prep',    flow: '08', label: 'Active cook mode',    C: MealPrepCookModeScreen },
  { id: 'cook-sum',   feature: 'Meal Prep',    flow: '08', label: 'Cook summary',        C: CookSummaryScreen },
  { id: 'profile',    feature: 'Profile',      flow: '09', label: 'Account hub',         C: ProfileScreen },
  { id: 'checkin',    feature: 'Feedback',     flow: '10', label: 'Weekly check-in',     C: CheckInScreen },
  { id: 'macro-heat', feature: 'Analytics',    flow: '11', label: 'Macro adherence',     C: MacroHeatmapScreen },
  { id: 'food-log',   feature: 'Feedback',     flow: '10', label: 'Daily food log',      C: FoodLogScreen },
  { id: 'water',      feature: 'Feedback',     flow: '10', label: 'Water tracking',      C: WaterTrackingScreen },
]
