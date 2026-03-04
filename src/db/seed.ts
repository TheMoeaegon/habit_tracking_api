import db from './connection.ts';
import { users, habits, entries, habitTags, tags } from './schema.ts';

const seed = async () => {
  console.log('Starting seeding...');
  try {
    // Clear existing data (order matters due to FK constraints)
    console.log('Clearing existing data...');
    await db.delete(habitTags);
    await db.delete(entries);
    await db.delete(habits);
    await db.delete(tags);
    await db.delete(users);

    // --- Users ---
    console.log('Creating demo users...');
    const [user1, user2, user3] = await db
      .insert(users)
      .values([
        {
          email: 'moee@test.com',
          hashedPassword: 'hashedpassword',
          username: 'moee',
          firstName: 'Moee',
          lastName: 'Aegon',
        },
        {
          email: 'jane@test.com',
          hashedPassword: 'hashedpassword',
          username: 'jane',
          firstName: 'Jane',
          lastName: 'Doe',
        },
        {
          email: 'alex@test.com',
          hashedPassword: 'hashedpassword',
          username: 'alex',
          firstName: 'Alex',
          lastName: 'Smith',
        },
      ])
      .returning();

    // --- Tags ---
    console.log('Creating tags...');
    const [healthTag, fitnessTag, mindfulnessTag, productivityTag, learningTag] = await db
      .insert(tags)
      .values([
        { name: 'Health', color: '#22c55e' },
        { name: 'Fitness', color: '#ef4444' },
        { name: 'Mindfulness', color: '#a855f7' },
        { name: 'Productivity', color: '#3b82f6' },
        { name: 'Learning', color: '#f59e0b' },
      ])
      .returning();

    // --- Habits ---
    console.log('Creating habits...');
    const [habit1, habit2, habit3, habit4, habit5, habit6, habit7] = await db
      .insert(habits)
      .values([
        {
          userId: user1.id,
          name: 'Morning Run',
          description: 'Run 5km every morning before work',
          frequency: 'daily',
          targetCount: 1,
        },
        {
          userId: user1.id,
          name: 'Read Books',
          description: 'Read at least 30 pages a day',
          frequency: 'daily',
          targetCount: 1,
        },
        {
          userId: user1.id,
          name: 'Meditate',
          description: '15 minutes of guided meditation',
          frequency: 'daily',
          targetCount: 1,
        },
        {
          userId: user2.id,
          name: 'Drink Water',
          description: 'Drink 8 glasses of water',
          frequency: 'daily',
          targetCount: 8,
        },
        {
          userId: user2.id,
          name: 'Gym Workout',
          description: 'Strength training at the gym',
          frequency: 'weekly',
          targetCount: 4,
        },
        {
          userId: user3.id,
          name: 'Journal',
          description: 'Write a daily journal entry',
          frequency: 'daily',
          targetCount: 1,
        },
        {
          userId: user3.id,
          name: 'Learn Spanish',
          description: 'Practice Spanish on Duolingo',
          frequency: 'daily',
          targetCount: 1,
          isActive: false,
        },
      ])
      .returning();

    // --- Habit Tags ---
    console.log('Creating habit-tag associations...');
    await db.insert(habitTags).values([
      { habitId: habit1.id, tagId: fitnessTag.id },
      { habitId: habit1.id, tagId: healthTag.id },
      { habitId: habit2.id, tagId: learningTag.id },
      { habitId: habit2.id, tagId: productivityTag.id },
      { habitId: habit3.id, tagId: mindfulnessTag.id },
      { habitId: habit3.id, tagId: healthTag.id },
      { habitId: habit4.id, tagId: healthTag.id },
      { habitId: habit5.id, tagId: fitnessTag.id },
      { habitId: habit6.id, tagId: mindfulnessTag.id },
      { habitId: habit6.id, tagId: productivityTag.id },
      { habitId: habit7.id, tagId: learningTag.id },
    ]);

    // --- Entries ---
    console.log('Creating habit entries...');
    const today = new Date();
    const daysAgo = (n: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      return d;
    };

    await db.insert(entries).values([
      // Morning Run entries (user1)
      { habitId: habit1.id, completionDate: daysAgo(0), note: 'Great pace today!' },
      { habitId: habit1.id, completionDate: daysAgo(1), note: 'A bit tired but pushed through' },
      { habitId: habit1.id, completionDate: daysAgo(2) },
      { habitId: habit1.id, completionDate: daysAgo(4), note: 'Personal best time' },
      { habitId: habit1.id, completionDate: daysAgo(5) },

      // Read Books entries (user1)
      { habitId: habit2.id, completionDate: daysAgo(0), note: 'Finished chapter 12' },
      { habitId: habit2.id, completionDate: daysAgo(1) },
      { habitId: habit2.id, completionDate: daysAgo(2), note: 'Started a new book' },
      { habitId: habit2.id, completionDate: daysAgo(3) },

      // Meditate entries (user1)
      { habitId: habit3.id, completionDate: daysAgo(0), note: 'Very calming session' },
      { habitId: habit3.id, completionDate: daysAgo(1) },
      { habitId: habit3.id, completionDate: daysAgo(3) },

      // Drink Water entries (user2)
      { habitId: habit4.id, completionDate: daysAgo(0), note: 'Hit all 8 glasses' },
      { habitId: habit4.id, completionDate: daysAgo(1), note: 'Only managed 6 glasses' },
      { habitId: habit4.id, completionDate: daysAgo(2) },
      { habitId: habit4.id, completionDate: daysAgo(3) },
      { habitId: habit4.id, completionDate: daysAgo(4) },

      // Gym Workout entries (user2)
      { habitId: habit5.id, completionDate: daysAgo(1), note: 'Leg day' },
      { habitId: habit5.id, completionDate: daysAgo(3), note: 'Upper body focus' },
      { habitId: habit5.id, completionDate: daysAgo(5), note: 'Full body workout' },

      // Journal entries (user3)
      { habitId: habit6.id, completionDate: daysAgo(0), note: 'Reflected on goals' },
      { habitId: habit6.id, completionDate: daysAgo(1) },
      { habitId: habit6.id, completionDate: daysAgo(2), note: 'Gratitude journaling' },
      { habitId: habit6.id, completionDate: daysAgo(4) },

      // Learn Spanish entries (user3 - inactive habit, older entries)
      { habitId: habit7.id, completionDate: daysAgo(10), note: 'Lesson 15 completed' },
      { habitId: habit7.id, completionDate: daysAgo(12) },
      { habitId: habit7.id, completionDate: daysAgo(14), note: 'Struggled with verb conjugations' },
    ]);

    console.log('Seeding completed successfully!');
  } catch (e) {
    console.error('Seeding failed:', e);
    process.exit(1);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seed;
