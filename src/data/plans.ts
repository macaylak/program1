// src/data/plans.ts

export type Block =
  | { type: 'warmup'; minutes: number; note?: string }
  | { type: 'set'; name: string; reps?: number; rounds?: number; minutes?: number; note?: string }
  | { type: 'cooldown'; minutes: number; note?: string };

export type Workout = {
  id: string;
  title: string;
  focus?: string;
  estMinutes?: number;
  equipment?: string[];
  blocks?: Block[];
};

export type Plan = {
  id: string;
  title: string;
  goal: 'Strength' | 'Endurance' | 'Mobility' | 'Rehab' | 'Weight Loss';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  sessionsPerWeek: number;
  equipment: string[];
  summary: string;
  image?: string;
  workouts: Workout[]; // <— NEW
};

export const PLANS: Plan[] = [
  {
    id: 'strength-beginner-8w',
    title: 'Strength Foundations (8 weeks)',
    goal: 'Strength',
    level: 'Beginner',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    equipment: ['Dumbbells', 'Bands'],
    summary:
      'Build a solid base with full-body dumbbell + band movements, 3 sessions/week.',
    workouts: [
      {
        id: 'sb8w-1',
        title: 'Full Body A',
        focus: 'Strength',
        estMinutes: 35,
        equipment: ['Dumbbells', 'Bands'],
        blocks: [
          { type: 'warmup', minutes: 5, note: 'Light band pull-aparts & shoulder circles' },
          { type: 'set', name: 'DB Floor Press', reps: 10, rounds: 3, note: 'Tempo 2-0-2' },
          { type: 'set', name: 'Seated Row (Band)', reps: 12, rounds: 3 },
          { type: 'set', name: 'Goblet Squat', reps: 10, rounds: 3 },
          { type: 'cooldown', minutes: 5, note: 'Chest & hips stretch' },
        ],
      },
      {
        id: 'sb8w-2',
        title: 'Upper Focus',
        focus: 'Strength',
        estMinutes: 32,
        equipment: ['Dumbbells', 'Bands'],
        blocks: [
          { type: 'warmup', minutes: 5, note: 'Band external rotations' },
          { type: 'set', name: 'DB Shoulder Press', reps: 8, rounds: 3 },
          { type: 'set', name: 'Band Lat Pulldown', reps: 12, rounds: 3 },
          { type: 'set', name: 'DB Biceps Curl', reps: 10, rounds: 2 },
          { type: 'cooldown', minutes: 5, note: 'Triceps & lats stretch' },
        ],
      },
      {
        id: 'sb8w-3',
        title: 'Lower + Core',
        focus: 'Strength',
        estMinutes: 34,
        equipment: ['Dumbbells', 'Bands'],
        blocks: [
          { type: 'warmup', minutes: 5, note: 'Ankles/hips mobility' },
          { type: 'set', name: 'DB RDL (seated or standing)', reps: 10, rounds: 3 },
          { type: 'set', name: 'Seated Band Leg Press', reps: 12, rounds: 3 },
          { type: 'set', name: 'Pallof Press (Band)', reps: 12, rounds: 2 },
          { type: 'cooldown', minutes: 5, note: 'Hamstrings & core reset' },
        ],
      },
      {
        id: 'sb8w-4',
        title: 'Full Body B',
        focus: 'Strength',
        estMinutes: 35,
        equipment: ['Dumbbells', 'Bands'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'DB Incline Press (bench or prop)', reps: 10, rounds: 3 },
          { type: 'set', name: 'Single-arm Row (DB)', reps: 10, rounds: 3 },
          { type: 'set', name: 'DB Split Squat (assisted)', reps: 8, rounds: 3 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
    ],
  },
  {
    id: 'endurance-6w',
    title: 'Endurance Builder (6 weeks)',
    goal: 'Endurance',
    level: 'Beginner',
    durationWeeks: 6,
    sessionsPerWeek: 3,
    equipment: ['None', 'Bands'],
    summary:
      'Low-impact intervals and aerobic circuits to improve work capacity.',
    workouts: [
      {
        id: 'e6w-1',
        title: 'Intervals: 30/30 x 10',
        focus: 'Aerobic Intervals',
        estMinutes: 28,
        equipment: ['None'],
        blocks: [
          { type: 'warmup', minutes: 5, note: 'Easy arm cycles & breathing' },
          { type: 'set', name: '30s moderate / 30s easy', minutes: 15, note: 'RPE 6/10 on work' },
          { type: 'cooldown', minutes: 5 },
        ],
      },
      {
        id: 'e6w-2',
        title: 'Band Conditioning Circuit',
        focus: 'Conditioning',
        estMinutes: 32,
        equipment: ['Bands'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'Row (band) 45s', rounds: 4 },
          { type: 'set', name: 'Press (band) 45s', rounds: 4 },
          { type: 'set', name: 'Marches or arm cycles 45s', rounds: 4 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
      {
        id: 'e6w-3',
        title: 'Steady 20',
        focus: 'Aerobic Base',
        estMinutes: 30,
        equipment: ['None'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'Steady effort', minutes: 20, note: 'RPE 5/10' },
          { type: 'cooldown', minutes: 5 },
        ],
      },
    ],
  },
  {
    id: 'mobility-4w',
    title: 'Mobility Reset (4 weeks)',
    goal: 'Mobility',
    level: 'Beginner',
    durationWeeks: 4,
    sessionsPerWeek: 4,
    equipment: ['None'],
    summary:
      'Daily short sessions to improve range of motion and joint health.',
    workouts: [
      {
        id: 'm4w-1',
        title: 'Neck + Thoracic',
        focus: 'Mobility',
        estMinutes: 15,
        equipment: ['None'],
        blocks: [
          { type: 'warmup', minutes: 3, note: 'Breathing + gentle circles' },
          { type: 'set', name: 'Neck CARs', reps: 6, rounds: 2 },
          { type: 'set', name: 'T-spine rotations', reps: 8, rounds: 2 },
          { type: 'cooldown', minutes: 2, note: 'Easy holds' },
        ],
      },
      {
        id: 'm4w-2',
        title: 'Shoulders',
        focus: 'Mobility',
        estMinutes: 16,
        equipment: ['None'],
        blocks: [
          { type: 'warmup', minutes: 3 },
          { type: 'set', name: 'Shoulder CARs', reps: 6, rounds: 2 },
          { type: 'set', name: 'Doorway pec stretch', minutes: 2, rounds: 2 },
          { type: 'cooldown', minutes: 3 },
        ],
      },
      {
        id: 'm4w-3',
        title: 'Hips',
        focus: 'Mobility',
        estMinutes: 16,
        equipment: ['None'],
        blocks: [
          { type: 'warmup', minutes: 3 },
          { type: 'set', name: 'Hip CARs', reps: 6, rounds: 2 },
          { type: 'set', name: 'Figure-4 stretch', minutes: 2, rounds: 2 },
          { type: 'cooldown', minutes: 3 },
        ],
      },
      {
        id: 'm4w-4',
        title: 'Spine Flow',
        focus: 'Mobility',
        estMinutes: 14,
        equipment: ['None'],
        blocks: [
          { type: 'warmup', minutes: 2 },
          { type: 'set', name: 'Cat-cow', reps: 10, rounds: 2 },
          { type: 'set', name: 'Seated thoracic reach', reps: 10, rounds: 2 },
          { type: 'cooldown', minutes: 2 },
        ],
      },
    ],
  },
  {
    id: 'strength-int-10w',
    title: 'Strength Progression (10 weeks)',
    goal: 'Strength',
    level: 'Intermediate',
    durationWeeks: 10,
    sessionsPerWeek: 4,
    equipment: ['Dumbbells', 'Cable Machine'],
    summary:
      'Progressive overload with upper/lower splits and accessory work.',
    workouts: [
      {
        id: 'si10w-1',
        title: 'Upper (Push)',
        focus: 'Strength',
        estMinutes: 38,
        equipment: ['Dumbbells', 'Cable Machine'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'DB Bench / Floor Press', reps: 8, rounds: 4, note: 'Add load if strong' },
          { type: 'set', name: 'Cable Fly', reps: 12, rounds: 3 },
          { type: 'set', name: 'Overhead Press', reps: 8, rounds: 3 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
      {
        id: 'si10w-2',
        title: 'Lower + Posterior',
        focus: 'Strength',
        estMinutes: 36,
        equipment: ['Dumbbells', 'Cable Machine'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'DB RDL', reps: 8, rounds: 4 },
          { type: 'set', name: 'Cable Pull-through', reps: 12, rounds: 3 },
          { type: 'set', name: 'Split Squat (assisted)', reps: 8, rounds: 3 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
      {
        id: 'si10w-3',
        title: 'Upper (Pull)',
        focus: 'Strength',
        estMinutes: 36,
        equipment: ['Dumbbells', 'Cable Machine'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'One-arm Row', reps: 10, rounds: 4 },
          { type: 'set', name: 'Cable Lat Pulldown', reps: 10, rounds: 3 },
          { type: 'set', name: 'Rear Delt Fly', reps: 12, rounds: 2 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
      {
        id: 'si10w-4',
        title: 'Accessory + Core',
        focus: 'Hypertrophy',
        estMinutes: 32,
        equipment: ['Dumbbells', 'Cable Machine'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'Hammer Curl', reps: 12, rounds: 3 },
          { type: 'set', name: 'Triceps Pressdown', reps: 12, rounds: 3 },
          { type: 'set', name: 'Cable Pallof Press', reps: 12, rounds: 3 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
    ],
  },
  {
    id: 'rehab-6w',
    title: 'Rehab Support (6 weeks)',
    goal: 'Rehab',
    level: 'Beginner',
    durationWeeks: 6,
    sessionsPerWeek: 3,
    equipment: ['Bands', 'Wheelchair Bench'],
    summary:
      'Therapist-inspired circuits for gentle strengthening and control.',
    workouts: [
      {
        id: 'r6w-1',
        title: 'Control & Activation',
        focus: 'Rehab',
        estMinutes: 28,
        equipment: ['Bands', 'Wheelchair Bench'],
        blocks: [
          { type: 'warmup', minutes: 5, note: 'Breathing + bracing' },
          { type: 'set', name: 'Band External Rotation', reps: 12, rounds: 3 },
          { type: 'set', name: 'Seated March (bench)', reps: 15, rounds: 2 },
          { type: 'set', name: 'Scapular Retraction', reps: 12, rounds: 3 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
      {
        id: 'r6w-2',
        title: 'Gentle Strength',
        focus: 'Rehab',
        estMinutes: 30,
        equipment: ['Bands', 'Wheelchair Bench'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'Band Row', reps: 12, rounds: 3 },
          { type: 'set', name: 'Bench Sit-to-Stand or Push', reps: 8, rounds: 3, note: 'As able' },
          { type: 'set', name: 'Band Press', reps: 10, rounds: 3 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
      {
        id: 'r6w-3',
        title: 'Stability & Holds',
        focus: 'Rehab',
        estMinutes: 26,
        equipment: ['Bands'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'Band Pallof Hold', minutes: 1, rounds: 3 },
          { type: 'set', name: 'Isometric Row Hold', minutes: 0.5, rounds: 3 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
    ],
  },
  {
    id: 'cut-8w',
    title: 'Lean & Active (8 weeks)',
    goal: 'Weight Loss',
    level: 'Beginner',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    equipment: ['Bands', 'Dumbbells'],
    summary:
      'Circuit-style training to increase calorie burn and keep it fun.',
    workouts: [
      {
        id: 'c8w-1',
        title: 'Circuit A',
        focus: 'Conditioning',
        estMinutes: 32,
        equipment: ['Bands', 'Dumbbells'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'DB Thruster (modified as needed)', reps: 10, rounds: 3 },
          { type: 'set', name: 'Band Row 40s', rounds: 3 },
          { type: 'set', name: 'March / Arm Cycle 60s', rounds: 3 },
          { type: 'cooldown', minutes: 4 },
        ],
      },
      {
        id: 'c8w-2',
        title: 'EMOM 20',
        focus: 'Conditioning',
        estMinutes: 28,
        equipment: ['Dumbbells'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'Every minute: 8 DB Press + 8 Row (alt minutes)', minutes: 20 },
          { type: 'cooldown', minutes: 3 },
        ],
      },
      {
        id: 'c8w-3',
        title: 'Circuit B',
        focus: 'Conditioning',
        estMinutes: 30,
        equipment: ['Bands'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'Band Chest Press 40s', rounds: 3 },
          { type: 'set', name: 'Band Squat/Press-Out 40s', rounds: 3 },
          { type: 'set', name: 'Core: Deadbug 30s', rounds: 3 },
          { type: 'cooldown', minutes: 4 },
        ],
      },
      {
        id: 'c8w-4',
        title: 'Steady + Sprint Finish',
        focus: 'Mixed',
        estMinutes: 30,
        equipment: ['None', 'Bands'],
        blocks: [
          { type: 'warmup', minutes: 5 },
          { type: 'set', name: 'Steady effort', minutes: 18, note: 'RPE 5/10' },
          { type: 'set', name: 'Sprint finish: 20s hard x 4', minutes: 2 },
          { type: 'cooldown', minutes: 5 },
        ],
      },
    ],
  },
];